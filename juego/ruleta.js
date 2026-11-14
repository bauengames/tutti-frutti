/* tutti.frutti · web (igual que app-ruleta.js de la app) · la ruleta de la letra, en grande.
   Antes la letra giraba chiquita en una esquina y la grilla aparecía de golpe. Ahora:
   1. Se oscurece la pantalla y en el centro aparece una ficha grande con la ruleta (las mismas frutas y letras
      que la medalla del juego, con su tic-tic: se copian de #medal mientras gira).
   2. Cae la letra: la ficha da un saltito con un destello (el "ding" lo pone el juego).
   3. La ficha vuela y se achica hasta donde va la letra arriba, y la pantalla se aclara.
   Si la ronda tiene letra prohibida (online o Aventura), abajo de la ficha aparece "Prohibida la R".
   4. Recién ahí aparece la grilla, con las casillas entrando en cascada, y se puede escribir.
   Solo en la pantalla de juego; con "Reducir movimiento" queda como antes. */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var antes = window.spinLetterReveal;
  if (typeof antes !== "function" || reduce) return;

  var capa = null, ficha = null, copia = null, obs = null;
  function armar() {
    if (capa) return;
    capa = document.createElement("div");
    capa.className = "ru-capa";
    capa.setAttribute("aria-hidden", "true");
    capa.innerHTML = '<div class="ru-centro"><p class="ru-titulo"></p><div class="ru-ficha"><div class="ru-letra"></div><span class="ru-brillo"></span></div><p class="ru-prohibida"></p></div>';
    document.body.appendChild(capa);
    ficha = capa.querySelector(".ru-ficha");
    copia = capa.querySelector(".ru-letra");
  }
  function limpiar() {
    if (obs) { obs.disconnect(); obs = null; }
    if (capa) capa.classList.remove("visible", "cae", "sale", "oculta");
    if (ficha) { ficha.getAnimations && ficha.getAnimations().forEach(function (a) { a.cancel(); }); ficha.style.transform = ""; }
  }

  window.spinLetterReveal = function (letra, alTerminar) {
    var juego = document.getElementById("screen-game");
    var medal = document.getElementById("medal");
    if (!juego || !juego.classList.contains("active") || !medal) {
      return antes.apply(this, arguments);
    }
    armar();
    limpiar();
    // La ficha queda a una altura fija: cuando sube el teclado por detrás, no se mueve.
    capa.style.setProperty("--ru-top", Math.round(Math.min(window.innerHeight * 0.28, 260)) + "px");
    capa.querySelector(".ru-titulo").textContent = t("letra_label");
    // Si la ronda tiene letra prohibida, se avisa ahí mismo, debajo de la ficha.
    var duelo = state.duelMode && state.duel && state.duel.modo === "prohibida" ? state.duel.extra : "";
    var prohibida = (state.adventureMode || state.dailyMode ? state.advBanned : duelo || (state.room && state.room.bannedLetter)) || "";
    var aviso = capa.querySelector(".ru-prohibida");
    aviso.classList.remove("si");
    if (prohibida) {
      aviso.innerHTML = "<b>" + escapeHtml(prohibida) + "</b>" + escapeHtml(t("adv_note_banned", { x: prohibida }));
      void aviso.offsetWidth; aviso.classList.add("si");
    }
    copia.innerHTML = medal.innerHTML;
    capa.classList.add("visible");
    // Lo que muestra la medalla (fruta o letra) se copia a la ficha grande en cada paso.
    obs = new MutationObserver(function () {
      copia.innerHTML = medal.innerHTML;
      copia.classList.remove("paso"); void copia.offsetWidth; copia.classList.add("paso");
    });
    obs.observe(medal, { childList: true, characterData: true, subtree: true });

    var self = this;
    return antes.call(self, letra, function () {
      if (obs) { obs.disconnect(); obs = null; }
      copia.textContent = letra;
      copia.classList.remove("paso");
      capa.classList.add("cae");
      // Después del saltito, la ficha vuela hasta la medalla de arriba y, al mismo tiempo, entran las casillas.
      // Si toca una letra difícil, antes se ofrece "Otra letra" (app-ayudas.js): se espera a que elija o pase el rato.
      var oferta = APP.ofrecerOtraLetra ? APP.ofrecerOtraLetra(capa.querySelector(".ru-centro"), copia, ficha) : null;
      if (oferta && oferta.then) oferta.then(function () { setTimeout(volar, 120); }); else setTimeout(volar, 420);
      // Se devuelve la oferta para que el teclado (app-nativo.js) espere: si subía antes, tapaba el botón.
      return oferta && oferta.then ? oferta : undefined;
      function volar() {
        var desde = ficha.getBoundingClientRect(), hasta = medal.getBoundingClientRect();
        var escala = Math.max(0.2, Math.min(1, (hasta.height || 60) / desde.height));
        // Con letra grande las medidas vienen en otra escala que el movimiento (APP.vista, app-nativo.js).
        var f = APP.vista ? APP.vista().f : 1;
        var dx = ((hasta.left + hasta.width / 2) - (desde.left + desde.width / 2)) / f;
        var dy = ((hasta.top + hasta.height / 2) - (desde.top + desde.height / 2)) / f;
        capa.classList.add("sale");
        if (ficha.animate) ficha.animate([{ transform: "none", opacity: 1 }, { transform: "translate(" + dx + "px," + dy + "px) scale(" + escala + ")", opacity: 0 }],
          { duration: 360, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards" });
        var grid = document.getElementById("catGrid");
        // La clase queda puesta hasta la próxima ronda: si se sacaba, volvía a correr la animación de siempre
        // de las casillas y parecía que las categorías se cargaban dos veces.
        if (grid) { grid.classList.remove("cascada"); void grid.offsetWidth; grid.classList.add("cascada"); }
        alTerminar();
        // Al terminar el vuelo se esconde la capa sin devolver la ficha al centro (eso se hace en la próxima ronda).
        setTimeout(function () {
          if (obs) { obs.disconnect(); obs = null; }
          capa.classList.add("oculta");
          capa.classList.remove("visible", "sale");
        }, 400);
      }
    });
  };

  // Si se sale de la partida a mitad de la ruleta, la capa no queda colgada.
  var pantallaAntes = window.showScreen;
  window.showScreen = function (id) { if (id !== "screen-game") limpiar(); return pantallaAntes.apply(this, arguments); };
})();
