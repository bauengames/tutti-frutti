/* tutti.frutti · web (igual que en la app) · invitar amigos y "¿y ahora?" después de la primera partida.
   - Al terminar cualquier partida (pantalla final): botón "Retá a un amigo", que arranca un duelo
     (jugás una ronda y después le mandás el link).
   - Después de la primera partida guiada, una tarjeta arriba de la pantalla de modos con dos caminos: la Aventura
     o retar a un amigo. Se va cuando elegís uno o la cerrás (clave tuttifruti_app_siguiente, la pone app-rapida.js).
   Se carga después de guia.js. */
(function () {
  var TEXTOS = {
    es: {
      retar: "Retá a un amigo",
      retar_sub: "Jugás una ronda y le mandás el link",
      sig_titulo: "¡Ya sabés jugar! ¿Y ahora?",
      sig_aventura: "Aventura",
      sig_amigo: "Retá a un amigo",
      cerrar: "Cerrar",
    },
    en: {
      retar: "Challenge a friend",
      retar_sub: "Play a round and send them the link",
      sig_titulo: "You know how to play! What's next?",
      sig_aventura: "Adventure",
      sig_amigo: "Duel a friend",
      cerrar: "Close",
    },
    pt: {
      retar: "Desafie um amigo",
      retar_sub: "Jogue uma rodada e mande o link",
      sig_titulo: "Você já sabe jogar! E agora?",
      sig_aventura: "Aventura",
      sig_amigo: "Desafie um amigo",
      cerrar: "Fechar",
    },
  };
  function tx(clave) { var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave; return APP.tu ? APP.tu(str) : str; }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }

  // ---------- Pantalla final: retar a un amigo ----------
  function botonRetar() {
    var pantalla = document.getElementById("screen-final");
    if (!pantalla) return;
    var b = document.getElementById("appRetarBtn");
    if (!b) {
      var compartir = pantalla.querySelector('[onclick="shareFinalResult()"]');
      if (!compartir) return;
      b = document.createElement("button");
      b.type = "button";
      b.id = "appRetarBtn";
      b.className = "btn btn-block app-retar";
      b.addEventListener("click", function () {
        if (APP.evento) APP.evento("retar_amigo", { desde: "final" });
        openDuelCreate();
      });
      compartir.parentNode.insertBefore(b, compartir.nextSibling);
    }
    b.innerHTML = "<strong>" + iconSvgInline("espadas") + esc(tx("retar")) + "</strong><small>" + esc(tx("retar_sub")) + "</small>";
  }
  botonRetar();

  // ---------- Inicio: "¿y ahora?" después de la primera partida ----------
  var KEY = "tuttifruti_app_siguiente";
  function pendiente() { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function listo() {
    try { localStorage.setItem(KEY, "hecho"); } catch (e) { /* sin almacenamiento */ }
    var c = document.getElementById("appSiguiente");
    if (c) c.remove();
  }
  window.appSiguiente = function (que) {
    listo();
    if (APP.evento) APP.evento("siguiente", { que: que });
    if (que === "aventura") openAdventure();
    else if (que === "amigo") openDuelCreate();
  };
  function tarjeta() {
    var home = document.querySelector("#lobbyWrap .mode-grid");
    if (!home) return;
    var vieja = document.getElementById("appSiguiente");
    if (!pendiente()) { if (vieja) vieja.remove(); return; }
    var html =
      '<span class="as-fruta" aria-hidden="true">' + mascotSvg("happy", getMyAvatar(), myEquipped()) + "</span>" +
      '<span class="as-cuerpo"><strong>' + esc(tx("sig_titulo")) + "</strong>" +
        '<span class="as-botones">' +
          '<button type="button" class="as-btn as-aventura" onclick="appSiguiente(\'aventura\')">' + iconSvg("star") + " " + esc(tx("sig_aventura")) + "</button>" +
          '<button type="button" class="as-btn as-amigo" onclick="appSiguiente(\'amigo\')">' + iconSvg("espadas") + " " + esc(tx("sig_amigo")) + "</button>" +
        "</span></span>" +
      '<button type="button" class="as-cerrar" onclick="appSiguiente(\'cerrar\')" aria-label="' + esc(tx("cerrar")) + '">×</button>';
    if (vieja) { if (vieja.innerHTML !== html) vieja.innerHTML = html; return; }
    var c = document.createElement("div");
    c.id = "appSiguiente";
    c.className = "app-siguiente";
    c.innerHTML = html;
    home.insertBefore(c, home.firstChild);
  }
  APP.alPintarInicio(tarjeta);
  tarjeta();

  // Si igual arrancó la Aventura o un duelo por otro lado, la tarjeta ya no hace falta.
  ["openAdventure", "openDuelCreate"].forEach(function (n) {
    var antes = window[n];
    if (typeof antes !== "function") return;
    window[n] = function () { if (pendiente()) listo(); return antes.apply(this, arguments); };
  });

  var idiomaAntes = window.setLanguage;
  if (typeof idiomaAntes === "function") window.setLanguage = function () {
    var r = idiomaAntes.apply(this, arguments);
    botonRetar();
    var c = document.getElementById("appSiguiente");
    if (c) c.remove();
    tarjeta();
    return r;
  };
})();
