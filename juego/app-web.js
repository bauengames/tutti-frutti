/* tutti.frutti · web · base común para las partes que vienen de la app de iPhone.
   Los módulos de juego/ (Frutigrama, Copa Frutibot, pase de temporada, regalo del día, récords, etc.) son
   los mismos de la app, adaptados a la web. Esperan un objeto APP con algunas ayudas: acá se arman las
   versiones de la web (ventanitas, llamadas al servidor, vibración) y la lista de cosas a refrescar en el
   inicio. Se carga después del juego (jugar.html) y antes de los demás archivos de juego/. */
(function () {
  window.APP = {
    sitio: "https://tuttipuntofrutti.com",
    esNativa: false,
    tiendaUrl: "https://tuttipuntofrutti.com/jugar",
  };

  // Estadísticas: lo mismo que el resto del juego (Google Analytics, si se aceptó).
  APP.evento = function (nombre, datos) { try { track(nombre, datos || {}); } catch (e) { /* sin estadísticas */ } };

  // En la web no hay videos con premio ni anuncios entre partidas.
  APP.hayVideo = function () { return false; };
  APP.verVideo = function () { return Promise.resolve(false); };
  APP.daltonismo = function () { return false; };
  APP.sinConexion = function () { return navigator.onLine === false; };
  APP.introEnCurso = false;

  // Partidas terminadas (para el título "Veterano", igual que en la app).
  APP.partidaTerminada = function () {
    try {
      var n = (parseInt(localStorage.getItem("tuttifruti_app_partidas_total") || "0", 10) || 0) + 1;
      localStorage.setItem("tuttifruti_app_partidas_total", String(n));
    } catch (e) { /* sin almacenamiento */ }
  };

  // Al terminar de mostrar los resultados (en la web aparecen de una): se espera un momento.
  APP.alTerminarRevision = function (fn) { setTimeout(fn, 1400); };

  // "Tus amigos hoy" y el Frutigrama se publican con la liga (leaguePublish arma hoy/{día}/{uid}).
  APP.publicarHoy = function () { if (typeof leaguePublish === "function") leaguePublish(); };

  // Llamadas a las funciones del sitio (juez, rival, diario…).
  window.apiPost = function (nombre, cuerpo, ms) {
    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var id = ctrl ? setTimeout(function () { ctrl.abort(); }, ms || 10000) : null;
    return fetch("/.netlify/functions/" + nombre, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo || {}),
      signal: ctrl ? ctrl.signal : undefined,
    }).then(function (r) { clearTimeout(id); return r; }, function (e) { clearTimeout(id); throw e; });
  };

  // Vibración corta en los celulares que la tienen.
  var PATRONES = { bien: [30], aviso: [40], error: [60, 40, 60], fuerte: [80] };
  window.vibrar = function (tipo) { try { if (typeof vibrate === "function") vibrate(PATRONES[tipo] || [30]); } catch (e) { /* nada */ } };

  // Ventanita (en la app es un cartel que sube desde abajo). Devuelve { tarjeta, cerrar }.
  var abiertas = [];
  APP.abrirHoja = function (html, clase) {
    var capa = document.createElement("div");
    capa.className = "confirm-overlay web-hoja";
    capa.setAttribute("role", "dialog");
    capa.setAttribute("aria-modal", "true");
    capa.innerHTML = '<div class="confirm-card info-card app-hoja-propia ' + (clase || "") + '">' +
      '<button type="button" class="howto-close web-hoja-cerrar" aria-label="' + escapeHtml(t("howto_close")) + '">×</button>' + html + "</div>";
    var tarjeta = capa.firstChild;
    var hoja = {
      tarjeta: tarjeta,
      cerrar: function () {
        if (!capa.parentNode) return;
        capa.remove();
        abiertas = abiertas.filter(function (h) { return h !== hoja; });
      },
    };
    capa.addEventListener("click", function (e) { if (e.target === capa) hoja.cerrar(); });
    tarjeta.querySelector(".web-hoja-cerrar").addEventListener("click", hoja.cerrar);
    document.body.appendChild(capa);
    abiertas.push(hoja);
    return hoja;
  };
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && abiertas.length) abiertas[abiertas.length - 1].cerrar();
  });

  // Volver al inicio (la pantalla de modos).
  window.appIrAInicio = function () {
    if (typeof backToModes === "function") backToModes();
    else if (typeof goToLobby === "function") goToLobby();
  };
  window.appAbrirLiga = function () { if (typeof openLeague === "function") openLeague(); };

  // Botón grande en la pantalla de modos (mismo estilo que Desafío del día, Aventura, etc.).
  // despuesDe: id del botón que va antes. Devuelve el botón; pintar(icono, título, subtítulo) lo actualiza.
  APP.banner = function (id, clase, accion, despuesDe) {
    var b = document.getElementById(id);
    if (!b) {
      var grilla = document.querySelector("#lobbyWrap .mode-grid");
      if (!grilla) return null;
      b = document.createElement("button");
      b.type = "button";
      b.id = id;
      b.className = "daily-banner hub-only " + (clase || "");
      b.innerHTML = '<span class="daily-icon" aria-hidden="true"></span><span class="daily-text"><strong></strong><span class="daily-sub"></span></span><span class="daily-arrow" aria-hidden="true">→</span>';
      b.addEventListener("click", accion);
      var antes = despuesDe && document.getElementById(despuesDe);
      if (antes && antes.parentNode === grilla) grilla.insertBefore(b, antes.nextSibling); else grilla.appendChild(b);
    }
    b.pintar = function (icono, titulo, sub) {
      var i = b.querySelector(".daily-icon"), s = b.querySelector("strong"), d = b.querySelector(".daily-sub");
      if (i.innerHTML !== icono) i.innerHTML = icono;
      if (s.textContent !== titulo) s.textContent = titulo;
      if (d.innerHTML !== sub) d.innerHTML = sub;
    };
    return b;
  };

  // Lo que se dibuja en el inicio (Frutigrama, regalo, pase, copa…): cada módulo suma su parte.
  var pintores = [];
  APP.alPintarInicio = function (fn) { pintores.push(fn); };
  window.appRenderInicio = function () {
    pintores.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
  };
  // Se repinta al volver a la pantalla de modos y al cambiar de idioma.
  ["openLobbyHub", "backToModes", "goToLobby", "setLanguage"].forEach(function (n) {
    var antes = window[n];
    if (typeof antes !== "function") return;
    window[n] = function () { var r = antes.apply(this, arguments); setTimeout(appRenderInicio, 0); return r; };
  });
  // La XP que se gana jugando (addXp la avisa): el pase de temporada la suma.
  window.appXpGanada = function () {};
})();
