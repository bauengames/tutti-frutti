/* tutti.frutti · web (igual que app-mundo-temporada.js de la app) · que los mundos de temporada de la Aventura (Navidad, Carnaval) se vean (10/11/2026, Augusto:
   "habría que fijarse que destaque cuando se active, porque si no capaz se pierde").
   - Abiertos para todos desde su fecha (antes había que haber pasado el Mundo Manzana): ver advUnlocked en jugar.html.
   - Botón en la pantalla de modos (debajo del Frutigrama) mientras el mundo está abierto y sin terminar: "¡Llegó el Mundo Navidad!".
   - Una hoja, una sola vez por mundo, cuando estás en la pantalla de modos sin otro cartel abierto, con "Jugar".
   - "Jugar" abre el mapa en el mundo de temporada (que va arriba de todo) y no en tu nivel de siempre. */
(function () {
  var NB = " ";
  var TX = {
    es: { kicker: "Aventura · Temporada", llego: "¡Llegó el {mundo}!", sub: "10 niveles nuevos, abierto para todos", van: "{h} de 10 niveles",
      texto: "10 niveles nuevos de temporada, con categorías especiales. Está abierto para todos: no hace falta haber pasado otros mundos.", jugar: "Jugar", luego: "Más tarde" },
    en: { kicker: "Adventure · Season", llego: "The {mundo} is here!", sub: "10 new levels, open to everyone", van: "{h} of 10 levels",
      texto: "10 new seasonal levels with special categories. It's open to everyone: no need to clear other worlds first.", jugar: "Play", luego: "Later" },
    pt: { kicker: "Aventura · Temporada", llego: "Chegou o {mundo}!", sub: "10 níveis novos, aberto para todos", van: "{h} de 10 níveis",
      texto: "10 níveis novos de temporada, com categorias especiais. Está aberto para todos: não precisa ter passado outros mundos.", jugar: "Jogar", luego: "Mais tarde" },
    de: { kicker: "Abenteuer · Saison", llego: "Die {mundo} ist da!", sub: "10 neue Level, für alle offen", van: "{h} von 10 Leveln",
      texto: "10 neue Saison-Level mit besonderen Kategorien. Offen für alle: Du musst keine anderen Welten geschafft haben.", jugar: "Spielen", luego: "Später" },
    fr: { kicker: "Aventure · Saison", llego: "Le {mundo} est arrivé" + NB + "!", sub: "10 nouveaux niveaux, ouverts à tous", van: "{h} niveaux sur 10",
      texto: "10 nouveaux niveaux de saison, avec des catégories spéciales. Ouvert à tous" + NB + ": pas besoin d'avoir fini d'autres mondes.", jugar: "Jouer", luego: "Plus tard" },
    it: { kicker: "Avventura · Stagione", llego: "È arrivato il {mundo}!", sub: "10 livelli nuovi, aperti a tutti", van: "{h} livelli su 10",
      texto: "10 nuovi livelli stagionali, con categorie speciali. È aperto a tutti: non serve aver finito altri mondi.", jugar: "Gioca", luego: "Più tardi" },
  };
  function tx(k, v) {
    var s = (TX[state.lang] || TX.es)[k] || TX.es[k];
    if (APP.tu) s = APP.tu(s);
    Object.keys(v || {}).forEach(function (n) { s = s.split("{" + n + "}").join(String(v[n])); });
    return APP.numeros ? APP.numeros(s) : s;
  }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }
  var VISTOS_KEY = "tuttifruti_app_mundo_temporada_visto";

  // El mundo de temporada abierto y sin terminar (si hubiera dos, el más reciente).
  function mundoActivo() {
    if (typeof ADV_WORLDS === "undefined" || typeof advSeasonOpen !== "function") return null;
    var d = advLoad(), elegido = null;
    ADV_WORLDS.forEach(function (W, w) {
      if (!W.season || !advSeasonOpen(W) || advWorldDone(d, w)) return;
      if (!elegido || W.season > elegido.W.season) elegido = { W: W, w: w };
    });
    if (!elegido) return null;
    var hechos = 0, primero = elegido.w * ADV_PER_WORLD + 1;
    for (var n = primero; n < primero + ADV_PER_WORLD; n++) if ((d.stars[n] || 0) > 0) hechos++;
    elegido.hechos = hechos;
    elegido.nombre = t("adv_world_name", { name: advWorldName(elegido.W) });
    return elegido;
  }

  // Abre el mapa mostrando el mundo de temporada (la Aventura baja sola a tu nivel de siempre; acá se vuelve arriba).
  APP.abrirMundoTemporada = function () {
    openAdventure();
    setTimeout(function () {
      var m = document.querySelector("#advWorlds .adv-world.season");
      // Con lugar arriba para el "← Inicio" fijo: si no, tapaba el nombre del mundo.
      if (m && document.querySelector("#screen-adventure.active")) window.scrollTo({ top: Math.max(0, m.getBoundingClientRect().top + window.scrollY - 110), behavior: APP.menosMovimiento && APP.menosMovimiento() ? "auto" : "smooth" });
    }, 700);
  };

  // ---------- Botón en la pantalla de modos ----------
  function tarjeta() {
    var m = localStorage.getItem("tuttifruti_playerName") ? mundoActivo() : null;
    var viejo = document.getElementById("mtBanner");
    if (!m) { if (viejo) viejo.remove(); return; }
    var b = APP.banner("mtBanner", "mt-banner", function () { APP.abrirMundoTemporada(); }, document.getElementById("fgBanner") ? "fgBanner" : "dailyBanner");
    if (!b) return;
    b.pintar('<span class="mt-t-fruta">' + fruitSvg(m.W.fruit) + "</span>", tx("llego", { mundo: m.nombre }), esc(m.hechos ? tx("van", { h: m.hechos }) : tx("sub")));
  }
  APP.alPintarInicio(tarjeta);

  // En la web no hay APP.cuandoLibre: la hoja sale si estás en la pantalla de modos y no hay otro cartel abierto.
  function libre() {
    var lobby = document.getElementById("screen-lobby"), wrap = document.getElementById("lobbyWrap");
    if (!lobby || !lobby.classList.contains("active") || !wrap || !wrap.classList.contains("view-hub")) return false;
    if (document.querySelector(".web-hoja")) return false;
    return !Array.prototype.some.call(document.querySelectorAll("#howTo, #infoModal, #confirmBuy"), function (el) { return el.style.display && el.style.display !== "none"; });
  }
  if (!APP.cuandoLibre) APP.cuandoLibre = function (clave, fn) { if (libre()) fn(); };

  // ---------- La hoja de "¡Llegó!", una sola vez por mundo ----------
  function avisar() {
    var m = mundoActivo();
    if (!m || !APP.cuandoLibre || !localStorage.getItem("tuttifruti_playerName")) return;
    var vistos = [];
    try { vistos = JSON.parse(localStorage.getItem(VISTOS_KEY) || "[]") || []; } catch (e) { vistos = []; }
    if (vistos.indexOf(m.W.key) >= 0) return;
    APP.cuandoLibre("mundo-" + m.W.key, function () {
      var ya = [];
      try { ya = JSON.parse(localStorage.getItem(VISTOS_KEY) || "[]") || []; } catch (e) { ya = []; }
      if (ya.indexOf(m.W.key) >= 0) return;
      try { localStorage.setItem(VISTOS_KEY, JSON.stringify(ya.concat([m.W.key]))); } catch (e) { /* nada */ }
      var h = APP.abrirHoja('<span class="confirm-art mt-arte">' + fruitSvg(m.W.fruit) + "</span>" +
        "<h2>" + esc(tx("llego", { mundo: m.nombre })) + "</h2><p>" + esc(tx("texto")) + "</p>" +
        '<div class="confirm-actions"><button type="button" class="btn btn-ghost" data-r="no">' + esc(tx("luego")) + "</button>" +
        '<button type="button" class="btn btn-primary" data-r="si">' + esc(tx("jugar")) + "</button></div>");
      if (typeof launchConfetti === "function") launchConfetti();
      h.tarjeta.addEventListener("click", function (e) {
        var b = e.target.closest("[data-r]");
        if (!b) return;
        h.cerrar();
        if (b.dataset.r === "si") APP.abrirMundoTemporada();
        if (APP.evento) APP.evento("mundo_temporada_aviso", { mundo: m.W.key, respuesta: b.dataset.r });
      });
    });
  }
  var lobbyAntes = window.goToLobby;
  window.goToLobby = function () { var r = lobbyAntes.apply(this, arguments); setTimeout(avisar, 1500); return r; };
  setTimeout(function () { tarjeta(); avisar(); }, 3000);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") setTimeout(function () { tarjeta(); avisar(); }, 1500); });
})();
