/* tutti.frutti · web · reglas del online iguales a las de la app (app-reglas.js, 8/11).
   1. ¡Basta! online: antes se podía cantar apenas empezaba la ronda y se cortaba para todos. Ahora se canta con todas
      las categorías completas o pasados 30 segundos (o la mitad del reloj, si es más corto). Mientras tanto el botón
      se ve apagado y, si lo tocás, te dice cuánto falta.
   2. Revisión online: esperaba el "Listo" de todos sin reloj; alguien conectado que no tocaba nada la trababa. Ahora,
      a los 180 segundos (3 minutos), quien creó la sala la cierra sola (y ve la cuenta regresiva).
   Se carga al final: su ¡Basta! es el primero que se ejecuta. */
(function () {
  var TEXTOS = {
    es: { basta_espera: "Completá todas las categorías para cantar ¡Basta! (o esperá {n} s)", revision_cierra: "La revisión se cierra sola en {n} s" },
    en: { basta_espera: "Fill in every category to call Stop! (or wait {n} s)", revision_cierra: "Review closes by itself in {n} s" },
    pt: { basta_espera: "Preencha todas as categorias para gritar Basta! (ou espere {n} s)", revision_cierra: "A revisão fecha sozinha em {n} s" },
  };
  function tx(k, v) {
    var s = (TEXTOS[state.lang] || TEXTOS.es)[k] || TEXTOS.es[k];
    if (APP.tu) s = APP.tu(s);
    return v ? s.replace(/\{(\w+)\}/g, function (m, n) { return v[n] !== undefined ? v[n] : m; }) : s;
  }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }
  function aviso(texto) {
    var stack = document.getElementById("toastStack");
    if (!stack) return;
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = "<span><strong>" + esc(texto) + "</strong></span>";
    stack.appendChild(el);
    setTimeout(function () { el.classList.add("out"); }, 2600);
    setTimeout(function () { el.remove(); }, 3100);
  }
  function casillas() {
    return Array.prototype.filter.call(document.querySelectorAll("#catGrid input"), function (i) { return !i.disabled && i.offsetParent; });
  }
  function vacias() { return casillas().filter(function (i) { return !i.value.trim(); }).length; }

  // ---------- 1. ¡Basta! online ----------
  var MIN_BASTA = 30;
  function esperaBasta() {
    // Segundos que faltan para poder cantar ¡Basta! con casillas vacías (0 = ya se puede).
    var sala = state.room;
    if (!state.online || !sala || typeof sala.roundStartAt !== "number" || typeof serverNow !== "function") return 0;
    var minimo = sala.roundTimed === false || !state.duration ? MIN_BASTA : Math.min(MIN_BASTA, Math.floor(state.duration / 2));
    var pasados = (serverNow() - sala.roundStartAt - (typeof ROUND_INTRO_MS === "number" ? ROUND_INTRO_MS : 0)) / 1000;
    return Math.max(0, Math.ceil(minimo - pasados));
  }
  function bastaPermitido() { return !state.online || vacias() === 0 || esperaBasta() === 0; }
  function marcarBoton() {
    var b = document.querySelector("#bastaWrap .basta");
    if (!b) return;
    var juego = document.getElementById("screen-game");
    var apagado = !!(state.online && juego && juego.classList.contains("active") && !bastaPermitido());
    b.classList.toggle("basta-espera", apagado);
  }
  setInterval(marcarBoton, 400);
  document.addEventListener("input", function (e) { if (e.target && e.target.closest && e.target.closest("#catGrid")) marcarBoton(); }, true);

  var bastaAntes = window.onBastaTap;
  if (typeof bastaAntes === "function") window.onBastaTap = function () {
    try {
      if (state.online && !bastaPermitido()) {
        aviso(tx("basta_espera", { n: esperaBasta() }));
        var b = document.querySelector("#bastaWrap .basta");
        if (b) { b.classList.remove("basta-niega"); void b.offsetWidth; b.classList.add("basta-niega"); }
        if (typeof vibrate === "function") vibrate(40);
        return;
      }
    } catch (e) { console.error("reglas", e); }
    return bastaAntes.apply(this, arguments);
  };

  // ---------- 2. Revisión online que se cierra sola ----------
  var REVISION_MAX = 180;
  var cuentaId = null;
  function revisarReloj() {
    var sala = state.room, el = document.getElementById("reviewReadyStatus");
    var nota = document.getElementById("rgCierre");
    var activa = state.online && state.isHost && sala && sala.status === "review" && typeof sala.reviewStartAt === "number" &&
      document.getElementById("screen-review") && document.getElementById("screen-review").classList.contains("active");
    if (!activa) { if (nota) nota.remove(); clearInterval(cuentaId); cuentaId = null; return; }
    var quedan = Math.max(0, Math.ceil(REVISION_MAX - (serverNow() - sala.reviewStartAt) / 1000));
    if (!nota && el) { nota = document.createElement("p"); nota.id = "rgCierre"; nota.className = "hint rg-cierre"; el.parentNode.insertBefore(nota, el.nextSibling); }
    if (nota) nota.textContent = tx("revision_cierra", { n: quedan });
    if (quedan <= 0 && !state.reviewFinalizing && typeof hostFinalizeReview === "function") hostFinalizeReview(sala.round);
  }
  var salaAntes = window.handleRoomUpdate;
  if (typeof salaAntes === "function") window.handleRoomUpdate = function () {
    var r = salaAntes.apply(this, arguments);
    try {
      revisarReloj();
      if (!cuentaId && state.online && state.isHost && state.room && state.room.status === "review") cuentaId = setInterval(revisarReloj, 1000);
    } catch (e) { console.error("reglas", e); }
    return r;
  };
})();
