/* tutti.frutti · web (igual que en la app) · "Revisá las respuestas" (online) más simple.
   Antes cada palabra de cada jugador tenía 3 botones de reacción y "Objetar": con 4 jugadores y 8 categorías
   eran más de 100 botones y casi 5 pantallas de lista, con un párrafo largo de instrucciones arriba.
   Ahora (sobre renderReviewAnswers de index.html, con sus mismas funciones toggleReaction / toggleObjection /
   acceptObjection):
   - Cada categoría es una tarjeta con un renglón por jugador: nombre y palabra, nada más.
   - Tocás la palabra de otro y se abre una hoja con las reacciones y "Objetar" (o "Quitar la objeción").
   - Tocás la tuya si te la objetaron: "La acepto (vale 0)".
   - Las reacciones y objeciones se ven solo si alguien las usó (un globito con el número); las objetadas
     quedan marcadas en color.
   - Arriba, una línea corta; "Cómo funciona" despliega la explicación completa.
   Se carga después de app-puntajes.js. */
(function () {
  var TEXTOS = {
    es: {
      corto: "Tocá una palabra si creés que no vale, o para reaccionar.", como: "Cómo funciona",
      de: "{n} · {c}", objetar: "Objetar: no vale", quitar: "Quitar mi objeción", objetada_n: "{n} la objetaron", objetada_1: "1 la objetó",
      aceptar: "La acepto (vale 0)", tuya: "Te la objetaron. Si no la aceptás, decide el juez.", aceptada: "Aceptaste: vale 0",
      riesgo: "Si el juez le da la razón a {n}, perdés 5 puntos.", reaccionar: "Reaccionar", vale0: "vale 0", contra: "{n} en contra",
    },
    en: {
      corto: "Tap a word if you think it doesn't count, or to react.", como: "How it works",
      de: "{n} · {c}", objetar: "Challenge: doesn't count", quitar: "Remove my challenge", objetada_n: "{n} challenged it", objetada_1: "1 challenged it",
      aceptar: "I accept it (worth 0)", tuya: "Someone challenged it. If you don't accept, the judge decides.", aceptada: "You accepted: worth 0",
      riesgo: "If the judge sides with {n}, you lose 5 points.", reaccionar: "React", vale0: "worth 0", contra: "{n} against",
    },
    pt: {
      corto: "Toque uma palavra se achar que não vale, ou para reagir.", como: "Como funciona",
      de: "{n} · {c}", objetar: "Contestar: não vale", quitar: "Tirar minha contestação", objetada_n: "{n} contestaram", objetada_1: "1 contestou",
      aceptar: "Aceito (vale 0)", tuya: "Contestaram sua palavra. Se você não aceitar, o juiz decide.", aceptada: "Você aceitou: vale 0",
      riesgo: "Se o juiz der razão a {n}, você perde 5 pontos.", reaccionar: "Reagir", vale0: "vale 0", contra: "{n} contra",
    },
  };
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave;
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return str;
  }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }

  var antes = window.renderReviewAnswers;
  if (typeof antes !== "function" || typeof REACTION_ICONS === "undefined") return;
  var ultimo = null, hoja = null;
  window.renderReviewAnswers = function (data) {
    var r = antes.apply(this, arguments);
    try { ultimo = data; pintar(data); if (hoja && hoja.refrescar) hoja.refrescar(); } catch (e) { console.error("revision", e); }
    return r;
  };

  function datos(data, cat, pid) {
    var round = data.round;
    var val = ((((data.answers || {})[round] || {})[pid] || {})[cat] || "").trim();
    var obj = ((((data.objections || {})[round] || {})[cat] || {})[pid]) || {};
    var reac = ((((data.reactions || {})[round] || {})[cat] || {})[pid]) || {};
    var aceptada = !!((((data.accepted || {})[round] || {})[cat] || {})[pid]);
    var conteo = {};
    Object.keys(reac).forEach(function (e) { var n = Object.keys(reac[e] || {}).length; if (n && REACTION_ICONS[e]) conteo[e] = n; });
    return { val: val, objetores: Object.keys(obj), mia: !!obj[state.playerId], reac: reac, conteo: conteo, aceptada: aceptada };
  }

  function pintar(data) {
    var lista = document.getElementById("reviewList");
    var categories = data.categories || (data.config && data.config.categories) || [];
    var players = data.players || {}, me = state.playerId;
    // Vos primero y después los demás, siempre en el mismo orden.
    var pids = Object.keys(players).sort(function (a, b) { return a === me ? -1 : b === me ? 1 : 0; });
    // Instrucciones: una línea y el resto plegado.
    var lead = document.querySelector('#screen-review [data-i18n="review_lead"]');
    if (lead && !lead.dataset.rv) {
      lead.dataset.rv = "1";
      lead.style.display = "none";
      var corto = document.createElement("p");
      corto.className = "rv-corto";
      corto.innerHTML = esc(tx("corto")) + ' <button type="button" class="rv-como">' + esc(tx("como")) + "</button>";
      lead.parentNode.insertBefore(corto, lead);
      corto.querySelector(".rv-como").addEventListener("click", function () { lead.style.display = lead.style.display === "none" ? "" : "none"; });
    }
    var corto2 = document.querySelector("#screen-review .rv-corto");
    if (corto2) corto2.firstChild.textContent = tx("corto") + " ";
    lista.classList.add("rv-lista");
    lista.innerHTML = categories.map(function (cat) {
      var filas = pids.map(function (pid) {
        var d = datos(data, cat, pid), mio = pid === me, nombre = safeName((players[pid] && players[pid].name) || "?");
        var tocable = d.val && !isJoker(d.val) && (!mio || (d.objetores.length && !d.aceptada));
        var marcas = Object.keys(d.conteo).map(function (e) {
          return '<span class="rv-reac' + ((d.reac[e] || {})[me] ? " mia" : "") + '"><span class="reaction-icon' + (REACTION_EMOJIS.includes(e) ? "" : " sticker") + '">' + REACTION_ICONS[e]() + "</span>" + d.conteo[e] + "</span>";
        }).join("");
        if (d.aceptada) marcas += '<span class="rv-obj">' + esc(tx("vale0")) + "</span>";
        else if (d.objetores.length) marcas += '<span class="rv-obj">' + esc(tx("contra", { n: d.objetores.length })) + "</span>";
        return '<' + (tocable ? 'button type="button"' : "div") + ' class="rv-fila' + (d.val ? "" : " vacia") + (d.objetores.length ? " objetada" : "") + (mio ? " mia" : "") + '"' +
          (tocable ? ' data-cat="' + esc(cat) + '" data-pid="' + esc(pid) + '"' : "") + ">" +
          '<span class="rv-quien">' + playerDotHtml(pid, players) + '<span class="rv-nombre">' + esc(nombre) + (mio ? esc(t("you_suffix")) : "") + "</span></span>" +
          '<span class="rv-val">' + (d.val ? esc(answerText(d.val)) : esc(t("no_answer"))) + "</span>" +
          (marcas ? '<span class="rv-marcas">' + marcas + "</span>" : "") +
          "</" + (tocable ? "button" : "div") + ">";
      }).join("");
      return '<div class="rv-cat"><p class="rv-titulo">' + esc(catLabel(cat)) + (cat === data.wildcard ? '<span class="wildcard-badge">×2</span>' : "") + "</p>" + filas + "</div>";
    }).join("");
  }

  document.addEventListener("click", function (e) {
    var fila = e.target.closest && e.target.closest("#reviewList .rv-fila[data-cat]");
    if (!fila || !ultimo) return;
    abrir(fila.getAttribute("data-cat"), fila.getAttribute("data-pid"));
  });

  // Hoja de una palabra: reacciones y objetar (de otro) o aceptar la objeción (la tuya).
  function abrir(cat, pid) {
    if (!APP.abrirHoja) return;
    var me = state.playerId, players = ultimo.players || {};
    var h = APP.abrirHoja('<div class="rv-hoja"></div>', "rv-hoja-card");
    hoja = h;
    var caja = h.tarjeta.querySelector(".rv-hoja");
    function contenido() {
      if (!ultimo || ultimo.status !== "review") { h.cerrar(); return; }
      var d = datos(ultimo, cat, pid), mio = pid === me;
      var nombre = safeName((players[pid] && players[pid].name) || "?");
      var html = '<p class="rv-h-de">' + esc(tx("de", { n: nombre + (mio ? t("you_suffix") : ""), c: catLabel(cat) })) + "</p>" +
        '<h2 class="rv-h-val">' + esc(answerText(d.val)) + "</h2>";
      if (mio) {
        html += d.aceptada ? '<p class="rv-h-nota">' + esc(tx("aceptada")) + "</p>"
          : '<p class="rv-h-nota">' + esc(tx("tuya")) + '</p><button type="button" class="btn btn-secondary btn-block" data-aceptar>' + esc(tx("aceptar")) + "</button>";
      } else {
        var usables = REACTION_EMOJIS.concat(typeof ownedStickers === "function" ? ownedStickers() : []);
        html += '<p class="rv-h-label">' + esc(tx("reaccionar")) + '</p><div class="rv-h-reac">' + usables.map(function (em) {
          var n = d.conteo[em] || 0, mia = !!(d.reac[em] || {})[me];
          return '<button type="button" class="reaction-btn' + (mia ? " mine" : "") + '" data-reac="' + esc(em) + '"><span class="reaction-icon' + (REACTION_EMOJIS.includes(em) ? "" : " sticker") + '">' + REACTION_ICONS[em]() + "</span>" + (n ? '<span class="count">' + n + "</span>" : "") + "</button>";
        }).join("") + "</div>";
        if (d.objetores.length) html += '<p class="rv-h-nota">' + esc(d.objetores.length === 1 ? tx("objetada_1") : tx("objetada_n", { n: d.objetores.length })) + "</p>";
        html += '<button type="button" class="btn ' + (d.mia ? "btn-secondary" : "btn-primary rv-h-objetar") + ' btn-block" data-objetar>' + esc(d.mia ? tx("quitar") : tx("objetar")) + "</button>" +
          (d.mia ? "" : '<p class="rv-h-riesgo">' + esc(tx("riesgo", { n: nombre })) + "</p>");
      }
      caja.innerHTML = html;
    }
    h.refrescar = contenido;
    contenido();
    caja.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-reac")) toggleReaction(cat, pid, b.getAttribute("data-reac"));
      else if (b.hasAttribute("data-objetar")) { toggleObjection(cat, pid); h.cerrar(); }
      else if (b.hasAttribute("data-aceptar")) { acceptObjection(cat, pid); h.cerrar(); }
    });
    var obs = new MutationObserver(function () { if (!document.body.contains(h.tarjeta)) { obs.disconnect(); if (hoja === h) hoja = null; } });
    obs.observe(document.body, { childList: true });
  }

  // Al salir de la revisión, la hoja no queda abierta.
  var pantallaAntes = window.showScreen;
  window.showScreen = function (id) {
    if (id !== "screen-review" && hoja) { try { hoja.cerrar(); } catch (e) { /* nada */ } hoja = null; }
    return pantallaAntes.apply(this, arguments);
  };
})();
