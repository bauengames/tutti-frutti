/* tutti.frutti · web (igual que en la app) · "hay gente jugando" en el desafío del día.
   - En el botón del desafío ya jugado (pantalla de modos): "Le ganaste al 70 % de los que jugaron".
   - En el resultado del desafío: "Hiciste más puntos que el 70 % de los que jugaron hoy".
   Nunca se muestra cuántos jugaron (con pocos jugadores quedaría feo): solo el porcentaje.
   Los números salen de la función "diario" de la web (servidor/diario.js), que cuenta con la cuenta de
   servicio porque las reglas no dejan que un teléfono lea más que el top 10. Si la función todavía no está
   publicada o falla, no se muestra nada. Solo con 5 jugadores o más, y solo si el porcentaje es del 25 % para
   arriba (para alentar, no para desanimar).
   Se carga después de los módulos del Inicio. */
(function () {
  var MINIMO = 5, PCT_MINIMO = 25, CACHE_MS = 5 * 60 * 1000;
  var TEXTOS = {
    es: { tarjeta: "Le ganaste al {p} % de los que jugaron", mejor: "Hiciste más puntos que el {p} % de los que jugaron hoy" },
    en: { tarjeta: "You beat {p}% of today's players", mejor: "You scored more than {p}% of today's players" },
    pt: { tarjeta: "Você superou {p}% de quem jogou hoje", mejor: "Você fez mais pontos que {p}% de quem jogou hoje" },
  };
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave];
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return str;
  }

  function fechaHoy() { try { return getDailyChallenge().key; } catch (e) { return ""; } }

  // ---------- Pedido al servidor (con memoria de unos minutos) ----------
  var memoria = {};
  function pedir(fecha, puntos) {
    var clave = fecha + "|" + (puntos == null ? "" : puntos);
    var m = memoria[clave];
    if (m && Date.now() - m.at < CACHE_MS) return Promise.resolve(m.datos);
    if (typeof apiPost !== "function" || !fecha) return Promise.resolve(null);
    var cuerpo = { fecha: fecha };
    if (puntos != null) cuerpo.puntos = puntos;
    return apiPost("diario", cuerpo, 8000).then(function (r) { return r && r.ok ? r.json() : null; }).then(function (datos) {
      if (datos && typeof datos.jugaron === "number") memoria[clave] = { at: Date.now(), datos: datos };
      return datos;
    }).catch(function () { return null; });
  }

  // ---------- Tarjeta del Inicio ----------
  var ultimo = null; // { fecha, pct }
  function pintarTarjeta() {
    var card = document.querySelector("#dailyBanner .daily-text");
    if (!card) return;
    var linea = card.querySelector(".daily-gente-linea");
    var ok = ultimo && ultimo.fecha === fechaHoy() && ultimo.pct >= PCT_MINIMO;
    if (!ok) { if (linea) linea.remove(); return; }
    var texto = tx("tarjeta", { p: ultimo.pct });
    if (!linea) {
      linea = document.createElement("span");
      linea.className = "daily-sub daily-gente-linea";
      card.appendChild(linea);
    }
    if (linea.textContent !== texto) linea.textContent = texto;
  }
  function usable(d) { return d && d.jugaron >= MINIMO && typeof d.mejorQue === "number"; }
  // Solo si ya jugaste el desafío de hoy (antes no hay porcentaje que mostrar).
  function actualizarTarjeta() {
    var hoy = typeof getTodayDaily === "function" && getTodayDaily();
    if (!hoy || hoy.unfinished) { ultimo = null; pintarTarjeta(); return; }
    var fecha = hoy.date;
    pedir(fecha, hoy.score || 0).then(function (d) {
      ultimo = usable(d) ? { fecha: fecha, pct: d.mejorQue } : null;
      pintarTarjeta();
    });
  }
  APP.alPintarInicio(pintarTarjeta);
  window.addEventListener("load", function () { setTimeout(actualizarTarjeta, 3000); });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) setTimeout(actualizarTarjeta, 1500); });
  var lobbyAntes = window.goToLobby;
  if (typeof lobbyAntes === "function") window.goToLobby = function () { var r = lobbyAntes.apply(this, arguments); setTimeout(actualizarTarjeta, 600); return r; };

  // La pantalla de resultados es la misma para todos los modos: el renglón del desafío se saca al cambiar.
  var pantallaAntes = window.showScreen;
  window.showScreen = function () { var v = document.getElementById("dailyGente"); if (v) v.remove(); return pantallaAntes.apply(this, arguments); };

  // ---------- Resultado del desafío ----------
  var resultadoAntes = window.showDailyResult;
  if (typeof resultadoAntes === "function") window.showDailyResult = function (record, fresh) {
    var r = resultadoAntes.apply(this, arguments);
    try {
      var viejo = document.getElementById("dailyGente"); if (viejo) viejo.remove();
      if (!record || record.unfinished) return r;
      var fecha = record.date, puntos = record.score || 0;
      // Recién terminado, el puntaje se está guardando: se espera un poco para contarlo.
      setTimeout(function () {
        pedir(fecha, puntos).then(function (d) {
          if (!usable(d) || d.mejorQue < PCT_MINIMO) return;
          if (!document.getElementById("screen-results").classList.contains("active")) return;
          var texto = tx("mejor", { p: d.mejorQue });
          var p = document.getElementById("dailyGente") || document.createElement("p");
          p.id = "dailyGente"; p.className = "daily-gente";
          p.textContent = texto;
          var resumen = document.getElementById("resultsSummary");
          if (resumen && !p.parentNode) resumen.parentNode.insertBefore(p, resumen.nextSibling);
          if (fecha === fechaHoy()) ultimo = { fecha: fecha, pct: d.mejorQue };
        });
      }, fresh ? 2500 : 0);
    } catch (e) { console.error(e); }
    return r;
  };
})();
