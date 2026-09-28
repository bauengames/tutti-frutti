/* tutti.frutti · carga demorada de Google AdSense (anuncios automáticos).
   El script de AdSense pesa ~250 KB y ocupa casi 1 s de procesador en celulares:
   se carga recién cuando la persona interactúa con la página (scroll, toque, tecla)
   o 3 segundos después de que la página terminó de cargar, lo que pase primero.
   El aviso de consentimiento de Google (Funding Choices) llega junto con este script.
   La verificación de la cuenta de AdSense se hace con la meta google-adsense-account del head. */
(function () {
  var SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9897296561814312";
  var EVENTS = ["scroll", "pointerdown", "keydown", "touchstart"];
  var loaded = false;

  function load() {
    if (loaded) return;
    loaded = true;
    EVENTS.forEach(function (e) { window.removeEventListener(e, load); });
    var s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = SRC;
    document.head.appendChild(s);
  }

  EVENTS.forEach(function (e) { window.addEventListener(e, load, { once: true, passive: true }); });

  function loadLater() { setTimeout(load, 3000); }
  if (document.readyState === "complete") loadLater();
  else window.addEventListener("load", loadLater);
})();
