/* tutti.frutti · web (igual que en la app) · primera partida guiada y Frutibot más rápido en "Al azar".
   - Partida rápida (appPartidaRapida): busca rival "Al azar" y, si no aparece nadie en 2 segundos,
     juega contra Frutibot (3 rondas en vez de 5).
   - Primera partida guiada: para quien todavía no jugó nunca, un botón en la pantalla de modos arranca una
     partida corta contra Frutibot (2 rondas, 4 categorías fáciles) con consejitos en pantalla.
   Se carga después del juego. */
(function () {
  var TEXTOS = {
    es: {
      rapida: "Partida rápida",
      guia_letra: "Cuando salga la letra, escribí en cada categoría una palabra que empiece con esa letra",
      guia_basta: "¡Bien! Completá las que puedas y tocá ¡Basta! antes que Frutibot",
      guia_revision: "Acá ves las respuestas. Si una palabra no te convence, podés objetarla y decide el juez.",
      guia_puntos: "Puntos: 10 si la palabra es tuya sola, 5 si se repite y 20 si sos el único en completar la categoría.",
      guia_ronda2: "Nueva letra Ojo: no vale repetir la misma palabra en dos categorías.",
      guia_fin: "¡Terminaste tu primera partida! Cada partida suma XP para subir de nivel",
      entendido: "Entendido",
      ronda: "Ronda {n} de {total}",
      banner: "¿Primera vez? Aprendé jugando", banner_sub: "Una partida corta de práctica contra Frutibot",
    },
    en: {
      rapida: "Quick game",
      guia_letra: "When the letter comes up, type a word starting with it in each category",
      guia_basta: "Nice! Fill in what you can and hit Stop! before Frutibot",
      guia_revision: "Here are the answers. If a word doesn't convince you, challenge it and the judge decides.",
      guia_puntos: "Points: 10 if only you used the word, 5 if it's repeated and 20 if you're the only one who filled the category.",
      guia_ronda2: "New letter Careful: you can't use the same word in two categories.",
      guia_fin: "You finished your first game! Every game gives XP to level up",
      entendido: "Got it",
      ronda: "Round {n} of {total}",
      banner: "First time? Learn by playing", banner_sub: "A short practice game against Frutibot",
    },
    pt: {
      rapida: "Partida rápida",
      guia_letra: "Quando a letra aparecer, escreva em cada categoria uma palavra que comece com ela",
      guia_basta: "Boa! Complete o que puder e toque Stop! antes do Frutibot",
      guia_revision: "Aqui estão as respostas. Se uma palavra não te convencer, conteste e o juiz decide.",
      guia_puntos: "Pontos: 10 se só você usou a palavra, 5 se repetir e 20 se você foi o único a completar a categoria.",
      guia_ronda2: "Letra nova Atenção: não vale repetir a mesma palavra em duas categorias.",
      guia_fin: "Você terminou sua primeira partida! Cada partida dá XP para subir de nível",
      entendido: "Entendi",
      ronda: "Rodada {n} de {total}",
      banner: "Primeira vez? Aprenda jogando", banner_sub: "Uma partida curta de treino contra o Frutibot",
    },
  };
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave;
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return str;
  }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }
  APP.txRapida = tx;

  var configOriginal = { categories: RANDOM_MATCH_CONFIG.categories.slice(), totalRounds: RANDOM_MATCH_CONFIG.totalRounds, duration: RANDOM_MATCH_CONFIG.duration };
  var botRapido = false, guiando = false;

  // Frutibot entra enseguida cuando se pidió partida rápida.
  var programarOriginal = window.scheduleBotMatch;
  window.scheduleBotMatch = function (demora) {
    if (botRapido) demora = 2000;
    return programarOriginal.call(this, demora);
  };
  function restaurar() {
    botRapido = false;
    RANDOM_MATCH_CONFIG.categories = configOriginal.categories.slice();
    RANDOM_MATCH_CONFIG.totalRounds = configOriginal.totalRounds;
    RANDOM_MATCH_CONFIG.duration = configOriginal.duration;
  }
  function arrancar() {
    openOnline("random");
    beginGame({ howtoDone: true });
  }

  window.appPartidaRapida = function () {
    if (!(document.getElementById("playerName").value || "").trim()) { window.appCambiarNombre && appCambiarNombre(); return; }
    botRapido = true;
    RANDOM_MATCH_CONFIG.totalRounds = 3;
    arrancar();
  };

  // ---------- Primera partida guiada ----------
  var GUIA_KEY = "tuttifruti_app_guia_hecha";
  var paso = "";
  window.appPrimeraPartida = function () {
    try { if (localStorage.getItem(GUIA_KEY)) return; } catch (e) { return; }
    guiando = true;
    botRapido = true;
    RANDOM_MATCH_CONFIG.categories = ["Nombre", "Animal", "Color", "Comida"];
    RANDOM_MATCH_CONFIG.totalRounds = 2;
    RANDOM_MATCH_CONFIG.duration = 60; // la primera vez, sin apuro
    paso = "";
    document.body.classList.add("app-guiando");
    arrancar();
  };
  var globo = null;
  function consejo(clave, vars) {
    if (paso === clave) return;
    paso = clave;
    if (!globo) {
      globo = document.createElement("div");
      globo.className = "app-guia";
      document.body.appendChild(globo);
      globo.addEventListener("click", function (e) { if (e.target.closest("button")) globo.classList.remove("visible"); });
    }
    globo.innerHTML = '<span class="app-guia-fruta">' + mascotSvg("happy", getMyAvatar(), myEquipped()) + "</span>" +
      "<span class=\"app-guia-texto\">" + esc(tx(clave, vars)) + '</span><button type="button" aria-label="' + esc(tx("entendido")) + '">×</button>';
    globo.classList.remove("visible"); void globo.offsetWidth; globo.classList.add("visible");
  }
  function terminarGuia() {
    guiando = false;
    document.body.classList.remove("app-guiando");
    try { localStorage.setItem(GUIA_KEY, "1"); localStorage.setItem("tuttifruti_app_siguiente", "1"); } catch (e) { /* sin almacenamiento */ }
    if (globo) globo.classList.remove("visible");
  }

  var showOriginal = window.showScreen;
  window.showScreen = function (id) {
    var r = showOriginal.apply(this, arguments);
    if (guiando) {
      if (id === "screen-game") consejo((state.room && state.room.round > 1) ? "guia_ronda2" : "guia_letra");
      else if (id === "screen-review") consejo((state.room && state.room.round > 1) ? "guia_puntos" : "guia_revision");
      else if (id === "screen-final") { consejo("guia_fin"); terminarGuia(); setTimeout(function () { if (globo) globo.classList.add("visible"); }, 50); }
      else if (globo && id !== "screen-searching" && id !== "screen-waiting" && id !== "screen-judging") globo.classList.remove("visible");
    }
    return r;
  };
  document.addEventListener("input", function (e) {
    if (guiando && (paso === "guia_letra" || paso === "guia_ronda2") && e.target.closest && e.target.closest("#catGrid") && e.target.value.trim()) consejo("guia_basta");
  }, true);

  // En la primera partida no hay categoría doble: una regla menos para aprender.
  var comodinOriginal = window.pickWildcard;
  if (typeof comodinOriginal === "function") window.pickWildcard = function () { return guiando ? null : comodinOriginal.apply(this, arguments); };

  // Contra Frutibot el código de sala no sirve para nada (nadie más puede entrar): solo "Ronda 1 de 5".
  var introOriginal = window.playOnlineRoundIntro;
  if (typeof introOriginal === "function") window.playOnlineRoundIntro = function () {
    var r = introOriginal.apply(this, arguments);
    try {
      if (state.room && state.room.bot && state.totalRounds) document.getElementById("roundLabel").textContent = tx("ronda", { n: state.round, total: state.totalRounds });
    } catch (e) { console.error(e); }
    return r;
  };

  var lobbyOriginal = window.goToLobby;
  window.goToLobby = function () {
    var r = lobbyOriginal.apply(this, arguments);
    restaurar();
    if (guiando) terminarGuia();
    if (globo) globo.classList.remove("visible");
    return r;
  };

  // ---------- Botón para quien nunca jugó ----------
  var NOMBRES = {
    es: [["Kiwi", "Mango", "Coco", "Limón", "Durazno", "Ananá", "Pomelo", "Melón"], ["Veloz", "Genio", "Crack", "Feliz", "Astuto", "Valiente", "Rayo", "Capo"]],
    en: [["Kiwi", "Mango", "Coconut", "Lemon", "Peach", "Pineapple", "Melon", "Cherry"], ["Speedy", "Genius", "Champ", "Happy", "Clever", "Brave", "Flash", "Boss"]],
    pt: [["Kiwi", "Manga", "Coco", "Limão", "Pêssego", "Abacaxi", "Melão", "Caju"], ["Veloz", "Gênio", "Craque", "Feliz", "Esperto", "Valente", "Raio", "Fera"]],
  };
  function nombreAlAzar() {
    var L = NOMBRES[state.lang] || NOMBRES.es;
    function uno(a) { return a[Math.floor(Math.random() * a.length)]; }
    return uno(L[0]) + " " + uno(L[1]);
  }
  function nuncaJugo() {
    try { if (localStorage.getItem(GUIA_KEY)) return false; } catch (e) { return false; }
    return !(getStats().gamesPlayed > 0);
  }
  function banner() {
    var b = document.getElementById("guiaBanner");
    if (!nuncaJugo()) { if (b) { b.remove(); setTimeout(appRenderInicio, 0); } return; }
    b = APP.banner("guiaBanner", "guia-banner", function () {
      // Sin nombre todavía: se le pone uno al azar (se cambia cuando quiera en "Tu nombre").
      var campo = document.getElementById("playerName");
      if (!campo.value.trim()) {
        campo.value = nombreAlAzar();
        state.playerName = campo.value;
        try { localStorage.setItem("tuttifruti_playerName", campo.value); } catch (e) { /* sin almacenamiento */ }
        if (typeof checkCanPlay === "function") checkCanPlay();
      }
      if (APP.evento) APP.evento("guia_web", {});
      appPrimeraPartida();
    });
    if (!b) return;
    if (b.parentNode.firstChild !== b) b.parentNode.insertBefore(b, b.parentNode.firstChild);
    b.pintar(mascotSvg("happy", getMyAvatar(), myEquipped()), tx("banner"), esc(tx("banner_sub")));
  }
  APP.alPintarInicio(banner);
  banner();
  setTimeout(appRenderInicio, 0); // el regalo se esconde mientras está este botón

  // ---------- Al azar: Frutibot entra a los 6 segundos, con cuenta regresiva ----------
  // Con pocos jugadores casi nunca aparece otra persona: esperar 12 segundos sin saber qué pasa hacía que la
  // gente se fuera. Ahora son 6 y se ve cuánto falta.
  var ESPERA_BOT = 6000;
  var CUENTA = {
    es: "Si no aparece nadie, en {n} s jugás contra Frutibot.",
    en: "If nobody shows up, you'll play Frutibot in {n}s.",
    pt: "Se ninguém aparecer, em {n} s você joga contra o Frutibot.",
  };
  var cuentaId = null;
  function cuentaRegresiva(ms) {
    clearInterval(cuentaId);
    var hint = document.querySelector('#screen-searching [data-i18n="searching_bot_hint"]');
    if (!hint) return;
    var fin = Date.now() + ms;
    function pintar() {
      var activa = document.getElementById("screen-searching").classList.contains("active");
      var n = Math.ceil((fin - Date.now()) / 1000);
      if (!activa || n <= 0) { clearInterval(cuentaId); return; }
      var str = CUENTA[state.lang] || CUENTA.es;
      if (APP.tu) str = APP.tu(str);
      hint.textContent = str.split("{n}").join(String(n));
    }
    pintar();
    cuentaId = setInterval(pintar, 250);
  }
  var botAntes = window.scheduleBotMatch;
  if (typeof botAntes === "function") window.scheduleBotMatch = function (delay) {
    var ms = delay == null || delay >= ESPERA_BOT ? ESPERA_BOT : delay;
    if (delay == null || delay >= ESPERA_BOT) cuentaRegresiva(ms);
    return botAntes.call(this, ms);
  };
})();
