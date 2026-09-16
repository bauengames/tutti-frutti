/* tutti.frutti · banner de consentimiento de cookies (para publicidad personalizada).
   Autocontenido: inyecta su propio estilo e HTML, no depende del CSS de la página que lo carga. */
(function () {
  var STORAGE_KEY = "tuttifruti_cookie_consent";

  window.getAdsConsent = function () {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  };

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage unavailable */ }
    var banner = document.getElementById("cookieConsentBanner");
    if (banner) banner.remove();
    window.dispatchEvent(new CustomEvent("ads-consent-changed", { detail: value }));
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
      "#cookieConsentBanner .ccb-actions{width:100%;}",
      "#cookieConsentBanner .ccb-actions button{flex:1;}}",
    ].join("");
    document.head.appendChild(style);
  }

  function injectBanner() {
    var banner = document.createElement("div");
    banner.id = "cookieConsentBanner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML =
      '<div class="ccb-wrap">' +
      '<p>Usamos cookies propias y de anuncios (Google AdSense) para mostrar publicidad y, si la aceptás, personalizarla. Más info en nuestra <a href="privacidad.html">política de privacidad</a>.</p>' +
      '<div class="ccb-actions">' +
      '<button type="button" class="ccb-reject" id="ccbReject">Rechazar</button>' +
      '<button type="button" class="ccb-accept" id="ccbAccept">Aceptar</button>' +
      "</div></div>";
    document.body.appendChild(banner);
    document.getElementById("ccbAccept").addEventListener("click", function () { setConsent("accepted"); });
    document.getElementById("ccbReject").addEventListener("click", function () { setConsent("rejected"); });
  }

  function init() {
    if (window.getAdsConsent()) return;
    injectStyle();
    injectBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
