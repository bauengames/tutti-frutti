/* tutti.frutti · web (igual que en la app) · Online más fácil de usar (y las letras del Contrarreloj plegadas).
   - Crear sala: arranca con el paquete Clásico ya elegido y un resumen ("8 categorías · 45 s · 5 rondas ·
     letras clásicas") con "Cambiar"; las opciones (categorías, tiempo, rondas, letras, reglas, vueltas de tuerca)
     quedan plegadas hasta que las abrís. El código de la sala se ve recién en la sala (no antes de crearla).
     Las categorías ya no están en una caja con scroll propio, y "Random" deja de aparecer dos veces:
     el paquete pasa a llamarse "Sorpresa" y la categoría suelta "Una al azar".
   - Sala de espera: las reglas de la sala a la vista de todos, "Compartir link" e "Invitar amigos" (les llega
     un aviso; lo verifica el servidor, tipo "sala").
   - Unirme: botón "Pegar" y, cuando el código está completo, entra solo.
   - Al azar: una línea que explica cómo funciona (en la web no está el duelo al azar por turnos, que es de la app).
   - Contrarreloj: la grilla de letras plegada en "Letras: clásicas · Cambiar".
   Se carga después de app-web.js. */
(function () {
  var TEXTOS = {
    es: {
      resumen_t: "Así se juega", cambiar: "Cambiar", listo: "Listo", cats: "{n} categorías", cats1: "1 categoría", sorpresa_cats: "categorías sorpresa",
      seg: "{n} s", sin_tiempo: "sin tiempo", rondas: "{n} rondas", ronda1: "1 ronda", sin_limite: "rondas sin límite",
      letras_clasicas: "letras clásicas", letras_todas: "todas las letras", letras_n: "{n} letras", letras: "Letras: {x}", l_clasicas: "clásicas", l_todas: "todas", l_n: "{n}",
      juez: "juez con IA", sin_juez: "sin juez", vueltas: "{n} vueltas de tuerca", vuelta1: "1 vuelta de tuerca",
      compartir: "Compartir link", invitar: "Invitar amigos", invitar_t: "Invitar a la sala", invitar_sub: "Les llega un aviso y entran directo.",
      invitado: "Invitado", invitar_btn: "Invitar", sin_amigos: "Todavía no tenés amigos agregados. Sumalos desde Mi fruta → Amigos.",
      pegar: "Pegar", codigo_ph: "Ej.: JZCQJ",
      azar_nota: "Buscamos a alguien que esté conectado ahora. Si en unos segundos no aparece nadie, jugás contra Frutibot.",
      azar_duelo: "¿Preferís no esperar? Jugá un duelo al azar: cada uno juega su turno cuando puede.",
      azar_duelo_btn: "Duelo al azar",
      pack_random: "Sorpresa", random_chip: "Una al azar",
    },
    en: {
      resumen_t: "How this room plays", cambiar: "Change", listo: "Done", cats: "{n} categories", cats1: "1 category", sorpresa_cats: "surprise categories",
      seg: "{n} s", sin_tiempo: "no timer", rondas: "{n} rounds", ronda1: "1 round", sin_limite: "unlimited rounds",
      letras_clasicas: "classic letters", letras_todas: "all letters", letras_n: "{n} letters", letras: "Letters: {x}", l_clasicas: "classic", l_todas: "all", l_n: "{n}",
      juez: "AI judge", sin_juez: "no judge", vueltas: "{n} twists", vuelta1: "1 twist",
      compartir: "Share link", invitar: "Invite friends", invitar_t: "Invite to the room", invitar_sub: "They get a notification and join right away.",
      invitado: "Invited", invitar_btn: "Invite", sin_amigos: "You haven't added any friends yet. Add them from My fruit → Friends.",
      pegar: "Paste", codigo_ph: "E.g. JZCQJ",
      azar_nota: "We look for someone who's online right now. If nobody shows up in a few seconds, you play against Frutibot.",
      azar_duelo: "Rather not wait? Play a random duel: each of you plays your turn whenever you can.",
      azar_duelo_btn: "Random duel",
      pack_random: "Surprise", random_chip: "One at random",
    },
    pt: {
      resumen_t: "Como se joga", cambiar: "Mudar", listo: "Pronto", cats: "{n} categorias", cats1: "1 categoria", sorpresa_cats: "categorias surpresa",
      seg: "{n} s", sin_tiempo: "sem tempo", rondas: "{n} rodadas", ronda1: "1 rodada", sin_limite: "rodadas sem limite",
      letras_clasicas: "letras clássicas", letras_todas: "todas as letras", letras_n: "{n} letras", letras: "Letras: {x}", l_clasicas: "clássicas", l_todas: "todas", l_n: "{n}",
      juez: "juiz com IA", sin_juez: "sem juiz", vueltas: "{n} reviravoltas", vuelta1: "1 reviravolta",
      compartir: "Compartilhar link", invitar: "Convidar amigos", invitar_t: "Convidar para a sala", invitar_sub: "Eles recebem um aviso e entram direto.",
      invitado: "Convidado", invitar_btn: "Convidar", sin_amigos: "Você ainda não tem amigos adicionados. Adicione em Minha fruta → Amigos.",
      pegar: "Colar", codigo_ph: "Ex.: JZCQJ",
      azar_nota: "Procuramos alguém que esteja conectado agora. Se ninguém aparecer em alguns segundos, você joga contra o Frutibot.",
      azar_duelo: "Prefere não esperar? Jogue um duelo aleatório: cada um joga seu turno quando puder.",
      azar_duelo_btn: "Duelo aleatório",
      pack_random: "Surpresa", random_chip: "Uma aleatória",
    },
  };
  function tx(k, v) {
    var s = (TEXTOS[state.lang] || TEXTOS.es)[k] || TEXTOS.es[k] || k;
    return v ? s.replace(/\{(\w+)\}/g, function (m, n) { return v[n] !== undefined ? v[n] : m; }) : s;
  }
  var esc = window.escapeHtml;
  ["es", "en", "pt"].forEach(function (lang) {
    if (!I18N[lang]) return;
    I18N[lang].pack_random = TEXTOS[lang].pack_random;
    I18N[lang].random_category_chip = TEXTOS[lang].random_chip;
    I18N[lang].join_code_placeholder = TEXTOS[lang].codigo_ph;
  });

  // ---------- Resumen de la sala (crear) y de las letras (Contrarreloj) ----------
  function letrasTexto(pool, corto) {
    pool = pool || [];
    if (corto) {
      var c = DEFAULT_LETTERS.length === pool.length && DEFAULT_LETTERS.every(function (l) { return pool.indexOf(l) >= 0; });
      return c ? tx("l_clasicas") : pool.length >= FULL_ALPHABET.length ? tx("l_todas") : tx("l_n", { n: pool.length });
    }
    var clasicas = DEFAULT_LETTERS.length === pool.length && DEFAULT_LETTERS.every(function (l) { return pool.indexOf(l) >= 0; });
    if (clasicas) return tx("letras_clasicas");
    if (pool.length >= FULL_ALPHABET.length) return tx("letras_todas");
    return tx("letras_n", { n: pool.length });
  }
  // Las reglas en una línea, a partir de la configuración (la de la sala o la que se está armando).
  function reglasTexto(c) {
    var partes = [];
    if (c.categoriesMode === "random") partes.push(tx("sorpresa_cats"));
    else partes.push((c.categories || []).length === 1 ? tx("cats1") : tx("cats", { n: (c.categories || []).length }));
    partes.push(c.timed === false ? tx("sin_tiempo") : tx("seg", { n: c.duration }));
    var r = +c.totalRounds;
    partes.push(r === 0 ? tx("sin_limite") : r === 1 ? tx("ronda1") : tx("rondas", { n: r }));
    partes.push(letrasTexto(c.letterPool));
    partes.push(c.judge === false ? tx("sin_juez") : tx("juez"));
    var v = Object.keys(c.twists || {}).filter(function (k) { return c.twists[k]; }).length;
    if (v) partes.push(v === 1 ? tx("vuelta1") : tx("vueltas", { n: v }));
    return partes.join(" · ");
  }
  function configActual() {
    var d = document.getElementById("durationSelect"), r = document.getElementById("roundsSelect");
    return { categories: state.categories, categoriesMode: state.categoriesMode, duration: d ? +d.value : state.duration,
      totalRounds: r ? +r.value : state.totalRounds, letterPool: state.letterPool, judge: state.judgeOn, timed: state.timed, twists: state.twists };
  }
  var abierto = false;
  function resumen() {
    var wrap = document.getElementById("lobbyWrap"), cfg = document.getElementById("hostConfigFields");
    if (!wrap || !cfg) return;
    var caja = document.getElementById("olResumen");
    if (!caja) {
      caja = document.createElement("div");
      caja.id = "olResumen"; caja.className = "ol-resumen mode-only";
      caja.innerHTML = '<div class="ol-resumen-txt"><span class="label"></span><strong></strong></div><button type="button" class="ol-cambiar"></button>';
      cfg.parentNode.insertBefore(caja, cfg);
      caja.querySelector(".ol-cambiar").addEventListener("click", function () {
        abierto = !abierto;
        resumen();
        if (abierto) cfg.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    }
    var modo = state.mode, ver = modo === "create" || modo === "streak";
    caja.style.display = ver ? "" : "none";
    wrap.classList.toggle("ol-plegado", ver && !abierto);
    wrap.classList.toggle("ol-contrarreloj", modo === "streak");
    if (!ver) return;
    caja.querySelector(".label").textContent = modo === "streak" ? "" : tx("resumen_t");
    caja.querySelector("strong").textContent = modo === "streak" ? tx("letras", { x: letrasTexto(state.letterPool, true) }) : reglasTexto(configActual());
    caja.querySelector(".ol-cambiar").textContent = abierto ? tx("listo") : tx("cambiar");
  }

  // ---------- Unirme: "Pegar" y entrar solo con el código completo ----------
  function prepararUnirme() {
    var input = document.getElementById("joinCodeInput");
    if (!input || document.getElementById("olPegar")) return;
    input.placeholder = tx("codigo_ph");
    var fila = document.createElement("div");
    fila.className = "room-row ol-unirme";
    input.parentNode.insertBefore(fila, input);
    fila.appendChild(input);
    if (navigator.clipboard && navigator.clipboard.readText) {
      var b = document.createElement("button");
      b.type = "button"; b.id = "olPegar"; b.textContent = tx("pegar");
      b.addEventListener("click", function () {
        navigator.clipboard.readText().then(function (txt) {
          var m = String(txt || "").toUpperCase().match(/(?:ROOM=)?([A-Z0-9]{5})\b/);
          if (!m) return;
          input.value = m[1];
          input.dispatchEvent(new Event("input"));
        }).catch(function () {});
      });
      fila.appendChild(b);
    }
    var ultimo = "";
    input.addEventListener("input", function () {
      var v = input.value.trim();
      if (v.length === 5 && v !== ultimo && state.mode === "join") {
        ultimo = v;
        var play = document.getElementById("playBtn");
        setTimeout(function () { if (play && !play.disabled && input.value.trim() === v) play.click(); }, 350);
      }
    });
  }

  // ---------- Al azar: cómo funciona y el duelo al azar ----------
  function prepararAzar() {
    var playBtn = document.getElementById("playBtn");
    var caja = document.getElementById("olAzar");
    if (!caja && playBtn) {
      caja = document.createElement("div");
      caja.id = "olAzar"; caja.className = "ol-azar";
      caja.innerHTML = '<p class="ol-azar-nota"></p>';
      var ref = document.getElementById("hostConfigFields");
      ref.parentNode.insertBefore(caja, ref);
    }
    if (!caja) return;
    caja.style.display = state.mode === "random" ? "" : "none";
    caja.querySelector(".ol-azar-nota").textContent = tx("azar_nota");
  }

  var modoAntes = window.setMode;
  window.setMode = function (mode) {
    var r = modoAntes.apply(this, arguments);
    try {
      // Una sala sin categorías no se puede crear: arranca con el Clásico (se puede cambiar).
      if (mode === "create" && state.categoriesMode !== "random" && !state.categories.length && typeof loadPack === "function") loadPack("clasico");
      if (mode !== "create" && mode !== "streak") abierto = false;
      document.querySelectorAll('[data-i18n="pack_random"]').forEach(function (b) { b.textContent = tx("pack_random"); });
      prepararUnirme();
      prepararAzar();
      resumen();
    } catch (e) { console.error(e); }
    return r;
  };
  var puedeAntes = window.checkCanPlay;
  window.checkCanPlay = function () { var r = puedeAntes.apply(this, arguments); try { resumen(); } catch (e) { /* nada */ } return r; };
  ["toggleTwist", "toggleJudge", "toggleTimed", "loadPack"].forEach(function (n) {
    var antes = window[n];
    if (typeof antes !== "function") return;
    window[n] = function () { var r = antes.apply(this, arguments); try { resumen(); } catch (e) { /* nada */ } return r; };
  });
  ["durationSelect", "roundsSelect"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("change", resumen);
  });

  // ---------- Sala de espera: reglas, compartir e invitar ----------
  var invitados = {};
  function invitar(code) {
    var h = APP.abrirHoja("<h2>" + esc(tx("invitar_t")) + '</h2><p class="hint">' + esc(tx("invitar_sub")) + '</p><div class="ol-amigos"><p class="hint">…</p></div>', "ol-hoja");
    var lista = h.tarjeta.querySelector(".ol-amigos");
    var hechos = invitados[code] || (invitados[code] = {});
    Promise.resolve(typeof loadFriends === "function" ? loadFriends().catch(function () { return []; }) : []).then(function (amigos) {
      var enSala = Object.keys((state.room && state.room.players) || {});
      amigos = (amigos || []).filter(function (a) { return enSala.indexOf(a.uid) < 0; });
      if (!amigos.length) { lista.innerHTML = '<p class="hint">' + esc(tx("sin_amigos")) + "</p>"; return; }
      lista.innerHTML = amigos.map(function (a) {
        return '<div class="friend-row ol-amigo"><span class="friend-avatar">' + mascotSvg("happy", avatarOf(a), cleanAccessories(a.acc)) + "</span><span><strong>" + esc(a.name || "?") + "</strong></span>" +
          '<button type="button" class="btn btn-primary" data-amigo="' + esc(a.uid) + '"' + (hechos[a.uid] ? " disabled" : "") + ">" + esc(hechos[a.uid] ? tx("invitado") : tx("invitar_btn")) + "</button></div>";
      }).join("");
      lista.addEventListener("click", function (e) {
        var b = e.target.closest("[data-amigo]");
        if (!b || b.disabled) return;
        var uid = b.getAttribute("data-amigo");
        hechos[uid] = true;
        b.disabled = true; b.textContent = tx("invitado");
        if (APP.avisar) APP.avisar("sala", uid, { sala: code });
        if (APP.evento) APP.evento("sala_invitar", {});
        if (window.vibrar) vibrar("bien");
      });
    });
  }
  var salaAntes = window.renderWaitingRoom;
  window.renderWaitingRoom = function (data) {
    var r = salaAntes.apply(this, arguments);
    try {
      var tarjeta = document.querySelector("#screen-waiting .code-card");
      var caja = document.getElementById("olSala");
      if (!caja && tarjeta) {
        caja = document.createElement("div");
        caja.id = "olSala"; caja.className = "ol-sala";
        caja.innerHTML = '<p class="ol-sala-reglas"></p><div class="ol-sala-botones"><button type="button" class="btn btn-secondary" data-compartir></button><button type="button" class="btn btn-secondary" data-invitar></button></div>';
        tarjeta.insertAdjacentElement("afterend", caja);
        caja.querySelector("[data-compartir]").addEventListener("click", function () {
          var textos = { es: "Unite a mi sala de tutti.frutti", en: "Join my tutti.frutti room", pt: "Entre na minha sala de tutti.frutti" };
          var link = roomShareLink();
          if (navigator.share) navigator.share({ title: "tutti.frutti", text: (textos[state.lang] || textos.es) + " (" + state.roomCode + ")", url: link }).catch(function () {});
          else if (navigator.clipboard) navigator.clipboard.writeText(link).then(function () { seedToast(t("copied_btn")); }).catch(function () {});
          if (APP.evento) APP.evento("share", { type: "room" });
        });
        caja.querySelector("[data-invitar]").addEventListener("click", function () { invitar(state.roomCode); });
      }
      if (caja) {
        var cfg = (data && data.config) || {};
        caja.querySelector(".ol-sala-reglas").textContent = reglasTexto(cfg);
        caja.querySelector("[data-compartir]").textContent = tx("compartir");
        var inv = caja.querySelector("[data-invitar]");
        inv.textContent = tx("invitar");
        inv.style.display = typeof isGoogleUser === "function" && isGoogleUser() ? "" : "none";
      }
    } catch (e) { console.error(e); }
    return r;
  };
})();
