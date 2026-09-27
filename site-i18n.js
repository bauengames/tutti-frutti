/* tutti.frutti · idioma de las páginas de contenido.
   Cada idioma tiene su propia URL (/, /en/, /pt/) con el texto ya escrito en el HTML
   (lo genera scripts/build-site.cjs). Este script ya no traduce nada: solo
   - recuerda el idioma de la página en tuttifruti_lang, para que el juego (/jugar) arranque igual;
   - abre y cierra el menú de idiomas, que son links a la versión equivalente;
   - muestra un aviso chico (sin redirigir) si el navegador está en otro idioma disponible. */
(function () {
  var LANGS = ["es", "en", "pt"];
  var HINT = {
    es: { text: "Esta página también está en español.", link: "Ver en español", close: "Cerrar" },
    en: { text: "This page is also available in English.", link: "View in English", close: "Close" },
    pt: { text: "Esta página também está disponível em português.", link: "Ver em português", close: "Fechar" },
  };
  var pageLang = (document.documentElement.lang || "es").slice(0, 2);

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  store("tuttifruti_lang", pageLang);

  window.rememberSiteLanguage = function (lang) {
    store("tuttifruti_lang", lang);
    store("tuttifruti_lang_explicit", "1");
  };

  window.toggleSiteLangMenu = function () {
    var menu = document.getElementById("langMenu");
    if (menu) menu.classList.toggle("open");
  };

  document.addEventListener("click", function (e) {
    var picker = document.getElementById("langPicker");
    var menu = document.getElementById("langMenu");
    if (picker && menu && !picker.contains(e.target)) menu.classList.remove("open");
  });

  function showLanguageHint() {
    if (read("tuttifruti_lang_explicit") || read("tuttifruti_lang_hint_closed")) return;
    var browserLang = (navigator.language || "").slice(0, 2).toLowerCase();
    if (LANGS.indexOf(browserLang) === -1 || browserLang === pageLang) return;
    var alt = document.querySelector('link[rel="alternate"][hreflang="' + browserLang + '"]');
    if (!alt) return;
    var t = HINT[browserLang];
    var bar = document.createElement("div");
    bar.className = "lang-hint";
    bar.setAttribute("lang", browserLang);
    bar.innerHTML = '<span></span> <a></a><button type="button"></button>';
    bar.querySelector("span").textContent = t.text;
    var link = bar.querySelector("a");
    link.textContent = t.link + " →";
    link.href = new URL(alt.href).pathname;
    link.addEventListener("click", function () { window.rememberSiteLanguage(browserLang); });
    var close = bar.querySelector("button");
    close.textContent = "×";
    close.setAttribute("aria-label", t.close);
    close.addEventListener("click", function () {
      store("tuttifruti_lang_hint_closed", "1");
      bar.remove();
    });
    document.body.insertBefore(bar, document.body.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showLanguageHint);
  } else {
    showLanguageHint();
  }
})();
