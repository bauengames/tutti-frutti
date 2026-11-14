/* tutti.frutti · web · se desconecta de Firebase cuando no la estás usando (igual que app-conexion.js de la app).
   El plan gratis de Firebase acepta 100 conexiones a la vez (app + web juntas) y la web quedaba
   conectada todo el tiempo que la pestaña estaba abierta. Ahora:
   - Después de 3 minutos sin tocar nada en una pantalla tranquila (modos, tienda, mapa, perfil...), se desconecta.
   - Si la pestaña queda escondida (cambiás de pestaña o de app), se desconecta a los 20 segundos.
   - Al tocar la pantalla o volver a la pestaña se conecta de nuevo enseguida (lo que se guardó mientras tanto se manda solo).
   Nunca se desconecta en una sala online, buscando rival, esperando amigos ni a mitad de una partida. */
(function () {
  var QUIETA_MS = 3 * 60 * 1000, FONDO_MS = 20 * 1000;
  var TRANQUILAS = ["screen-lobby", "screen-adventure", "screen-adventure-result", "screen-profile", "screen-friend", "screen-shop",
    "screen-duels", "screen-duel-result", "screen-copa", "screen-copa-resultado",
    "screen-frutigrama", "screen-league", "screen-temporada"];
  var desconectada = false, reloj = null;

  function pantalla() { var a = document.querySelector(".screen.active"); return a ? a.id : ""; }
  function sePuede() {
    if (!window.FB || !window.FB.desconectar) return false;
    if (TRANQUILAS.indexOf(pantalla()) < 0) return false;
    // En el inicio también se arma o se espera una sala: si hay sala abierta, no se corta.
    if (window.state && state.roomCode && state.room) return false;
    return true;
  }
  function desconectar() {
    reloj = null;
    if (desconectada || !sePuede()) return;
    try { window.FB.desconectar(); desconectada = true; } catch (e) { console.error(e); }
  }
  function conectar() {
    if (!desconectada) return;
    try { window.FB.conectar(); desconectada = false; } catch (e) { console.error(e); }
  }
  function esperar(ms) {
    clearTimeout(reloj);
    reloj = setTimeout(desconectar, ms);
  }
  function actividad() {
    conectar();
    if (!document.hidden) esperar(QUIETA_MS);
  }
  ["pointerdown", "keydown", "touchstart", "wheel"].forEach(function (ev) { document.addEventListener(ev, actividad, { passive: true, capture: true }); });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) esperar(FONDO_MS);
    else actividad();
  });
  // Si algo del juego cambia de pantalla solo (por ejemplo, llega una invitación), también cuenta como actividad.
  var showAntes = window.showScreen;
  if (typeof showAntes === "function") window.showScreen = function () {
    var r = showAntes.apply(this, arguments);
    actividad();
    return r;
  };
  esperar(QUIETA_MS);
  APP.conexion = { desconectada: function () { return desconectada; } };
})();
