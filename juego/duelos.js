/* tutti.frutti · web (igual que en la app) · duelos con modos de la Aventura.
   Al crear un duelo se elige el modo (o "Sorpresa"); queda guardado en el duelo (modo y extra), así quien lo
   recibe juega con la misma regla:
   - Letra prohibida: sale una letra que no puede aparecer en ninguna palabra (extra = esa letra).
   - Palabras largas: solo valen palabras de ADV_LONG_MIN letras o más.
   - Termina en…: todas las palabras terminan con una letra (extra = esa letra).
   - Lluvia de ideas: una sola categoría, varias palabras distintas (las categorías son "Animal#1"…).
   La palabra que rompe la regla se marca mientras escribís y no suma al corregir (jugar.html usa APP.reglaDuelo).
   Se carga después del juego y de aventura.js (los textos de las reglas son los de la Aventura). */
(function () {
  var TEXTOS = {
    es: {
      elegir: "¿Qué modo jugamos?", elegir_sub: "Tu rival juega la misma ronda, con la misma regla.", modo: "Modo: {m}",
      clasico: "Clásico", clasico_d: "Una palabra por categoría, como siempre.",
      prohibida: "Letra prohibida", prohibida_d: "Sale una letra que no puede aparecer en ninguna palabra.",
      largas: "Palabras largas", largas_d: "Solo valen palabras de {m} letras o más.",
      termina: "Termina en…", termina_d: "Todas las palabras tienen que terminar con una letra que sale al empezar.",
      lluvia: "Lluvia de ideas", lluvia_d: "Una sola categoría y {n} palabras distintas para escribir.",
      sorpresa: "Sorpresa", sorpresa_d: "Te toca uno de estos modos al azar.",
    },
    en: {
      elegir: "Which mode do we play?", elegir_sub: "Your rival plays the same round, with the same rule.", modo: "Mode: {m}",
      clasico: "Classic", clasico_d: "One word per category, as always.",
      prohibida: "Banned letter", prohibida_d: "You get a letter that can't appear in any word.",
      largas: "Long words", largas_d: "Only words with {m} letters or more count.",
      termina: "Ends with…", termina_d: "Every word has to end with a letter you get at the start.",
      lluvia: "Brainstorm", lluvia_d: "A single category and {n} different words to write.",
      sorpresa: "Surprise", sorpresa_d: "You get one of these modes at random.",
    },
    pt: {
      elegir: "Qual modo vamos jogar?", elegir_sub: "Seu rival joga a mesma rodada, com a mesma regra.", modo: "Modo: {m}",
      clasico: "Clássico", clasico_d: "Uma palavra por categoria, como sempre.",
      prohibida: "Letra proibida", prohibida_d: "Sai uma letra que não pode aparecer em nenhuma palavra.",
      largas: "Palavras longas", largas_d: "Só valem palavras com {m} letras ou mais.",
      termina: "Termina em…", termina_d: "Todas as palavras têm que terminar com uma letra que sai no começo.",
      lluvia: "Chuva de ideias", lluvia_d: "Uma só categoria e {n} palavras diferentes para escrever.",
      sorpresa: "Surpresa", sorpresa_d: "Você pega um destes modos ao acaso.",
    },
  };
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave;
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return str;
  }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }
  var MODOS = ["prohibida", "largas", "termina", "lluvia"];
  var ICONOS = { clasico: "trophy", prohibida: "prohibida", largas: "scales", termina: "ballot", lluvia: "rainbow", sorpresa: "dice" };
  var LLUVIA_N = 6;
  function azar(a) { return a[Math.floor(Math.random() * a.length)]; }
  function vars() { return { m: ADV_LONG_MIN, n: LLUVIA_N }; }
  function esModo(m) { return MODOS.indexOf(m) >= 0; }

  // ¿La palabra rompe la regla del duelo? Devuelve el motivo o "".
  APP.reglaDuelo = function (duel, val) {
    if (!duel || !esModo(duel.modo) || !val || isJoker(val)) return "";
    var letras = normalizeAnswer(val).replace(/[^a-zñ]/g, "");
    if (!letras) return "";
    if (duel.modo === "prohibida" && duel.extra && hasBannedLetter(val, duel.extra)) return "prohibida";
    if (duel.modo === "largas" && letras.length < ADV_LONG_MIN) return "largas";
    if (duel.modo === "termina" && duel.extra && letras.slice(-1) !== normalizeAnswer(duel.extra)) return "termina";
    return "";
  };

  // El modo en una línea (pantalla del desafío y resultado).
  APP.duelModoHtml = function (duel) {
    if (!duel || !esModo(duel.modo)) return "";
    return '<span class="duel-modo-chip">' + inlineIcon(ICONOS[duel.modo]) + esc(tx("modo", { m: tx(duel.modo) })) + "</span>" +
      '<small class="duel-modo-desc">' + esc(tx(duel.modo + "_d", vars())) + "</small>";
  };

  // Arma el duelo según el modo (se llama antes de jugarlo, cuando lo crea quien desafía).
  function aplicar(duel, modo) {
    if (modo === "sorpresa") modo = azar(MODOS);
    if (!esModo(modo)) return;
    duel.modo = modo;
    duel.extra = "";
    if (modo === "prohibida") duel.extra = azar(BANNED_LETTER_CANDIDATES.filter(function (x) { return x !== duel.letter; }));
    if (modo === "termina") duel.extra = azar(ADV_END_LETTERS[state.lang] || ADV_END_LETTERS.es);
    if (modo === "lluvia") {
      var base = azar(ADV_CATS.lluvia);
      duel.categories = [];
      for (var k = 1; k <= LLUVIA_N; k++) duel.categories.push(base + "#" + k);
      duel.wildcard = "";
      duel.letter = azar(ADV_LETTERS.easy);
    }
  }

  // ---------- Elegir el modo al crear un duelo ----------
  var modoElegido = null;
  var crearAntes = window.openDuelCreate;
  if (typeof crearAntes === "function" && APP.abrirHoja) window.openDuelCreate = function () {
    var self = this, args = arguments;
    var opciones = ["clasico"].concat(MODOS, ["sorpresa"]);
    var h = APP.abrirHoja("<h2>" + esc(tx("elegir")) + '</h2><p class="hint">' + esc(tx("elegir_sub")) + '</p><div class="dm-opciones">' +
      opciones.map(function (m) {
        return '<button type="button" class="dm-opcion" data-modo="' + m + '"><span class="dm-icono">' + iconSvg(ICONOS[m]) + "</span>" +
          '<span class="dm-texto"><strong>' + esc(tx(m)) + "</strong><small>" + esc(tx(m + "_d", vars())) + "</small></span></button>";
      }).join("") + "</div>", "dm-hoja");
    h.tarjeta.addEventListener("click", function (e) {
      var b = e.target.closest("[data-modo]");
      if (!b) return;
      modoElegido = b.dataset.modo;
      h.cerrar();
      if (APP.evento) APP.evento("duelo_modo", { modo: modoElegido });
      crearAntes.apply(self, args);
    });
  };
  var rondaAntes = window.startDuelRound;
  if (typeof rondaAntes === "function") window.startDuelRound = function (duel, role) {
    if (role === "creator" && modoElegido) { aplicar(duel, modoElegido); modoElegido = null; }
    return rondaAntes.apply(this, arguments);
  };

  // ---------- Durante la partida ----------
  // La regla abajo de la letra (como las vueltas de tuerca online).
  var notaAntes = window.renderTwistNote;
  if (typeof notaAntes === "function") window.renderTwistNote = function () {
    var r = notaAntes.apply(this, arguments);
    var d = state.duelMode && state.duel;
    var nota = document.getElementById("twistNote");
    if (!d || !esModo(d.modo) || !nota) return r;
    var texto = d.modo === "prohibida" ? t("banned_letter_note", { x: d.extra })
      : d.modo === "largas" ? t("adv_note_largas", { m: ADV_LONG_MIN })
      : d.modo === "termina" ? t("adv_note_termina", { e: d.extra })
      : t("adv_note_lluvia", { w: d.categories.length, c: catLabel(d.categories[0]) });
    nota.insertAdjacentHTML("beforeend", '<span class="twist-part">' + inlineIcon(ICONOS[d.modo]) + escapeHtml(texto) + "</span>");
    nota.style.display = "flex";
    return r;
  };
  // La casilla se marca si la palabra rompe la regla.
  var escribirAntes = window.onAnswerInput;
  if (typeof escribirAntes === "function") window.onAnswerInput = function (el) {
    var r = escribirAntes.apply(this, arguments);
    var d = state.duelMode && state.duel;
    if (d && esModo(d.modo) && el) el.classList.toggle("rule-bad", !!APP.reglaDuelo(d, el.value.trim()));
    return r;
  };

  // ---------- Resultado: el modo debajo del título ----------
  var resultadoAntes = window.showDuelResult;
  if (typeof resultadoAntes === "function") window.showDuelResult = function (id, data) {
    var r = resultadoAntes.apply(this, arguments);
    var lead = document.getElementById("duelResultLead");
    var caja = document.getElementById("duelResultModo");
    if (lead && !caja) { caja = document.createElement("p"); caja.id = "duelResultModo"; caja.className = "duel-modo"; lead.insertAdjacentElement("afterend", caja); }
    if (caja) caja.innerHTML = APP.duelModoHtml(data);
    return r;
  };
})();
