/* tutti.frutti · web (igual que app-fruta.js de la app) · tu fruta con vida.
   - En la partida te acompaña al lado de la letra: arranca contenta, piensa mientras escribís,
     salta con cada categoría que completás, se pone nerviosa cuando queda poco tiempo
     y festeja si completaste todo.
   - En los resultados festeja más fuerte si ganaste (y suena triste si perdiste).
   - En el inicio, si la tocás, salta y hace "boing" (y después abre Mi fruta).
   Se carga después de juego/sonidos.js. */
(function () {
  var FRASES = {
    es: { inicio: ["¡Vamos!", "¡Dale que sale!", "¡A pensar!"], apuro: ["¡Rápido!", "¡Se acaba!", "¡Ya casi!"], todo: ["¡Completo!", "¡Bien ahí!", "¡Tocá Basta!"] },
    en: { inicio: ["Let's go!", "You got this!", "Think fast!"], apuro: ["Hurry!", "Time's running out!", "Almost!"], todo: ["All done!", "Nice!", "Hit Stop!"] },
    pt: { inicio: ["Vamos!", "Bora!", "Pensa rápido!"], apuro: ["Rápido!", "Tá acabando!", "Quase!"], todo: ["Completo!", "Mandou bem!", "Aperta Stop!"] }, de: {inicio: ["Los geht's!", "Du schaffst das!", "Schnell denken!"], apuro: ["Beeil dich!", "Die Zeit läuft ab!", "Fast!"], todo: ["Alles ausgefüllt!", "Super!", "Drück Stopp!"]}, fr: {inicio: ["C'est parti !", "Tu vas y arriver !", "Pense vite !"], apuro: ["Vite !", "Le temps file !", "Presque !"], todo: ["Tout est rempli !", "Bien joué !", "Appuie sur Stop !"]}, it: {inicio: ["Via!", "Ce la fai!", "Pensa veloce!"], apuro: ["Sbrigati!", "Il tempo sta finendo!", "Quasi!"], todo: ["Tutto completo!", "Bravo!", "Premi Stop!"]},
  };
  var SALIR = {
    es: { titulo: "¿Volver al inicio?", cuerpo: "Se termina esta partida.", diario: "Se termina el desafío y no lo vas a poder volver a jugar hoy.", aventura: "Se termina este nivel.", seguir: "Seguir jugando", salir: "Volver al inicio" },
    en: { titulo: "Back to home?", cuerpo: "This game will end.", diario: "The challenge ends and you won't be able to play it again today.", aventura: "This level will end.", seguir: "Keep playing", salir: "Back to home" },
    pt: { titulo: "Voltar ao início?", cuerpo: "Esta partida vai terminar.", diario: "O desafio termina e você não vai poder jogar de novo hoje.", aventura: "Este nível vai terminar.", seguir: "Continuar jogando", salir: "Voltar ao início" }, de: {titulo: "Zurück zum Start?", cuerpo: "Dieses Spiel wird beendet.", diario: "Die Herausforderung endet und du kannst sie heute nicht nochmal spielen.", aventura: "Dieses Level wird beendet.", seguir: "Weiterspielen", salir: "Zum Start"}, fr: {titulo: "Retour à l'accueil ?", cuerpo: "Cette partie va se terminer.", diario: "Le défi se termine et tu ne pourras plus le jouer aujourd'hui.", aventura: "Ce niveau va se terminer.", seguir: "Continuer à jouer", salir: "Retour à l'accueil"}, it: {titulo: "Tornare all'inizio?", cuerpo: "Questa partita finirà.", diario: "La sfida finisce e oggi non potrai giocarla di nuovo.", aventura: "Questo livello finirà.", seguir: "Continua a giocare", salir: "Torna all'inizio"},
  };
  function frase(tipo) {
    var l = (FRASES[state.lang] || FRASES.es)[tipo];
    if (APP.tu) l = APP.tu(l);
    return l[Math.floor(Math.random() * l.length)];
  }

  // ---------- Compañera en la partida ----------
  var juego = document.getElementById("screen-game");
  var topline = juego && juego.querySelector(".topline");
  var cont = null, animo = "", llenas = 0, nervios = "", globoId = null, festejoTodo = false;
  if (topline) {
    cont = document.createElement("div");
    cont.className = "app-companera";
    cont.id = "appCompanera";
    cont.innerHTML = '<div class="acp-fruta"></div><div class="acp-globo"></div>';
    topline.insertBefore(cont, topline.querySelector("#timerWrap"));
    // Tu fruta es el botón para volver al Inicio (la de arriba de todo se sacó: había dos). Como salir corta la
    // partida, primero pregunta; "Seguir jugando" vuelve a la casilla donde estabas, con el teclado abierto.
    cont.setAttribute("role", "button");
    cont.addEventListener("click", function () {
      reaccionar();
      if (window.SONIDOS) SONIDOS.boing();
      preguntarSalir();
    });
    // Tocar la fruta no saca el foco de la casilla: así el teclado no se cierra ni la pantalla se rearma.
    cont.addEventListener("pointerdown", function (e) { e.preventDefault(); });
    cont.addEventListener("mousedown", function (e) { e.preventDefault(); });
  }
  // "¿Volver al inicio?" con la partida en curso. (10/11) La misma pregunta para la fruta de arriba de todo, que en la
  // revisión online, la votación, el juez, la espera de la sala y la Copa te sacaba sin preguntar. Y si la pantalla
  // cambia con la hoja abierta (se acabó el tiempo, llegó el resultado), la hoja se cierra sola.
  var hojaSalir = null;
  function preguntarSalir() {
    if (hojaSalir) return;
    var ae = document.activeElement;
    var casilla = ae && ae.matches && (ae.matches("#catGrid input") || ae.matches(".app-teclado-previo")) ? ae : null;
    var T = SALIR[state.lang] || SALIR.es;
    var cuerpo = state.dailyMode ? T.diario : state.adventureMode ? T.aventura : T.cuerpo;
    if (APP.tu) cuerpo = APP.tu(cuerpo);
    var h = APP.abrirHoja("<h2>" + escapeHtml(T.titulo) + "</h2><p>" + escapeHtml(cuerpo) + "</p>" +
      '<button type="button" class="btn btn-primary btn-block" data-seguir>' + escapeHtml(APP.tu ? APP.tu(T.seguir) : T.seguir) + "</button>" +
      '<button type="button" class="btn btn-secondary btn-block" data-salir>' + escapeHtml(T.salir) + "</button>", "", { encima: true });
    hojaSalir = { h: h, pantalla: (document.querySelector(".screen.active") || {}).id };
    new MutationObserver(function (m, obs) { if (!document.body.contains(h.tarjeta)) { obs.disconnect(); hojaSalir = null; } }).observe(document.body, { childList: true });
    h.tarjeta.querySelector("[data-seguir]").addEventListener("click", function () { h.cerrar(); if (casilla && document.body.contains(casilla)) casilla.focus(); });
    h.tarjeta.querySelector("[data-salir]").addEventListener("click", function () {
      h.cerrar();
      goToLobby(); // también deja la sala online (goToLobby lo hace)
    });
  }
  var pantallaSalir = window.showScreen;
  window.showScreen = function (id) {
    if (hojaSalir && hojaSalir.pantalla !== id) { hojaSalir.h.cerrar(); hojaSalir = null; }
    return pantallaSalir.apply(this, arguments);
  };
  var EN_PARTIDA = ["screen-game", "screen-review", "screen-voting", "screen-judging", "screen-waiting", "screen-copa-juego"];
  document.addEventListener("click", function (e) {
    if (!e.target.closest || !e.target.closest(".brand-mini")) return;
    var activa = document.querySelector(".screen.active");
    if (!activa || EN_PARTIDA.indexOf(activa.id) < 0) return;
    e.preventDefault(); e.stopPropagation();
    preguntarSalir();
  }, true);
  function ponerAnimo(nuevo) {
    if (!cont || animo === nuevo) return;
    animo = nuevo;
    cont.querySelector(".acp-fruta").innerHTML = mascotSvg(nuevo, getMyAvatar(), myEquipped());
    cont.dataset.animo = nuevo;
  }
  function globo(texto) {
    if (!cont) return;
    var g = cont.querySelector(".acp-globo");
    g.textContent = texto;
    g.classList.remove("visible"); void g.offsetWidth; g.classList.add("visible");
    clearTimeout(globoId);
    globoId = setTimeout(function () { g.classList.remove("visible"); }, 1800);
  }
  function reaccionar() {
    if (!cont) return;
    var f = cont.querySelector(".acp-fruta");
    f.classList.remove("salta"); void f.offsetWidth; f.classList.add("salta");
  }
  function contarLlenas() {
    var inputs = document.querySelectorAll("#catGrid input");
    var n = 0, total = 0;
    inputs.forEach(function (i) { total++; if (i.value.trim()) n++; });
    return { n: n, total: total };
  }
  function empezarRonda() {
    if (!cont) return;
    llenas = 0; nervios = ""; festejoTodo = false;
    cont.classList.remove("nerviosa", "muy-nerviosa");
    animo = "";
    ponerAnimo("happy");
    reaccionar();
    setTimeout(function () { globo(frase("inicio")); }, 500);
    setTimeout(function () { if (!nervios && !festejoTodo) ponerAnimo("thinking"); }, 1600);
  }

  // Cada vez que se escribe en una categoría.
  document.addEventListener("input", function (e) {
    if (!cont || !e.target.closest || !e.target.closest("#catGrid")) return;
    var c = contarLlenas();
    if (c.n > llenas) {
      reaccionar();
      vibrar("toque");
      if (window.SONIDOS) SONIDOS.burbuja(c.n);
      if (!nervios) { ponerAnimo("happy"); setTimeout(function () { if (!nervios && !festejoTodo) ponerAnimo("thinking"); }, 900); }
    }
    if (c.total && c.n >= c.total && !festejoTodo) {
      festejoTodo = true;
      ponerAnimo("happy");
      globo(frase("todo"));
    }
    if (c.n < c.total) festejoTodo = false;
    llenas = c.n;
  }, true);

  // Nervios según el reloj.
  var timerOriginal = window.updateTimerDisplay;
  window.updateTimerDisplay = function () {
    var r = timerOriginal.apply(this, arguments);
    if (!cont || !juego.classList.contains("active")) return r;
    var s = state.secondsLeft;
    var nuevo = s > 0 && s <= 3 ? "muy" : s > 0 && s <= 10 ? "si" : "";
    if (nuevo !== nervios) {
      if (nuevo === "si" && !nervios) globo(frase("apuro"));
      nervios = nuevo;
      cont.classList.toggle("nerviosa", nuevo === "si");
      cont.classList.toggle("muy-nerviosa", nuevo === "muy");
      if (nuevo) ponerAnimo("surprised");
      else ponerAnimo(festejoTodo ? "happy" : "thinking");
    }
    return r;
  };

  // Al entrar a la pantalla de juego empieza la ronda; al salir se calma.
  var showOriginal = window.showScreen;
  var estabaEnJuego = false;
  window.showScreen = function (id) {
    var r = showOriginal.apply(this, arguments);
    var ahora = id === "screen-game";
    if (ahora && !estabaEnJuego) empezarRonda();
    if (!ahora && cont) { cont.classList.remove("nerviosa", "muy-nerviosa"); nervios = ""; }
    estabaEnJuego = ahora;
    return r;
  };
  // Cuando sale una letra nueva en la misma pantalla (contrarreloj, rondas seguidas).
  var letraOriginal = window.playDing;
  window.playDing = function () {
    var r = letraOriginal.apply(this, arguments);
    if (juego.classList.contains("active")) empezarRonda();
    return r;
  };

  // ---------- Resultados: festejo más grande o tristeza ----------
  var GANAR = { finalResultBadge: 1, advResultMascot: 1, duelResultMascot: 1, roundMascot: 1 };
  var setOriginal = window.setMascot;
  window.setMascot = function (id, mood) {
    var r = setOriginal.apply(this, arguments);
    if (!GANAR[id]) return r;
    var el = document.getElementById(id);
    var m = el && el.querySelector(".mascot");
    if (!m) return r;
    if (mood === "happy") {
      m.classList.add("festejo");
      setTimeout(function () { vibrar("bien"); }, 250);
    } else if (mood === "sad" && id !== "roundMascot") {
      setTimeout(function () { if (window.SONIDOS) SONIDOS.triste(); vibrar("error"); }, 300);
    }
    return r;
  };

  // ---------- Mi fruta: tocarla la hace saltar ----------
  document.addEventListener("click", function (e) {
    var cont = e.target.closest && e.target.closest("#profileMascot");
    if (!cont) return;
    var fruta = cont.querySelector(".mascot-svg") || cont.querySelector("svg");
    if (!fruta) return;
    fruta.classList.remove("toque"); void fruta.getBoundingClientRect(); fruta.classList.add("toque");
    if (window.SONIDOS) SONIDOS.boing();
    vibrar("medio");
  });

  // ---------- Inicio: tocar tu fruta ----------
  window.appTocarFruta = function (el) {
    var svg = el.querySelector(".mascot-svg") || el.querySelector("svg");
    if (svg) { svg.classList.remove("toque"); void svg.getBoundingClientRect(); svg.classList.add("toque"); }
    if (window.SONIDOS) SONIDOS.boing();
    vibrar("medio");
    setTimeout(function () { openProfile("fruit"); }, 420);
  };
})();
