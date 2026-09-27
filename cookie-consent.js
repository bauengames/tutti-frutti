/* tutti.frutti · banner de cookies para todo el mundo, en combinación con el aviso de Google.
   - En el Espacio Económico Europeo, el Reino Unido y Suiza el consentimiento lo pide el aviso
     de Google (Privacidad y mensajes de AdSense), así que este banner no aparece.
   - En el resto del mundo aparece este banner, con Aceptar y Rechazar. Rechazar:
     · pasa Analytics y los anuncios a "sin consentimiento" (Consent Mode de Google);
     · pide a AdSense anuncios no personalizados.
   Cómo se decide: si la zona horaria del navegador no es de Europa, el banner se muestra enseguida.
   Si es de Europa, se espera a la API del aviso de Google (__tcfapi, llega con AdSense) y el banner
   solo se muestra si Google dice que ahí no aplica su aviso (gdprApplies = false) o si no responde.
   Se carga después de analytics.js y antes de ads-loader.js. Autocontenido: trae su propio estilo. */
(function () {
  var STORAGE_KEY = "tuttifruti_cookie_consent";
  var TEXTS = {
    es: { label: "Aviso de cookies", text: "Usamos cookies propias, de anuncios (Google AdSense) y de estadísticas (Google Analytics) para mostrar publicidad y entender cómo se usa el sitio. Más info en nuestra", link: "política de privacidad", href: "/privacidad", reject: "Rechazar", accept: "Aceptar" },
    en: { label: "Cookie notice", text: "We use our own cookies, advertising cookies (Google AdSense) and analytics cookies (Google Analytics) to show ads and understand how the site is used. More info in our", link: "privacy policy", href: "/en/privacy", reject: "Reject", accept: "Accept" },
    pt: { label: "Aviso de cookies", text: "Usamos cookies próprios, de anúncios (Google AdSense) e de estatísticas (Google Analytics) para mostrar publicidade e entender como o site é usado. Mais informações na nossa", link: "política de privacidade", href: "/pt/privacidade", reject: "Recusar", accept: "Aceitar" },
  };

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function applyConsent(value) {
    if (value !== "rejected") return;
    if (window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
    }
    (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1;
  }

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage unavailable */ }
    var banner = document.getElementById("cookieConsentBanner");
    if (banner) banner.remove();
    applyConsent(value);
  }

  function texts() {
    var lang = (document.documentElement.lang || "es").slice(0, 2);
    return TEXTS[lang] || TEXTS.es;
  }

  function injectStyle() {
    var style = document.createElement("style");
    style.textContent = [
      "#cookieConsentBanner{position:fixed;left:0;right:0;bottom:0;z-index:9999;",
      "background:#14101F;color:#FFF3E2;padding:18px 20px;",
      "font-family:'Instrument Sans',system-ui,sans-serif;font-size:14px;line-height:1.5;",
      "box-shadow:0 -4px 24px rgba(0,0,0,.25);}",
      "#cookieConsentBanner .ccb-wrap{max-width:920px;margin:0 auto;display:flex;flex-wrap:wrap;",
      "align-items:center;gap:14px 20px;}",
      "#cookieConsentBanner p{margin:0;flex:1 1 320px;color:rgba(255,243,226,.85);}",
      "#cookieConsentBanner a{color:#FF5E5B;text-decoration:underline;}",
      "#cookieConsentBanner .ccb-actions{display:flex;gap:10px;flex-shrink:0;}",
      "#cookieConsentBanner button{font-family:inherit;font-size:14px;font-weight:700;",
      "padding:10px 18px;border-radius:8px;cursor:pointer;border:2px solid transparent;}",
      "#cookieConsentBanner .ccb-accept{background:#FF5E5B;color:#14101F;}",
      "#cookieConsentBanner .ccb-reject{background:transparent;color:#FFF3E2;border-color:rgba(255,243,226,.35);}",
      "@media (max-width:520px){#cookieConsentBanner .ccb-wrap{flex-direction:column;align-items:stretch;}",
      "#cookieConsentBanner p{flex:none;}",
      "#cookieConsentBanner .ccb-actions{width:100%;}",
      "#cookieConsentBanner .ccb-actions button{flex:1;}}",
    ].join("");
    document.head.appendChild(style);
  }

  function showBanner() {
    if (getConsent() || document.getElementById("cookieConsentBanner")) return;
    var tx = texts();
    injectStyle();
    var banner = document.createElement("div");
    banner.id = "cookieConsentBanner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", tx.label);
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML =
      '<div class="ccb-wrap">' +
      "<p>" + tx.text + ' <a href="' + tx.href + '">' + tx.link + "</a>.</p>" +
      '<div class="ccb-actions">' +
      '<button type="button" class="ccb-reject" id="ccbReject">' + tx.reject + "</button>" +
      '<button type="button" class="ccb-accept" id="ccbAccept">' + tx.accept + "</button>" +
      "</div></div>";
    document.body.appendChild(banner);
    document.getElementById("ccbAccept").addEventListener("click", function () { setConsent("accepted"); });
    document.getElementById("ccbReject").addEventListener("click", function () { setConsent("rejected"); });
  }

  // Si la persona ya eligió antes, se aplica su elección y no se muestra nada.
  var saved = getConsent();
  if (saved) {
    applyConsent(saved);
    return;
  }

  var timeZone = "";
  try { timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { /* sin Intl */ }
  var maybeEurope = /^(Europe|Atlantic)\//.test(timeZone);

  if (!maybeEurope) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", showBanner);
    else showBanner();
    return;
  }

  // Posiblemente en Europa: se espera a que el aviso de Google diga si le corresponde.
  // Al principio la API puede responder sin saberlo todavía (gdprApplies sin definir):
  // se sigue preguntando hasta tener respuesta o hasta que pasen 12 segundos.
  var waited = 0;
  var poll = setInterval(function () {
    waited += 500;
    if (waited >= 12000) {
      clearInterval(poll);
      showBanner();
      return;
    }
    if (typeof window.__tcfapi !== "function") return;
    window.__tcfapi("ping", 2, function (ping) {
      if (!ping || typeof ping.gdprApplies !== "boolean") return;
      clearInterval(poll);
      if (!ping.gdprApplies) showBanner();
    });
  }, 500);
})();
