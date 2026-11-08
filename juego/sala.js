/* tutti.frutti · web · salas online: quién sigue en la sala (8/11, igual que app-sala.js de la app).
   1. Volver a la sala: cuando el teléfono pierde la conexión (por ejemplo, al cerrar el celular un rato), Firebase marca
      al jugador como desconectado. Antes nunca se volvía a marcar como conectado: el resto de la partida no contaba en
      "Listo, ya revisé", su pedido de revancha no se veía y aparecía con el punto rojo. Ahora, al volver la conexión,
      se marca otra vez y se vuelve a preparar la marca de desconexión.
   2. Irse de la sala ("Salir", "Volver al inicio"): antes solo se dejaba de escuchar la sala y para los demás seguías
      conectado; la revisión esperaba tu "Listo" para siempre. Ahora se marca que te fuiste.
   3. Si quien creó la sala se va (o pierde la conexión más de 20 segundos), los demás quedaban trabados: sin esa
      persona la partida no avanza. Ahora ven un aviso y pueden volver al inicio. Si vuelve, el aviso se cierra solo.
   4. Rival de "Al azar" que nunca entró: quien arma la sala lo anota desde la cola sin "connected" y el rival lo pone
      al entrar. Si al llegar a la revisión sigue sin ponerlo y no mandó respuestas, se lo marca desconectado: antes
      quedaba como conectado para siempre y la revisión esperaba su "Listo".
   5. Partidas sin límite de rondas: no había forma de terminarlas (nunca llegaba el final, ni la revancha, ni la XP de
      la partida). Quien creó la sala tiene "Terminar la partida" en el resultado de cada ronda.
   Se carga después de juego/revision.js. */
(function () {
  var TEXTOS = {
    es: { se_fue: "{n} salió de la sala", se_fue_p: "Sin quien creó la sala, la partida no puede seguir.", volver: "Volver al inicio", terminar: "Terminar la partida" },
    en: { se_fue: "{n} left the room", se_fue_p: "The game can't go on without the person who created the room.", volver: "Back to home", terminar: "End the game" },
    pt: { se_fue: "{n} saiu da sala", se_fue_p: "Sem quem criou a sala, a partida não pode continuar.", volver: "Voltar ao início", terminar: "Encerrar a partida" },
    de: { se_fue: "{n} hat den Raum verlassen", se_fue_p: "Ohne die Person, die den Raum erstellt hat, kann die Partie nicht weitergehen.", volver: "Zum Start", terminar: "Partie beenden" },
    fr: { se_fue: "{n} a quitté le salon", se_fue_p: "Sans la personne qui a créé le salon, la partie ne peut pas continuer.", volver: "Retour à l'accueil", terminar: "Terminer la partie" },
    it: { se_fue: "{n} ha lasciato la stanza", se_fue_p: "Senza chi ha creato la stanza, la partita non può continuare.", volver: "Torna all'inizio", terminar: "Termina la partita" },
  };
  function tx(k, v) {
    var s = (TEXTOS[state.lang] || TEXTOS.es)[k] || TEXTOS.es[k];
    if (APP.tu) s = APP.tu(s);
    return v ? s.replace(/\{(\w+)\}/g, function (m, n) { return v[n] !== undefined ? v[n] : m; }) : s;
  }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }
  function miConexion(codigo) { return window.FB.ref(window.FB.db, "rooms/" + codigo + "/players/" + state.playerId + "/connected"); }

  // ---------- 1. Volver a la sala ----------
  var dejarDeEscuchar = null;
  var prepararAntes = window.setupDisconnectHandling;
  if (typeof prepararAntes === "function") window.setupDisconnectHandling = function () {
    var r = prepararAntes.apply(this, arguments);
    try {
      if (dejarDeEscuchar) dejarDeEscuchar();
      var codigo = state.roomCode;
      dejarDeEscuchar = window.FB.onValue(window.FB.ref(window.FB.db, ".info/connected"), function (snap) {
        if (snap.val() !== true || !state.online || state.roomCode !== codigo) return;
        var ref = miConexion(codigo);
        window.FB.onDisconnect(ref).set(false);
        window.FB.set(ref, true).catch(function () { /* se reintenta en la próxima reconexión */ });
      });
    } catch (e) { console.error("sala", e); }
    return r;
  };

  // ---------- 2. Irse de la sala ----------
  function marcarQueMeFui() {
    try {
      if (dejarDeEscuchar) { dejarDeEscuchar(); dejarDeEscuchar = null; }
      if (!state.online || !state.roomCode || !state.playerId || !window.FB) return;
      var ref = miConexion(state.roomCode);
      window.FB.onDisconnect(ref).cancel();
      window.FB.set(ref, false).catch(function () { /* la sala ya no existe */ });
    } catch (e) { console.error("sala", e); }
  }
  ["leaveRoom", "goToLobby"].forEach(function (nombre) {
    var antes = window[nombre];
    if (typeof antes !== "function") return;
    window[nombre] = function () { marcarQueMeFui(); cerrarAviso(); return antes.apply(this, arguments); };
  });

  // ---------- 3. Quien creó la sala se fue ----------
  var ESPERA = 20000, esperaId = null, aviso = null;
  function anfitrionFuera(data) {
    if (!data || !data.players || !data.hostId) return false;
    var h = data.players[data.hostId];
    return !h || h.connected === false;
  }
  function cerrarAviso() {
    clearTimeout(esperaId); esperaId = null;
    if (aviso) { var a = aviso; aviso = null; a.cerrar(); }
  }
  function mostrarAviso() {
    esperaId = null;
    var data = state.room;
    if (!state.online || state.isHost || !anfitrionFuera(data) || aviso) return;
    var h = (data.players || {})[data.hostId] || {};
    aviso = APP.abrirHoja("<h2>" + esc(tx("se_fue", { n: safeName(h.name || t("the_host_fallback")) })) + "</h2><p>" + esc(tx("se_fue_p")) + "</p>" +
      '<button type="button" class="btn btn-primary btn-block" data-sala-volver>' + esc(tx("volver")) + "</button>");
    var este = aviso;
    este.tarjeta.querySelector("[data-sala-volver]").addEventListener("click", function () { leaveRoom(); });
    // Cerrarla con la cruz deja seguir mirando el resultado; el aviso no vuelve a salir hasta que cambie algo.
    var cerrarAntes = este.cerrar;
    este.cerrar = function () { if (aviso === este) aviso = null; return cerrarAntes.apply(this, arguments); };
  }
  // ---------- 4. Rival de "Al azar" que nunca entró ----------
  function marcarAusentes(data) {
    if (!state.isHost || !data || data.status !== "review" || !data.players) return;
    var respuestas = ((data.answers || {})[data.round]) || {};
    Object.keys(data.players).forEach(function (pid) {
      if (pid === state.playerId || pid === data.bot || data.players[pid].connected !== undefined || respuestas[pid]) return;
      window.FB.set(window.FB.ref(window.FB.db, "rooms/" + state.roomCode + "/players/" + pid + "/connected"), false).catch(function () { /* nada */ });
    });
  }

  var salaAntes = window.handleRoomUpdate;
  if (typeof salaAntes === "function") window.handleRoomUpdate = function (data) {
    var r = salaAntes.apply(this, arguments);
    try { marcarAusentes(data); } catch (e) { console.error("sala", e); }
    try {
      if (!state.online || state.isHost || !anfitrionFuera(data)) cerrarAviso();
      else if (!esperaId && !aviso) esperaId = setTimeout(mostrarAviso, ESPERA);
    } catch (e) { console.error("sala", e); }
    return r;
  };

  // ---------- 5. Terminar una partida sin límite de rondas ----------
  var resultadoAntes = window.renderOnlineResults;
  if (typeof resultadoAntes === "function") window.renderOnlineResults = function (data) {
    var r = resultadoAntes.apply(this, arguments);
    try {
      var pie = document.querySelector("#screen-results .actions-row");
      var viejo = document.getElementById("salaTerminar");
      if (viejo) viejo.remove();
      if (pie && state.isHost && data && data.config && !data.config.totalRounds) {
        var b = document.createElement("button");
        b.type = "button"; b.id = "salaTerminar"; b.className = "secondary sala-terminar";
        b.textContent = tx("terminar");
        b.addEventListener("click", function () { b.disabled = true; hostNextRoundOrFinal(data, true); });
        pie.appendChild(b);
      }
    } catch (e) { console.error("sala", e); }
    return r;
  };
})();
