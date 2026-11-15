/* tutti.frutti · web · Contrarreloj con más vida: igual que app-contrarreloj.js de la app 1.0.21 (el ranking semanal es
   el mismo para la web y la app, así que las reglas tienen que ser iguales).
   1. Tiempo que se gana: una ronda completa (todas las casillas escritas) suma +5 s al reloj; si además valen
      todas, +10 s. Jugar bien te deja jugar más.
   2. Combo: rondas seguidas con todas válidas multiplican los puntos de la ronda (la 2.ª ×2, de la 3.ª en adelante
      ×3). Una ronda que no es pleno lo corta. Mientras dura, se ve "Combo ×N si valen todas" arriba de las casillas.
   3. Rondas sorpresa (desde la 3.ª ronda, más o menos una de cada cuatro, nunca dos seguidas):
      - Relámpago: 3 categorías y 15 segundos para esa ronda (el reloj general sigue corriendo).
      - Letra de oro: todo lo de esa ronda vale doble.
      - Una sola categoría: seis casillas de la misma categoría ("lluvia de ideas"; "Perro" y "Perros" cuentan una).
   Se engancha a startStreakMode, pickStreakCategories, startStreakRound, beginPlayingStreak, tickStreak,
   finishStreakRound, renderStreakResult, onBastaTap (ronda vacía: −5 s) y goToLobby. Se carga después de los demás archivos de juego/. */
(function () {
  var NB = " ";
  var TX = {
    es: { relampago: "Ronda relámpago", relampago_d: "3 categorías · quedan {s} s", oro: "Letra de oro", oro_d: "esta ronda vale doble",
      una: "Una sola categoría", una_d: "todas las que puedas", combo: "Combo ×{n} si valen todas", mas_s: "+{s} s", combo_hecho: "¡Combo ×{n}!", vacia: "Ronda vacía: −5 s" },
    en: { relampago: "Lightning round", relampago_d: "3 categories · {s} s left", oro: "Golden letter", oro_d: "this round counts double",
      una: "One category only", una_d: "as many as you can", combo: "Combo ×{n} if all are valid", mas_s: "+{s} s", combo_hecho: "Combo ×{n}!", vacia: "Empty round: −5 s" },
    pt: { relampago: "Rodada relâmpago", relampago_d: "3 categorias · faltam {s} s", oro: "Letra de ouro", oro_d: "esta rodada vale o dobro",
      una: "Uma só categoria", una_d: "todas as que conseguir", combo: "Combo ×{n} se todas valerem", mas_s: "+{s} s", combo_hecho: "Combo ×{n}!", vacia: "Rodada vazia: −5 s" },
    de: { relampago: "Blitzrunde", relampago_d: "3 Kategorien · noch {s} s", oro: "Goldener Buchstabe", oro_d: "diese Runde zählt doppelt",
      una: "Nur eine Kategorie", una_d: "so viele du schaffst", combo: "Combo ×{n}, wenn alle gültig sind", mas_s: "+{s} s", combo_hecho: "Combo ×{n}!" },
    fr: { relampago: "Manche éclair", relampago_d: "3 catégories · encore {s} s", oro: "Lettre en or", oro_d: "cette manche compte double",
      una: "Une seule catégorie", una_d: "autant que tu peux", combo: "Combo ×{n} si tout est valide", mas_s: "+{s} s", combo_hecho: "Combo ×{n}" + NB + "!" },
    it: { relampago: "Round lampo", relampago_d: "3 categorie · restano {s} s", oro: "Lettera d'oro", oro_d: "questo round vale doppio",
      una: "Una sola categoria", una_d: "tutte quelle che riesci", combo: "Combo ×{n} se sono tutte valide", mas_s: "+{s} s", combo_hecho: "Combo ×{n}!" },
  };
  function tx(k, v) {
    var s = (TX[state.lang] || TX.es)[k] || TX.es[k];
    if (APP.tu) s = APP.tu(s);
    Object.keys(v || {}).forEach(function (n) { s = s.split("{" + n + "}").join(String(v[n])); });
    return APP.numeros ? APP.numeros(s) : s;
  }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }

  var SEG_COMPLETA = 5, SEG_PLENO = 10, RELAMPAGO_SEG = 15, RELAMPAGO_CATS = 3, COMBO_MAX = 3;
  var combo = 0, especial = null, anterior = null, inicioRonda = 0, procesadas = 0;
  APP.contrarrelojEspecial = function () { return especial; };

  // ---------- Al empezar una partida ----------
  var modoAntes = window.startStreakMode;
  if (typeof modoAntes === "function") window.startStreakMode = function () {
    combo = 0; especial = null; anterior = null; procesadas = 0;
    return modoAntes.apply(this, arguments);
  };

  // ---------- Puntos y tiempo de la ronda que se acaba de jugar ----------
  // Se aplica una vez por ronda: antes de armar la siguiente (y ahí suma tiempo) o en el resultado final (sin tiempo).
  function procesarUltima(sigue) {
    var log = state.streakLog || [];
    if (log.length <= procesadas) return null;
    var r = log[log.length - 1];
    procesadas = log.length;
    var premio = { s: 0, combo: 0 };
    if (especial && !r.especial) r.especial = especial; // la ronda que se acaba de jugar (todavía no se sorteó la próxima)
    if (r.especial === "oro" && r.points > 0) { state.streakScore += r.points; r.points *= 2; }
    if (r.full) {
      combo++;
      var mult = Math.min(combo, COMBO_MAX);
      if (mult > 1 && r.points > 0) { state.streakScore += r.points * (mult - 1); r.points *= mult; r.combo = mult; premio.combo = mult; }
    } else combo = 0;
    var escritas = (r.results || []).filter(function (x) { return x.val && String(x.val).trim(); }).length;
    if (sigue && r.total > 0) {
      var s = r.full ? SEG_PLENO : escritas === r.total ? SEG_COMPLETA : 0;
      if (s) { state.streakTimeLeft += s; r.segundos = s; premio.s = s; }
    }
    return premio;
  }

  // ---------- Qué ronda toca (las sorpresas) ----------
  function sortearEspecial() {
    var n = state.streakRound || 1;
    if (n < 3 || anterior || Math.random() > 0.27) return null;
    var tipos = ["relampago", "oro", "una"];
    return tipos[Math.floor(Math.random() * tipos.length)];
  }
  var categoriasAntes = window.pickStreakCategories;
  if (typeof categoriasAntes === "function") window.pickStreakCategories = function () {
    var r = categoriasAntes.apply(this, arguments);
    if (especial === "relampago" && Array.isArray(r)) return r.slice(0, RELAMPAGO_CATS);
    if (especial === "una" && typeof ADV_CATS !== "undefined" && ADV_CATS.lluvia) {
      var base = ADV_CATS.lluvia[Math.floor(Math.random() * ADV_CATS.lluvia.length)];
      return Array.from({ length: STREAK_CATEGORY_COUNT }, function (_, k) { return base + "#" + (k + 1); });
    }
    return r;
  };

  var rondaAntes = window.startStreakRound;
  if (typeof rondaAntes === "function") window.startStreakRound = function () {
    var premio = procesarUltima(true);
    var previo = especial;
    especial = sortearEspecial();
    anterior = especial || null;
    if (!especial && previo) anterior = null;
    var r = rondaAntes.apply(this, arguments);
    if (especial === "una") state.wildcardCategory = null; // en la lluvia no hay categoría doble
    if (premio && (premio.s || premio.combo)) festejar(premio);
    return r;
  };

  // ---------- Durante la ronda: el cartel de la sorpresa o del combo, y el reloj del relámpago ----------
  function cartel() {
    var nota = document.getElementById("twistNote");
    if (!nota || !state.streakMode) return;
    var html = "";
    if (especial === "relampago") {
      var quedan = Math.max(0, RELAMPAGO_SEG - (inicioRonda - state.secondsLeft));
      html = iconSvg("bolt") + "<span><strong>" + esc(tx("relampago")) + "</strong> · " + esc(tx("relampago_d", { s: quedan })) + "</span>";
    } else if (especial === "oro") {
      html = iconSvg("star") + "<span><strong>" + esc(tx("oro")) + "</strong> · " + esc(tx("oro_d")) + "</span>";
    } else if (especial === "una") {
      html = iconSvg("rainbow") + "<span><strong>" + esc(tx("una")) + "</strong> · " + esc(tx("una_d")) + "</span>";
    }
    if (combo >= 1 && especial !== "relampago") html += (html ? '<span class="cr-sep"></span>' : "") + '<span class="cr-combo">' + esc(tx("combo", { n: Math.min(combo + 1, COMBO_MAX) })) + "</span>";
    else if (combo >= 1) html += '<span class="cr-combo">×' + Math.min(combo + 1, COMBO_MAX) + "</span>";
    if (!html) return;
    nota.innerHTML = html;
    nota.style.display = "flex";
    nota.classList.add("cr-nota");
    nota.classList.toggle("cr-oro", especial === "oro");
    nota.classList.toggle("cr-relampago", especial === "relampago");
  }
  var jugarAntes = window.beginPlayingStreak;
  if (typeof jugarAntes === "function") window.beginPlayingStreak = function () {
    var r = jugarAntes.apply(this, arguments);
    inicioRonda = state.secondsLeft;
    try { cartel(); } catch (e) { console.error(e); }
    return r;
  };
  var ticAntes = window.tickStreak;
  if (typeof ticAntes === "function") window.tickStreak = function () {
    var r = ticAntes.apply(this, arguments);
    if (state.streakMode && especial === "relampago" && !state.streakFinishing) {
      try { cartel(); } catch (e) { /* nada */ }
      if (inicioRonda - state.secondsLeft >= RELAMPAGO_SEG && state.secondsLeft > 0 && typeof onStreakReadyTap === "function") onStreakReadyTap();
    }
    return r;
  };
  // Lo de la ronda queda anotado en el registro (para el resultado), y se sale de la sorpresa al terminar.
  var terminarAntes = window.finishStreakRound;
  if (typeof terminarAntes === "function") window.finishStreakRound = function () {
    var tipo = especial, largo = (state.streakLog || []).length;
    return Promise.resolve(terminarAntes.apply(this, arguments)).then(function (v) {
      var log = state.streakLog || [];
      if (tipo && log.length > largo) log[largo].especial = tipo;
      return v;
    });
  };

  // ---------- Festejo entre rondas: "+10 s" y "¡Combo ×2!" ----------
  function festejar(p) {
    var el = document.createElement("div");
    el.className = "cr-premio";
    el.innerHTML = (p.s ? '<span class="cr-premio-s">' + esc(tx("mas_s", { s: p.s })) + "</span>" : "") +
      (p.combo ? '<span class="cr-premio-combo">' + esc(tx("combo_hecho", { n: p.combo })) + "</span>" : "");
    document.body.appendChild(el);
    if (typeof vibrar === "function") vibrar(p.combo ? "bien" : "toque");
    if (p.combo && window.SONIDOS && SONIDOS.burbuja) try { SONIDOS.burbuja(p.combo + 2); } catch (e) { /* nada */ }
    setTimeout(function () { el.classList.add("sale"); }, 1500);
    setTimeout(function () { el.remove(); }, 1900);
  }

  // ---------- Resultado: la última ronda también cuenta para el combo (sin tiempo), y cada ronda dice qué tuvo ----------
  var resultadoAntes = window.renderStreakResult;
  if (typeof resultadoAntes === "function") window.renderStreakResult = function () {
    procesarUltima(false);
    var r = resultadoAntes.apply(this, arguments);
    try {
      var log = state.streakLog || [];
      document.querySelectorAll("#answerList .streak-round").forEach(function (b, i) {
        var x = log[i];
        if (!x) return;
        var extra = [];
        if (x.especial) extra.push(tx(x.especial === "relampago" ? "relampago" : x.especial === "oro" ? "oro" : "una"));
        if (x.combo) extra.push("Combo ×" + x.combo);
        if (x.segundos) extra.push(tx("mas_s", { s: x.segundos }));
        if (!extra.length) return;
        var info = b.querySelector(".streak-round-info > span");
        if (info) info.insertAdjacentHTML("beforeend", ' · <span class="cr-extra">' + esc(extra.join(" · ")) + "</span>");
      });
    } catch (e) { console.error(e); }
    especial = null;
    return r;
  };
  // ---------- Ronda vacía: −5 s (en la app está en app-reglas.js, desde el 8/11) ----------
  // Tocar ¡Basta! con todo vacío daba letra nueva casi gratis (el reloj no corre en la ruleta ni con el juez).
  var bastaAntes = window.onBastaTap;
  if (typeof bastaAntes === "function") window.onBastaTap = function () {
    try {
      var casillas = Array.prototype.filter.call(document.querySelectorAll("#catGrid input"), function (i) { return !i.disabled && i.offsetParent; });
      var vacias = casillas.filter(function (i) { return !i.value.trim(); }).length;
      if (state.streakMode && casillas.length && vacias === casillas.length && state.secondsLeft > 0) {
        state.secondsLeft = Math.max(0, state.secondsLeft - 5);
        state.streakTimeLeft = state.secondsLeft;
        if (typeof updateTimerDisplay === "function") updateTimerDisplay();
        var stack = document.getElementById("toastStack");
        if (stack) {
          var el = document.createElement("div");
          el.className = "toast";
          el.innerHTML = "<span><strong>" + esc(tx("vacia")) + "</strong></span>";
          stack.appendChild(el);
          setTimeout(function () { el.classList.add("out"); }, 2600);
          setTimeout(function () { el.remove(); }, 3100);
        }
      }
    } catch (e) { console.error(e); }
    return bastaAntes.apply(this, arguments);
  };

  // Si sale de la partida, se limpia la sorpresa (que no quede el cartel en la próxima).
  var lobbyAntes = window.goToLobby;
  if (typeof lobbyAntes === "function") window.goToLobby = function () { especial = null; combo = 0; return lobbyAntes.apply(this, arguments); };
})();
