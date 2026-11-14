/* tutti.frutti · web (igual que app-ritmo.js de la app) · resultados con ritmo y festejo por récord.
   - Revisión con ritmo: en los resultados (online, desafío del día, Aventura) las respuestas aparecen
     una por una, cada una con su ✓ o ✗, un sonidito que sube de nota con cada acierto, una vibración
     y un contador de la ronda que va sumando. Tocando la lista se muestra todo de una.
   - Festejo por récord: si superás tu mejor marca (Contrarreloj, desafío del día o mejor ronda online),
     al terminar de aparecer las respuestas sale un sello grande de "¡Nuevo récord!" con confeti.
     La primera vez que jugás un modo solo se anota la marca (no se festeja).
   Las marcas se guardan en tuttifruti_app_records (en este navegador).
   Se carga después de juego/sonidos.js (reemplaza al viejo juego/records.js, que solo tenía el festejo). */
(function () {
  var TEXTOS = {
    es: {
      ronda: "Esta ronda", record: "¡Nuevo récord!", antes: "Tu mejor era {n}", tocar: "Tocá para seguir",
      m_contrarreloj: "Contrarreloj", m_diario: "Desafío del día", m_online: "Mejor ronda online",
    },
    en: {
      ronda: "This round", record: "New record!", antes: "Your best was {n}", tocar: "Tap to continue",
      m_contrarreloj: "Time attack", m_diario: "Daily challenge", m_online: "Best online round",
    },
    pt: {
      ronda: "Esta rodada", record: "Novo recorde!", antes: "Seu melhor era {n}", tocar: "Toque para continuar",
      m_contrarreloj: "Contra o relógio", m_diario: "Desafio do dia", m_online: "Melhor rodada online",
    }, de: {ronda: "Diese Runde", record: "Neuer Rekord!", antes: "Dein bester war {n}", tocar: "Zum Weitermachen tippen", m_contrarreloj: "Zeitrennen", m_diario: "Tagesherausforderung", m_online: "Beste Online-Runde"}, fr: {ronda: "Cette manche", record: "Nouveau record !", antes: "Ton meilleur score était {n}", tocar: "Touche pour continuer", m_contrarreloj: "Contre-la-montre", m_diario: "Défi du jour", m_online: "Meilleure manche en ligne"}, it: {ronda: "Questo round", record: "Nuovo record!", antes: "Il tuo record era {n}", tocar: "Tocca per continuare", m_contrarreloj: "Contro il tempo", m_diario: "Sfida del giorno", m_online: "Miglior round online"},
  };
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave;
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return APP.numeros(str);
  }
  var reducir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var S = window.SONIDOS || {};
  // Respuesta que no valió: un "tuc" grave y corto.
  function sonidoMal() {
    try {
      var c = !state.muted && getAudioCtx();
      if (!c) return;
      var t0 = c.currentTime, o = c.createOscillator(), g = c.createGain();
      o.type = "triangle"; o.frequency.setValueAtTime(220, t0); o.frequency.exponentialRampToValueAtTime(140, t0 + 0.16);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
      o.connect(g); g.connect(salidaEfectos(c)); o.start(t0); o.stop(t0 + 0.2);
    } catch (e) { /* sin sonido */ }
  }

  // ---------- Revisión con ritmo ----------
  var PASO = 430, ARRANQUE = 350;
  var tanda = null; // la lista que se está mostrando ahora
  // El contador de una revisión anterior no queda colgado en la pantalla siguiente.
  function quitarContadores() { document.querySelectorAll(".rt-total").forEach(function (p) { p.remove(); }); }
  function nuevaTanda(lista) {
    if (tanda) tanda.timers.forEach(clearTimeout);
    quitarContadores();
    var pill = document.createElement("div");
    pill.className = "rt-total";
    pill.innerHTML = "<span>" + escapeHtml(tx("ronda")) + "</span><strong>+0</strong>";
    lista.parentNode.insertBefore(pill, lista);
    tanda = { lista: lista, timers: [], filas: [], total: 0, aciertos: 0, pill: pill, alTerminar: [], fin: 0 };
    // Tocar la lista (o el contador) muestra todo de una.
    var saltar = function () { mostrarTodo(); };
    lista.addEventListener("click", saltar, { once: true });
    pill.addEventListener("click", saltar, { once: true });
    return tanda;
  }
  function puntosDe(fila) {
    var p = fila.querySelector(".points");
    return p ? parseInt(String(p.textContent).replace(/[^0-9-]/g, ""), 10) || 0 : 0;
  }
  function mostrarFila(T, fila, conEfectos) {
    if (fila.dataset.rtListo) return;
    fila.dataset.rtListo = "1";
    fila.classList.remove("rt-espera");
    var pts = puntosDe(fila), bien = pts > 0;
    fila.classList.add("rt-entra", bien ? "rt-bien" : "rt-mal");
    var marca = document.createElement("span");
    marca.className = "rt-marca";
    marca.setAttribute("aria-hidden", "true");
    marca.textContent = bien ? "✓" : "✗";
    fila.insertBefore(marca, fila.firstChild);
    T.total += pts;
    if (bien) T.aciertos++;
    var fuerte = T.pill.querySelector("strong");
    fuerte.textContent = "+" + T.total;
    T.pill.classList.remove("rt-late"); void T.pill.offsetWidth; T.pill.classList.add("rt-late");
    if (conEfectos) {
      if (bien) { if (S.burbuja) S.burbuja(T.aciertos); vibrar("toque"); }
      else sonidoMal();
    }
  }
  function terminar(T) {
    if (T.terminada) return;
    T.terminada = true;
    T.pill.classList.add("rt-hecho");
    var cbs = T.alTerminar; T.alTerminar = [];
    cbs.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
  }
  function mostrarTodo() {
    var T = tanda;
    if (!T || T.terminada) return;
    T.timers.forEach(clearTimeout); T.timers = [];
    T.filas.forEach(function (f) { mostrarFila(T, f, false); });
    terminar(T);
  }
  // Para el festejo: se ejecuta cuando terminaron de aparecer las respuestas (o enseguida).
  APP.alTerminarRevision = function (fn) {
    if (tanda && !tanda.terminada && document.body.contains(tanda.lista)) tanda.alTerminar.push(fn);
    else setTimeout(fn, 500);
  };

  var revealOriginal = window.revealRow;
  window.revealRow = function (row, index) {
    // Las rondas de Contrarreloj (bloques que se abren) siguen como antes.
    if (reducir || !row.classList.contains("answer-row") || !row.querySelector(".points")) return revealOriginal.apply(this, arguments);
    row.classList.add("rt-espera");
    // La fila todavía no está en la lista: se espera un instante a que el juego la agregue.
    setTimeout(function () {
      var lista = row.parentNode;
      if (!lista) return;
      if (index === 0 || !tanda || tanda.lista !== lista || tanda.terminada) nuevaTanda(lista);
      var T = tanda;
      T.filas.push(row);
      T.timers.push(setTimeout(function () { mostrarFila(T, row, true); }, ARRANQUE + index * PASO));
      clearTimeout(T.finTimer);
      T.finTimer = setTimeout(function () { terminar(T); }, ARRANQUE + index * PASO + 500);
      T.timers.push(T.finTimer);
    }, 0);
  };

  // ---------- Récords ----------
  var REC_KEY = "tuttifruti_app_records";
  function records() { try { var r = JSON.parse(localStorage.getItem(REC_KEY) || "{}"); return r && typeof r === "object" ? r : {}; } catch (e) { return {}; } }
  // Anota la marca; devuelve la anterior si se superó (y había una).
  function anotar(modo, valor) {
    if (!(valor > 0)) return null;
    var r = records(), antes = r[modo];
    if (antes != null && valor <= antes) return null;
    r[modo] = valor;
    try { localStorage.setItem(REC_KEY, JSON.stringify(r)); } catch (e) { /* nada */ }
    return antes == null ? null : antes; // la primera vez solo se anota
  }
  function festejar(modo, valor, antes) {
    if (APP.evento) APP.evento("nuevo_record", { modo: modo, puntos: valor });
    if (APP.momentoFeliz) APP.momentoFeliz("record");
    APP.alTerminarRevision(function () {
      var capa = document.createElement("div");
      capa.className = "rt-record";
      capa.innerHTML =
        '<div class="rt-sello">' +
          '<div class="rt-sello-fruta">' + mascotSvg("happy", getMyAvatar(), myEquipped()) + "</div>" +
          "<strong>" + escapeHtml(tx("record")) + "</strong>" +
          '<span class="rt-sello-modo">' + escapeHtml(tx("m_" + modo)) + "</span>" +
          '<span class="rt-sello-pts"><b>' + valor + "</b> " + ptsTxt() + "</span>" +
          '<small>' + escapeHtml(tx("antes", { n: antes })) + "</small>" +
        "</div>" +
        '<p class="rt-tocar">' + escapeHtml(tx("tocar")) + "</p>";
      document.body.appendChild(capa);
      vibrar("fuerte");
      launchConfetti();
      setTimeout(launchConfetti, 700);
      var cerrar = function () { capa.classList.add("saliendo"); setTimeout(function () { capa.remove(); }, 250); };
      capa.addEventListener("click", cerrar);
      setTimeout(function () { if (document.body.contains(capa)) cerrar(); }, 4500);
    });
  }

  // Contrarreloj: el puntaje de la partida.
  var rachaOriginal = window.renderStreakResult;
  if (typeof rachaOriginal === "function") window.renderStreakResult = function () {
    var puntos = state.streakScore;
    quitarContadores();
    // La mejor marca que ya tenía el juego también cuenta (si jugaba desde antes de esto).
    var r = records();
    if (r.contrarreloj == null) {
      var mejor = (getStreakHistory()[0] || {}).score;
      if (mejor > 0) { r.contrarreloj = mejor; try { localStorage.setItem(REC_KEY, JSON.stringify(r)); } catch (e) { /* nada */ } }
    }
    var res = rachaOriginal.apply(this, arguments);
    var antes = anotar("contrarreloj", puntos);
    if (antes != null) festejar("contrarreloj", puntos, antes);
    return res;
  };
  // Desafío del día: solo cuando recién lo terminaste.
  var diarioOriginal = window.showDailyResult;
  if (typeof diarioOriginal === "function") window.showDailyResult = function (record, fresh) {
    quitarContadores();
    var res = diarioOriginal.apply(this, arguments);
    if (fresh && record && !record.unfinished) {
      if (record.valid && record.valid === record.total && APP.momentoFeliz) APP.momentoFeliz("diario_perfecto");
      // Cada modo tiene su récord: A toda velocidad da muchos más puntos que A ciegas (el clásico sigue en "diario").
      var antes = anotar(record.mode && record.mode !== "clasico" ? "diario_" + record.mode : "diario", record.score || 0);
      if (antes != null) festejar("diario", record.score, antes);
    }
    return res;
  };
  // Online: los puntos que hiciste en una ronda (una vez por ronda).
  var onlineVistos = {};
  var onlineOriginal = window.renderOnlineResults;
  if (typeof onlineOriginal === "function") window.renderOnlineResults = function (data) {
    var res = onlineOriginal.apply(this, arguments);
    try {
      var round = data.round || 1, clave = state.roomCode + ":" + round + ":" + (data.roundStartAt || "");
      if (!onlineVistos[clave]) {
        onlineVistos[clave] = true;
        var mios = (data.roundScores && data.roundScores[round] && data.roundScores[round][state.playerId]) || {};
        var total = Object.keys(mios).reduce(function (s, c) { return s + (mios[c] || 0); }, 0);
        // En la práctica no hay récords, y tampoco se festeja ganarle a una ronda de la misma partida (salía
        // "¡Nuevo récord! Tu mejor era 10" en la segunda ronda de la primera partida).
        var practica = APP.esPractica && APP.esPractica();
        var r0 = records(), mismaSala = r0.online_sala === state.roomCode;
        var antes = practica ? null : anotar("online", total);
        // Se recuerda en qué sala se hizo la marca (cada vez que cambia, también la primera).
        var r1 = records();
        if (!practica && r1.online !== r0.online) { r1.online_sala = state.roomCode; try { localStorage.setItem(REC_KEY, JSON.stringify(r1)); } catch (e) { /* nada */ } }
        if (antes != null && !mismaSala) festejar("online", total, antes);
      }
    } catch (e) { console.error(e); }
    return res;
  };
})();
