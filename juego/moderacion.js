/* tutti.frutti · web · moderación (igual que app-moderacion.js de la app; en las salas y rankings se cruzan jugadores
   de la web y de la app, así que el filtro tiene que ser el mismo).
   - Filtro de malas palabras: todo texto que el juego muestra pasa por escapeHtml, así que ahí se
     tapan con ★★★ (nombres, respuestas, categorías propias). Tu nombre tampoco puede tener una.
   - Denunciar: en la liga y en la sala de espera, el botón ⋯ al lado de otro jugador. La denuncia
     queda en Firebase (reportes/{uidDenunciado}/{tuUid}); se lee desde la consola.
   - Bloquear: el nombre de ese jugador deja de verse en este navegador ("Jugador bloqueado").
     Se desbloquea desde Mi fruta ("Jugadores bloqueados", aparece si bloqueaste a alguien).
   - Tu nombre no puede ser ofensivo (al jugar y al aceptar un duelo).
   Se carga después de los demás archivos de juego/. */
(function () {
  var TEXTOS = {
    es: {
      nombre_malo: "Ese nombre no está permitido. Elegí otro.",
      denunciar_titulo: "¿Qué pasa con {n}?", denunciar_sub: "Tu denuncia es anónima. La revisamos a mano.",
      m_nombre: "Nombre ofensivo", m_respuestas: "Respuestas ofensivas", m_trampa: "Hace trampa", m_otro: "Otra cosa",
      bloquear_tambien: "Bloquear también (no vas a ver su nombre)", enviar: "Enviar denuncia",
      gracias: "Gracias por avisar. Lo vamos a revisar.", error: "No se pudo enviar. Probá de nuevo más tarde.",
      bloqueado: "Jugador bloqueado", bloquear: "Bloquear", desbloquear: "Desbloquear",
      bloqueados: "Jugadores bloqueados", bloqueados_vacio: "No bloqueaste a nadie.", mas: "Opciones", jugador: "Jugador",
    },
    en: {
      nombre_malo: "That name isn't allowed. Pick another one.",
      denunciar_titulo: "What's wrong with {n}?", denunciar_sub: "Your report is anonymous. We review it by hand.",
      m_nombre: "Offensive name", m_respuestas: "Offensive answers", m_trampa: "Cheating", m_otro: "Something else",
      bloquear_tambien: "Also block (you won't see their name)", enviar: "Send report",
      gracias: "Thanks for letting us know. We'll review it.", error: "Couldn't send it. Try again later.",
      bloqueado: "Blocked player", bloquear: "Block", desbloquear: "Unblock",
      bloqueados: "Blocked players", bloqueados_vacio: "You haven't blocked anyone.", mas: "Options", jugador: "Player",
    },
    pt: {
      nombre_malo: "Esse nome não é permitido. Escolha outro.",
      denunciar_titulo: "O que há de errado com {n}?", denunciar_sub: "Sua denúncia é anônima. Revisamos à mão.",
      m_nombre: "Nome ofensivo", m_respuestas: "Respostas ofensivas", m_trampa: "Trapaça", m_otro: "Outra coisa",
      bloquear_tambien: "Bloquear também (você não verá o nome)", enviar: "Enviar denúncia",
      gracias: "Obrigado por avisar. Vamos revisar.", error: "Não foi possível enviar. Tente mais tarde.",
      bloqueado: "Jogador bloqueado", bloquear: "Bloquear", desbloquear: "Desbloquear",
      bloqueados: "Jogadores bloqueados", bloqueados_vacio: "Você não bloqueou ninguém.", mas: "Opções", jugador: "Jogador",
    },
  };
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave;
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return APP.numeros(str);
  }
  APP.txModeracion = tx;

  // ---------- Filtro de palabras ----------
  // Palabras enteras (sin tildes, en minúscula). Lista corta y conservadora: insultos y
  // groserías comunes en español rioplatense y general, inglés y portugués.
  var MALAS = [
    "puto", "puta", "putos", "putas", "putita", "puton", "hdp", "hijodeputa", "pelotudo", "pelotuda", "boludo", "boluda",
    "forro", "forra", "conchudo", "conchuda", "chupapija", "chupapijas", "pija", "verga", "vergas", "culiado",
    "culiao", "culo", "orto", "trolo", "trola", "puto", "maricon", "marica", "mogolico", "mogolica", "retrasado", "retrasada",
    "pendejo", "pendeja", "cabron", "cabrona", "chinga", "chingada", "chingar", "pinche", "mamon", "joto", "gilipollas", "follar", "zorra", "mierda", "cagar", "cagon", "nazi", "hitler", "violador", "violar",
    "negro de mierda", "sudaca", "travelo", "putazo",
    "fuck", "fucker", "fucking", "motherfucker", "shit", "bitch", "bitches", "cunt", "cock", "pussy", "asshole",
    "bastard", "slut", "whore", "nigger", "nigga", "faggot", "fag", "retard", "rapist", "porn", "porno",
    "caralho", "buceta", "viado", "foder", "fodase", "foda-se", "merda", "cuzao", "arrombado", "vagabunda",
    "desgraçado", "desgracado", "otario",
  ];
  function sinTildes(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  // Variantes con números (put0, m1erda) y letras repetidas (puuuto).
  function normalizar(s) {
    return sinTildes(s).replace(/0/g, "o").replace(/1/g, "i").replace(/3/g, "e").replace(/4/g, "a").replace(/5/g, "s").replace(/7/g, "t").replace(/@/g, "a").replace(/\$/g, "s")
      .replace(/([a-z])\1{2,}/g, "$1");
  }
  var CONJUNTO = {};
  MALAS.forEach(function (w) { CONJUNTO[sinTildes(w)] = true; });
  var FRASES = MALAS.filter(function (w) { return w.indexOf(" ") >= 0; }).map(sinTildes);
  function esMala(palabra) { return !!CONJUNTO[normalizar(palabra)] && Object.prototype.hasOwnProperty.call(CONJUNTO, normalizar(palabra)); }

  // Devuelve el texto con las malas palabras tapadas.
  APP.censurar = function (texto) {
    if (texto == null) return texto;
    var s = String(texto);
    if (!/[a-zA-ZÀ-ÿ0-9]/.test(s)) return s;
    var norm = normalizar(s);
    FRASES.forEach(function (f) { if (norm.indexOf(f) >= 0) s = "★★★"; });
    return s.replace(/[A-Za-zÀ-ÿ0-9@$]+(?:-[A-Za-zÀ-ÿ]+)?/g, function (p) { return esMala(p) ? "★★★" : p; });
  };
  APP.textoOfensivo = function (texto) {
    var s = String(texto || "");
    if (APP.censurar(s) !== s) return true;
    // Letras sueltas separadas ("p u t o", "p.u.t.o").
    var partes = s.split(/[\s._\-]+/).filter(Boolean);
    if (partes.length >= 3 && partes.every(function (x) { return x.length === 1; })) return esMala(partes.join(""));
    // Palabras pegadas sin espacio que arman un insulto largo y claro.
    var junto = normalizar(s).replace(/[^a-z]/g, "");
    if (["hijodeputa", "hijadeputa", "chupapija", "motherfucker", "pelotudo", "pelotuda", "conchudo", "conchuda"].some(function (w) { return junto.indexOf(w) >= 0; })) return true;
    return nombreSexual(s);
  };

  // ---------- Nombres con contenido sexual (16/10) ----------
  // Pasó en la liga: "Aora sos adicta al sexo co..." no tenía ningún insulto de la lista. Solo para NOMBRES
  // (no para las respuestas del juego, donde "pene" o "concha" pueden ser válidas en su categoría).
  var NOMBRE_PALABRAS = [
    "sexo", "sexual", "sexy", "sex", "coger", "cogerte", "cogeme", "cogida", "cogido", "garchar", "garche", "garcha", "petera", "petero",
    "chupala", "chupamela", "chupame", "poronga", "pija", "pajero", "pajera", "pajeros", "paja", "tetas", "tetona", "teton", "pene", "penes",
    "vagina", "culear", "culiar", "orgasmo", "anal", "semen", "nudes", "desnuda", "desnudo", "xxx",
    "prostituta", "puticlub", "violacion", "pedofilo", "pedofila", "onlyfans", "horny", "boobs", "tits", "cum", "nude", "nudes",
    "transar", "trolazo", "tetas", "cachonda", "cachondo", "zorra", "perra", "putona",
    "sexo", "buceta", "piroca", "gostosa", "safada", "tesão", "tesao", "transa",
  ];
  var NOMBRE_RAICES = ["sexo", "porno", "masturb", "orgasm", "eyacul", "prostitut", "pedofil", "violac", "onlyfans", "garch", "chupame", "chupala", "chupamela", "poronga", "pajer", "putit", "putaz"];
  var NOMBRE_SET = {};
  NOMBRE_PALABRAS.forEach(function (w) { NOMBRE_SET[sinTildes(w)] = true; });
  function nombreSexual(s) {
    var palabras = normalizar(s).split(/[^a-zñ]+/).filter(Boolean);
    if (palabras.some(function (p) { return Object.prototype.hasOwnProperty.call(NOMBRE_SET, p); })) return true;
    var junto = palabras.join("");
    return NOMBRE_RAICES.some(function (r) { return junto.indexOf(r) >= 0; });
  }
  // Cómo se muestra el nombre de otro jugador: si es ofensivo (de alguien con una versión vieja o de la web),
  // se ve "Jugador" en vez del nombre.
  APP.nombreSeguro = function (nombre) {
    if (nombre == null || nombre === "") return nombre;
    return APP.textoOfensivo(nombre) ? tx("jugador") : nombre;
  };
  var escapeOriginal = window.escapeHtml;
  window.escapeHtml = function (str) { return escapeOriginal(str == null ? str : APP.censurar(str)); };

  // ---------- Bloqueados ----------
  var BLOQ_KEY = "tuttifruti_app_bloqueados";
  function bloqueados() { try { var b = JSON.parse(localStorage.getItem(BLOQ_KEY) || "{}"); return b && typeof b === "object" ? b : {}; } catch (e) { return {}; } }
  function guardarBloqueados(b) { try { localStorage.setItem(BLOQ_KEY, JSON.stringify(b)); } catch (e) { /* nada */ } }
  APP.estaBloqueado = function (uid) { return !!uid && Object.prototype.hasOwnProperty.call(bloqueados(), uid); };
  APP.nombreVisible = function (uid, nombre) { return APP.estaBloqueado(uid) ? tx("bloqueado") : APP.nombreSeguro(nombre); };
  APP.bloquear = function (uid, nombre) {
    if (!uid) return;
    var b = bloqueados(); b[uid] = String(nombre || "").slice(0, 30); guardarBloqueados(b);
    if (APP.evento) APP.evento("bloquear");
  };
  APP.desbloquear = function (uid) { var b = bloqueados(); delete b[uid]; guardarBloqueados(b); };
  APP.listaBloqueados = function () { var b = bloqueados(); return Object.keys(b).map(function (k) { return { uid: k, nombre: b[k] }; }); };

  // En las salas online, los bloqueados aparecen sin nombre.
  var salaOriginal = window.handleRoomUpdate;
  if (typeof salaOriginal === "function") {
    window.handleRoomUpdate = function (data) {
      if (data && data.players) Object.keys(data.players).forEach(function (pid) {
        if (pid !== state.playerId && APP.estaBloqueado(pid) && data.players[pid]) data.players[pid].name = tx("bloqueado");
      });
      return salaOriginal.apply(this, arguments);
    };
  }

  // ---------- Denunciar ----------
  var MOTIVOS = ["nombre", "respuestas", "trampa", "otro"];
  APP.denunciar = function (uid, nombre, donde) {
    if (!uid || !window.FB || uid === window.FB.uid) return;
    var elegido = "nombre";
    var hoja = APP.abrirHoja(
      "<h2>" + escapeHtml(tx("denunciar_titulo", { n: nombre || "?" })) + "</h2><p>" + escapeHtml(tx("denunciar_sub")) + "</p>" +
      '<div class="md-motivos">' + MOTIVOS.map(function (m, i) {
        return '<button type="button" class="aj-seg' + (i === 0 ? " activo" : "") + '" data-motivo="' + m + '">' + escapeHtml(tx("m_" + m)) + "</button>";
      }).join("") + "</div>" +
      '<label class="md-bloquear"><input type="checkbox" checked> <span>' + escapeHtml(tx("bloquear_tambien")) + "</span></label>" +
      '<button type="button" class="btn btn-primary btn-block" data-enviar>' + escapeHtml(tx("enviar")) + "</button>", "md-hoja");
    hoja.tarjeta.querySelectorAll("[data-motivo]").forEach(function (b) {
      b.addEventListener("click", function () {
        elegido = b.getAttribute("data-motivo");
        hoja.tarjeta.querySelectorAll("[data-motivo]").forEach(function (x) { x.classList.toggle("activo", x === b); });
        vibrar("toque");
      });
    });
    hoja.tarjeta.querySelector("[data-enviar]").addEventListener("click", function () {
      var boton = this; boton.disabled = true;
      var bloquearlo = hoja.tarjeta.querySelector(".md-bloquear input").checked;
      var F = window.FB;
      F.set(F.ref(F.db, "reportes/" + uid + "/" + F.uid), {
        motivo: elegido, nombre: String(nombre || "").slice(0, 30), donde: String(donde || "").slice(0, 20), at: F.serverTimestamp(),
      }).then(function () {
        if (bloquearlo) APP.bloquear(uid, nombre);
        if (APP.evento) APP.evento("denuncia", { motivo: elegido, donde: donde });
        hoja.cerrar();
        vibrar("bien");
        alert(tx("gracias"));
        if (donde === "liga" && window.appAbrirLiga) appAbrirLiga();
        if (bloquearlo) ocultarEnPantalla(uid);
      }).catch(function (e) {
        console.error("denuncia", e && (e.message || e));
        // Si no llegó (sin internet o reglas sin publicar), igual se puede bloquear.
        if (bloquearlo) { APP.bloquear(uid, nombre); if (donde === "liga" && window.appAbrirLiga) appAbrirLiga(); }
        boton.disabled = false;
        alert(tx("error"));
      });
    });
  };
  // Después de bloquear: en las listas que ya están en pantalla, el nombre pasa a "Jugador bloqueado".
  function ocultarEnPantalla(uid) {
    document.querySelectorAll('[data-md-uid="' + CSS.escape(uid) + '"]').forEach(function (b) {
      var fila = b.closest(".rank-row, .lg-fila");
      var nombre = fila && fila.querySelector(".rank-name, .lg-nombre");
      if (nombre && nombre.lastChild) nombre.lastChild.textContent = tx("bloqueado");
      b.remove();
    });
  }
  // Botón ⋯ para poner al lado de un jugador. El nombre va en un atributo (escapado) y se lee al tocar.
  APP.botonDenunciar = function (uid, nombre, donde) {
    if (!uid || (window.FB && uid === window.FB.uid)) return "";
    return '<button type="button" class="md-mas" aria-label="' + escapeOriginal(tx("mas")) + '" data-md-uid="' + escapeOriginal(uid) +
      '" data-md-nombre="' + escapeOriginal(String(nombre || "").slice(0, 30)) + '" data-md-donde="' + escapeOriginal(donde || "") + '">⋯</button>';
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-md-uid]");
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    APP.denunciar(b.getAttribute("data-md-uid"), b.getAttribute("data-md-nombre"), b.getAttribute("data-md-donde"));
  }, true);

  // En la sala de espera, el ⋯ al lado de cada jugador (las filas salen en el mismo orden que los jugadores).
  var esperaOriginal = window.renderWaitingRoom;
  if (typeof esperaOriginal === "function") {
    window.renderWaitingRoom = function (data) {
      var r = esperaOriginal.apply(this, arguments);
      try {
        var filas = document.querySelectorAll("#waitingPlayers .rank-row");
        Object.keys((data && data.players) || {}).forEach(function (pid, i) {
          if (filas[i] && pid !== state.playerId) filas[i].insertAdjacentHTML("beforeend", APP.botonDenunciar(pid, data.players[pid].name, "sala"));
        });
      } catch (e) { /* nada */ }
      return r;
    };
  }

  // En los rankings (desafío del día, semanal): ⋯ para denunciar, y los bloqueados sin nombre.
  var filaRankingOriginal = window.leaderboardRowHtml;
  if (typeof filaRankingOriginal === "function") {
    window.leaderboardRowHtml = function (pos, row, isMe) {
      var r = row || {};
      var bloqueado = !isMe && r.uid && APP.estaBloqueado(r.uid);
      var html = filaRankingOriginal.call(this, pos, bloqueado ? Object.assign({}, r, { name: tx("bloqueado") }) : r, isMe);
      if (isMe || !r.uid || bloqueado) return html;
      return html.replace(/<\/div>\s*$/, APP.botonDenunciar(r.uid, r.name, "ranking") + "</div>");
    };
  }

  // Lista de bloqueados (en la web se abre desde Mi fruta).
  window.appVerBloqueados = function () {
    var lista = APP.listaBloqueados();
    var hoja = APP.abrirHoja("<h2>" + escapeHtml(tx("bloqueados")) + "</h2>" +
      (lista.length ? '<div class="aj-grupo md-lista">' + lista.map(function (b) {
        return '<div class="aj-fila"><span>' + escapeHtml(b.nombre || "?") + '</span><button type="button" class="btn btn-ghost" data-desbloquear="' + escapeOriginal(b.uid) + '">' + escapeHtml(tx("desbloquear")) + "</button></div>";
      }).join("") + "</div>" : '<p class="hint">' + escapeHtml(tx("bloqueados_vacio")) + "</p>"));
    hoja.tarjeta.querySelectorAll("[data-desbloquear]").forEach(function (b) {
      b.addEventListener("click", function () { APP.desbloquear(b.getAttribute("data-desbloquear")); b.closest(".aj-fila").remove(); });
    });
  };
  // Nombres de otros jugadores en los módulos (safeName): los ofensivos se ven como "Jugador".
  window.safeName = function (n) { return APP.nombreSeguro(n); };

  // Tu nombre tampoco puede ser ofensivo: al empezar una partida y al aceptar un duelo.
  var empezarAntes = window.beginGame;
  if (typeof empezarAntes === "function") window.beginGame = function () {
    var input = document.getElementById("playerName");
    if (input && APP.textoOfensivo(input.value.trim())) { alert(tx("nombre_malo")); input.focus(); return; }
    return empezarAntes.apply(this, arguments);
  };
  var duelAntes = window.acceptDuel;
  if (typeof duelAntes === "function") window.acceptDuel = function () {
    var input = document.getElementById("duelName");
    if (input && APP.textoOfensivo(input.value.trim())) { alert(tx("nombre_malo")); input.focus(); return; }
    return duelAntes.apply(this, arguments);
  };

  // En Mi fruta, si bloqueaste a alguien: "Jugadores bloqueados" para desbloquear.
  var perfilAntes = window.openProfile;
  if (typeof perfilAntes === "function") window.openProfile = function () {
    var r = perfilAntes.apply(this, arguments);
    try {
      var viejo = document.getElementById("mdBloqueadosBtn");
      if (viejo) viejo.remove();
      var cuenta = document.querySelector("#screen-profile [data-account-box]");
      if (cuenta && APP.listaBloqueados().length) {
        var b = document.createElement("button");
        b.type = "button"; b.id = "mdBloqueadosBtn"; b.className = "btn btn-ghost btn-block md-bloqueados-btn";
        b.textContent = tx("bloqueados");
        b.addEventListener("click", function () { appVerBloqueados(); });
        cuenta.parentNode.insertBefore(b, cuenta.nextSibling);
      }
    } catch (e) { console.error(e); }
    return r;
  };
})();
