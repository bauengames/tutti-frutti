/* tutti.frutti · web (igual que app-sonidos.js de la app) · sonidos más lindos.
   El juego de la web usa pitidos simples; acá se arman sonidos con capas (campanas, madera,
   acordes, un poco de ruido) usando el mismo audio del juego, así respetan el botón de sonido.
   No usa archivos: todo se genera en el momento. */
(function () {
  var salida = null;
  function ctx() {
    if (state.muted) return null;
    var c = getAudioCtx();
    if (!c) return null;
    if (c.state !== "running") { c.resume().catch(function () {}); }
    salidaEfectos(c); // actualiza el volumen de los efectos (Ajustes → Sonido)
    if (!salida || salida.context !== c) {
      // Un compresor suave al final para que nada suene fuerte de golpe.
      var comp = c.createDynamicsCompressor();
      comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 4;
      comp.attack.value = 0.003; comp.release.value = 0.2;
      var vol = c.createGain(); vol.gain.value = 0.9;
      comp.connect(vol); vol.connect(salidaEfectos(c));
      salida = comp;
    }
    return c;
  }

  // Un tono con forma (ataque y caída), con glissando opcional.
  function tono(f, dur, o) {
    o = o || {};
    var c = ctx(); if (!c) return;
    var t0 = c.currentTime + (o.delay || 0);
    var osc = c.createOscillator(), g = c.createGain();
    osc.type = o.tipo || "sine";
    osc.frequency.setValueAtTime(f, t0);
    if (o.hasta) osc.frequency.exponentialRampToValueAtTime(o.hasta, t0 + dur);
    var v = o.vol == null ? 0.2 : o.vol, at = o.ataque || 0.005;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + at);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    var ultimo = g;
    if (o.filtro) {
      var fl = c.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = o.filtro;
      g.connect(fl); ultimo = fl;
    }
    osc.connect(g); ultimo.connect(salida);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  // Un golpe de ruido filtrado (madera, aire, papel).
  function ruido(dur, o) {
    o = o || {};
    var c = ctx(); if (!c) return;
    var t0 = c.currentTime + (o.delay || 0);
    var n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var src = c.createBufferSource(); src.buffer = buf;
    var fl = c.createBiquadFilter(); fl.type = o.tipoFiltro || "bandpass"; fl.frequency.value = o.frec || 2000; fl.Q.value = o.q || 1;
    if (o.hasta) fl.frequency.exponentialRampToValueAtTime(o.hasta, t0 + dur);
    var g = c.createGain(); g.gain.setValueAtTime(o.vol == null ? 0.2 : o.vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(fl); fl.connect(g); g.connect(salida);
    src.start(t0); src.stop(t0 + dur + 0.02);
  }
  // Campana: fundamental más armónicos que se apagan rápido.
  function campana(f, o) {
    o = o || {};
    var v = o.vol == null ? 0.16 : o.vol, d = o.delay || 0, dur = o.dur || 0.9;
    tono(f, dur, { vol: v, delay: d, ataque: 0.004 });
    tono(f * 2, dur * 0.6, { vol: v * 0.45, delay: d, ataque: 0.004 });
    tono(f * 3.01, dur * 0.35, { vol: v * 0.2, delay: d, ataque: 0.003 });
  }

  var S = window.SONIDOS = {
    // Madera: el tic del reloj y de la ruleta. Cuanto menos tiempo queda, más agudo.
    tic: function (agudo) {
      var f = 1100 + (agudo || 0) * 140;
      tono(f, 0.06, { vol: 0.16, tipo: "triangle" });
      ruido(0.03, { frec: 3500, q: 2, vol: 0.08 });
    },
    ruleta: function () { ruido(0.025, { frec: 2600, q: 3, vol: 0.09 }); tono(1500, 0.03, { vol: 0.05, tipo: "triangle" }); },
    // Cae la letra: campanita brillante.
    letra: function () { campana(1318, { vol: 0.15 }); campana(1760, { vol: 0.1, delay: 0.09, dur: 1.1 }); },
    // Se terminó el tiempo: dos notas que bajan, con un "plop" grave.
    tiempo: function () {
      tono(523, 0.22, { tipo: "triangle", vol: 0.18 });
      tono(392, 0.45, { tipo: "triangle", vol: 0.18, delay: 0.18, hasta: 330 });
      tono(110, 0.35, { vol: 0.25, delay: 0.18, hasta: 70 });
    },
    // ¡Basta! de fábrica: golpe + acorde corto con aire.
    basta: function () {
      tono(140, 0.25, { vol: 0.35, hasta: 60 });
      ruido(0.18, { frec: 1800, q: 0.7, vol: 0.18, hasta: 400 });
      [523, 659, 784].forEach(function (f, i) { tono(f, 0.38, { tipo: "triangle", vol: 0.1, delay: 0.04 + i * 0.03 }); });
    },
    // Festejo: arpegio que sube y termina en campana.
    festejo: function () {
      [523, 659, 784, 1047].forEach(function (f, i) { tono(f, 0.22, { tipo: "triangle", vol: 0.13, delay: i * 0.07 }); });
      campana(2093, { vol: 0.09, delay: 0.3, dur: 1 });
      ruido(0.4, { frec: 6000, q: 0.5, vol: 0.04, delay: 0.28 });
    },
    // Semillas: dos notitas tipo moneda.
    moneda: function () { tono(988, 0.08, { tipo: "square", vol: 0.06, filtro: 3000 }); tono(1319, 0.22, { tipo: "square", vol: 0.06, delay: 0.07, filtro: 3000 }); },
    // Perdiste: tres notas que bajan, tristonas.
    triste: function () {
      [392, 370, 349].forEach(function (f, i) { tono(f, 0.32, { tipo: "triangle", vol: 0.14, delay: i * 0.26 }); });
      tono(330, 0.8, { tipo: "triangle", vol: 0.14, delay: 0.78, hasta: 300 });
    },
    // Burbujita al completar una categoría: sube de nota con cada una.
    burbuja: function (n) {
      var escala = [523, 587, 659, 784, 880, 1047, 1175, 1319, 1568, 1760];
      var f = escala[Math.min(escala.length - 1, Math.max(0, n - 1))];
      tono(f, 0.12, { vol: 0.12, hasta: f * 1.25 });
    },
    // Últimos 15 segundos: un "tum-tum" de corazón con un tic de madera arriba (para que se oiga en el parlante
    // del celular), que se va haciendo más fuerte. A los 15, además, dos notitas de aviso. Desde los 5 sigue el tic.
    presion: function (quedan) {
      var k = Math.max(0, Math.min(1, (15 - quedan) / 9)); // 0 a los 15 s, 1 a los 6 s
      var v = 0.1 + k * 0.12;
      tono(190, 0.16, { tipo: "triangle", vol: v * 1.6, hasta: 120 });
      ruido(0.03, { frec: 1400, q: 1.5, vol: v * 0.5 });
      tono(170, 0.14, { tipo: "triangle", vol: v * 1.1, hasta: 110, delay: 0.17 });
      if (quedan === 15) { tono(880, 0.12, { tipo: "triangle", vol: 0.12 }); tono(1175, 0.18, { tipo: "triangle", vol: 0.12, delay: 0.12 }); }
    },
    // Toque suave para las pestañas.
    pop: function () { tono(620, 0.07, { vol: 0.07, hasta: 880 }); },
    // Tocar tu fruta.
    boing: function () { tono(300, 0.25, { vol: 0.16, tipo: "triangle", hasta: 720 }); tono(720, 0.18, { vol: 0.08, delay: 0.18, hasta: 520 }); },
  };

  // Reemplazos de los sonidos del juego.
  window.playTic = function () {
    var juego = document.getElementById("screen-game");
    var enPartida = juego && juego.classList.contains("active") && state.secondsLeft > 0 && state.secondsLeft <= 5;
    if (document.querySelector("#medal.spinning")) S.ruleta();
    else S.tic(enPartida ? 6 - state.secondsLeft : 0);
  };
  window.playTimeUp = (function (antes) {
    return function () { S.tiempo(); };
  })(window.playTimeUp);
  window.playDing = function () { S.letra(); };
  var bastaOriginal = window.playBastaSound;
  window.playBastaSound = function (id) {
    if (arguments.length === 0) id = myBastaSound();
    if (!id) { S.basta(); return; }
    return bastaOriginal.call(this, id);
  };

  // Presión de los últimos 15 segundos (hasta los 6; después está el tic). La Copa y Pasar el celu llaman a
  // appPresion con su propio reloj; las partidas del juego, cada vez que se actualiza el reloj.
  var ultimoSegundo = null;
  window.appPresion = function (quedan) {
    if (quedan > 15 || quedan < 6 || quedan === ultimoSegundo) return;
    ultimoSegundo = quedan;
    S.presion(quedan);
    if (quedan === 15) vibrar("toque");
  };
  var relojAntes = window.updateTimerDisplay;
  if (typeof relojAntes === "function") window.updateTimerDisplay = function () {
    var r = relojAntes.apply(this, arguments);
    try {
      var juego = document.getElementById("screen-game");
      var corre = juego && juego.classList.contains("active") && !document.querySelector("#medal.spinning") && !state.advFinishing;
      if (corre && typeof state.secondsLeft === "number") appPresion(state.secondsLeft);
      if (state.secondsLeft > 15) ultimoSegundo = null;
    } catch (e) { console.error(e); }
    return r;
  };

  function despues(nombre, fn) {
    var original = window[nombre];
    if (typeof original !== "function") return;
    window[nombre] = function () {
      var r = original.apply(this, arguments);
      try { fn.apply(this, arguments); } catch (e) { console.error(e); }
      return r;
    };
  }
  despues("launchConfetti", function () { S.festejo(); });
  despues("seedToast", function () { S.moneda(); });
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".app-tab")) S.pop();
  }, true);
})();
