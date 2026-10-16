/* tutti.frutti · web · marcos y títulos de los jugadores (vienen de la app de iPhone).
   En la app se compran marcos (un aro alrededor de la fruta) y títulos (un cartelito al lado del nombre),
   y viajan como ids cortos en las salas, los rankings y la liga. Acá la web los muestra igual que la app
   (los suyos y los de los demás). La web no los vende: si los compraste en la app con tu cuenta, también
   se ven cuando jugás desde acá. Mismo catálogo que app-cosmeticos.js. */
(function () {
  var TEXTOS = {
    es: {
      t_fan_n: "Fan de la Ñ", t_rayo: "Rayo veloz", t_maquina: "Máquina de palabras", t_diccionario: "Diccionario andante", t_rey: "Rey del ¡Basta!", t_leyenda: "Leyenda",
      t_constante: "Constante", t_aventurero: "Aventurero", t_veterano: "Veterano",
      t_explorador: "Explorador", t_conquistador: "Conquistador", t_maestro: "Maestro de la Aventura", t_experto: "Experto", t_campeon: "Campeón de la Copa",
      m_madera: "Cajón de madera",
    },
    en: {
      t_fan_n: "Ñ fan", t_rayo: "Lightning fast", t_maquina: "Word machine", t_diccionario: "Walking dictionary", t_rey: "King of Stop", t_leyenda: "Legend",
      t_constante: "Steady", t_aventurero: "Adventurer", t_veterano: "Veteran",
      t_explorador: "Explorer", t_conquistador: "Conqueror", t_maestro: "Adventure master", t_experto: "Expert", t_campeon: "Cup Champion",
      m_madera: "Wooden crate",
    },
    pt: {
      t_fan_n: "Fã do Ñ", t_rayo: "Raio veloz", t_maquina: "Máquina de palavras", t_diccionario: "Dicionário ambulante", t_rey: "Rei do Stop", t_leyenda: "Lenda",
      t_constante: "Constante", t_aventurero: "Aventureiro", t_veterano: "Veterano",
      t_explorador: "Explorador", t_conquistador: "Conquistador", t_maestro: "Mestre da Aventura", t_experto: "Expert", t_campeon: "Campeão da Copa",
      m_madera: "Caixote de madeira",
    },
  };
  function tx(clave) { var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave; return APP.tu ? APP.tu(str) : str; }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }
  APP.txCosmeticos = tx;

  function racha() { try { return Math.max(getProgress().bestDayStreak || 0, currentDayStreak(getProgress()) || 0); } catch (e) { return 0; } }
  function estrellas() { try { return advTotalStars(advLoad()); } catch (e) { return 0; } }
  function mundos() { try { var d = advLoad(); return ADV_WORLDS.filter(function (W, w) { return !W.season && advWorldDone(d, w); }).length; } catch (e) { return 0; } }
  function doradas() { try { return advGoldCount(advLoad()); } catch (e) { return 0; } }
  function partidas() { try { return parseInt(localStorage.getItem("tuttifruti_app_partidas_total") || "0", 10) || 0; } catch (e) { return 0; } }
  var MARCOS = [
    { id: "sandia" }, { id: "hielo" }, { id: "neon" }, { id: "dorado" }, { id: "fuego" }, { id: "arcoiris" }, { id: "brillos" }, { id: "diamante" },
    { id: "madera", gana: function () { return mundos() >= 10; } },
  ];
  var TITULOS = [
    { id: "fan_n" }, { id: "rayo" }, { id: "maquina" }, { id: "diccionario" }, { id: "rey" }, { id: "leyenda" },
    { id: "constante", gana: function () { return racha() >= 7; } },
    { id: "aventurero", gana: function () { return estrellas() >= 50; } },
    { id: "veterano", gana: function () { return partidas() >= 50; } },
    { id: "explorador", gana: function () { return mundos() >= 5; } },
    { id: "conquistador", gana: function () { return mundos() >= 15; } },
    { id: "maestro", gana: function () { return mundos() >= 25; } },
    { id: "experto", gana: function () { return doradas() >= 30; } },
    { id: "campeon", gana: function () { return !!(APP.copasGanadas && APP.copasGanadas() >= 1); } },
  ];
  var CATALOGO = { marco: MARCOS, titulo: TITULOS };
  function buscar(tipo, id) { return (CATALOGO[tipo] || []).filter(function (x) { return x.id === id; })[0] || null; }
  function lotiene(tipo, id, w) {
    var it = buscar(tipo, id);
    if (!it) return false;
    if (it.gana) return it.gana();
    return (w || getWallet()).owned.indexOf(tipo + ":" + id) >= 0;
  }
  function puesto(tipo) {
    var w = getWallet(), id = w.equipped && w.equipped[tipo];
    return id && lotiene(tipo, id, w) ? id : null;
  }
  // Lo que viaja a las salas, rankings y liga (solo ids válidos y propios).
  APP.miEstilo = function () {
    var out = {}, m = puesto("marco"), t = puesto("titulo");
    if (m) out.marco = m;
    if (t) out.titulo = t;
    return out;
  };
  // Para dibujar lo de otros jugadores (se ignora cualquier id que no esté en el catálogo).
  APP.claseMarco = function (id) { return buscar("marco", id) ? " tf-marco tf-marco-" + id : ""; };
  APP.htmlTitulo = function (id) { return buscar("titulo", id) ? '<span class="tf-titulo">' + esc(tx("t_" + id)) + "</span>" : ""; };

  // ---------- Salas online ----------
  var etiquetaAntes = window.myPlayerLabel;
  window.myPlayerLabel = function () { return Object.assign(etiquetaAntes.apply(this, arguments), APP.miEstilo()); };
  var puntoAntes = window.playerDotHtml;
  window.playerDotHtml = function (pid, players) {
    var html = puntoAntes.apply(this, arguments);
    var p = (players || {})[pid];
    var clase = p ? APP.claseMarco(p.marco) : "";
    return clase ? html.replace('class="player-avatar"', 'class="player-avatar' + clase + '"') : html;
  };
  var esperaAntes = window.renderWaitingRoom;
  window.renderWaitingRoom = function (data) {
    var r = esperaAntes.apply(this, arguments);
    try {
      var filas = document.querySelectorAll("#waitingPlayers .rank-row");
      Object.keys((data && data.players) || {}).forEach(function (pid, i) {
        var t = data.players[pid] && data.players[pid].titulo;
        var nombre = filas[i] && filas[i].querySelector(".rank-name");
        if (nombre && t && !nombre.querySelector(".tf-titulo")) nombre.insertAdjacentHTML("beforeend", APP.htmlTitulo(t));
      });
    } catch (e) { /* nada */ }
    return r;
  };

  // ---------- Rankings (desafío del día, semanal) ----------
  var filaAntes = window.leaderboardRowHtml;
  window.leaderboardRowHtml = function (pos, row, isMe) {
    var html = filaAntes.apply(this, arguments);
    var r = row || {};
    if (isMe) r = Object.assign({}, r, APP.miEstilo());
    var clase = APP.claseMarco(r.marco);
    if (clase) html = html.replace('class="player-avatar"', 'class="player-avatar' + clase + '"');
    if (r.titulo && buscar("titulo", r.titulo)) html = html.replace(/(<span class="rank-name">[\s\S]*?)(<\/span>\s*<span class="rank-score">)/, "$1" + APP.htmlTitulo(r.titulo) + "$2");
    return html;
  };

  // ---------- Tu perfil ----------
  var perfilAntes = window.renderProfile;
  if (typeof perfilAntes === "function") window.renderProfile = function () {
    var r = perfilAntes.apply(this, arguments);
    try {
      var grande = document.querySelector("#screen-profile .profile-mascot");
      if (grande) grande.className = "profile-mascot" + APP.claseMarco(puesto("marco"));
      var nombre = document.getElementById("profileName"), t = puesto("titulo");
      if (nombre && t && !nombre.querySelector(".tf-titulo")) nombre.insertAdjacentHTML("beforeend", " " + APP.htmlTitulo(t));
    } catch (e) { /* nada */ }
    return r;
  };
})();
