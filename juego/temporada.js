/* tutti.frutti · web (igual que en la app) · pase de temporada (gratis).
   Cada temporada dura unas 6 semanas y tiene 30 premios. Se avanza con la XP que ganás jugando
   (100 XP por premio). Los exclusivos de cada temporada (ícono de la app en el premio 10 y tema
   en el premio 30) no se venden ni vuelven después.
   Se guarda en progress.temporada (se sincroniza con la cuenta); cada premio se cobra una sola vez
   (progress.counted "pase:<temporada>:<n>").
   En la web: botón "Pase de temporada" en la pantalla de modos, con solapas Pase, Liga y Copa. */
(function () {
  var TEXTOS = {
    es: {
      tab: "Temporada", pase: "Pase", liga: "Liga", titulo: "Temporada {t}", termina: "Termina en {n} días", termina_hoy: "Termina hoy",
      nivel: "Premio {n} de {t}", xp: "{a} / {b} XP para el próximo", completo: "¡Completaste el pase!",
      exclusivos: "Exclusivos de esta temporada", cobrar: "Cobrar", bloqueado: "Jugá para desbloquearlo",
      semillas: "{n} semillas", hint: "Pista", joker: "Comodín", reroll: "Cambiar letra", clock: "Reloj extra", shield: "Escudo", freeze: "Congelador",
      acc: "Accesorio", icono: "Ícono para la app de iPhone «{n}»", titulo_banner: "Pase de temporada", sub_banner: "Premio {n} de {t} · gratis jugando", para_cobrar: "¡Tenés {n} premios para cobrar!", para_cobrar_1: "¡Tenés un premio para cobrar!", volver: "Modos", tema: "Tema «{n}»", pronto: "La próxima temporada empieza pronto. ¡Seguí sumando XP!",
      como: "Ganás XP jugando cualquier modo. Cada {n} XP desbloqueás un premio. Los exclusivos no vuelven cuando termina la temporada.",
      como_sube: "Ganás XP jugando cualquier modo. Cada premio pide un poco más: {a} XP los primeros, {b} los del medio y {c} los últimos. Los exclusivos no vuelven cuando termina la temporada.",
      cobrado: "¡{p}!", pase_tema: "Pase",
    },
    en: {
      tab: "Season", pase: "Pass", liga: "League", titulo: "{t} season", termina: "Ends in {n} days", termina_hoy: "Ends today",
      nivel: "Reward {n} of {t}", xp: "{a} / {b} XP to the next one", completo: "You completed the pass!",
      exclusivos: "This season's exclusives", cobrar: "Claim", bloqueado: "Play to unlock it",
      semillas: "{n} seeds", hint: "Hint", joker: "Joker", reroll: "New letter", clock: "Extra time", shield: "Shield", freeze: "Streak freeze",
      acc: "Accessory", icono: "iPhone app icon “{n}”", titulo_banner: "Season pass", sub_banner: "Reward {n} of {t} · free by playing", para_cobrar: "You have {n} rewards to claim!", para_cobrar_1: "You have a reward to claim!", volver: "Modes", tema: "“{n}” theme", pronto: "The next season starts soon. Keep earning XP!",
      como: "Earn XP playing any mode. Every {n} XP unlocks a reward. Exclusives don't come back when the season ends.",
      como_sube: "Earn XP playing any mode. Each reward asks a bit more: {a} XP for the first ones, {b} for the middle ones and {c} for the last ones. Exclusives don't come back when the season ends.",
      cobrado: "{p}!", pase_tema: "Pass",
    },
    pt: {
      tab: "Temporada", pase: "Passe", liga: "Liga", titulo: "Temporada {t}", termina: "Termina em {n} dias", termina_hoy: "Termina hoje",
      nivel: "Prêmio {n} de {t}", xp: "{a} / {b} XP para o próximo", completo: "Você completou o passe!",
      exclusivos: "Exclusivos desta temporada", cobrar: "Resgatar", bloqueado: "Jogue para desbloquear",
      semillas: "{n} sementes", hint: "Dica", joker: "Coringa", reroll: "Trocar letra", clock: "Relógio extra", shield: "Escudo", freeze: "Congelador",
      acc: "Acessório", icono: "Ícone do app de iPhone “{n}”", titulo_banner: "Passe de temporada", sub_banner: "Prêmio {n} de {t} · grátis jogando", para_cobrar: "Você tem {n} prêmios para resgatar!", para_cobrar_1: "Você tem um prêmio para resgatar!", volver: "Modos", tema: "Tema “{n}”", pronto: "A próxima temporada começa em breve. Continue somando XP!",
      como: "Você ganha XP jogando qualquer modo. A cada {n} XP desbloqueia um prêmio. Os exclusivos não voltam quando a temporada acaba.",
      como_sube: "Você ganha XP jogando qualquer modo. Cada prêmio pede um pouco mais: {a} XP os primeiros, {b} os do meio e {c} os últimos. Os exclusivos não voltam quando a temporada acaba.",
      cobrado: "{p}!", pase_tema: "Passe",
    },
  };
  // (16/11, igual que la app) Más claro (un jugador: "no se entiende lo de los premios, ni que dice exclusivos de esta
  // temporada; no queda claro que hay que ganarlos"). "Pase" pasa a "Premios"; en vez del párrafo, tres pasos; los
  // exclusivos pasan a "Premios especiales" con su número, candado y cuánto falta; cada fila dice cuánta XP falta y al
  // tocarla explica qué es el premio; y hay un "?" que explica cómo funciona la Temporada.
  // En la web, el ícono es para la app de iPhone y el tema se elige en la Tienda.
  var NUEVOS = {
    es: { pase: "Premios", pase_tema: "Temporada", completo: "¡Ganaste los 30 premios!",
      jugar: "Jugá y ganá premios", paso1: "Jugá cualquier modo", paso2: "Sumás XP", paso3: "Abrís un premio",
      ganados: "{n} de {t} premios", faltan: "Te faltan {n} XP", falta_fila: "{n} XP",
      especiales: "Premios especiales", especiales_sub: "Solo se ganan jugando esta temporada. No se venden y no vuelven.",
      premio_n: "Premio {n}", icono_corto: "Ícono de la app", tema_corto: "Tema de colores",
      listo: "¡Listo para cobrar!", tuyo: "Ya es tuyo", ayuda: "Cómo funciona la Temporada", entendido: "Entendido",
      d_semillas: "Para cambiar en la Tienda por frutas, accesorios y más.",
      d_acc: "Un accesorio para tu fruta. Si ya lo tenés, te llevás 25 semillas.",
      d_icono: "Para la app de iPhone: cambia cómo se ve tutti.frutti en la pantalla de inicio de tu teléfono.",
      d_tema: "Los colores de todo el juego. Se elige en la Tienda.",
      d_freeze: "Si un día no jugás, se usa solo y tu racha sigue.",
      d_solo: "Solo se gana esta temporada.",
      d_cuando: "Premio {n} · te faltan {x} XP" },
    en: { pase: "Rewards", pase_tema: "Season", completo: "You won all 30 rewards!",
      jugar: "Play and win rewards", paso1: "Play any mode", paso2: "Earn XP", paso3: "Unlock a reward",
      ganados: "{n} of {t} rewards", faltan: "{n} XP to go", falta_fila: "{n} XP",
      especiales: "Special rewards", especiales_sub: "You can only win them by playing this season. They're not for sale and won't come back.",
      premio_n: "Reward {n}", icono_corto: "App icon", tema_corto: "Color theme",
      listo: "Ready to claim!", tuyo: "It's yours", ayuda: "How the season works", entendido: "Got it",
      d_semillas: "Trade them in the Shop for fruits, accessories and more.",
      d_acc: "An accessory for your fruit. If you already have it, you get 25 seeds.",
      d_icono: "For the iPhone app: changes how tutti.frutti looks on your phone's home screen.",
      d_tema: "Colors for the whole game. Pick it in the Shop.",
      d_freeze: "If you skip a day, it's used automatically and your streak goes on.",
      d_solo: "Only this season.",
      d_cuando: "Reward {n} · {x} XP to go" },
    pt: { pase: "Prêmios", pase_tema: "Temporada", completo: "Você ganhou os 30 prêmios!",
      jugar: "Jogue e ganhe prêmios", paso1: "Jogue qualquer modo", paso2: "Ganhe XP", paso3: "Libere um prêmio",
      ganados: "{n} de {t} prêmios", faltan: "Faltam {n} XP", falta_fila: "{n} XP",
      especiales: "Prêmios especiais", especiales_sub: "Só dá para ganhar jogando nesta temporada. Não são vendidos e não voltam.",
      premio_n: "Prêmio {n}", icono_corto: "Ícone do app", tema_corto: "Tema de cores",
      listo: "Pronto para resgatar!", tuyo: "Já é seu", ayuda: "Como funciona a temporada", entendido: "Entendi",
      d_semillas: "Para trocar na Loja por frutas, acessórios e mais.",
      d_acc: "Um acessório para sua fruta. Se você já tiver, ganha 25 sementes.",
      d_icono: "Para o app de iPhone: muda como o tutti.frutti aparece na tela inicial do seu celular.",
      d_tema: "As cores do jogo inteiro. Escolha na Loja.",
      d_freeze: "Se você não jogar um dia, ele é usado sozinho e sua sequência continua.",
      d_solo: "Só nesta temporada.",
      d_cuando: "Prêmio {n} · faltam {x} XP" },
  };
  Object.keys(NUEVOS).forEach(function (l) { Object.assign(TEXTOS[l], NUEVOS[l]); });
  function miles(n) { try { return Number(n).toLocaleString(state.lang === "pt" ? "pt-BR" : state.lang); } catch (e) { return String(n); } }
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave;
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return str;
  }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }
  APP.txTemporada = tx;

  var XP_POR_PREMIO = 100, TOTAL = 30;
  var TEMPORADAS = [
    { id: "t1", emoji: "cerezo", nombre: { es: "Primavera", en: "Spring", pt: "Primavera" }, desde: "2026-10-04", hasta: "2026-11-15",
      icono: "primavera", tema: "lima__lavanda", acc: ["balloon", "sparkles", "tophat", "crown"] },
    { id: "t2", emoji: "sun", nombre: { es: "Verano", en: "Summer", pt: "Verão" }, desde: "2026-11-16", hasta: "2027-01-06",
      icono: "verano", tema: "mandarina__noche", acc: ["icecream", "straw", "mustache", "trophy"], xp: [200, 300, 400] },
    { id: "t3", emoji: "mascara", nombre: { es: "Carnaval", en: "Carnival", pt: "Carnaval" }, desde: "2027-01-07", hasta: "2027-02-14", // junto con el mundo Carnaval de la Aventura, cuando termina la Navidad
      icono: "carnaval", tema: "sandia__lavanda", acc: ["party", "bowtie", "mic", "beanie"], xp: [200, 300, 400] },
  ];
  if (APP.hemisferioSur && !APP.hemisferioSur()) {
    TEMPORADAS[0].nombre = { es: "Flores", en: "Blossom", pt: "Flores" };
    TEMPORADAS[1].nombre = { es: "Tropical", en: "Tropical", pt: "Tropical" };
  }
  // Nombres de los temas de color (Ajustes y tienda): estaban solo en español.
  var NOMBRES_TEMA = {
    en: { "Uva": "Grape", "Pomelo": "Grapefruit", "Tinta": "Ink", "Cielo": "Sky", "Lima": "Lime", "Mandarina": "Tangerine", "Sandía": "Watermelon", "Noche": "Night", "Lila": "Lilac", "Primavera": "Spring", "Verano": "Summer", "Carnaval": "Carnival" },
    pt: { "Pomelo": "Toranja", "Cielo": "Céu", "Mandarina": "Tangerina", "Sandía": "Melancia", "Noche": "Noite", "Lila": "Lilás", "Verano": "Verão" },
  };
  function nombrarTemas() {
    if (typeof PRESETS === "undefined") return;
    PRESETS.forEach(function (p) {
      if (!p.labelEs) p.labelEs = p.label;
      var base = p.labelEs;
      if (p.pase) { var T = TEMPORADAS.filter(function (x) { return x.id === p.pase; })[0]; if (T) { p.label = T.nombre[state.lang] || T.nombre.es; return; } }
      p.label = (NOMBRES_TEMA[state.lang] || {})[base] || base;
    });
  }
  nombrarTemas();
  var idiomaTemas = window.setLanguage;
  if (typeof idiomaTemas === "function") window.setLanguage = function () { var r = idiomaTemas.apply(this, arguments); nombrarTemas(); return r; };
  // Los 30 premios: semillas y comodines, un accesorio cada 5, y los exclusivos en el 10 y el 30.
  function premios(T) {
    var lista = [
      { s: 10 }, { i: "hint" }, { s: 15 }, { i: "joker" }, { a: T.acc[0] }, { s: 20 }, { i: "reroll" }, { i: "freeze" }, { s: 20 }, { icono: T.icono },
      { s: 20 }, { i: "clock" }, { i: "hint" }, { s: 25 }, { a: T.acc[1] }, { i: "joker" }, { s: 25 }, { i: "shield" }, { i: "freeze" }, { a: T.acc[2] },
      { s: 25 }, { i: "hint" }, { i: "reroll" }, { s: 30 }, { a: T.acc[3] }, { i: "joker" }, { s: 30 }, { i: "freeze" }, { s: 35 }, { tema: T.tema, s: 60 },
    ];
    return lista;
  }
  function fechaDe(k) { var p = k.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  APP.temporadaActual = function () {
    var hoy = dayKey();
    return TEMPORADAS.filter(function (T) { return hoy >= T.desde && hoy <= T.hasta; })[0] || null;
  };
  function datos(T) {
    var t = getProgress().temporada;
    if (!t || t.id !== T.id) t = { id: T.id, xp: 0 };
    return t;
  }
  // Premios ya cobrados. Se guardan también en progress.temporada.cobrados: la lista "counted" solo
  // conserva las últimas 80 marcas y, jugando mucho, las del pase se borraban y el premio se podía volver a cobrar.
  function cobrados(T) {
    var p = getProgress(), c = p.counted || [];
    var propios = p.temporada && p.temporada.id === T.id && Array.isArray(p.temporada.cobrados) ? p.temporada.cobrados : [];
    var lista = [];
    for (var n = 1; n <= TOTAL; n++) if (propios.indexOf(n) >= 0 || c.indexOf("pase:" + T.id + ":" + n) >= 0) lista.push(n);
    return lista;
  }
  // XP que pide cada premio: sin "xp" en la temporada, 100 cada uno; con xp: [a, b, c], a los premios 1-10,
  // b los 11-20 y c los 21-30 (igual que en la app, app-temporada.js).
  function costo(T, n) { var e = T.xp || [XP_POR_PREMIO]; return e[Math.min(e.length - 1, Math.floor((n - 1) / 10))]; }
  function hasta(T, n) { var s = 0; for (var k = 1; k <= n; k++) s += costo(T, k); return s; }
  function alcanzados(T) { var xp = datos(T).xp, n = 0; while (n < TOTAL && xp >= hasta(T, n + 1)) n++; return n; }
  APP.paseParaCobrar = function () {
    var T = APP.temporadaActual();
    if (!T) return 0;
    return alcanzados(T) - cobrados(T).length;
  };

  // La XP que se gana jugando también suma para el pase.
  var xpOriginal = window.appXpGanada;
  window.appXpGanada = function (n) {
    if (xpOriginal) xpOriginal.apply(this, arguments);
    var T = APP.temporadaActual();
    if (!T || !(n > 0)) return;
    var antes = alcanzados(T);
    bumpProgress(function (p) {
      var t = p.temporada && p.temporada.id === T.id ? p.temporada : { id: T.id, xp: 0 };
      t.xp += n;
      p.temporada = t;
    });
    if (alcanzados(T) > antes && window.appRenderInicio) appRenderInicio();
  };

  // ---------- Cobrar un premio ----------
  function nombreTema(key) { var p = PRESETS.filter(function (x) { return x.key === key; })[0]; return p ? p.label : key; }
  function textoPremio(p, T) {
    if (p.tema) return tx("tema", { n: nombreTema(p.tema) }) + " + " + tx("semillas", { n: p.s });
    if (p.icono) return tx("icono", { n: T.nombre[state.lang] || T.nombre.es });
    if (p.a) return t("acc_" + p.a);
    if (p.i) return tx(p.i);
    return tx("semillas", { n: p.s });
  }
  function dibujoPremio(p) {
    if (p.tema) { var pr = PRESETS.filter(function (x) { return x.key === p.tema; })[0]; return '<span class="aj-muestra" style="background:' + pr.color + ";--fondo:" + BG_COLOR[pr.bg] + '"></span>'; }
    if (p.icono) return '<img class="tp-icono-app" src="/juego/iconos/' + p.icono + '.png" alt="">';
    if (p.a) { var eq = {}; var item = ACCESSORY_ITEMS.filter(function (x) { return x.id === p.a; })[0]; if (item) eq[item.slot] = p.a; return mascotSvg("happy", getMyAvatar(), eq); }
    if (p.i === "hint") return iconSvg("sun");
    if (p.i === "reroll") return iconSvg("dice");
    if (p.i === "clock") return iconSvg("stopwatch");
    if (p.i === "shield") return SHIELD_SVG;
    if (p.i === "joker") return '<span class="rg-emoji">' + iconSvg("comodin") + "</span>";
    if (p.i === "freeze") return '<span class="rg-emoji">' + iconSvg("hielo") + '</span>';
    return seedIcon();
  }
  window.appCobrarPase = function (n) {
    var T = APP.temporadaActual();
    if (!T || n > alcanzados(T)) return;
    var clave = "pase:" + T.id + ":" + n;
    if (cobrados(T).indexOf(n) >= 0) return;
    bumpProgress(function (p) {
      var t = p.temporada && p.temporada.id === T.id ? p.temporada : { id: T.id, xp: 0 };
      t.cobrados = (Array.isArray(t.cobrados) ? t.cobrados : []).concat([n]);
      p.temporada = t;
    }, clave);
    var p = premios(T)[n - 1];
    var w = getWallet();
    if (p.i) w.items[p.i] = (w.items[p.i] || 0) + 1;
    if (p.a) {
      var item = ACCESSORY_ITEMS.filter(function (x) { return x.id === p.a; })[0];
      if (item && !w.owned.includes(accOwnedKey(p.a))) w.owned.push(accOwnedKey(p.a));
      else p = { s: 25 }; // si ya lo tenías, semillas
    }
    if (p.icono && !w.owned.includes("icon:" + p.icono)) w.owned.push("icon:" + p.icono);
    if (p.tema && !w.owned.includes("theme:" + p.tema)) w.owned.push("theme:" + p.tema);
    saveWallet(w);
    if (p.s) addSeeds(p.s);
    launchConfetti();
    if (APP.evento) APP.evento("pase_premio", { temporada: T.id, premio: n });
    refreshMyFruit();
    render();
    if (window.appRenderInicio) appRenderInicio();
  };

  // ---------- Pantalla ----------
  var pantalla = document.createElement("div");
  pantalla.className = "screen";
  pantalla.id = "screen-temporada";
  pantalla.innerHTML = '<div class="wrap app-temporada" id="temporadaCont"></div>';
  document.body.appendChild(pantalla);
  var cont = pantalla.querySelector("#temporadaCont");

  window.appSegmentosTemporada = function (activo) {
    return '<div class="screen-back-row"><button type="button" class="lobby-back" onclick="appIrAInicio()"><span aria-hidden="true">←</span> ' + esc(tx("volver")) + "</button></div>" +
      appSolapasTemporada(activo);
  };
  // Solo las solapas (la pantalla de la liga ya trae su botón de volver).
  window.appSolapasTemporada = function (activo) {
    var html = '<div class="aj-segmentos tp-seg">' +
      '<button type="button" class="aj-seg' + (activo === "pase" ? " activo" : "") + '" onclick="appAbrirTemporada()">' + esc(tx("pase")) + (APP.paseParaCobrar() > 0 ? ' <span class="tp-punto"></span>' : "") + "</button>" +
      '<button type="button" class="aj-seg' + (activo === "liga" ? " activo" : "") + '" onclick="appAbrirLiga()">' + esc(tx("liga")) + "</button></div>";
    html = window.appSolapaCopa ? appSolapaCopa(html, activo) : html;
    // (16/11, igual que la app) El "?" al lado de las solapas explica cómo funciona la Temporada.
    return '<div class="tp-seg-fila">' + html + '<button type="button" class="tp-ayuda" onclick="appExplicarTemporada()" aria-label="' + esc(tx("ayuda")) + '">?</button></div>';
  };

  function render() {
    var T = APP.temporadaActual();
    var html = appSegmentosTemporada("pase");
    if (!T) { cont.innerHTML = html + '<div class="lg-vacio">' + esc(tx("pronto")) + "</div>"; return; }
    var d = datos(T), hechos = cobrados(T), llegaste = alcanzados(T);
    var dias = Math.round((fechaDe(T.hasta) - fechaDe(dayKey())) / 86400000);
    var lista = premios(T);
    var enNivel = d.xp - hasta(T, llegaste), proximo = costo(T, llegaste + 1);
    html += '<div class="tp-cabecera"><span class="tp-emoji">' + iconSvg(T.emoji) + '</span><div><h1>' + esc(tx("titulo", { t: T.nombre[state.lang] || T.nombre.es })) + "</h1>" +
      "<small>" + esc(dias > 0 ? tx("termina", { n: dias }) : tx("termina_hoy")) + "</small></div></div>" +
      '<div class="tp-progreso"><strong class="tp-jugar">' + esc(tx("jugar")) + "</strong>" +
      '<ol class="tp-pasos"><li>' + esc(tx("paso1")) + "</li><li>" + esc(tx("paso2")) + "</li><li>" + esc(tx("paso3")) + "</li></ol>" +
      '<div class="tp-progreso-fila"><span>' + esc(tx("ganados", { n: llegaste, t: TOTAL })) + "</span><small>" +
      esc(llegaste >= TOTAL ? tx("completo") : tx("faltan", { n: miles(proximo - enNivel) })) + '</small></div>' +
      '<span class="ah-barra"><span style="width:' + (llegaste >= TOTAL ? 100 : Math.round(100 * enNivel / proximo)) + '%"></span></span></div>' +
      '<h2 class="ah-titulo-seccion tp-especiales-titulo">' + esc(tx("especiales")) + "</h2>" +
      '<p class="tp-especiales-sub">' + esc(tx("especiales_sub")) + "</p>" +
      '<div class="tp-exclusivos">' + lista.map(function (p, i) { return { p: p, n: i + 1 }; }).filter(function (x) { return x.p.icono || x.p.tema; }).map(function (x) {
        var n = x.n, cobrado = hechos.indexOf(n) >= 0, abierto = n <= llegaste;
        var estado = cobrado ? tx("tuyo") : abierto ? tx("listo") : tx("faltan", { n: miles(hasta(T, n) - d.xp) });
        return '<button type="button" class="tp-especial' + (cobrado ? " cobrado" : abierto ? " listo" : "") + '" data-premio="' + n + '">' +
          '<span class="tp-chip">' + esc(tx("premio_n", { n: n })) + "</span>" +
          '<span class="tp-esquina">' + (cobrado ? "✓" : abierto ? "" : iconSvg("candado")) + "</span>" +
          dibujoPremio(x.p.tema ? { tema: x.p.tema } : x.p) +
          "<strong>" + esc(tx(x.p.tema ? "tema_corto" : "icono_corto")) + "</strong><small>" + esc(estado) + "</small></button>";
      }).join("") + "</div>" +
      '<div class="tp-camino">' + lista.map(function (p, i) {
        var n = i + 1, cobrado = hechos.indexOf(n) >= 0, abierto = n <= llegaste;
        var especial = p.icono || p.tema || p.a;
        return '<div class="tp-fila' + (cobrado ? " cobrado" : abierto ? " listo" : "") + (especial ? " especial" : "") + '" id="tpFila' + n + '" data-premio="' + n + '">' +
          '<span class="tp-num">' + n + "</span>" +
          '<span class="tp-dibujo">' + dibujoPremio(p) + "</span>" +
          '<span class="tp-texto">' + esc(textoPremio(p, T)) + "</span>" +
          (cobrado ? '<span class="tp-ok">✓</span>' : abierto ? '<button type="button" class="tp-cobrar" onclick="appCobrarPase(' + n + ')">' + esc(tx("cobrar")) + "</button>" 
            : '<span class="tp-falta" aria-label="' + esc(tx("bloqueado")) + '">' + iconSvg("candado") + "<small>" + esc(tx("falta_fila", { n: miles(hasta(T, n) - d.xp) })) + "</small></span>") +
          "</div>";
      }).join("") + "</div>";
    cont.innerHTML = html;
  }
  // Tocar un premio (una fila o un especial) explica qué es y cuándo se gana.
  function descripcion(p) {
    var w = getWallet(), items = w.items || {};
    if (p.tema) return tx("d_tema") + " " + tx("d_solo");
    if (p.icono) return tx("d_icono") + " " + tx("d_solo");
    if (p.a) return tx("d_acc");
    if (p.i === "freeze") return tx("d_freeze");
    if (p.i === "joker") return t("shop_joker_desc", { pts: typeof JOKER_POINTS !== "undefined" ? JOKER_POINTS : 5, n: items.joker || 0 });
    if (p.i === "clock") return t("shop_clock_desc", { s: typeof CLOCK_SECONDS !== "undefined" ? CLOCK_SECONDS : 15, n: items.clock || 0 });
    if (p.i) return t("shop_" + p.i + "_desc", { n: items[p.i] || 0 });
    return tx("d_semillas");
  }
  function verPremio(n) {
    var T = APP.temporadaActual();
    if (!T || !APP.abrirHoja) return;
    var p = premios(T)[n - 1], d = datos(T);
    if (!p) return;
    var cobrado = cobrados(T).indexOf(n) >= 0, abierto = n <= alcanzados(T);
    var estado = cobrado ? tx("premio_n", { n: n }) + " · " + tx("tuyo") : abierto ? tx("premio_n", { n: n }) + " · " + tx("listo") : tx("d_cuando", { n: n, x: miles(hasta(T, n) - d.xp) });
    var h = APP.abrirHoja('<div class="tp-hoja-premio"><span class="tp-hoja-dibujo">' + dibujoPremio(p) + "</span>" +
      "<h2>" + esc(textoPremio(p, T)) + "</h2><p>" + esc(APP.numeros(descripcion(p))) + '</p><p class="tp-hoja-estado">' + esc(estado) + "</p></div>" +
      '<div class="confirm-actions"><button type="button" class="btn btn-primary" data-r="' + (abierto && !cobrado ? "cobrar" : "ok") + '">' +
      esc(abierto && !cobrado ? tx("cobrar") : tx("entendido")) + "</button></div>");
    h.tarjeta.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-r]");
      if (!b) return;
      h.cerrar();
      if (b.getAttribute("data-r") === "cobrar") appCobrarPase(n);
    });
  }
  cont.addEventListener("click", function (ev) {
    if (ev.target.closest(".tp-cobrar")) return;
    var f = ev.target.closest("[data-premio]");
    if (f) verPremio(+f.getAttribute("data-premio"));
  });
  // La hoja que explica la Temporada (el "?" de Premios, Liga y Copa).
  var EXPLICA = {
    es: ["Temporada: tres formas de ganar premios", [["Premios", "30 premios gratis que se abren con la XP que ganás jugando cualquier modo. Los especiales solo se ganan esta temporada."], ["Liga", "Cada semana competís por XP con hasta 20 jugadores: los primeros suben de liga y ganan semillas."], ["Copa", "8 rivales de Frutibot, uno tras otro, con 3 vidas. Si los ganás a todos, te llevás la copa de la semana."]], "Entendido"],
    en: ["Season: three ways to win prizes", [["Rewards", "30 free rewards you unlock with the XP you earn playing any mode. The special ones can only be won this season."], ["League", "Every week you compete for XP with up to 20 players: the top ones move up a league and win seeds."], ["Cup", "8 Frutibot rivals, one after another, with 3 lives. Beat them all and you win this week's cup."]], "Got it"],
    pt: ["Temporada: três jeitos de ganhar prêmios", [["Prêmios", "30 prêmios grátis que você libera com a XP que ganha jogando qualquer modo. Os especiais só dá para ganhar nesta temporada."], ["Liga", "Toda semana você disputa XP com até 20 jogadores: os primeiros sobem de liga e ganham sementes."], ["Copa", "8 rivais do Frutibot, um depois do outro, com 3 vidas. Se vencer todos, leva a copa da semana."]], "Entendi"],
  };
  window.appExplicarTemporada = function () {
    if (!APP.abrirHoja) return;
    var e = EXPLICA[state.lang] || EXPLICA.es;
    function tu(x) { return APP.numeros(APP.tu ? APP.tu(x) : x); }
    var h = APP.abrirHoja("<h2>" + esc(tu(e[0])) + '</h2><ul class="tp-explica">' + e[1].filter(function (p, i) { return i < 2 || window.appAbrirCopa; }).map(function (p) {
      return "<li><strong>" + esc(p[0]) + "</strong> " + esc(tu(p[1])) + "</li>";
    }).join("") + '</ul><div class="confirm-actions"><button type="button" class="btn btn-primary" data-r="ok">' + esc(e[2]) + "</button></div>");
    h.tarjeta.addEventListener("click", function (ev) { if (ev.target.closest("[data-r]")) h.cerrar(); });
  };
  window.appAbrirTemporada = function () {
    render();
    showScreen("screen-temporada");
    // Abre arriba de todo (antes bajaba sola hasta el próximo premio y se sentía raro).
    window.scrollTo(0, 0);
  };

  // ---------- Botón en la pantalla de modos ----------
  // Un solo botón "Temporada" junta el pase, la liga y la Copa Frutibot (así la pantalla de modos queda más simple).
  function banner() {
    var b = APP.banner("temporadaBanner", "pase-banner", function () { appAbrirTemporada(); }, "streakBanner");
    if (!b) return;
    var T = APP.temporadaActual();
    var cobrar = T ? APP.paseParaCobrar() : 0;
    var partes = [];
    var liga = document.getElementById("leagueBannerTitle");
    if (liga && liga.textContent) partes.push(liga.textContent);
    if (APP.copaResumen) partes.push(APP.copaResumen());
    if (T) partes.push(tx("pase") + " " + alcanzados(T) + "/" + TOTAL);
    b.classList.toggle("has-news", cobrar > 0);
    b.pintar(T ? iconSvg(T.emoji) : iconSvg("trophy"), T ? tx("titulo", { t: T.nombre[state.lang] || T.nombre.es }) : tx("tab"),
      esc(cobrar > 0 ? (cobrar === 1 ? tx("para_cobrar_1") : tx("para_cobrar", { n: cobrar })) : partes.join(" · ")));
  }
  APP.alPintarInicio(banner);
  banner();
})();
