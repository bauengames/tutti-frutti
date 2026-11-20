/* tutti.frutti · cartel "Bajá la app" en Android.
   En iPhone, Safari muestra solo su propio cartel (la meta apple-itunes-app). En Android no hay nada
   parecido, así que este archivo agrega una barrita arriba con el link a Google Play. Solo aparece en
   Android, no dentro de la app instalada como web (pantalla completa) y, si la cerrás, no vuelve por 14 días. */
(function () {
  if (!/android/i.test(navigator.userAgent)) return;
  if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return;
  var KEY = "tuttifruti_cartel_android";
  var DIAS = 14;
  try {
    var cerrado = +localStorage.getItem(KEY) || 0;
    if (cerrado && Date.now() - cerrado < DIAS * 86400000) return;
  } catch (e) { /* sin localStorage: se muestra igual */ }

  var PLAY = "https://play.google.com/store/apps/details?id=com.tuttipuntofrutti.app&referrer=utm_source%3Dweb%26utm_medium%3Dcartel";
  var TEXTOS = {
    es: { titulo: "tutti.frutti para Android", sub: "Gratis en Google Play", boton: "Ver", cerrar: "Cerrar" },
    en: { titulo: "tutti.frutti for Android", sub: "Free on Google Play", boton: "View", cerrar: "Close" },
    pt: { titulo: "tutti.frutti para Android", sub: "Grátis no Google Play", boton: "Ver", cerrar: "Fechar" },
  };
  var FRUTA = '<svg viewBox="6 2 88 92" width="26" height="26" aria-hidden="true"><path d="M50 36 C41 27 26 28 19 42 C12 56 15 71 25 80 C34 88 44 90 50 90 C56 90 66 88 75 80 C85 71 88 56 81 42 C74 28 59 27 50 36 Z" fill="#FF5E5B"/><path d="M51 35 C57 19 73 9 85 7 C84 22 71 34 51 35 Z" fill="#B6EF3C"/><path d="M48 35 C43 22 32 14 22 12 C23 26 33 34 48 35 Z" fill="#8FD32E"/></svg>';

  function mostrar() {
    if (document.getElementById("cartelAndroid")) return;
    var lang = (document.documentElement.lang || "es").slice(0, 2);
    var t = TEXTOS[lang] || TEXTOS.es;
    var css = document.createElement("style");
    css.textContent =
      "#cartelAndroid{display:flex;align-items:center;gap:10px;padding:8px 10px 8px 6px;background:var(--surface,#221B33);color:var(--text,#FFF3E2);" +
      "border-bottom:1px solid rgba(127,127,127,.25);font:500 14px/1.2 'Instrument Sans',system-ui,sans-serif;position:fixed;top:0;left:0;right:0;z-index:9000;box-shadow:0 2px 10px rgba(0,0,0,.15)}" +
      "#cartelAndroid .ca-cerrar{flex:none;width:28px;height:28px;border:0;background:none;color:inherit;opacity:.6;font-size:20px;line-height:1;padding:0;cursor:pointer}" +
      "#cartelAndroid .ca-icono{flex:none;width:40px;height:40px;border-radius:10px;display:grid;place-items:center;background:#14101F}" +
      "#cartelAndroid .ca-texto{flex:1;min-width:0}" +
      "#cartelAndroid .ca-texto strong{display:block;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
      "#cartelAndroid .ca-texto small{opacity:.7;font-size:12.5px}" +
      "#cartelAndroid .ca-ver{flex:none;padding:8px 16px;border-radius:99px;background:var(--primary,#FF5E5B);color:#14101F;font-weight:700;text-decoration:none}";
    document.head.appendChild(css);
    var barra = document.createElement("div");
    barra.id = "cartelAndroid";
    barra.setAttribute("role", "region");
    barra.setAttribute("aria-label", t.titulo);
    barra.innerHTML =
      '<button type="button" class="ca-cerrar" aria-label="' + t.cerrar + '">×</button>' +
      '<span class="ca-icono">' + FRUTA + "</span>" +
      '<span class="ca-texto"><strong>' + t.titulo + "</strong><small>" + t.sub + "</small></span>" +
      '<a class="ca-ver" href="' + PLAY + '" target="_blank" rel="noopener">' + t.boton + "</a>";
    // Va fija arriba de todo y corre la página hacia abajo lo que mide (el body de las páginas es flex y centrado:
    // metida como un elemento más, quedaba angosta o tapada por la barra de arriba).
    var antes = document.body.style.paddingTop;
    function correr() {
      document.body.style.paddingTop = antes;
      var base = parseFloat(getComputedStyle(document.body).paddingTop) || 0;
      document.body.style.paddingTop = (base + barra.offsetHeight) + "px";
    }
    barra.querySelector(".ca-cerrar").addEventListener("click", function () {
      try { localStorage.setItem(KEY, String(Date.now())); } catch (e) { /* nada */ }
      barra.remove();
      document.body.style.paddingTop = antes;
      window.removeEventListener("resize", correr);
    });
    document.body.appendChild(barra);
    correr();
    window.addEventListener("resize", correr);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mostrar);
  else mostrar();
})();
