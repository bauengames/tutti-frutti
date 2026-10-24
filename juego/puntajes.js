/* tutti.frutti · web (igual que en la app) · resultados de cada ronda online, más claros.
   Antes se veían solo tus palabras con "+20" o "+5" (sin decir por qué) y una leyenda arriba ("0 vacía o
   inválida · 5 repetida…") que había que ir a mirar; la tabla de la sala quedaba al final, sin lo de la ronda.
   Ahora, sobre lo que arma el juego (renderOnlineResults, index.html):
   - Arriba: la letra y en qué puesto vas ("Vas 1º · le sacás 40 a Frutibot").
   - Enseguida, la tabla de la sala con lo que sumó cada uno en la ronda (+60).
   - En cada categoría, por qué valió eso ("Nadie más la puso", "También la puso Lu", "Solo vos la
     completaste", ×2) y qué puso cada rival, con sus puntos.
   - La leyenda de puntos se saca (cada fila ya lo dice).
   Se carga al final, después de app-ritmo.js (que hace aparecer las filas de a una). */
(function () {
  var TEXTOS = {
    es: {
      vas: "Vas {p}º", de_n: "de {n}", le_sacas: "le sacás {d} a {n}", a_de: "a {d} de {n}", empatado: "empatado con {n}",
      r20: "Solo vos la completaste", r10: "Nadie más la puso", r5: "También la puso {n}", r5b: "Repetida", r0: "No vale", doble: "vale doble",
      ronda: "{n} en la ronda", y: " y ", letra: "Letra",
      empate_fin: "Empataron {n} con {p} puntos", quedaste: "Quedaste {p}º", r: "R{k}",
      d_gane: "¡Ganaste la ronda!", d_gano: "Ganó {n} la ronda", d_empate: "¡Empate!", d_ronda: "Ronda {k}", vos: "Vos",
    },
    en: {
      vas: "You're {p}", de_n: "of {n}", le_sacas: "{d} ahead of {n}", a_de: "{d} behind {n}", empatado: "tied with {n}",
      r20: "Only you filled it in", r10: "No one else wrote it", r5: "{n} wrote it too", r5b: "Repeated", r0: "Doesn't count", doble: "double points",
      ronda: "{n} this round", y: " and ", letra: "Letter",
      empate_fin: "{n} tied with {p} points", quedaste: "You came {p}", r: "R{k}",
      d_gane: "You won the round!", d_gano: "{n} won the round", d_empate: "It's a tie!", d_ronda: "Round {k}", vos: "You",
    },
    pt: {
      vas: "Você está em {p}º", de_n: "de {n}", le_sacas: "{d} à frente de {n}", a_de: "a {d} de {n}", empatado: "empatado com {n}",
      r20: "Só você preencheu", r10: "Ninguém mais escreveu", r5: "{n} também escreveu", r5b: "Repetida", r0: "Não vale", doble: "vale o dobro",
      ronda: "{n} na rodada", y: " e ", letra: "Letra",
      empate_fin: "{n} empataram com {p} pontos", quedaste: "Você ficou em {p}º", r: "R{k}",
      d_gane: "Você ganhou a rodada!", d_gano: "{n} ganhou a rodada", d_empate: "Empate!", d_ronda: "Rodada {k}", vos: "Você",
    },
  };
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave;
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return str;
  }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }
  function puesto(p) {
    if (state.lang !== "en") return p;
    var s = p % 100 >= 11 && p % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][p % 10] || "th";
    return p + s;
  }
  function juntar(nombres) {
    return nombres.length <= 1 ? nombres.join("") : nombres.slice(0, -1).join(", ") + tx("y") + nombres[nombres.length - 1];
  }

  var antes = window.renderOnlineResults;
  if (typeof antes !== "function") return;
  window.renderOnlineResults = function (data) {
    var r = antes.apply(this, arguments);
    try { mejorar(data); } catch (e) { console.error("puntajes", e); }
    return r;
  };

  // Final de la partida: puestos compartidos si empatan, "Empataron…" en vez de "Ganó…" y lo de cada ronda.
  var finalAntes = window.renderOnlineFinal;
  if (typeof finalAntes === "function") window.renderOnlineFinal = function (data) {
    var r = finalAntes.apply(this, arguments);
    try { mejorarFinal(data); } catch (e) { console.error("puntajes final", e); }
    return r;
  };
  function mejorarFinal(data) {
    var players = data.players || {}, me = state.playerId;
    var nombre = function (pid) { return safeName((players[pid] && players[pid].name) || "?"); };
    var tabla = Object.keys(players).map(function (pid) { return { pid: pid, score: players[pid].score || 0 }; })
      .sort(function (a, b) { return b.score - a.score; });
    tabla.forEach(function (f, i) { f.pos = i && tabla[i - 1].score === f.score ? tabla[i - 1].pos : i + 1; });
    var categories = data.categories || (data.config && data.config.categories) || [];
    var rondas = Object.keys(data.roundScores || {}).map(Number).filter(function (k) { return k > 0; }).sort(function (a, b) { return a - b; });
    var deRonda = function (pid, k) {
      var s = ((data.roundScores[k] || {})[pid]) || {};
      return categories.reduce(function (t, c) { return t + (s[c] || 0); }, 0) + ((((data.penalties || {})[k] || {})[pid]) || 0);
    };
    document.querySelectorAll("#finalRankingList .rank-row").forEach(function (fila, i) {
      var f = tabla[i];
      if (!f) return;
      var pos = fila.querySelector(".rank-pos");
      if (pos) pos.textContent = f.pos;
      // El trofeo solo para el primero si no hay empate arriba.
      if (i === 0 && tabla[1] && tabla[1].score === tabla[0].score) { var tr = fila.querySelector(".rank-name > svg"); if (tr) tr.remove(); }
      if (rondas.length > 1) {
        var nom = fila.querySelector(".rank-name");
        var det = document.createElement("small");
        det.className = "pz-rondas";
        det.textContent = rondas.map(function (k) { return tx("r", { k: k }) + " " + deRonda(f.pid, k); }).join(" · ");
        if (nom) nom.appendChild(det);
      }
    });
    var arriba = tabla.filter(function (f) { return f.pos === 1; });
    var resumen = document.getElementById("finalSummary");
    if (arriba.length > 1) resumen.innerHTML = esc(tx("empate_fin", { n: juntar(arriba.map(function (f) { return nombre(f.pid); })), p: arriba[0].score }));
    var mia = tabla.filter(function (f) { return f.pid === me; })[0];
    if (mia && mia.pos > 1) {
      resumen.innerHTML += '<span class="pz-dif">' + esc(tx("quedaste", { p: puesto(mia.pos) })) + " · " + tx("a_de", { d: tabla[0].score - mia.score, n: esc(nombre(tabla[0].pid)) }) + "</span>";
    }
  }

  // Los otros modos (desafío del día, Aventura...) usan la misma pantalla: ahí todo queda como siempre.
  var pantallaAntes = window.showScreen;
  window.showScreen = function (id) {
    if (id === "screen-results" && !state.online) {
      var p = document.getElementById("screen-results"), ranking = p.querySelector(".ranking"), nota = document.getElementById("waitingHostNote");
      p.classList.remove("pz-online");
      if (ranking && nota && ranking.nextElementSibling !== nota) nota.parentNode.insertBefore(ranking, nota);
    }
    return pantallaAntes.apply(this, arguments);
  };

  function mejorar(data) {
    var pantalla = document.getElementById("screen-results");
    var round = data.round || 1, me = state.playerId;
    var categories = data.categories || (data.config && data.config.categories) || [];
    var players = data.players || {};
    var scores = ((data.roundScores || {})[round]) || {};
    var answers = ((data.answers || {})[round]) || {};
    var otros = Object.keys(players).filter(function (pid) { return pid !== me; });
    var nombre = function (pid) { return safeName((players[pid] && players[pid].name) || "?"); };
    var ganado = function (pid) {
      return categories.reduce(function (s, c) { return s + (((scores[pid] || {})[c]) || 0); }, 0) + ((((data.penalties || {})[round] || {})[pid]) || 0);
    };
    pantalla.classList.add("pz-online");

    // ---- Tabla de la sala: arriba, con lo de la ronda y puestos compartidos si empatan ----
    var tabla = Object.keys(players).map(function (pid) { return { pid: pid, score: players[pid].score || 0 }; })
      .sort(function (a, b) { return b.score - a.score; });
    tabla.forEach(function (f, i) { f.pos = i && tabla[i - 1].score === f.score ? tabla[i - 1].pos : i + 1; });
    var filas = document.querySelectorAll("#rankingList .rank-row");
    tabla.forEach(function (f, i) {
      var fila = filas[i];
      if (!fila) return;
      var pos = fila.querySelector(".rank-pos");
      if (pos) pos.textContent = f.pos;
      var g = ganado(f.pid);
      var chip = document.createElement("span");
      chip.className = "pz-gana" + (g > 0 ? "" : " cero");
      chip.textContent = (g > 0 ? "+" : "") + g;
      chip.setAttribute("aria-label", tx("ronda", { n: (g > 0 ? "+" : "") + g }));
      var score = fila.querySelector(".rank-score");
      if (score) fila.insertBefore(chip, score);
    });
    var ranking = pantalla.querySelector(".ranking");
    var mascota = document.getElementById("roundMascot");
    if (ranking && mascota && ranking.previousElementSibling !== mascota) mascota.parentNode.insertBefore(ranking, mascota.nextSibling);

    // ---- Arriba: letra y puesto ----
    var mia = tabla.filter(function (f) { return f.pid === me; })[0];
    if (mia && tabla.length > 1) {
      var lider = tabla.filter(function (f) { return f.pid !== me; })[0];
      var segundo = lider;
      var detalle;
      if (mia.pos === 1) {
        detalle = segundo.score === mia.score ? tx("empatado", { n: esc(nombre(segundo.pid)) }) : tx("le_sacas", { d: mia.score - segundo.score, n: esc(nombre(segundo.pid)) });
      } else {
        var primero = tabla[0];
        detalle = primero.score === mia.score ? tx("empatado", { n: esc(nombre(primero.pid)) }) : tx("a_de", { d: primero.score - mia.score, n: esc(nombre(primero.pid)) });
      }
      var resumen = document.getElementById("resultsSummary");
      resumen.innerHTML = esc(tx("letra")) + ": <strong>" + esc(data.letter) + "</strong> · <strong>" + esc(tx("vas", { p: puesto(mia.pos) })) + "</strong> " +
        esc(tx("de_n", { n: tabla.length })) + '<span class="pz-dif">' + detalle + "</span>";
    }

    // ---- Cada categoría: por qué valió eso y qué puso cada rival ----
    var normal = function (s) { return typeof normalizeAnswer === "function" ? normalizeAnswer(s) : String(s || "").trim().toLowerCase(); };
    var filasR = document.querySelectorAll("#answerList .answer-row");
    categories.forEach(function (cat, i) {
      var fila = filasR[i];
      if (!fila) return;
      var mio = (((answers[me] || {})[cat]) || "").trim();
      var pts = ((scores[me] || {})[cat]) || 0;
      var mult = typeof roundMultiplier === "function" ? roundMultiplier(data, cat) : 1;
      var base = mult ? pts / mult : pts;
      var nota = fila.querySelector('div[style*="flex-basis"]'); // lo que ya explica el juego (juez, comodín, repetida...)
      var motivo = "";
      if (mio && !nota) {
        if (base >= 20) motivo = tx("r20");
        else if (base >= 10) motivo = tx("r10");
        else if (base >= 5) {
          var iguales = otros.filter(function (pid) { var v = (((answers[pid] || {})[cat]) || "").trim(); return v && normal(v) === normal(mio); }).map(nombre);
          motivo = iguales.length ? tx("r5", { n: juntar(iguales) }) : tx("r5b");
        } else motivo = tx("r0");
        if (mult > 1 && pts > 0) motivo += " · " + tx("doble");
      }
      var rivales = otros.map(function (pid) {
        var v = (((answers[pid] || {})[cat]) || "").trim(), p = ((scores[pid] || {})[cat]) || 0;
        return '<span class="pz-otro"><b>' + esc(nombre(pid)) + "</b> " + (v ? esc(typeof answerText === "function" ? answerText(v) : v) : "—") +
          ' <i class="' + (p > 0 ? "si" : "") + '">' + (p > 0 ? "+" + p : "0") + "</i></span>";
      }).join("");
      var extra = document.createElement("div");
      extra.className = "pz-extra";
      extra.innerHTML = (motivo ? '<p class="pz-motivo">' + esc(motivo) + "</p>" : "") + (rivales ? '<p class="pz-otros">' + rivales + "</p>" : "");
      if (extra.innerHTML) fila.appendChild(extra);
    });

    // ---- Mano a mano (2 jugadores): frente a frente, corona para quien ganó la ronda y cada categoría lado a lado ----
    var viejo = document.getElementById("pzDuoVs"); if (viejo) viejo.remove();
    var viejaLista = document.getElementById("pzDuoLista"); if (viejaLista) viejaLista.remove();
    pantalla.classList.toggle("pz-duo", otros.length === 1);
    if (otros.length !== 1) return;
    var rival = otros[0], ga = ganado(me), gb = ganado(rival);
    var fruta = function (pid) { return pid === me ? getMyAvatar() : ((players[pid] && players[pid].avatar) || "🍏"); };
    var lado = function (pid, g, otro) {
      var gana = g > otro, pierde = g < otro;
      return '<div class="pz-jug' + (gana ? " gana" : pierde ? " pierde" : "") + '"><span class="pz-fruta">' + (gana ? '<span class="pz-corona">' + iconSvg("crown") + "</span>" : "") +
        mascotSvg(gana ? "happy" : pierde ? "sad" : "neutral", fruta(pid), pid === me ? myEquipped() : {}) + "</span><small>" + esc(pid === me ? tx("vos") : nombre(pid)) + "</small><strong>" + g + "</strong></div>";
    };
    var vs = document.createElement("div");
    vs.id = "pzDuoVs"; vs.className = "pz-vs";
    vs.innerHTML = lado(me, ga, gb) + '<span class="pz-x">VS</span>' + lado(rival, gb, ga);
    var hero = pantalla.querySelector(".hero-band");
    hero.insertBefore(vs, hero.firstChild);
    document.getElementById("resultsTitle").textContent = ga > gb ? tx("d_gane") : gb > ga ? tx("d_gano", { n: nombre(rival) }) : tx("d_empate");
    var resumen2 = document.getElementById("resultsSummary");
    var suyo = (tabla.filter(function (f) { return f.pid === rival; })[0] || { score: 0 }).score;
    var dif = !mia ? "" : mia.score === suyo ? tx("empatado", { n: esc(nombre(rival)) }) : mia.score > suyo ? tx("le_sacas", { d: mia.score - suyo, n: esc(nombre(rival)) }) : tx("a_de", { d: suyo - mia.score, n: esc(nombre(rival)) });
    if (resumen2) resumen2.innerHTML = esc(tx("d_ronda", { k: round })) + " · " + esc(tx("letra")) + " " + esc(data.letter) + (dif ? '<span class="pz-dif">' + dif + "</span>" : "");
    // Lado a lado. Las filas entran al mismo ritmo que el sonido de la revisión (app-ritmo.js: 350 ms + 430 por fila).
    var lista = document.createElement("div");
    lista.id = "pzDuoLista"; lista.className = "pz-duo-lista";
    lista.innerHTML = categories.map(function (cat, i) {
      var a = (((answers[me] || {})[cat]) || "").trim(), b = (((answers[rival] || {})[cat]) || "").trim();
      var pa = ((scores[me] || {})[cat]) || 0, pb = ((scores[rival] || {})[cat]) || 0;
      var fila = filasR[i], nota = fila && fila.querySelector('div[style*="flex-basis"]');
      var celda = function (v, p, gana, der) {
        return '<span class="pz-c' + (der ? " der" : "") + (p > 0 ? "" : " cero") + (gana ? " gana" : "") + '">' + (v ? esc(typeof answerText === "function" ? answerText(v) : v) : "—") + "<b>" + p + "</b></span>";
      };
      return '<div class="pz-dfila" style="animation-delay:' + (350 + i * 430) + 'ms"><span class="pz-dcat">' + esc(catLabel(cat)) + (cat === data.wildcard ? " <i>×2</i>" : "") + "</span>" +
        '<div class="pz-par">' + celda(a, pa, pa > pb) + celda(b, pb, pb > pa, true) + "</div>" + (nota ? '<p class="pz-dnota">' + nota.textContent + "</p>" : "") + "</div>";
    }).join("");
    var answerList = document.getElementById("answerList");
    answerList.parentNode.insertBefore(lista, answerList.nextSibling);
  }
})();
