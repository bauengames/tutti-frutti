/* tutti.frutti · web · borrar la cuenta (igual que app-cuenta.js de la app).
   En Mi fruta, debajo de la cuenta de Google: "Borrar mi cuenta".
   1. Confirmación (hay que escribir BORRAR).
   2. Se vuelve a elegir la misma cuenta de Google (Firebase lo pide para borrar).
   3. Se borran los datos de Firebase: progreso guardado, perfil y código de amigo, amistades,
      duelos creados y recibidos, rankings, liga y "amigos hoy".
   4. Se borra la cuenta, se limpia todo lo guardado en este navegador y el juego arranca de cero.
   En el ranking del desafío del día no se borra el puntaje: se reemplaza el nombre por "—". */
(function () {
  var TEXTOS = {
    es: {
      boton: "Borrar mi cuenta", titulo: "¿Borrar tu cuenta?",
      texto: "Se borran para siempre tu progreso, semillas, frutas, logros, amigos, duelos y tus puntajes en los rankings, en este navegador y en cualquier otro lugar donde uses esta cuenta. No se puede deshacer.",
      escribi: "Escribí BORRAR para confirmar", palabra: "BORRAR", seguir: "Borrar cuenta", cancelar: "Cancelar",
      confirmar: "Ahora confirmá que sos vos: elegí la misma cuenta con la que entraste.",
      borrando: "Borrando…", listo: "Listo, tu cuenta se borró.",
      otra_cuenta: "Elegiste una cuenta distinta de la que tenés abierta. Probá de nuevo con la misma.",
      error: "No se pudo borrar la cuenta. Revisá tu conexión y probá de nuevo.",
    },
    en: {
      boton: "Delete my account", titulo: "Delete your account?",
      texto: "Your progress, seeds, fruits, achievements, friends, duels and ranking scores will be deleted forever, in this browser and anywhere else you use this account. This can't be undone.",
      escribi: "Type DELETE to confirm", palabra: "DELETE", seguir: "Delete account", cancelar: "Cancel",
      confirmar: "Now confirm it's you: choose the same account you signed in with.",
      borrando: "Deleting…", listo: "Done, your account was deleted.",
      otra_cuenta: "You chose a different account from the one you're signed in with. Try again with the same one.",
      error: "Couldn't delete the account. Check your connection and try again.",
    },
    pt: {
      boton: "Apagar minha conta", titulo: "Apagar sua conta?",
      texto: "Seu progresso, sementes, frutas, conquistas, amigos, duelos e pontuações nos rankings serão apagados para sempre, neste navegador e em qualquer outro lugar onde você use esta conta. Não dá para desfazer.",
      escribi: "Escreva APAGAR para confirmar", palabra: "APAGAR", seguir: "Apagar conta", cancelar: "Cancelar",
      confirmar: "Agora confirme que é você: escolha a mesma conta com que entrou.",
      borrando: "Apagando…", listo: "Pronto, sua conta foi apagada.",
      otra_cuenta: "Você escolheu uma conta diferente da que está aberta. Tente de novo com a mesma.",
      error: "Não foi possível apagar a conta. Verifique sua conexão e tente de novo.",
    },
  };
  function tx(clave) { var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave; return APP.tu ? APP.tu(str) : str; }
  APP.txCuenta = tx;

  // Semana (como weekKey del juego) de hace n semanas.
  function semanaHace(n) {
    var shifted = new Date(Date.now() - 3 * 3600 * 1000 - n * 7 * 86400000);
    var date = new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()));
    var dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    var week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
    return date.getUTCFullYear() + "-W" + String(week).padStart(2, "0");
  }

  // Borra todo lo de este jugador en Firebase. Cada parte por separado: si una falla, sigue con las demás.
  function borrarDatos() {
    var F = window.FB, uid = F.uid;
    function quitar(ruta) { return F.remove(F.ref(F.db, ruta)).catch(function (e) { console.error("borrar", ruta, e && (e.code || e.message)); }); }
    function leer(ruta) { return F.get(F.ref(F.db, ruta)).then(function (s) { return s.val(); }).catch(function () { return null; }); }
    var tareas = [];
    // Perfil y código de amigo.
    tareas.push(leer("profiles/" + uid + "/code").then(function (code) {
      return Promise.all([code ? quitar("friendCodes/" + code) : null, quitar("profiles/" + uid)]);
    }));
    // Amistades (de los dos lados).
    tareas.push(leer("friends/" + uid).then(function (amigos) {
      return Promise.all(Object.keys(amigos || {}).map(function (fid) {
        // Las invitaciones de racha que mandaste se quitan antes: las reglas piden que sigan siendo amigos.
        return quitar("rachaPedidos/" + fid + "/" + uid).then(function () { return quitar("friends/" + fid + "/" + uid); }).then(function () { return quitar("friends/" + uid + "/" + fid); });
      }));
    }));
    // Duelos recibidos.
    tareas.push(leer("duelInbox/" + uid).then(function (inbox) {
      return Promise.all(Object.keys(inbox || {}).map(function (id) { return quitar("duelInbox/" + uid + "/" + id); }));
    }));
    // Duelos: los creados se borran enteros; en los otros, solo tu resultado.
    (getMyDuels() || []).forEach(function (d) {
      tareas.push(leer("duels/" + d.id + "/creator/uid").then(function (creador) {
        return creador === uid ? quitar("duels/" + d.id) : quitar("duels/" + d.id + "/rivals/" + uid);
      }));
    });
    // Rankings: semanal (últimas 12 semanas) y desafío del día (últimos 60 días).
    for (var w = 0; w < 12; w++) tareas.push(quitar("weekly/" + semanaHace(w) + "/" + uid));
    // En el del día no se puede borrar (sería volver a jugarlo): se le saca el nombre y queda "—". Los días con modo tienen
    // su ranking aparte (daily/{fecha}-{modo}); lo jugado antes de los modos o con una versión vieja está en daily/{fecha}.
    for (var d = 0; d < 60; d++) (function (dia) {
      new Set([dia, dailyBoardKey(dia)]).forEach(function (tabla) {
        tareas.push(leer("daily/" + tabla + "/" + uid).then(function (v) {
          if (v) return F.update(F.ref(F.db, "daily/" + tabla + "/" + uid), { name: "—", avatar: "" }).catch(function () {});
        }));
      });
    })(dayKey(-d));
    // Rachas de a dos (de los dos lados) y las invitaciones que te mandaron.
    tareas.push(leer("misRachas/" + uid).then(function (pares) {
      return Promise.all(Object.keys(pares || {}).map(function (id) {
        var otro = id.split("_").filter(function (x) { return x !== uid; })[0];
        return Promise.all([quitar("rachasAmigos/" + id), quitar("misRachas/" + uid + "/" + id), otro ? quitar("misRachas/" + otro + "/" + id) : null]);
      }));
    }));
    tareas.push(leer("rachaPedidos/" + uid).then(function (pedidos) {
      return Promise.all(Object.keys(pedidos || {}).map(function (de) { return quitar("rachaPedidos/" + uid + "/" + de); }));
    }));
    // Las palabras que pusiste en el desafío (rareza), también de los últimos 60 días.
    for (var ra = 0; ra < 60; ra++) tareas.push(quitar("rareza/" + dayKey(-ra) + "/" + uid));
    // "Amigos hoy" (últimos 10 días) y la liga (esta semana y la anterior).
    for (var h = 0; h < 10; h++) tareas.push(quitar("hoy/" + dayKey(-h) + "/" + uid));
    var ligas = [];
    var p = getProgress();
    if (p.liga && p.liga.grupo != null) ligas.push(p.liga);
    try {
      var l = JSON.parse(localStorage.getItem("tuttifruti_app_liga") || "null");
      if (l && l.grupo != null) ligas.push(l);
      if (l && l.previa) ligas.push(l.previa);
    } catch (e) { /* nada */ }
    ligas.forEach(function (x) { tareas.push(quitar("ligas/" + x.semana + "/" + x.div + "/" + x.grupo + "/" + uid)); });
    // La dirección para notificaciones de este teléfono.
    tareas.push(quitar("tokens/" + uid));
    // Lo que tus denuncias dejaron no se borra (son anónimas para el resto). El progreso guardado, al final.
    return Promise.all(tareas).then(function () { return quitar("users/" + uid); });
  }

  function limpiarTelefono() {
    var claves = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf("tuttifruti") === 0) claves.push(k);
    }
    claves.forEach(function (k) { try { localStorage.removeItem(k); } catch (e) { /* nada */ } });
  }

  window.appBorrarCuenta = function () {
    if (!isGoogleUser()) return;
    var hoja = APP.abrirHoja(
      "<h2>" + escapeHtml(tx("titulo")) + "</h2><p>" + escapeHtml(tx("texto")) + "</p>" +
      '<label class="ab-label" for="cuBorrar">' + escapeHtml(tx("escribi")) + "</label>" +
      '<input type="text" id="cuBorrar" autocomplete="off" autocapitalize="characters" spellcheck="false">' +
      '<button type="button" class="btn btn-block cu-borrar" data-borrar disabled>' + escapeHtml(tx("seguir")) + "</button>" +
      '<button type="button" class="btn btn-ghost btn-block" data-cancelar>' + escapeHtml(tx("cancelar")) + "</button>", "cu-hoja");
    var input = hoja.tarjeta.querySelector("#cuBorrar"), boton = hoja.tarjeta.querySelector("[data-borrar]");
    input.addEventListener("input", function () { boton.disabled = input.value.trim().toUpperCase() !== tx("palabra"); });
    hoja.tarjeta.querySelector("[data-cancelar]").addEventListener("click", hoja.cerrar);
    boton.addEventListener("click", function () {
      boton.disabled = true;
      // Primero el aviso de que hay que volver a entrar; recién al cerrarlo se abre la ventana para iniciar sesión.
      alert(tx("confirmar"));
      window.FB.reautenticar().then(function (r) {
        if (!r.ok) {
          boton.disabled = false;
          if (r.code === "otra-cuenta") alert(tx("otra_cuenta"));
          else if (r.code !== "cancelled") alert(tx("error"));
          return;
        }
        boton.textContent = tx("borrando");
        if (APP.evento) APP.evento("cuenta_borrada");
        return borrarDatos()
          .then(function () { return window.FB.borrarUsuario(); })
          .then(function () {
            limpiarTelefono();
            alert(tx("listo"));
            location.reload();
          });
      }).catch(function (e) {
        console.error("borrar cuenta", e && (e.code || e.message));
        boton.disabled = false; boton.textContent = tx("seguir");
        alert(tx("error"));
      });
    });
  };
  // Botón en Mi fruta, debajo de la cuenta de Google (solo si iniciaste sesión).
  var cuentasAntes = window.renderAccountBoxes;
  if (typeof cuentasAntes === "function") window.renderAccountBoxes = function () {
    var r = cuentasAntes.apply(this, arguments);
    try {
      var caja = document.querySelector("#screen-profile [data-account-box]");
      if (caja && isGoogleUser() && !caja.querySelector(".cu-boton")) {
        caja.insertAdjacentHTML("beforeend", '<button type="button" class="danger-link cu-boton" onclick="appBorrarCuenta()">' + escapeHtml(tx("boton")) + "</button>");
      }
    } catch (e) { console.error(e); }
    return r;
  };
  renderAccountBoxes();
})();
