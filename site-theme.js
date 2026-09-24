/* tutti.frutti · selector de tema compartido por las páginas de contenido
   (reglas, privacidad, términos, contacto). Usa los mismos presets que jugar.html/index.html. */
(function () {
  var BG_COLOR = { tinta: "#14101F", violeta: "#2A1F47", petroleo: "#103036", crema: "#FFF3E2", lavanda: "#ECE4FF" };
  var LIGHT_BACKGROUNDS = ["crema", "lavanda"];
  var PRESETS = [
    { key: "pomelo__crema", theme: "pomelo", bg: "crema", label: "Pomelo", color: "#FF5E5B" },
    { key: "cielo__violeta", theme: "cielo", bg: "violeta", label: "Cielo", color: "#35C8F2" },
    { key: "uva__violeta", theme: "uva", bg: "violeta", label: "Uva", color: "#9C6BFF" },
    { key: "lima__petroleo", theme: "lima", bg: "petroleo", label: "Lima", color: "#B6EF3C" },
    { key: "mandarina__lavanda", theme: "mandarina", bg: "lavanda", label: "Mandarina", color: "#FFA62B" },
  ];

  window.renderPresetGrid = function () {
    var grid = document.getElementById("presetGrid");
    if (!grid || grid.childElementCount) return;
    var currentPreset = document.documentElement.getAttribute("data-theme") + "__" + document.documentElement.getAttribute("data-bg");
    grid.innerHTML = PRESETS.map(function (p) {
      return '<button type="button" class="theme-option' + (p.key === currentPreset ? ' selected' : '') + '" data-preset="' + p.key + '" onclick="setPreset(\'' + p.key + '\')">' +
        '<span class="theme-swatch" style="background:' + p.color + '; --sw2:' + BG_COLOR[p.bg] + ';"></span>' + p.label +
        '</button>';
    }).join("");
  };

  window.toggleThemeMenu = function () {
    window.renderPresetGrid();
    document.getElementById("themeMenu").classList.toggle("open");
  };

  window.setPreset = function (key) {
    var preset = PRESETS.filter(function (p) { return p.key === key; })[0] || PRESETS[0];
    document.documentElement.setAttribute("data-theme", preset.theme);
    document.documentElement.setAttribute("data-bg", preset.bg);
    if (LIGHT_BACKGROUNDS.indexOf(preset.bg) !== -1) {
      document.documentElement.setAttribute("data-light", "");
    } else {
      document.documentElement.removeAttribute("data-light");
    }
    document.querySelectorAll(".theme-option[data-preset]").forEach(function (btn) {
      btn.classList.toggle("selected", btn.dataset.preset === preset.key);
    });
    var menu = document.getElementById("themeMenu");
    if (menu) menu.classList.remove("open");
    try { localStorage.setItem("tuttifruti_preset", preset.key); } catch (e) { /* storage unavailable */ }
  };

  document.addEventListener("click", function (e) {
    var picker = document.getElementById("themePicker");
    var menu = document.getElementById("themeMenu");
    if (picker && menu && !picker.contains(e.target)) {
      menu.classList.remove("open");
    }
  });
})();
