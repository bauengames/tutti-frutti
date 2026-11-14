/* tutti.frutti · web · caritas en las salas online (igual que app-emotes.js de la app: en una sala pueden estar
   jugadores de la web y de la app, y todos ven las caritas de todos).
   En la sala de espera, la revisión, los resultados de cada ronda y el final hay un botón redondo abajo: abre una
   barra con 8 caritas (tu fruta contenta, sorprendida, enojada, triste, pensando, con sueño, un pulgar y fuego).
   Lo que manda cada uno aparece arriba como un globito con su fruta y su nombre, y se va solo.
   Sin texto libre: no hay nada que moderar. Contra Frutibot, Frutibot contesta con otra carita.
   En Firebase: rooms/{código}/emotes/{uid} = { e, at } (la última que mandó cada uno; la regla deja escribir
   solo la propia y si estás en la sala). Se carga después de juego/revision.js. */
(function () {
  if (typeof window.handleRoomUpdate !== "function") return;
  var EMOTES = [
    { id: "alegre", cara: "happy" }, { id: "sorpresa", cara: "surprised" }, { id: "enojo", cara: "angry" },
    { id: "triste", cara: "sad" }, { id: "pensando", cara: "thinking" }, { id: "sueno", cara: "sleepy" },
    { id: "bien", icono: "thumb" }, { id: "fuego", icono: "flame" },
  ];
  var PANTALLAS = ["screen-waiting", "screen-review", "screen-results", "screen-final"];
  var TEXTOS = {
    es: { abrir: "Mandar una carita", cerrar: "Cerrar", vos: "Vos" },
    en: { abrir: "Send a face", cerrar: "Close", vos: "You" },
    pt: { abrir: "Mandar uma carinha", cerrar: "Fechar", vos: "Você" }, de: {abrir: "Gesicht schicken", cerrar: "Schließen", vos: "Du"}, fr: {abrir: "Envoyer une tête", cerrar: "Fermer", vos: "Toi"}, it: {abrir: "Manda una faccina", cerrar: "Chiudi", vos: "Tu"},
  };
  function tx(k) { var s = (TEXTOS[state.lang] || TEXTOS.es)[k] || TEXTOS.es[k]; return APP.tu ? APP.tu(s) : s; }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }
  // Las caras van con la fruta completa de quien la manda (ropa, fondo y marco), como en todos lados.
  function dibujo(e, uid, p) {
    var x = EMOTES.filter(function (m) { return m.id === e; })[0];
    if (!x) return "";
    return x.cara ? APP.caraJugador("em-cara", Object.assign({ uid: uid }, p), x.cara) : iconSvg(x.icono);
  }

  // ---------- Botón y barra ----------
  var boton = null, barra = null, pila = null;
  function armar() {
    if (boton) return;
    boton = document.createElement("button");
    boton.type = "button"; boton.className = "em-boton"; boton.setAttribute("aria-label", tx("abrir"));
    barra = document.createElement("div");
    barra.className = "em-barra"; barra.setAttribute("role", "menu");
    pila = document.createElement("div");
    pila.className = "em-pila"; pila.setAttribute("aria-live", "polite");
    document.body.appendChild(pila); document.body.appendChild(barra); document.body.appendChild(boton);
    boton.addEventListener("click", function () { if (barra.classList.contains("abierta")) cerrarBarra(); else abrirBarra(); });
    barra.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-em]");
      if (!b) return;
      mandar(b.getAttribute("data-em"));
      cerrarBarra();
    });
    document.addEventListener("click", function (ev) {
      if (barra.classList.contains("abierta") && !ev.target.closest(".em-barra, .em-boton")) cerrarBarra();
    }, true);
  }
  function abrirBarra() {
    var yo = state.playerId;
    barra.innerHTML = EMOTES.map(function (m) { return '<button type="button" role="menuitem" class="em-op" data-em="' + m.id + '">' + dibujo(m.id, yo, {}) + "</button>"; }).join("");
    barra.classList.add("abierta");
    boton.classList.add("activo");
    boton.setAttribute("aria-label", tx("cerrar"));
  }
  function cerrarBarra() {
    if (!barra) return;
    barra.classList.remove("abierta");
    boton.classList.remove("activo");
    boton.setAttribute("aria-label", tx("abrir"));
  }
  function enSala() {
    var p = document.querySelector(".screen.active");
    if (APP.esPractica && APP.esPractica()) return false; // la partida de práctica no lleva caritas
    return !!(state.room && state.roomCode && state.online !== false && p && PANTALLAS.indexOf(p.id) >= 0);
  }
  // Arriba de la barra de botones de abajo de cada pantalla (si no, tapaba "Retá a un amigo" o "Listo, ya revisé").
  // Si la pantalla es corta y la barra queda a mitad de pantalla (iPad), el botón va a la esquina de abajo, que está
  // libre: arriba de la barra tapaba las últimas filas de las respuestas. Con la barra pegada abajo, la barra se
  // separa un poco de lo de arriba (.em-hueco) para que al final de la lista el botón no tape la última fila.
  // (8/11) También al deslizar (soloBoton): al llegar al final de la lista la barra de abajo se despega y sube, y el botón,
  // que solo se ubicaba al cambiar la sala, quedaba encima de "Listo, ya revisé". Al deslizar no se toca el hueco:
  // cambiaría el alto de la página mientras deslizás.
  function ubicar(soloBoton) {
    var p = document.querySelector(".screen.active");
    var barras = p ? p.querySelectorAll(".lobby-footer, .review-actions, .actions-row, .btn-row") : [];
    var v = APP.vista ? APP.vista() : { f: 1, alto: window.innerHeight };
    var alto = v.alto, f = v.f || 1, boton_ = 54 * f, tope = alto, hueco = null;
    Array.prototype.forEach.call(barras, function (b) {
      var r = b.getBoundingClientRect(), cs = getComputedStyle(b), top = r.top;
      if (!r.height) return;
      // Las barras fijas abajo (sticky) pueden estar todavía más abajo de la pantalla si la página es larga
      // (la revisión online): igual terminan pegadas al borde, así que se cuenta dónde van a quedar.
      var pegada = (cs.position === "sticky" || cs.position === "fixed") && !b.classList.contains("pie-suelto");
      if (!pegada && alto - r.bottom >= boton_ + 40 * f) return; // abajo de la barra hay lugar: esquina
      if (pegada) top = Math.min(r.top, alto - r.height - (parseFloat(cs.bottom) || 0) * f);
      // Si abajo de la barra no entra el botón, va arriba de ella (antes, una barra despegada a 64 puntos del borde
      // no contaba y el botón iba a la esquina, encima de la barra).
      if (top < tope) { tope = top; hueco = pegada ? b : null; }
    });
    if (!soloBoton) {
      document.querySelectorAll(".em-hueco").forEach(function (b) { if (b !== hueco) b.classList.remove("em-hueco"); });
      if (hueco) hueco.classList.add("em-hueco");
    }
    if (tope >= alto) {
      boton.style.bottom = "calc(16px + env(safe-area-inset-bottom))";
      barra.style.bottom = "calc(80px + env(safe-area-inset-bottom))";
      return;
    }
    var abajo = Math.max(16, Math.round((alto - tope) / f + 12));
    boton.style.bottom = abajo + "px";
    barra.style.bottom = (abajo + 64) + "px";
  }
  function actualizarBoton() {
    var ver = enSala();
    if (ver) armar();
    if (!boton) return;
    if (ver) ubicar();
    boton.classList.toggle("visible", ver);
    if (ver) boton.innerHTML = mascotSvg("happy", getMyAvatar());
    else { cerrarBarra(); document.querySelectorAll(".em-hueco").forEach(function (b) { b.classList.remove("em-hueco"); }); }
    // La barra de abajo se acomoda un rato después (app-nativo.js marca si quedó suelta): se vuelve a ubicar.
    clearTimeout(ubicarId);
    if (ver) ubicarId = setTimeout(function () { if (enSala()) ubicar(); }, 500);
  }
  var ubicarId = null;
  window.addEventListener("resize", function () { if (boton && enSala()) ubicar(); });

  // ---------- Mandar y recibir ----------
  var ultimoEnvio = 0;
  function mandar(e) {
    if (!enSala() || Date.now() - ultimoEnvio < 1200 || !window.FB) return;
    ultimoEnvio = Date.now();
    var me = state.playerId, F = window.FB;
    mostrar(me, e);
    vistos[me] = Date.now() + 5000; // la mía ya se mostró: cuando vuelva de Firebase no se repite
    F.set(F.ref(F.db, "rooms/" + state.roomCode + "/emotes/" + me), { e: e, at: F.serverTimestamp() }).catch(function () {});
    if (APP.evento) APP.evento("emote", { e: e });
    // Contra Frutibot: contesta (solo en este teléfono).
    var bot = state.room && state.room.bot;
    if (bot) setTimeout(function () { if (enSala()) mostrar(bot, EMOTES[Math.floor(Math.random() * EMOTES.length)].id); }, 900 + Math.random() * 900);
  }
  var vistos = {}, primera = true;
  function revisar(data) {
    var em = (data && data.emotes) || {};
    Object.keys(em).forEach(function (uid) {
      var x = em[uid] || {}, at = Number(x.at) || 0;
      if (!at || at <= (vistos[uid] || 0)) return;
      vistos[uid] = at;
      if (!primera && uid !== state.playerId) mostrar(uid, x.e);
    });
    primera = false;
  }
  function mostrar(uid, e) {
    if (!pila || !enSala()) return;
    var players = (state.room && state.room.players) || {};
    var p = players[uid] || {};
    var nombre = uid === state.playerId ? tx("vos") : safeName(p.name || "?");
    var d = dibujo(e, uid, p);
    if (!d) return;
    var g = document.createElement("div");
    g.className = "em-globo" + (uid === state.playerId ? " mio" : "");
    g.innerHTML = '<span class="em-dib">' + d + '</span><span class="em-nombre">' + esc(nombre) + "</span>";
    pila.appendChild(g);
    while (pila.children.length > 3) pila.removeChild(pila.firstChild);
    setTimeout(function () { g.classList.add("sale"); }, 3200);
    setTimeout(function () { g.remove(); }, 3600);
  }

  var deslizando = false;
  window.addEventListener("scroll", function () {
    if (deslizando || !boton || !boton.classList.contains("visible")) return;
    deslizando = true;
    requestAnimationFrame(function () { deslizando = false; if (enSala()) ubicar(true); });
  }, { passive: true });

  var antes = window.handleRoomUpdate;
  window.handleRoomUpdate = function (data) {
    var r = antes.apply(this, arguments);
    try { revisar(data); actualizarBoton(); } catch (e) { console.error("emotes", e); }
    return r;
  };
  var pantallaAntes = window.showScreen;
  window.showScreen = function () {
    var r = pantallaAntes.apply(this, arguments);
    try { actualizarBoton(); if (!enSala()) { vistos = {}; primera = true; if (pila) pila.innerHTML = ""; } } catch (e) { /* nada */ }
    return r;
  };
})();
