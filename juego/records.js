/* tutti.frutti · web (igual que en la app) · festejo por récord.
   Si superás tu mejor marca (Contrarreloj, desafío del día o mejor ronda online), al terminar de ver los
   resultados sale un sello grande de "¡Nuevo récord!" con confeti. La primera vez que jugás un modo solo
   se anota la marca (no se festeja). Las marcas se guardan en tuttifruti_app_records (en este navegador). */
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
    },
  };
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave;
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return str;
  }

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
          '<span class="rt-sello-pts"><b>' + valor + "</b> pts</span>" +
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
    var res = diarioOriginal.apply(this, arguments);
    if (fresh && record && !record.unfinished) {
      if (record.valid && record.valid === record.total && APP.momentoFeliz) APP.momentoFeliz("diario_perfecto");
      var antes = anotar("diario", record.score || 0);
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
        var antes = anotar("online", total);
        if (antes != null) festejar("online", total, antes);
      }
    } catch (e) { console.error(e); }
    return res;
  };
})();
