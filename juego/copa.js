/* tutti.frutti · web (igual que en la app) · Copa Frutibot (tercera solapa de Temporada: Pase · Liga · Copa).
   Una escalera de 5 rivales de la computadora, cada uno más difícil (completa más categorías, hay
   menos tiempo y letras más difíciles). Cada partida es una ronda: el que suma más puntos gana
   (10 por palabra válida, 5 si los dos pusieron la misma). Ganás y pasás al siguiente rival.
   Cada copa da 3 fichas: perder cuesta una, y sin fichas se vuelve a empezar desde el primero.
   Se renueva cada semana (lunes, igual que la liga). Ganarla da 60 semillas (una vez por semana)
   y, la primera vez, el título "Campeón de la Copa".
   Las respuestas del rival salen de la función "rival" de la web (la misma IA de Frutibot); si no
   contesta, el rival juega con un puntaje estimado según su nivel.
   Se guarda en tuttifruti_app_copa (también en la cuenta). */
(function () {
  var KEY = "tuttifruti_app_copa";
  var FICHAS = 3, PREMIO = 60;
  var RIVALES = [
    { id: "kiwi", fruta: "🥝", acc: {}, nivel: 0.4, cats: 5, tiempo: 75, letras: ["easy"] },
    { id: "limon", fruta: "🍋", acc: { glasses: "sunglasses" }, nivel: 0.55, cats: 5, tiempo: 65, letras: ["easy"] },
    { id: "uva", fruta: "🍇", acc: { hat: "tophat" }, nivel: 0.68, cats: 6, tiempo: 65, letras: ["easy", "medium"] },
    { id: "anana", fruta: "🍍", acc: { hat: "cap" }, nivel: 0.78, cats: 6, tiempo: 55, letras: ["easy", "medium"] },
    { id: "coco", fruta: "🥥", acc: { hat: "crown" }, nivel: 0.88, cats: 7, tiempo: 60, letras: ["medium", "easy"] },
  ];
  var TEXTOS = {
    es: {
      copa: "Copa", titulo: "Copa Frutibot", sub: "Ganale a los 5 rivales y llevate la copa de la semana.", renueva: "Nueva copa en {n} días", renueva_1: "Nueva copa mañana",
      fichas: "Fichas", jugar: "Jugar", ganado: "Le ganaste", proximo: "Te toca", campeon: "¡Ganaste la Copa de esta semana!", copas: "Copas ganadas: {n}",
      n_kiwi: "Kiwi Novato", n_limon: "Limón Ácido", n_uva: "Uva Astuta", n_anana: "Ananá Veloz", n_coco: "Coco Campeón",
      f_kiwi: "Es su primera vez… ¡no seas malo!", f_limon: "Sus respuestas pican", f_uva: "Conoce palabras raras", f_anana: "Escribe rapidísimo", f_coco: "El último rival. Nunca perdió",
      vs: "vs", letra: "Letra", basta: "¡Basta!", tu: "Vos", gano: "¡Le ganaste a {r}!", perdio: "Te ganó {r}", empate: "¡Empate! Jugala de nuevo",
      ficha_menos: "Perdiste una ficha", sin_fichas: "Te quedaste sin fichas: la copa vuelve a empezar", seguir: "Seguir", reintentar: "Jugar de nuevo",
      premio: "¡Copa ganada! +{n} semillas", titulo_nuevo: "Nuevo título: «Campeón de la Copa»", puntos: "{n} pts", nada: "—", total: "Total",
      offline: "Necesitás conexión para jugar la Copa", rival_piensa: "{r} está pensando…", banner_sub: "Te toca: {r} · {n} de 5", banner_campeon: "¡Campeón de esta semana!",
    },
    en: {
      copa: "Cup", titulo: "Frutibot Cup", sub: "Beat all 5 rivals and win this week's cup.", renueva: "New cup in {n} days", renueva_1: "New cup tomorrow",
      fichas: "Tokens", jugar: "Play", ganado: "Beaten", proximo: "Your turn", campeon: "You won this week's Cup!", copas: "Cups won: {n}",
      n_kiwi: "Rookie Kiwi", n_limon: "Sour Lemon", n_uva: "Sly Grape", n_anana: "Speedy Pineapple", n_coco: "Champion Coconut",
      f_kiwi: "It's their first time… go easy!", f_limon: "Their answers sting", f_uva: "Knows some weird words", f_anana: "Types super fast", f_coco: "The last rival. Never lost",
      vs: "vs", letra: "Letter", basta: "Stop!", tu: "You", gano: "You beat {r}!", perdio: "{r} beat you", empate: "It's a tie! Play again",
      ficha_menos: "You lost a token", sin_fichas: "Out of tokens: the cup starts over", seguir: "Continue", reintentar: "Play again",
      premio: "Cup won! +{n} seeds", titulo_nuevo: "New title: “Cup Champion”", puntos: "{n} pts", nada: "—", total: "Total",
      offline: "You need a connection to play the Cup", rival_piensa: "{r} is thinking…", banner_sub: "Up next: {r} · {n} of 5", banner_campeon: "This week's champion!",
    },
    pt: {
      copa: "Copa", titulo: "Copa Frutibot", sub: "Vença os 5 rivais e leve a copa da semana.", renueva: "Nova copa em {n} dias", renueva_1: "Nova copa amanhã",
      fichas: "Fichas", jugar: "Jogar", ganado: "Vencido", proximo: "Sua vez", campeon: "Você ganhou a Copa desta semana!", copas: "Copas ganhas: {n}",
      n_kiwi: "Kiwi Novato", n_limon: "Limão Azedo", n_uva: "Uva Esperta", n_anana: "Abacaxi Veloz", n_coco: "Coco Campeão",
      f_kiwi: "É a primeira vez dele… pega leve!", f_limon: "As respostas dele ardem", f_uva: "Conhece palavras estranhas", f_anana: "Escreve rapidíssimo", f_coco: "O último rival. Nunca perdeu",
      vs: "vs", letra: "Letra", basta: "Stop!", tu: "Você", gano: "Você venceu {r}!", perdio: "{r} venceu você", empate: "Empate! Jogue de novo",
      ficha_menos: "Você perdeu uma ficha", sin_fichas: "Sem fichas: a copa recomeça", seguir: "Continuar", reintentar: "Jogar de novo",
      premio: "Copa ganha! +{n} sementes", titulo_nuevo: "Novo título: «Campeão da Copa»", puntos: "{n} pts", nada: "—", total: "Total",
      offline: "Você precisa de conexão para jogar a Copa", rival_piensa: "{r} está pensando…", banner_sub: "Sua vez: {r} · {n} de 5", banner_campeon: "Campeão desta semana!",
    },
  };
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave;
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return str;
  }
  APP.txCopa = tx;
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }
  function nombre(R) { return tx("n_" + R.id); }

  // ---------- Lo guardado ----------
  function leer() {
    var d = null;
    try { d = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { d = null; }
    if (!d || typeof d !== "object") d = {};
    if (!Array.isArray(d.ganadas)) d.ganadas = [];
    if (d.semana !== weekKey()) { d.semana = weekKey(); d.rival = 0; d.fichas = FICHAS; }
    if (typeof d.rival !== "number") d.rival = 0;
    if (typeof d.fichas !== "number") d.fichas = FICHAS;
    return d;
  }
  function guardar(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* nada */ } }
  APP.copasGanadas = function () { return leer().ganadas.length; };
  if (typeof SYNC_KEYS !== "undefined" && SYNC_KEYS.indexOf(KEY) < 0) SYNC_KEYS.push(KEY);
  var juntarAntes = window.mergeSyncValue;
  if (typeof juntarAntes === "function") window.mergeSyncValue = function (key, localRaw, remoteRaw) {
    if (key !== KEY || localRaw == null || remoteRaw == null) return juntarAntes.apply(this, arguments);
    var L, R;
    try { L = JSON.parse(localRaw); R = JSON.parse(remoteRaw); } catch (e) { return localRaw; }
    if (!L || !R) return localRaw || remoteRaw;
    var ganadas = (R.ganadas || []).concat((L.ganadas || []).filter(function (s) { return (R.ganadas || []).indexOf(s) < 0; }));
    // De la semana actual manda el que llegó más lejos.
    var base = L.semana === R.semana ? ((R.rival || 0) > (L.rival || 0) ? R : L) : ((L.semana || "") > (R.semana || "") ? L : R);
    return JSON.stringify({ semana: base.semana, rival: base.rival || 0, fichas: base.fichas, ganadas: ganadas.slice(-200) });
  };

  // ---------- Solapa "Copa" dentro de Temporada ----------
  window.appSolapaCopa = function (html, activo) {
    var boton = '<button type="button" class="aj-seg' + (activo === "copa" ? " activo" : "") + '" onclick="appAbrirCopa()">' + esc(tx("copa")) + "</button>";
    return html.replace(/<\/div>$/, boton + "</div>");
  };

  var pantalla = document.createElement("div");
  pantalla.className = "screen";
  pantalla.id = "screen-copa";
  pantalla.innerHTML = '<div class="wrap app-temporada app-copa" id="copaCont"></div>';
  document.body.insertBefore(pantalla, document.getElementById("appTabs"));
  var cont = pantalla.querySelector("#copaCont");

  function diasParaLunes() {
    var hoy = new Date(Date.now() - 3 * 3600 * 1000), dia = hoy.getUTCDay() || 7;
    return 8 - dia;
  }
  function render() {
    var d = leer(), campeon = d.rival >= RIVALES.length;
    var dias = diasParaLunes();
    var fichas = "";
    for (var i = 0; i < FICHAS; i++) fichas += advHeart(i < d.fichas);
    var html = appSegmentosTemporada("copa") +
      '<div class="tp-cabecera cp-cabecera"><span class="cp-trofeo">' + iconSvg("trophy") + '</span><div><h1>' + esc(tx("titulo")) + "</h1>" +
      "<small>" + esc(dias <= 1 ? tx("renueva_1") : tx("renueva", { n: dias })) + "</small></div></div>" +
      '<p class="hint">' + esc(tx("sub")) + "</p>";
    if (campeon) html += '<div class="cp-campeon">' + iconSvg("trophy") + "<strong>" + esc(tx("campeon")) + "</strong></div>";
    else html += '<div class="cp-fichas"><span>' + esc(tx("fichas")) + '</span><span class="cp-corazones">' + fichas + "</span></div>";
    html += '<div class="cp-escalera">' + RIVALES.map(function (R, k) {
      var hecho = k < d.rival, ahora = k === d.rival;
      return '<div class="cp-rival' + (hecho ? " hecho" : ahora ? " ahora" : " bloqueado") + '">' +
        '<span class="cp-num">' + (k + 1) + "</span>" +
        '<span class="cp-fruta">' + mascotSvg(hecho ? "sad" : "happy", R.fruta, R.acc) + "</span>" +
        '<span class="cp-texto"><strong>' + esc(nombre(R)) + "</strong><small>" + esc(tx("f_" + R.id)) + "</small></span>" +
        (hecho ? '<span class="cp-ok">✓</span>' : ahora ? '<button type="button" class="tp-cobrar" onclick="appJugarCopa()">' + esc(tx("jugar")) + "</button>" : '<span class="cp-candado">' + ADV_LOCK_SVG + "</span>") +
        "</div>";
    }).join("") + "</div>";
    if (d.ganadas.length) html += '<p class="hint cp-copas">' + iconSvg("trophy") + esc(tx("copas", { n: d.ganadas.length })) + "</p>";
    cont.innerHTML = html;
  }
  window.appAbrirCopa = function () {
    render();
    showScreen("screen-copa");
    window.scrollTo(0, 0);
    if (APP.evento) APP.evento("abrir_copa", {});
  };

  // ---------- La partida ----------
  var juego = document.createElement("div");
  juego.className = "screen";
  juego.id = "screen-copa-juego";
  document.body.insertBefore(juego, document.getElementById("appTabs"));
  var final = document.createElement("div");
  final.className = "screen";
  final.id = "screen-copa-resultado";
  document.body.insertBefore(final, document.getElementById("appTabs"));
  var P = null; // partida en curso

  function sortear(R) {
    var letras = [].concat.apply([], R.letras.map(function (k) { return ADV_LETTERS[k]; }));
    var pool = [].concat(ADV_CATS.easy, ADV_CATS.medium).sort(function () { return Math.random() - 0.5; });
    var cats = pool.slice(0, R.cats);
    if (window.letrasPosibles) letras = letrasPosibles(letras, cats); // nada de Color con Q (letras.js)
    var letra = letras[Math.floor(Math.random() * letras.length)];
    return { letra: letra, cats: cats };
  }
  // El rival: pide palabras a la IA (como Frutibot) y se queda con una parte según su nivel.
  function respuestasRival(R, letra, cats) {
    var labels = cats.map(function (c) { return catLabel(c); });
    return apiPost("rival", { letra: letra, categorias: labels, idioma: state.lang }, 12000).then(function (res) {
      return res.ok ? res.json() : null;
    }).then(function (json) {
      var por = (json && json.respuestas) || {}, out = {}, alguna = false;
      cats.forEach(function (c, i) {
        var v = por[labels[i]];
        if (typeof v === "string" && v.trim()) { alguna = true; if (Math.random() < R.nivel) out[c] = v.trim().slice(0, 40); }
      });
      return alguna ? out : null;
    }).catch(function () { return null; });
  }

  window.appJugarCopa = function () {
    var d = leer(), R = RIVALES[d.rival];
    if (!R) return;
    if (navigator.onLine === false) { seedToast(tx("offline")); return; }
    var s = sortear(R);
    P = { R: R, letra: s.letra, cats: s.cats, resp: {}, seg: R.tiempo, fin: false, rival: respuestasRival(R, s.letra, s.cats) };
    getAudioCtx();
    recordGameStart();
    juego.innerHTML =
      '<div class="board"><div class="topline"><div class="medal-wrap"><p class="label letra-label">' + esc(tx("letra")) + '</p>' +
      '<div class="medal" id="copaLetra">' + esc(P.letra) + '</div><p class="round-label">' + esc(tx("titulo")) + " · " + esc(nombre(R)) + "</p></div>" +
      '<div class="timer cp-timer"><svg viewBox="0 0 68 68" aria-hidden="true"><circle class="timer-track" cx="34" cy="34" r="28" stroke-width="6" fill="none"/>' +
      '<circle id="copaAro" cx="34" cy="34" r="28" stroke-width="6" fill="none" stroke-dasharray="175.9" stroke-dashoffset="0" stroke-linecap="round"/></svg>' +
      '<div class="timer-num" id="copaNum">' + P.seg + "</div></div></div>" +
      '<div class="cp-vs"><span class="cp-vs-yo">' + mascotSvg("happy", getMyAvatar(), myEquipped()) + "<small>" + esc(tx("tu")) + '</small></span><b>' + esc(tx("vs")) + '</b><span class="cp-vs-el">' + mascotSvg("happy", R.fruta, R.acc) + "<small>" + esc(nombre(R)) + "</small></span></div></div>" +
      '<div class="grid" id="copaGrid">' + P.cats.map(function (c) {
        return '<div class="card"><p class="card-label">' + esc(catLabel(c)) + '</p><input type="text" maxlength="40" placeholder="' + esc(P.letra) + '..." data-cat="' + esc(c) + '" autocomplete="off" autocapitalize="words"></div>';
      }).join("") + "</div>" +
      '<div class="basta-wrap"><button class="basta" onclick="appCopaBasta()">' + esc(tx("basta")) + "</button></div>";
    juego.querySelectorAll("#copaGrid input").forEach(function (inp, i, todos) {
      inp.addEventListener("input", function () { P.resp[inp.dataset.cat] = inp.value; inp.classList.toggle("filled", !!inp.value.trim()); });
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); if (todos[i + 1]) todos[i + 1].focus(); else inp.blur(); } });
    });
    showScreen("screen-copa-juego");
    window.scrollTo(0, 0);
    reloj();
    clearInterval(P.id);
    P.id = setInterval(function () {
      if (!P || P.fin) return;
      P.seg--;
      reloj();
      if (P.seg > 0 && P.seg <= 5) { playTic(); vibrate(50); }
      if (P.seg <= 0) { playTimeUp(); terminar(); }
    }, 1000);
    if (APP.evento) APP.evento("copa_partida", { rival: R.id });
  };
  function reloj() {
    var aro = document.getElementById("copaAro"), num = document.getElementById("copaNum");
    if (!aro || !P) return;
    var c = 2 * Math.PI * 28;
    aro.setAttribute("stroke-dashoffset", c * (1 - Math.max(0, P.seg) / P.R.tiempo));
    aro.classList.toggle("low", P.seg <= 10);
    num.textContent = Math.max(0, P.seg);
    num.classList.toggle("urgent", P.seg <= 10);
  }
  window.appCopaBasta = function () { if (P && !P.fin) { vibrar("fuerte"); terminar(); } };

  function terminar() {
    if (!P || P.fin) return;
    P.fin = true;
    clearInterval(P.id);
    var partida = P;
    // Mientras el juez corrige, el rival termina de pensar (como mucho unos segundos más).
    var rival = Promise.race([partida.rival, new Promise(function (r) { setTimeout(function () { r(null); }, 9000); })]);
    Promise.all([judgeSoloAnswers(partida.cats, partida.resp, partida.letra, 1, "COPA"), rival]).then(function (x) {
      resultado(partida, x[0] || [], x[1]);
    }).catch(function (e) { console.error("copa", e); resultado(partida, [], null); });
  }

  function resultado(partida, mios, rival) {
    var R = partida.R;
    // Si la IA del rival no contestó, juega con palabras "fantasma" según su nivel.
    var fantasma = !rival;
    if (fantasma) { rival = {}; partida.cats.forEach(function (c) { if (Math.random() < R.nivel) rival[c] = "✓"; }); }
    var filas = [], yo = 0, el = 0, validas = 0;
    partida.cats.forEach(function (c) {
      var m = mios.filter(function (r) { return r.cat === c; })[0] || {};
      var miVal = (m.val || "").trim(), ok = !!m.valid && !!miVal;
      var suya = rival[c] || "";
      var iguales = ok && suya && suya !== "✓" && normalizeAnswer(suya) === normalizeAnswer(miVal);
      var pm = ok ? (iguales ? 5 : 10) : 0, pr = suya ? (iguales ? 5 : 10) : 0;
      if (ok) validas++;
      yo += pm; el += pr;
      filas.push({ c: c, mio: miVal, ok: ok, suya: suya === "✓" ? "" : suya, tiene: !!suya, pm: pm, pr: pr });
    });
    var d = leer(), gano = yo > el, empate = yo === el, avisos = [];
    if (gano) {
      d.rival++;
      if (d.rival >= RIVALES.length && d.ganadas.indexOf(d.semana) < 0) {
        var primera = d.ganadas.length === 0;
        d.ganadas.push(d.semana);
        addSeeds(PREMIO);
        avisos.push(tx("premio", { n: PREMIO }));
        if (primera) avisos.push(tx("titulo_nuevo"));
        if (APP.evento) APP.evento("copa_ganada", {});
      }
    } else if (!empate) {
      d.fichas--;
      if (d.fichas <= 0) { d.rival = 0; d.fichas = FICHAS; avisos.push(tx("sin_fichas")); } else avisos.push(tx("ficha_menos"));
    }
    guardar(d);
    bumpProgress(function (p) { addMission(p, "valid_words", validas); });
    if (APP.partidaTerminada) APP.partidaTerminada("copa");
    var campeon = gano && d.rival >= RIVALES.length;
    final.innerHTML = '<div class="results"><div class="results-card">' +
      '<div class="screen-back-row"><button type="button" class="lobby-back" onclick="appAbrirCopa()"><span aria-hidden="true">←</span> ' + esc(tx("copa")) + "</button></div>" +
      '<div class="hero-band cp-hero' + (gano ? " gano" : empate ? "" : " perdio") + '">' +
        '<div class="cp-vs cp-vs-final"><span class="cp-vs-yo">' + mascotSvg(gano ? "happy" : "sad", getMyAvatar(), myEquipped()) + "<small>" + esc(tx("tu")) + "</small><strong>" + yo + "</strong></span><b>" + esc(tx("vs")) + '</b>' +
        '<span class="cp-vs-el">' + mascotSvg(gano ? "sad" : "happy", R.fruta, R.acc) + "<small>" + esc(nombre(R)) + "</small><strong>" + el + "</strong></span></div>" +
        "<h2>" + esc(gano ? tx("gano", { r: nombre(R) }) : empate ? tx("empate") : tx("perdio", { r: nombre(R) })) + "</h2>" +
      "</div>" +
      avisos.map(function (a) { return '<p class="cp-aviso">' + esc(a) + "</p>"; }).join("") +
      '<div class="cp-tabla">' + filas.map(function (f) {
        return '<div class="cp-fila"><span class="cp-cat">' + esc(catLabel(f.c)) + "</span>" +
          '<span class="cp-mia' + (f.ok ? " ok" : " mal") + '">' + esc(f.mio || tx("nada")) + "<b>+" + f.pm + "</b></span>" +
          '<span class="cp-suya">' + esc(f.suya || (f.tiene ? "✓" : tx("nada"))) + "<b>+" + f.pr + "</b></span></div>";
      }).join("") + "</div>" +
      '<div class="adv-actions"><button class="btn btn-secondary" onclick="appAbrirCopa()">' + esc(tx("seguir")) + "</button>" +
      (!campeon ? '<button class="btn btn-primary" onclick="appJugarCopa()">' + esc(gano ? tx("jugar") + " · " + nombre(RIVALES[d.rival]) : tx("reintentar")) + "</button>" : "") +
      "</div></div></div>";
    showScreen("screen-copa-resultado");
    window.scrollTo(0, 0);
    if (gano) { launchConfetti(); vibrar("bien"); } else if (!empate) { launchFruitConfetti("lose"); }
    P = null;
  }
  // Para el botón "Temporada" de la pantalla de modos (juego/temporada.js).
  APP.copaResumen = function () {
    var d = leer();
    return d.rival >= RIVALES.length ? tx("titulo") + " ✓" : tx("copa") + " " + d.rival + "/" + RIVALES.length;
  };

  if (window.appRenderInicio) appRenderInicio();

  // Si sale de la partida por otro lado (por ejemplo, un link), el reloj se frena.
  var pantallaAntes = window.showScreen;
  window.showScreen = function (id) {
    if (P && !P.fin && id !== "screen-copa-juego" && id !== "screen-judging") { clearInterval(P.id); P = null; }
    return pantallaAntes.apply(this, arguments);
  };
})();
