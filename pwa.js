/* tutti.frutti · registro del service worker y botón "Instalar la app".
   El botón (id="installAppBtn") solo aparece cuando el navegador permite
   instalar; en iPhone, donde no hay aviso automático, muestra cómo hacerlo a mano. */
(function () {
  var TEXTS = {
    es: { ios: "Para instalarla en tu iPhone: tocá el botón Compartir (el cuadrado con la flecha) y elegí \"Agregar a inicio\"." },
    en: { ios: "To install it on your iPhone: tap the Share button (the square with the arrow) and choose \"Add to Home Screen\"." },
    pt: { ios: "Para instalar no seu iPhone: toque no botão Compartilhar (o quadrado com a seta) e escolha \"Adicionar à Tela de Início\"." },
  };
  function text(key) {
    var lang = (document.documentElement.lang || "es").slice(0, 2);
    return (TEXTS[lang] || TEXTS.es)[key];
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () { /* sin app instalable, el sitio anda igual */ });
    });
  }

  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  var isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var deferredPrompt = null;

  function button() { return document.getElementById("installAppBtn"); }

  function showButton() {
    var btn = button();
    if (!btn || standalone) return;
    btn.style.display = "";
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    showButton();
  });

  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;
    var btn = button();
    if (btn) btn.style.display = "none";
  });

  window.installApp = function () {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () { deferredPrompt = null; });
    } else if (isIos) {
      alert(text("ios"));
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (isIos && !standalone) showButton();
  });
})();
