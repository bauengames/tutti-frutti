/* tutti.frutti · web (igual que app-musica.js de la app) · música tranquila de fondo.
   Se compone en el momento con el mismo audio del juego (sin archivos), con aire de juego: percusión
   suave (bombo, chasquido, shaker), bajo saltarín, acordes cortitos a contratiempo y una melodía pegadiza
   de campanita (partes A A B A) sobre Do · La m · Fa · Sol a 104 pulsos por minuto.
   - Suena solo fuera de la partida (Inicio, tienda, Mi fruta, temporada, mapa de la Aventura...).
     Al empezar una ronda se apaga despacito y al volver al Inicio vuelve de a poco.
   - En la web arranca apagada (una página que suena sola molesta): se prende con el botón de la notita, al lado
     del de sonido, y queda guardado. El botón de sonido la calla también.
   - Arranca recién después de tu primera partida.
   Se carga después de juego/sonidos.js. */
(function () {
  var KEY = "tuttifruti_app_musica";
  var BPM = 104, PULSO = 60 / BPM, COMPAS = PULSO * 4, VOLUMEN = 0.09;
  var plugins = (window.Capacitor && window.Capacitor.Plugins) || {};
  var EN_JUEGO = ["screen-game", "screen-judging", "screen-review", "screen-voting", "screen-waiting", "screen-searching", "screen-copa-juego", "screen-duel-intro"];

  // Volumen de la música (Ajustes → Sonido), de 0 a 1.
  function volumen() {
    try { var v = localStorage.getItem("tuttifruti_app_vol_musica"); return v === null ? 1 : Math.max(0, Math.min(1, Number(v) || 0)); } catch (e) { return 1; }
  }
  APP.musicaVolumen = function () {
    if (!sonando || !salida) return;
    salida.gain.cancelScheduledValues(c.currentTime);
    salida.gain.setTargetAtTime(VOLUMEN * volumen(), c.currentTime, 0.1);
  };
  APP.musicaActiva = function () { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } };
  APP.cambiarMusica = function () {
    try { localStorage.setItem(KEY, APP.musicaActiva() ? "0" : "1"); } catch (e) { /* nada */ }
    pintarBoton();
    revisar();
  };
  // Botón de la notita, al lado del de sonido (en la web no hay Ajustes).
  var NOTA = '<svg class="ph" viewBox="0 0 256 256" aria-hidden="true"><path d="M100 188 V60 L196 40 V168" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><circle cx="76" cy="188" r="24" fill="none" stroke="currentColor" stroke-width="16"/><circle cx="172" cy="168" r="24" fill="none" stroke="currentColor" stroke-width="16"/></svg>';
  var TXB = { es: ["Prender la música", "Apagar la música"], en: ["Turn music on", "Turn music off"], pt: ["Ligar a música", "Desligar a música"] };
  function pintarBoton() {
    var b = document.getElementById("musicaBtn");
    if (!b) {
      var mute = document.getElementById("muteBtn");
      if (!mute) return;
      b = document.createElement("button");
      b.type = "button"; b.id = "musicaBtn"; b.className = "icon-btn musica-btn";
      b.innerHTML = NOTA;
      b.addEventListener("click", function () { APP.cambiarMusica(); });
      mute.parentNode.insertBefore(b, mute.nextSibling);
    }
    var on = APP.musicaActiva();
    b.classList.toggle("apagada", !on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.setAttribute("aria-label", (TXB[state.lang] || TXB.es)[on ? 1 : 0]);
    b.title = b.getAttribute("aria-label");
  }

  function f(nota) { return 440 * Math.pow(2, (nota - 69) / 12); } // número MIDI → frecuencia
  // Do · La m · Fa · Sol, un compás cada uno. Melodía escrita (corcheas, null = silencio):
  // parte A dos veces, parte B (más arriba) y A otra vez: 16 compases que se repiten.
  var ACORDES = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]];
  var BAJOS = [36, 33, 29, 31];
  var A = [[76, null, 79, null, 81, 79, 76, null], [72, null, 76, null, 74, 72, 69, null],
           [72, 74, 76, null, 77, 76, 74, null], [74, null, 79, null, 77, 76, 74, null]];
  var B = [[84, null, 81, 79, 76, null, 79, null], [81, null, 79, 76, 72, null, 76, null],
           [77, 76, 74, 72, 74, null, 76, null], [79, null, 74, null, 79, 81, 79, null]];
  var FORMA = [A, A, B, A];

  // ---------- Sonido ----------
  var c = null, salida = null, eco = null, ruido = null;
  function armar() {
    if (salida && salida.context === getAudioCtx()) return true;
    c = getAudioCtx();
    if (!c) return false;
    salida = c.createGain(); salida.gain.value = 0;
    var filtro = c.createBiquadFilter(); filtro.type = "lowpass"; filtro.frequency.value = 5000;
    salida.connect(filtro); filtro.connect(c.destination);
    eco = c.createDelay(1.5); eco.delayTime.value = PULSO * 0.75;
    var vuelta = c.createGain(); vuelta.gain.value = 0.25;
    var ecoVol = c.createGain(); ecoVol.gain.value = 0.22;
    eco.connect(vuelta); vuelta.connect(eco); eco.connect(ecoVol); ecoVol.connect(salida);
    ruido = c.createBuffer(1, Math.floor(c.sampleRate * 0.5), c.sampleRate);
    var d = ruido.getChannelData(0); for (var k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1;
    return true;
  }
  function tono(tipo, frec, t, vol, ataque, caida, destino) {
    var o = c.createOscillator(), g = c.createGain();
    o.type = tipo; o.frequency.value = frec;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + ataque);
    g.gain.exponentialRampToValueAtTime(0.0008, t + ataque + caida);
    o.connect(g); g.connect(destino || salida);
    o.start(t); o.stop(t + ataque + caida + 0.05);
    return g;
  }
  function bombo(t) {
    var o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.12);
    g.gain.setValueAtTime(0.55, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(g); g.connect(salida); o.start(t); o.stop(t + 0.25);
  }
  function golpe(t, frec, vol, dur, q) {
    var src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
    src.buffer = ruido; bp.type = "bandpass"; bp.frequency.value = frec; bp.Q.value = q || 1;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(bp); bp.connect(g); g.connect(salida); src.start(t); src.stop(t + dur + 0.02);
  }
  function campanita(n, t, fuerza) {
    var g = tono("triangle", f(n), t, 0.2 * fuerza, 0.005, 0.5);
    g.connect(eco);
    tono("sine", f(n) * 2, t, 0.06 * fuerza, 0.003, 0.18);
  }

  // ---------- Compositor: va programando un compás adelante ----------
  var sonando = false, proximo = 0, compas = 0, relojId = null;
  function programarCompas(t) {
    var i = compas % 4, parte = FORMA[Math.floor(compas / 4) % 4];
    var C8 = PULSO / 2;
    // Percusión: bombo en 1 y 3, chasquido en 2 y 4, shaker en las corcheas.
    bombo(t); bombo(t + PULSO * 2);
    golpe(t + PULSO, 1900, 0.16, 0.09, 1.2); golpe(t + PULSO * 3, 1900, 0.16, 0.09, 1.2);
    for (var k = 0; k < 8; k++) golpe(t + k * C8, 7000, k % 2 ? 0.05 : 0.028, 0.04, 0.8);
    // Bajo saltarín: raíz, raíz, quinta, octava.
    var b = BAJOS[i];
    [[0, b], [1.5, b], [2, b + 7], [3, b + 12]].forEach(function (x) { tono("triangle", f(x[1]), t + x[0] * PULSO, 0.3, 0.01, 0.28); });
    // Acordes cortitos a contratiempo, tipo ukelele.
    [0.5, 1.5, 2.5, 3.5].forEach(function (pos) {
      ACORDES[i].forEach(function (n, j) { tono("triangle", f(n), t + pos * PULSO + j * 0.012, 0.07, 0.004, 0.16); });
    });
    // Melodía escrita.
    parte[i].forEach(function (n, k) { if (n) campanita(n, t + k * C8, k === 0 ? 1 : 0.8); });
    compas++;
  }
  function reloj() {
    if (!sonando || !c) return;
    while (proximo < c.currentTime + 1.5) { programarCompas(proximo); proximo += COMPAS; }
  }
  function empezar() {
    if (sonando || !armar()) return;
    if (c.state !== "running") { c.resume().then(function () { if (c.state === "running") revisar(); }).catch(function () {}); return; }
    sonando = true;
    proximo = c.currentTime + 0.2;
    salida.gain.cancelScheduledValues(c.currentTime);
    salida.gain.setValueAtTime(salida.gain.value, c.currentTime);
    salida.gain.linearRampToValueAtTime(VOLUMEN * volumen(), c.currentTime + 3);
    reloj();
    relojId = setInterval(reloj, 400);
  }
  function parar(rapido) {
    if (!sonando) return;
    sonando = false;
    clearInterval(relojId);
    var fin = rapido ? 0.4 : 1.5;
    salida.gain.cancelScheduledValues(c.currentTime);
    salida.gain.setValueAtTime(salida.gain.value, c.currentTime);
    salida.gain.linearRampToValueAtTime(0, c.currentTime + fin);
  }

  // ---------- Cuándo suena ----------
  function enPartida() {
    var a = document.querySelector(".screen.active");
    if (a && EN_JUEGO.indexOf(a.id) >= 0) return true;
    return !!(state.streakMode && a && a.id !== "screen-results");
  }
  function yaJugo() {
    try { if (Number(localStorage.getItem("tuttifruti_app_partidas_total")) > 0) return true; } catch (e) { /* nada */ }
    return typeof getStats === "function" && (getStats().gamesPlayed || 0) > 0;
  }
  // Fuera de la partida el audio respeta el modo silencio y se mezcla con lo que esté sonando;
  // en la partida queda como siempre (los sonidos del juego suenan aunque esté en silencio).
  APP.tipoAudio = function () { return enPartida() ? "playback" : "ambient"; };
  var revisandoId = null;
  function revisar() {
    clearTimeout(revisandoId);
    revisandoId = setTimeout(function () {
      var puede = APP.musicaActiva() && !state.muted && !document.hidden && !enPartida() && yaJugo() && !APP.introEnCurso && !enAnuncio;
      if (!puede) { parar(enPartida()); return; }
      if (sonando) return;
      otroAudioSonando().then(function (otro) { if (!otro) empezar(); });
    }, 250);
  }
  // ¿Hay otra app sonando? En un iPhone de verdad el audio del propio juego (el de los efectos, que queda
  // prendido) cuenta como "otro audio" y la música no arrancaba nunca (en el simulador no pasa). Por eso
  // se pausa un instante el audio del juego, se pregunta y se vuelve a prender.
  function otroAudioSonando() {
    var I = plugins.Iconos;
    if (!I || !I.otroAudio) return Promise.resolve(false);
    var ctx = state.audioCtx;
    var pausado = ctx && ctx.state === "running" && !sonando;
    return (pausado ? ctx.suspend().catch(function () {}) : Promise.resolve())
      .then(function () { return I.otroAudio(); })
      .then(function (r) { return !!(r && r.sonando); }, function () { return false; })
      .then(function (otro) {
        if (pausado && ctx.state === "suspended") return ctx.resume().catch(function () {}).then(function () { return otro; });
        return otro;
      });
  }
  APP.musicaRevisar = revisar;
  // (10/11, Augusto: "algunas ads quedan trabadas y arrancan recién al minimizar y volver") Mientras hay un anuncio de
  // pantalla completa o un video, el audio del juego se suspende del todo (antes la música solo bajaba a cero y el
  // audio seguía tomado; al minimizar se suspendía, y justo ahí el video arrancaba). Al cerrarse, vuelve.
  var enAnuncio = false;
  APP.pausaPorAnuncio = function (si) {
    enAnuncio = !!si;
    var ctxs = [c, state.audioCtx].filter(function (x) { return x && x.state !== "closed"; });
    if (enAnuncio) {
      parar(true);
      ctxs.forEach(function (x) { if (x.state === "running" && x.suspend) x.suspend().catch(function () {}); });
      try { if (navigator.audioSession) navigator.audioSession.type = "ambient"; } catch (e) { /* nada */ }
    } else {
      ctxs.forEach(function (x) { if (x.state !== "running" && x.resume) x.resume().catch(function () {}); });
      revisar();
    }
  };
  var pantallaAntes = window.showScreen;
  window.showScreen = function () { var r = pantallaAntes.apply(this, arguments); revisar(); return r; };
  var silencioAntes = window.toggleMute;
  if (typeof silencioAntes === "function") window.toggleMute = function () { var r = silencioAntes.apply(this, arguments); revisar(); return r; };
  document.addEventListener("visibilitychange", function () { if (document.hidden) parar(true); else revisar(); });
  window.addEventListener("app-intro-fin", revisar);
  // En iPhone el audio solo arranca (o vuelve, si el sistema lo pausó al cambiar de modo) dentro de un toque, y
  // cuenta el toque al levantar el dedo: ahí mismo se reactiva, sin esperas de por medio.
  function destrabar() {
    if (enAnuncio) return;
    var ctx = typeof getAudioCtx === "function" ? getAudioCtx() : null;
    if (ctx && ctx.state !== "running" && ctx.resume) ctx.resume().catch(function () {});
    if (!sonando || (ctx && ctx.state !== "running")) revisar();
  }
  document.addEventListener("touchend", destrabar, true);
  document.addEventListener("click", destrabar, true);
  pintarBoton();
  var idiomaAntes = window.setLanguage;
  if (typeof idiomaAntes === "function") window.setLanguage = function () { var r = idiomaAntes.apply(this, arguments); pintarBoton(); return r; };
  setTimeout(revisar, 1500);
})();
