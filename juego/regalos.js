/* tutti.frutti · web (igual que en la app) · calendario de regalos de la semana.
   Cada día que abrís la app hay un regalito; si entrás días seguidos, avanzás en el calendario
   (7 días, el último es el más grande). Si te salteás un día, vuelve a empezar.
   Se guarda en progress.regalos (se sincroniza con la cuenta) y cada día se cobra una sola vez
   (progress.counted "regalo:<día>", aunque tengas dos teléfonos).
   Se abre solo, una vez por día, al estar en la pantalla de modos; si lo cerrás sin abrir, queda un botón arriba de todo. */
(function () {
  var TEXTOS = {
    es: {
      titulo: "Regalo del día", sub: "Entrá todos los días: el regalo del día 7 es el más grande.", dia: "Día {n}",
      abrir: "Abrir regalo", gracias: "¡Gracias!", vuelve: "Si te salteás un día, el calendario vuelve a empezar.",
      semillas: "{n} semillas", pista: "Una pista", congelador: "Un congelador de racha", comodin: "Un comodín", xp: "+{n} XP",
      ganaste: "¡Ganaste {premio}!", manana: "Volvé mañana para el día {n}",
      duplicar: "Duplicar con un video", duplicado: "¡Duplicado! Otra vez {premio}", banner_sub: "Día {n} de 7 · tocá para abrirlo",
    },
    en: {
      titulo: "Daily gift", sub: "Come back every day: day 7 has the biggest gift.", dia: "Day {n}",
      abrir: "Open gift", gracias: "Thanks!", vuelve: "If you skip a day, the calendar starts over.",
      semillas: "{n} seeds", pista: "A hint", congelador: "A streak freeze", comodin: "A joker", xp: "+{n} XP",
      ganaste: "You got {premio}!", manana: "Come back tomorrow for day {n}",
      duplicar: "Double it with a video", duplicado: "Doubled! {premio} again", banner_sub: "Day {n} of 7 · tap to open it",
    },
    pt: {
      titulo: "Presente do dia", sub: "Entre todos os dias: o presente do dia 7 é o maior.", dia: "Dia {n}",
      abrir: "Abrir presente", gracias: "Valeu!", vuelve: "Se você pular um dia, o calendário recomeça.",
      semillas: "{n} sementes", pista: "Uma dica", congelador: "Um congelador de sequência", comodin: "Um coringa", xp: "+{n} XP",
      ganaste: "Você ganhou {premio}!", manana: "Volte amanhã para o dia {n}",
      duplicar: "Dobrar com um vídeo", duplicado: "Dobrado! {premio} de novo", banner_sub: "Dia {n} de 7 · toque para abrir",
    },
  };
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave;
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return str;
  }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }

  var PREMIOS = [
    { semillas: 5 }, { item: "hint" }, { semillas: 10 }, { item: "freeze" }, { item: "joker" }, { semillas: 15 }, { semillas: 30, xp: 50 },
  ];
  function textoPremio(p) {
    if (p.item === "hint") return tx("pista");
    if (p.item === "freeze") return tx("congelador");
    if (p.item === "joker") return tx("comodin");
    return tx("semillas", { n: p.semillas }) + (p.xp ? " · " + tx("xp", { n: p.xp }) : "");
  }
  function iconoPremio(p) {
    if (p.item === "hint") return iconSvg("sun");
    if (p.item === "freeze") return '<span class="rg-emoji">' + iconSvg("hielo") + '</span>';
    if (p.item === "joker") return '<span class="rg-emoji">' + iconSvg("comodin") + "</span>";
    return seedIcon();
  }

  // Estado de hoy: en qué día del calendario estás y si ya lo abriste.
  APP.regaloHoy = function () {
    var p = getProgress(), r = p.regalos || {};
    if (r.ultimo === dayKey()) return { dia: r.dia || 1, abierto: true };
    // Si el de hoy ya figura cobrado pero el calendario quedó atrasado (pasaba al juntar el progreso con la
    // cuenta), se arregla acá: cuenta como abierto y no vuelve a saltar el cartel.
    if ((p.counted || []).indexOf("regalo:" + dayKey()) >= 0) {
      var diaArreglado = r.ultimo === dayKey(-1) ? ((r.dia || 0) % 7) + 1 : (r.dia || 1);
      setTimeout(function () { var q = getProgress(); q.regalos = { ultimo: dayKey(), dia: diaArreglado }; saveProgress(q); }, 0);
      return { dia: diaArreglado, abierto: true };
    }
    var dia = r.ultimo === dayKey(-1) ? ((r.dia || 0) % 7) + 1 : 1;
    return { dia: dia, abierto: false };
  };

  function cobrar(dia) {
    var hoy = dayKey(), clave = "regalo:" + hoy;
    if ((getProgress().counted || []).indexOf(clave) >= 0) return null;
    bumpProgress(function (p) { p.regalos = { ultimo: hoy, dia: dia }; }, clave);
    var premio = darPremio(PREMIOS[dia - 1]);
    if (APP.evento) APP.evento("regalo_diario", { dia: dia });
    return premio;
  }
  // Entrega un premio del calendario (lo usa abrir el regalo y duplicarlo con un video).
  function darPremio(premio) {
    var w = getWallet();
    if (premio.item === "freeze" && (w.items.freeze || 0) >= 2) premio = { semillas: 30 };
    if (premio.item) { w.items[premio.item] = (w.items[premio.item] || 0) + 1; saveWallet(w); }
    if (premio.semillas) addSeeds(premio.semillas);
    if (premio.xp) {
      bumpProgress(function (p) { p.xp = (p.xp || 0) + premio.xp; });
      if (window.appXpGanada) appXpGanada(premio.xp);
    }
    return premio;
  }
  // Duplicar el regalo de hoy mirando un video (una sola vez por día, aunque haya dos teléfonos).
  function duplicar(hoja, premio, boton) {
    var clave = "regalo2:" + dayKey();
    if ((getProgress().counted || []).indexOf(clave) >= 0) { boton.remove(); return; }
    boton.disabled = true;
    APP.verVideo().then(function (ok) {
      if (!ok) { boton.disabled = false; return; }
      if ((getProgress().counted || []).indexOf(clave) >= 0) { boton.remove(); return; }
      bumpProgress(function () {}, clave);
      var otro = darPremio(premio);
      if (APP.evento) APP.evento("video_premio", { tipo: "regalo_doble" });
      launchConfetti(); vibrar("bien");
      boton.remove();
      hoja.tarjeta.querySelector(".rg-resultado").innerHTML = "<strong>" + esc(tx("duplicado", { premio: textoPremio(otro) })) + "</strong>";
      if (window.appRenderInicio) appRenderInicio();
    });
  }

  var abierto = null;
  window.appAbrirRegalo = function () {
    if (abierto) return;
    var e = APP.regaloHoy();
    var cajas = PREMIOS.map(function (p, i) {
      var n = i + 1;
      var clase = n < e.dia || (n === e.dia && e.abierto) ? " hecho" : n === e.dia ? " hoy" : "";
      return '<div class="rg-caja' + clase + '"><small>' + esc(tx("dia", { n: n })) + "</small>" +
        '<span class="rg-icono">' + (clase === " hoy" ? '<span class="rg-emoji">' + iconSvg("regalo") + '</span>' : clase === " hecho" ? "✓" : iconoPremio(p)) + "</span></div>";
    }).join("");
    abierto = APP.abrirHoja(
      '<h2>' + esc(tx("titulo")) + '</h2><p>' + esc(tx("sub")) + "</p>" +
      '<div class="rg-grilla">' + cajas + "</div>" +
      '<div class="rg-resultado"></div>' +
      (e.abierto ? '<p class="hint">' + esc(tx("manana", { n: (e.dia % 7) + 1 })) + "</p>"
        : '<button type="button" class="btn btn-primary btn-block" data-abrir>' + esc(tx("abrir")) + "</button>") +
      '<p class="hint rg-vuelve">' + esc(tx("vuelve")) + "</p>", "rg-hoja");
    var hoja = abierto;
    var obs = new MutationObserver(function () { if (!document.body.contains(hoja.tarjeta)) { obs.disconnect(); abierto = null; if (window.appRenderInicio) appRenderInicio(); } });
    obs.observe(document.body, { childList: true });
    var boton = hoja.tarjeta.querySelector("[data-abrir]");
    if (boton) boton.addEventListener("click", function () {
      var premio = cobrar(e.dia);
      var caja = hoja.tarjeta.querySelector(".rg-caja.hoy");
      if (caja) { caja.classList.add("abriendo"); }
      vibrar("bien");
      setTimeout(function () {
        if (caja) { caja.classList.remove("hoy", "abriendo"); caja.classList.add("hecho"); caja.querySelector(".rg-icono").innerHTML = premio ? iconoPremio(premio) : "✓"; }
        launchConfetti();
        if (premio) hoja.tarjeta.querySelector(".rg-resultado").innerHTML = "<strong>" + esc(tx("ganaste", { premio: textoPremio(premio) })) + "</strong>";
        boton.textContent = tx("gracias");
        boton.onclick = hoja.cerrar;
        if (premio && APP.hayVideo && APP.hayVideo()) {
          boton.insertAdjacentHTML("beforebegin", '<button type="button" class="btn btn-block ap-video-btn rg-duplicar">▶ ' + esc(tx("duplicar")) + "</button>");
          var dup = hoja.tarjeta.querySelector(".rg-duplicar");
          dup.addEventListener("click", function () { duplicar(hoja, premio, dup); });
        }
        if (window.appRenderInicio) appRenderInicio();
      }, 550);
    }, { once: true });
  };

  // Botón arriba de todo en la pantalla de modos (solo si todavía no lo abriste hoy).
  function banner() {
    var b = APP.banner("regaloBanner", "regalo-banner", function () { appAbrirRegalo(); });
    if (!b) return;
    if (b.parentNode.firstChild !== b) b.parentNode.insertBefore(b, b.parentNode.firstChild);
    var e = APP.regaloHoy();
    b.style.display = e.abierto ? "none" : "";
    b.pintar(iconSvg("regalo"), tx("titulo"), esc(tx("banner_sub", { n: e.dia })));
  }
  APP.alPintarInicio(banner);
  banner();

  // Se ofrece solo, una vez por día, cuando estás en el inicio y no hay otro cartel abierto.
  var ofrecido = "";
  function ofrecer() {
    if (ofrecido === dayKey() || APP.regaloHoy().abierto) return;
    if (!localStorage.getItem("tuttifruti_playerName") || APP.introEnCurso) return;
    var lobby = document.getElementById("screen-lobby");
    if (!lobby.classList.contains("active") || !document.getElementById("lobbyWrap").classList.contains("view-hub")) return;
    // Si hay otro cartel a la vista (los del juego existen siempre, escondidos), se espera a la próxima.
    var otroCartel = !!document.querySelector(".web-hoja") || Array.prototype.some.call(document.querySelectorAll("#howTo, #infoModal, #confirmBuy"), function (el) { return getComputedStyle(el).display !== "none"; });
    if (otroCartel) return;
    ofrecido = dayKey();
    appAbrirRegalo();
  }
  // Al abrir: cuando termina la animación de entrada (o enseguida, si no hay animación).
  window.addEventListener("app-intro-fin", function () { setTimeout(ofrecer, 600); });
  setTimeout(ofrecer, 2600);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") setTimeout(ofrecer, 800); });
  var lobbyOriginal = window.goToLobby;
  window.goToLobby = function () { var r = lobbyOriginal.apply(this, arguments); setTimeout(ofrecer, 1200); return r; };
})();
