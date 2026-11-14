/* tutti.frutti · web · qué tan rara fue tu palabra, en el Desafío del día (igual que app-rareza.js de la app: los
   jugadores de la web también cuentan para los porcentajes).
   Como en Pointless o la regla original del Scattergories: todos juegan la misma letra y las mismas categorías, así que
   se puede mostrar cuánta gente puso lo mismo. Al terminar, cada palabra válida lleva una etiqueta: "Solo vos",
   "Rara · 4 %" o "61 %" (de los que jugaron hoy, cuántos pusieron esa palabra en esa categoría).
   No cambia el puntaje (el ranking del día se guarda antes de saber qué pusieron los demás): es para comentar y comparar.
   En Firebase: rareza/{día}/{uid} = { "0": "Mono", "1": "marrón", ... } con las palabras válidas, por posición de la
   categoría (para contar se comparan sin tildes ni mayúsculas, sin la s final). Sin nombre ni fruta: solo el id de la cuenta.
   Se escribe una vez por día (las reglas no dejan cambiarla) y se lee entera al ver el resultado; al volver a abrirlo
   más tarde los porcentajes se actualizan. Con menos de 5 jugadores todavía no se muestran porcentajes.
   Desde el 2/11 se guarda la palabra tal como se escribió (para mostrársela a tus amigos) y se normaliza al comparar. */
(function () {
  var TX = {
    es: { solo: "Solo vos", rara: "Rara · {p} %", pct: "{p} %", nota: "Debajo de cada palabra: cuántos de los {n} que jugaron hoy pusieron lo mismo.",
      pocos: "Cuando jueguen más personas vas a ver qué tan rara fue cada palabra.", mejor: "Tu palabra más original: {w}",
      amigos: "Lo que pusieron tus amigos", hoy: "Hoy hizo {p} puntos en el desafío", racha: "{d} días de racha juntos", ver: "Ver perfil" },
    en: { solo: "Only you", rara: "Rare · {p}%", pct: "{p}%", nota: "Under each word: how many of the {n} players today put the same one.",
      pocos: "Once more people play, you'll see how rare each word was.", mejor: "Your most original word: {w}",
      amigos: "What your friends put", hoy: "Scored {p} points in today's challenge", racha: "{d}-day streak together", ver: "View profile" },
    pt: { solo: "Só você", rara: "Rara · {p}%", pct: "{p}%", nota: "Embaixo de cada palavra: quantos dos {n} que jogaram hoje puseram a mesma.",
      pocos: "Quando mais gente jogar, você vai ver o quanto cada palavra foi rara.", mejor: "Sua palavra mais original: {w}",
      amigos: "O que seus amigos puseram", hoy: "Hoje fez {p} pontos no desafio", racha: "{d} dias de sequência juntos", ver: "Ver perfil" },
    de: { solo: "Nur du", rara: "Selten · {p} %", pct: "{p} %", nota: "Unter jedem Wort: wie viele der {n} Spieler heute dasselbe geschrieben haben.",
      pocos: "Sobald mehr Leute spielen, siehst du, wie selten jedes Wort war.", mejor: "Dein originellstes Wort: {w}",
      amigos: "Was deine Freunde geschrieben haben", hoy: "Heute {p} Punkte in der Challenge", racha: "{d} Tage Serie zusammen", ver: "Profil ansehen" },
    fr: { solo: "Toi seul", rara: "Rare · {p} %", pct: "{p} %", nota: "Sous chaque mot : combien des {n} joueurs d'aujourd'hui ont mis le même.",
      pocos: "Quand plus de monde aura joué, tu verras à quel point chaque mot était rare.", mejor: "Ton mot le plus original : {w}",
      amigos: "Ce qu'ont mis tes amis", hoy: "{p} points au défi d'aujourd'hui", racha: "{d} jours de série ensemble", ver: "Voir le profil" },
    it: { solo: "Solo tu", rara: "Rara · {p}%", pct: "{p}%", nota: "Sotto ogni parola: quanti dei {n} giocatori di oggi hanno messo la stessa.",
      pocos: "Quando avranno giocato più persone, vedrai quanto era rara ogni parola.", mejor: "La tua parola più originale: {w}",
      amigos: "Cosa hanno messo i tuoi amici", hoy: "Oggi {p} punti nella sfida", racha: "{d} giorni di serie insieme", ver: "Vedi profilo" },
  };
  function tx(k, v) {
    var s = (TX[state.lang] || TX.es)[k] || TX.es[k];
    if (APP.tu) s = APP.tu(s);
    s = v ? s.replace(/\{(\w+)\}/g, function (m, n) { return v[n] !== undefined ? v[n] : m; }) : s;
    return APP.numeros(s.replace(/(\d) %/g, "$1\u00a0%")); // el número y el "%" no se separan
  }
  var MINIMO = 5, RARA = 10;
  function norm(w) {
    var s = String(w || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ ]/g, " ").replace(/\s+/g, " ").trim();
    if (s.length > 3) s = s.replace(/s$/, "");
    return s.slice(0, 40);
  }
  function ruta(dia, uid) { return window.FB.ref(window.FB.db, "rareza/" + dia + (uid ? "/" + uid : "")); }
  // Lluvia de ideas: las 6 palabras son de la misma categoría, así que el orden no importa.
  function pusoLoMismo(palabras, i, mia, lluvia) {
    if (!palabras) return false;
    if (!lluvia) return !!palabras[String(i)] && norm(palabras[String(i)]) === mia;
    return Object.keys(palabras).some(function (k) { return palabras[k] && norm(palabras[k]) === mia; });
  }
  function misPalabras(record) {
    var out = {};
    // Tal como se escribió (para mostrársela a tus amigos con tildes); para contar se normaliza al leer (norm).
    (record.results || []).forEach(function (r, i) { if (r.valid && !r.joker && r.val && norm(r.val)) out[String(i)] = String(r.val).trim().slice(0, 40); });
    return out;
  }
  var SUBIDA_KEY = "tuttifruti_app_rareza_subida";
  function subir(record) {
    var palabras = misPalabras(record);
    try { if (localStorage.getItem(SUBIDA_KEY) === record.date) return Promise.resolve(); } catch (e) { /* nada */ }
    if (!Object.keys(palabras).length) palabras = { v: "" }; // también cuenta como jugador (para el total)
    return window.FB.set(ruta(record.date, window.FB.uid), palabras).then(function () {
      try { localStorage.setItem(SUBIDA_KEY, record.date); } catch (e) { /* nada */ }
    }).catch(function (e) {
      // Ya estaba (se jugó desde otro teléfono con la misma cuenta) o las reglas todavía no están publicadas.
      if (!/permission/i.test(String(e && e.message))) console.error("rareza", e && e.message);
    });
  }
  function pintar(record) {
    var lista = document.getElementById("answerList");
    if (!lista || !document.querySelector("#screen-results.active") || !state || state.room) return;
    var amigosListos = state.friends || !(typeof isGoogleUser === "function" && isGoogleUser()) || typeof loadFriends !== "function"
      ? Promise.resolve() : loadFriends().catch(function () { /* sin amigos */ });
    return Promise.all([window.FB.get(ruta(record.date)), amigosListos]).then(function (res) {
      // Mientras se leía pudo cambiar la pantalla: la lista de respuestas la comparten todos los modos.
      var titulo = document.getElementById("resultsTitle");
      if (!document.querySelector("#screen-results.active") || !titulo || titulo.textContent.indexOf(formatDayLabel(record.date)) < 0) return;
      var snap = res[0];
      var todos = snap.val() || {}, uids = Object.keys(todos), n = uids.length;
      var filas = lista.querySelectorAll(".answer-row");
      lista.querySelectorAll(".rz-chip, .rz-nota, .da-cab, .da-fila, .da-perfil").forEach(function (x) { x.remove(); });
      pintarAmigos(lista, filas, record, todos);
      var nota = document.createElement("p");
      nota.className = "hint rz-nota";
      if (n < MINIMO) { nota.textContent = tx("pocos"); lista.insertBefore(nota, lista.querySelector(".hint")); return; }
      var mejor = null;
      (record.results || []).forEach(function (r, i) {
        if (!r.valid || r.joker || !r.val || !filas[i]) return;
        var mia = norm(r.val), iguales = 0;
        uids.forEach(function (u) { if (pusoLoMismo(todos[u], i, mia, record.mode === "lluvia")) iguales++; });
        if (!iguales) iguales = 1; // la mía todavía no llegó
        var p = Math.round(100 * iguales / n);
        var chip = document.createElement("span");
        chip.className = "rz-chip" + (iguales === 1 ? " rz-unica" : p < RARA ? " rz-rara" : "");
        chip.textContent = iguales === 1 ? tx("solo") : p < RARA ? tx("rara", { p: Math.max(1, p) }) : tx("pct", { p: p });
        if (iguales === 1 || p < RARA) {
          chip.insertAdjacentHTML("afterbegin", iconSvg("star"));
          // (10/11) Queda en el diccionario con estrellita.
          var catR = r.cat || (record.categories || [])[i];
          if (catR && APP.diccionarioRara) APP.diccionarioRara(catR, r.val);
        }
        var val = filas[i].querySelector(".answer-val");
        if (val) val.appendChild(chip); // debajo de la palabra: al lado le quitaba lugar y partía palabras largas
        if (!mejor || iguales < mejor.iguales) mejor = { w: answerText(r.val), iguales: iguales };
      });
      nota.textContent = (mejor && mejor.iguales <= Math.max(1, n * RARA / 100) ? tx("mejor", { w: mejor.w }) + " · " : "") + tx("nota", { n: n });
      lista.insertBefore(nota, lista.querySelector(".hint"));
      if (APP.evento) APP.evento("rareza_vista", { jugadores: Math.min(n, 9999) });
    }).catch(function () { /* sin conexión o sin reglas: no se muestra nada */ });
  }
  // ---------- Lo que pusieron tus amigos (2/11, versión B del boceto aprobada por Augusto) ----------
  // Arriba, quiénes son (fruta y nombre); debajo de cada palabra, la fruta de cada amigo con lo que puso (con borde si
  // es lo mismo que vos). Tocar una fruta despliega su ficha en esa fila: la fruta con su ropa y fondo, el nombre, cuánto
  // hizo hoy y "Ver perfil". Hasta 3 amigos (primero los de tus rachas de a dos) para que entre en un renglón.
  // Solo se ve después de jugar (estás en tu resultado), así que nadie se copia. Mismos datos que la rareza.
  // (10/11, Augusto: "ayer 5 amigos lo hicieron y no los podía ver a todos") Ahora todos los que jugaron (hasta 20):
  // debajo de cada palabra las fichas pasan al renglón siguiente si no entran. Primero los de tus rachas de a dos.
  var AMIGOS_MAX = 20, fechaActual = "";
  function esc(v) { return typeof escapeHtml === "function" ? escapeHtml(String(v)) : String(v); }
  function fruta(f) { return APP.caraJugador("da-fruta", f); }
  function amigosQueJugaron(todos) {
    var lista = (state.friends || []).filter(function (f) { return f && f.uid && todos[f.uid]; });
    var conRacha = APP.rachasAmigos && APP.rachasAmigos.lista ? APP.rachasAmigos.lista().map(function (x) { return x.otro; }) : [];
    lista.sort(function (a, b) { return (conRacha.indexOf(b.uid) >= 0) - (conRacha.indexOf(a.uid) >= 0); });
    return lista.slice(0, AMIGOS_MAX);
  }
  var ABIERTO_KEY = "tuttifruti_app_amigos_desafio_abierto";
  function pintarAmigos(lista, filas, record, todos) {
    var amigos = amigosQueJugaron(todos);
    fechaActual = record.date;
    if (!amigos.length) return;
    // (8/11) Desplegable: cerrado se ve el título y las frutas; al tocarlo aparecen las palabras de cada uno debajo
    // de las tuyas (abierto, el ranking del día quedaba muy abajo). Se recuerda cómo lo dejaste.
    var cab = document.createElement("div");
    cab.className = "da-cab";
    cab.innerHTML = '<button type="button" class="da-abrir" aria-expanded="false"><b>' + esc(tx("amigos")) + '</b><span class="da-minis">' +
      amigos.slice(0, 4).map(fruta).join("") + (amigos.length > 4 ? '<span class="da-mas">+' + (amigos.length - 4) + "</span>" : "") + '</span><svg class="da-flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<div class="da-ley">' + amigos.map(function (f) {
      return '<button type="button" class="da-chip da-chip-ley" data-amigo="' + esc(f.uid) + '">' + fruta(f) + esc(f.name || "?") + "</button>";
    }).join("") + "</div>";
    lista.insertBefore(cab, filas[0] || lista.firstChild);
    lista.classList.add("da-lista");
    var abrir = cab.querySelector(".da-abrir");
    function ponerAbierto(si) {
      lista.classList.toggle("da-abierto", si);
      abrir.setAttribute("aria-expanded", si ? "true" : "false");
      if (!si) { var p = lista.querySelector(".da-perfil"); if (p) p.remove(); }
    }
    var antes = false;
    try { antes = localStorage.getItem(ABIERTO_KEY) === "1"; } catch (e) { /* nada */ }
    ponerAbierto(antes);
    abrir.addEventListener("click", function () {
      var si = !lista.classList.contains("da-abierto");
      ponerAbierto(si);
      try { localStorage.setItem(ABIERTO_KEY, si ? "1" : "0"); } catch (e) { /* nada */ }
      if (si && APP.evento) APP.evento("amigos_desafio_abrir", { n: amigos.length });
    });
    var misNorm = {};
    (record.results || []).forEach(function (r) { if (r.val && !r.joker) misNorm[norm(r.val)] = true; });
    (record.results || []).forEach(function (r, i) {
      if (!filas[i]) return;
      var mia = r.val && !r.joker ? norm(r.val) : "";
      var fila = document.createElement("div");
      fila.className = "da-fila";
      fila.innerHTML = amigos.map(function (f) {
        var w = todos[f.uid] && todos[f.uid][String(i)];
        var igual = w && (record.mode === "lluvia" ? misNorm[norm(w)] : mia && norm(w) === mia);
        return '<button type="button" class="da-chip' + (w ? "" : " da-nada") + (igual ? " da-igual" : "") + '" data-amigo="' + esc(f.uid) + '">' +
          fruta(f) + (w ? esc(w) : "—") + "</button>";
      }).join("");
      filas[i].appendChild(fila);
    });
    if (!lista.dataset.daOido) {
      lista.dataset.daOido = "1";
      lista.addEventListener("click", function (ev) {
        var b = ev.target.closest(".da-chip");
        if (!b || !lista.contains(b)) return;
        desplegar(b, b.getAttribute("data-amigo"));
      });
    }
    if (APP.evento) APP.evento("amigos_desafio_visto", { n: amigos.length });
  }
  // La ficha del amigo se abre debajo de las frutas que tocaste; tocar la misma fruta la cierra.
  function desplegar(boton, uid) {
    var f = (state.friends || []).filter(function (x) { return x.uid === uid; })[0];
    var donde = boton.closest(".da-fila, .da-cab");
    if (!f || !donde) return;
    var abierta = document.querySelector(".da-perfil");
    var misma = abierta && abierta.parentNode === donde && abierta.getAttribute("data-amigo") === uid;
    if (abierta) abierta.remove();
    document.querySelectorAll(".da-chip.da-tocado").forEach(function (x) { x.classList.remove("da-tocado"); });
    if (misma) return;
    boton.classList.add("da-tocado");
    var racha = APP.rachasAmigos && APP.rachasAmigos.lista ? APP.rachasAmigos.lista().filter(function (x) { return x.otro === uid && x.n > 0; })[0] : null;
    var p = document.createElement("div");
    p.className = "da-perfil";
    p.setAttribute("data-amigo", uid);
    p.innerHTML = APP.caraJugador("da-escena", f) + '<span class="da-datos"><b>' + esc(f.name || "?") + "</b>" +
      (APP.htmlTitulo && f.titulo ? " " + APP.htmlTitulo(f.titulo) : "") +
      '<small class="da-hoy"></small>' + (racha ? "<small>" + esc(tx("racha", { d: racha.n })) + "</small>" : "") +
      '</span><button type="button" class="da-ver">' + esc(tx("ver")) + "</button>";
    p.querySelector(".da-ver").addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (APP.evento) APP.evento("amigos_desafio_perfil", {});
      // Se sale del desafío: si no, un duelo empezado desde la ficha se quedaba con sus categorías para siempre.
      if (state.dailyMode && typeof leaveDailyMode === "function") leaveDailyMode();
      if (typeof openFriend === "function") openFriend(uid);
    });
    donde.appendChild(p);
    // Cuánto hizo hoy en el desafío (lo mismo que "Tus amigos hoy").
    var F = window.FB;
    if (F && F.get) F.get(F.ref(F.db, "hoy/" + (fechaActual || dayKey()) + "/" + uid + "/daily")).then(function (s) {
      var v = s.val();
      if (typeof v === "number" && p.isConnected) p.querySelector(".da-hoy").textContent = tx("hoy", { p: v });
    }).catch(function () { /* nada */ });
  }

  var antes = window.showDailyResult;
  if (typeof antes !== "function") return;
  window.showDailyResult = function (record, fresh) {
    var r = antes.apply(this, arguments);
    try {
      if (!record || record.unfinished || typeof whenFirebaseReady !== "function") return r;
      // Jugado con una versión anterior un día con modo: fue el clásico y no se puede comparar con los de hoy.
      if (!record.mode && dailyModeFor(record.date) !== "clasico") return r;
      whenFirebaseReady(function () {
        if (!window.FB || !window.FB.uid) return;
        // Siempre se intenta subir (una vez por día): también si lo jugaste con la versión anterior y lo volvés a abrir.
        subir(record).then(function () { return pintar(record); });
      });
    } catch (e) { console.error(e); }
    return r;
  };
})();
