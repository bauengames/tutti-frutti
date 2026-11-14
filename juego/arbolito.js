/* tutti.frutti · web (igual que app-arbolito.js de la app) · "Decorá tu arbolito" (Navidad, mientras dura isXmasSeason: del 1/12 al 6/1).
   Para que la Navidad también te traiga a jugar:
   - Botón en la pantalla de modos con tu arbolito. Cada día que terminás al menos una partida (cualquier modo) se cuelga un
     adorno (uno por día): bola roja, bola dorada, bastón, campanita, regalito, moño, bola azul, copo de nieve,
     galletita de jengibre y media navideña.
   - Con 5 adornos: PREMIO_5 semillas. Con 10: la Estrella de Navidad para tu fruta (accesorio que no se vende;
     el dibujo está en fruits.js) y PREMIO_10 semillas, y la estrella se prende arriba del arbolito.
   - "Compartir mi arbolito": una imagen con tu arbolito decorado y tu fruta para mandar por WhatsApp.
   - "Jugar una partida": contra Frutibot con categorías navideñas.
   El avance va en el progreso del jugador (progress.arbolito = { temp, dias, premio5, premio10 }), que se
   sincroniza con la cuenta; con dos teléfonos se juntan los días. "temp" es el año en que empezó la Navidad (la
   del 6 de enero sigue siendo la del año anterior). Se carga después de juego/navidad.js. */
(function () {
  var META = 10, MITAD = 5, PREMIO_5 = 50, PREMIO_10 = 100;
  var CATEGORIAS = ["Algo de Navidad", "Comida navideña", "Algo para regalar", "Juguete", "Nombre", "Animal", "Color", "Fruta"];
  var TEXTOS = {
    es: {
      titulo: "Navidad", tarjeta: "Decorá tu arbolito", tarjeta_lista: "¡Arbolito completo!",
      explica: "Cada día que jugás una partida colgás un adorno. Con {m}: {s} semillas. Con {n}: la Estrella para tu fruta y {s2} semillas.",
      hoy_listo: "¡Hoy ya colgaste uno! Volvé mañana por otro.", hoy_falta: "Hoy todavía no colgaste nada: terminá una partida.",
      progreso: "{n} de {m}", termina: "Hasta el 6 de enero", jugar: "Jugar una partida navideña", compartir: "Compartir mi arbolito",
      sumo: "Arbolito: {n} de {m} · Volvé mañana por otro adorno",
      p5_t: "¡Medio arbolito!", p5_b: "Ya colgaste {n} adornos: +{s} semillas. Con {m} te ganás la Estrella.",
      p10_t: "¡Arbolito completo!", p10_b: "Te ganaste la Estrella de Navidad para tu fruta y {s} semillas.", ponerla: "Ponérmela", listo: "¡Gracias!",
      acc_estrella: "Estrella de Navidad", limitado: "Premio de Navidad",
      sh_titulo: "Mi arbolito", sh_adornos: "{n} de {m} adornos", sh_completo: "¡Completo!", sh_pregunta: "¿Armás el tuyo?", sh_donde: "Gratis en iPhone y en la web",
      sh_texto: "¡Mirá mi arbolito en tutti.frutti! Cada día que jugás le colgás un adorno. ¿Armás el tuyo?",
    },
    en: {
      titulo: "Christmas", tarjeta: "Decorate your tree", tarjeta_lista: "Tree complete!",
      explica: "Every day you play a game you hang an ornament. At {m}: {s} seeds. At {n}: the Star for your fruit and {s2} seeds.",
      hoy_listo: "You already hung one today! Come back tomorrow for another.", hoy_falta: "Nothing hung today yet: finish a game.",
      progreso: "{n} of {m}", termina: "Until January 6", jugar: "Play a Christmas game", compartir: "Share my tree",
      sumo: "Tree: {n} of {m} · Come back tomorrow for another ornament",
      p5_t: "Halfway there!", p5_b: "You've hung {n} ornaments: +{s} seeds. Reach {m} to win the Star.",
      p10_t: "Tree complete!", p10_b: "You won the Christmas Star for your fruit and {s} seeds.", ponerla: "Put it on", listo: "Thanks!",
      acc_estrella: "Christmas star", limitado: "Christmas prize",
      sh_titulo: "My tree", sh_adornos: "{n} of {m} ornaments", sh_completo: "Complete!", sh_pregunta: "Will you make yours?", sh_donde: "Free on iPhone and on the web",
      sh_texto: "Look at my tree in tutti.frutti! Every day you play you hang an ornament. Will you make yours?",
    },
    pt: {
      titulo: "Natal", tarjeta: "Decore sua árvore", tarjeta_lista: "Árvore completa!",
      explica: "Cada dia em que você joga uma partida, pendura um enfeite. Com {m}: {s} sementes. Com {n}: a Estrela para sua fruta e {s2} sementes.",
      hoy_listo: "Hoje você já pendurou um! Volte amanhã para outro.", hoy_falta: "Hoje você ainda não pendurou nada: termine uma partida.",
      progreso: "{n} de {m}", termina: "Até 6 de janeiro", jugar: "Jogar uma partida de Natal", compartir: "Compartilhar minha árvore",
      sumo: "Árvore: {n} de {m} · Volte amanhã para outro enfeite",
      p5_t: "Meia árvore!", p5_b: "Você já pendurou {n} enfeites: +{s} sementes. Com {m} você ganha a Estrela.",
      p10_t: "Árvore completa!", p10_b: "Você ganhou a Estrela de Natal para sua fruta e {s} sementes.", ponerla: "Colocar", listo: "Valeu!",
      acc_estrella: "Estrela de Natal", limitado: "Prêmio de Natal",
      sh_titulo: "Minha árvore", sh_adornos: "{n} de {m} enfeites", sh_completo: "Completa!", sh_pregunta: "Vai montar a sua?", sh_donde: "Grátis no iPhone e na web",
      sh_texto: "Olha minha árvore no tutti.frutti! Cada dia que você joga, pendura um enfeite. Vai montar a sua?",
    },
    de: {
      titulo: "Weihnachten",
      tarjeta: "Schmück deinen Baum",
      tarjeta_lista: "Baum fertig!",
      explica: "An jedem Tag, an dem du ein Spiel spielst, hängst du eine Kugel auf. Bei {m}: {s} Samen. Bei {n}: der Stern für deine Frucht und {s2} Samen.",
      hoy_listo: "Heute hast du schon eine aufgehängt! Komm morgen wieder für die nächste.",
      hoy_falta: "Heute hängt noch nichts: Spiel eine Runde zu Ende.",
      progreso: "{n} von {m}",
      termina: "Bis 6. Januar",
      jugar: "Weihnachtsspiel spielen",
      compartir: "Meinen Baum teilen",
      sumo: "Baum: {n} von {m} · Komm morgen für die nächste Kugel wieder",
      p5_t: "Halb geschafft!",
      p5_b: "Du hast {n} Kugeln aufgehängt: +{s} Samen. Schaffst du {m}, gewinnst du den Stern.",
      p10_t: "Baum fertig!",
      p10_b: "Du hast den Weihnachtsstern für deine Frucht und {s} Samen gewonnen.",
      ponerla: "Aufsetzen",
      listo: "Danke!",
      acc_estrella: "Weihnachtsstern",
      limitado: "Weihnachtspreis",
      sh_titulo: "Mein Baum",
      sh_adornos: "{n} von {m} Kugeln",
      sh_completo: "Fertig!",
      sh_pregunta: "Schmückst du deinen auch?",
      sh_donde: "Kostenlos auf iPhone und im Web",
      sh_texto: "Schau dir meinen Baum in tutti.frutti an! An jedem Tag, an dem du spielst, hängst du eine Kugel auf. Schmückst du deinen auch?"
    },
    fr: {
      titulo: "Noël",
      tarjeta: "Décore ton sapin",
      tarjeta_lista: "Sapin terminé !",
      explica: "Chaque jour où tu joues une partie, tu accroches une boule. À {m} : {s} graines. À {n} : l'Étoile pour ton fruit et {s2} graines.",
      hoy_listo: "Tu en as déjà accroché une aujourd'hui ! Reviens demain pour la suivante.",
      hoy_falta: "Rien d'accroché aujourd'hui : termine une partie.",
      progreso: "{n} sur {m}",
      termina: "Jusqu'au 6 janvier",
      jugar: "Jouer une partie de Noël",
      compartir: "Partager mon sapin",
      sumo: "Sapin : {n} sur {m} · Reviens demain pour une autre boule",
      p5_t: "À mi-chemin !",
      p5_b: "Tu as accroché {n} boules : +{s} graines. Atteins {m} pour gagner l'Étoile.",
      p10_t: "Sapin terminé !",
      p10_b: "Tu as gagné l'Étoile de Noël pour ton fruit et {s} graines.",
      ponerla: "La mettre",
      listo: "Merci !",
      acc_estrella: "Étoile de Noël",
      limitado: "Prix de Noël",
      sh_titulo: "Mon sapin",
      sh_adornos: "{n} boules sur {m}",
      sh_completo: "Terminé !",
      sh_pregunta: "Tu fais le tien ?",
      sh_donde: "Gratuit sur iPhone et sur le web",
      sh_texto: "Regarde mon sapin dans tutti.frutti ! Chaque jour où tu joues, tu accroches une boule. Tu fais le tien ?"
    },
    it: {
      titulo: "Natale",
      tarjeta: "Decora il tuo albero",
      tarjeta_lista: "Albero completo!",
      explica: "Ogni giorno in cui giochi una partita appendi una pallina. A {m}: {s} semi. A {n}: la Stella per il tuo frutto e {s2} semi.",
      hoy_listo: "Oggi ne hai già appesa una! Torna domani per la prossima.",
      hoy_falta: "Oggi non hai ancora appeso niente: finisci una partita.",
      progreso: "{n} di {m}",
      termina: "Fino al 6 gennaio",
      jugar: "Gioca una partita di Natale",
      compartir: "Condividi il mio albero",
      sumo: "Albero: {n} di {m} · Torna domani per un'altra pallina",
      p5_t: "A metà strada!",
      p5_b: "Hai appeso {n} palline: +{s} semi. Arriva a {m} per vincere la Stella.",
      p10_t: "Albero completo!",
      p10_b: "Hai vinto la Stella di Natale per il tuo frutto e {s} semi.",
      ponerla: "Mettila",
      listo: "Grazie!",
      acc_estrella: "Stella di Natale",
      limitado: "Premio di Natale",
      sh_titulo: "Il mio albero",
      sh_adornos: "{n} palline su {m}",
      sh_completo: "Completo!",
      sh_pregunta: "Fai anche il tuo?",
      sh_donde: "Gratis su iPhone e sul web",
      sh_texto: "Guarda il mio albero su tutti.frutti! Ogni giorno in cui giochi appendi una pallina. Fai anche il tuo?"
    },
  };
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave;
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return APP.numeros(str);
  }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }
  Object.keys(TEXTOS).forEach(function (lang) {
    if (!I18N[lang]) return;
    I18N[lang].acc_estrella = TEXTOS[lang].acc_estrella;
    I18N[lang].shop_limited_arbolito = TEXTOS[lang].limitado;
  });

  // En la web no hay APP.cuandoTranquilo: los premios salen un momento después (no encima del resultado que aparece).
  if (!APP.cuandoTranquilo) APP.cuandoTranquilo = function (fn) { setTimeout(fn, 1500); };

  // ---------- Cuándo ----------
  var forzado = false;
  function activo() { return forzado || (typeof isXmasSeason === "function" && isXmasSeason()); }
  function temporada(date) { date = date || new Date(); return String(date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear()); }

  // ---------- La Estrella: premio, no se vende ----------
  if (!ACCESSORY_ITEMS.some(function (x) { return x.id === "estrella"; })) ACCESSORY_ITEMS.push({ id: "estrella", slot: "hat", price: 0, season: "arbolito_premio" });
  var venderAntes = window.accForSale;
  window.accForSale = function (a) { return a && a.season === "arbolito_premio" ? false : venderAntes.apply(this, arguments); };

  // ---------- Los adornos y el arbolito (dibujos, en un arbolito de 200 x 240) ----------
  // Bolas con volumen: sombra abajo a la derecha y brillo arriba a la izquierda.
  function bola(c) {
    return '<circle cx="1" cy="1.5" r="8.5" fill="#000" opacity=".22"/><circle r="8.5" fill="' + c + '"/>' +
      '<path d="M8.2 2 A8.5 8.5 0 0 1 -6 6" stroke="#000" stroke-width="3" fill="none" opacity=".15"/>' +
      '<rect x="-3" y="-11.5" width="6" height="4" rx="1" fill="#E8C14A"/><ellipse cx="-3.2" cy="-3.4" rx="2.6" ry="3.4" transform="rotate(35 -3.2 -3.4)" fill="#fff" opacity=".6"/>';
  }
  var ADORNOS = [
    bola("#E23A4E"), bola("#FFD23F"),
    '<path d="M2 10 V-3 C2 -10 -6 -10 -6 -3" stroke="#fff" stroke-width="4.2" fill="none" stroke-linecap="round"/><path d="M2 10 V-3 C2 -10 -6 -10 -6 -3" stroke="#E23A4E" stroke-width="4.2" fill="none" stroke-dasharray="3 3"/>',
    '<path d="M-8 6 C-8 -2 -6 -9 0 -9 C6 -9 8 -2 8 6 Z" fill="#FFD23F"/><rect x="-9.5" y="5" width="19" height="3.4" rx="1.7" fill="#E8A400"/><circle cy="10.5" r="2.4" fill="#E8A400"/>',
    '<rect x="-8" y="-6" width="16" height="14" rx="2" fill="#9C6BFF"/><rect x="-1.5" y="-6" width="3" height="14" fill="#FFD23F"/><rect x="-8" y="-1" width="16" height="3" fill="#FFD23F"/><path d="M0 -6 C-6 -12 -8 -6 0 -6 C8 -6 6 -12 0 -6 Z" fill="#FFD23F"/>',
    '<path d="M0 0 L-9.5 -6 L-9.5 6 Z M0 0 L9.5 -6 L9.5 6 Z" fill="#E23A4E"/><circle r="2.8" fill="#B02236"/><path d="M-1 1 L-5 10 M1 1 L5 10" stroke="#E23A4E" stroke-width="2.6" stroke-linecap="round"/>',
    bola("#35C8F2"),
    '<g stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M-9 0 H9"/><path d="M-4.5 -7.8 L4.5 7.8"/><path d="M-4.5 7.8 L4.5 -7.8"/></g><circle r="2.2" fill="#fff"/>',
    '<circle cy="-6" r="4.6" fill="#B97A3E"/><path d="M-3 -2 H3 L8 3 L5.5 5.5 L3 3 V7 L5.5 11 L2 12 L0 8 L-2 12 L-5.5 11 L-3 7 V3 L-5.5 5.5 L-8 3 Z" fill="#B97A3E"/><g fill="#fff"><circle cx="-1.6" cy="-7" r=".9"/><circle cx="1.6" cy="-7" r=".9"/><circle cy="1" r=".9"/><circle cy="4.5" r=".9"/></g>',
    '<path d="M-5 -8 H4 V3 L9 6 C10 9.5 7 11.5 3.5 10.5 L-3 6.5 C-6 4.5 -5 1 -5 -2 Z" fill="#E23A4E"/><rect x="-6.5" y="-11" width="12" height="4.4" rx="1.6" fill="#fff"/>',
  ];
  // Dónde va cada adorno, en el orden en que se cuelgan.
  var LUGARES = [[100, 76], [84, 108], [118, 104], [68, 128], [100, 124], [132, 129], [58, 174], [88, 168], [116, 174], [146, 178]];
  // El arbolito, con volumen: cada piso más claro de un lado, nieve en las puntas, guirnalda de lucecitas que
  // brillan, sombra del piso de arriba sobre el de abajo y estrella con resplandor cuando está completo.
  // Los degradés llevan un id propio por dibujo (en la pantalla puede haber más de un arbolito a la vez).
  var arbolId = 0;
  var LUCES = [[[74, 86], [88, 90.5], [102, 92], [116, 90], [128, 85]],
    [[56, 136], [74, 142.5], [92, 145.5], [110, 145.5], [128, 142.5], [146, 136]],
    [[42, 189], [62, 195.5], [84, 199], [106, 200], [128, 198], [148, 193.5], [162, 188]]];
  var COLORES_LUZ = ["#FFD23F", "#FF5E5B", "#35C8F2", "#B6EF3C"];
  function arbolSvg(n) {
    var completo = n >= META, k = ++arbolId, g = "arG" + k, sh = "arS" + k, st = "arE" + k, tr = "arT" + k;
    var s = '<svg viewBox="0 0 200 240" aria-hidden="true" focusable="false"><defs>' +
      '<linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4DD07E"/><stop offset=".55" stop-color="#26A158"/><stop offset="1" stop-color="#157040"/></linearGradient>' +
      '<linearGradient id="' + sh + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B4A28" stop-opacity=".55"/><stop offset="1" stop-color="#0B4A28" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="' + st + '"><stop offset="0" stop-color="#FFF6C2"/><stop offset=".6" stop-color="#FFD23F"/><stop offset="1" stop-color="#F5A800"/></radialGradient>' +
      '<linearGradient id="' + tr + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9A6232"/><stop offset=".5" stop-color="#7A4A26"/><stop offset="1" stop-color="#5A3418"/></linearGradient>' +
      "</defs>" +
      // Tronco
      '<rect x="89" y="192" width="22" height="30" rx="3" fill="url(#' + tr + ')"/>' +
      // Pisos (de abajo hacia arriba), con base curva; sombra del piso de arriba sobre cada uno; mitad derecha más oscura.
      '<path d="M100 104 L28 190 Q100 210 172 190 Z" fill="url(#' + g + ')"/><path d="M100 104 L100 205 Q140 202 172 190 Z" fill="#000" opacity=".12"/><path d="M58 146 Q100 160 142 146 L132 160 Q100 168 68 160 Z" fill="url(#' + sh + ')"/>' +
      '<path d="M100 58 L42 140 Q100 156 158 140 Z" fill="url(#' + g + ')"/><path d="M100 58 L100 152 Q132 150 158 140 Z" fill="#000" opacity=".12"/><path d="M68 92 Q100 103 132 92 L124 104 Q100 111 76 104 Z" fill="url(#' + sh + ')"/>' +
      '<path d="M100 22 L60 88 Q100 101 140 88 Z" fill="url(#' + g + ')"/><path d="M100 22 L100 97 Q122 95 140 88 Z" fill="#000" opacity=".12"/>' +
      // Nieve en el borde de cada piso
      '<g fill="#F4F8FF">' +
      '<path d="M28 190 Q100 210 172 190 Q170 196 164 195 Q158 201 150 197 Q142 204 132 199 Q122 206 112 201 Q102 207 92 201 Q82 206 72 199 Q62 204 54 197 Q46 201 38 195 Q31 196 28 190 Z"/>' +
      '<path d="M42 140 Q100 156 158 140 Q156 146 150 145 Q143 151 134 146 Q125 153 114 148 Q104 154 94 148 Q84 153 74 147 Q64 151 56 145 Q48 147 42 140 Z"/>' +
      '<path d="M60 88 Q100 101 140 88 Q138 93 132 92 Q125 98 116 93 Q107 99 98 94 Q89 99 80 93 Q72 97 66 92 Q62 93 60 88 Z"/></g>' +
      // Guirnaldas y lucecitas
      '<g stroke="#E8C14A" stroke-width="1.4" fill="none" opacity=".8"><path d="M70 85 C88 94 114 93 132 83"/><path d="M52 134 C78 148 122 148 150 134"/><path d="M38 186 C76 202 128 202 166 186"/></g>';
    var c = 0;
    LUCES.forEach(function (fila) {
      fila.forEach(function (p) {
        var col = COLORES_LUZ[c++ % COLORES_LUZ.length];
        s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4.6" fill="' + col + '" opacity=".28"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.1" fill="' + col + '"/>' +
          '<circle cx="' + (p[0] - 0.7) + '" cy="' + (p[1] - 0.7) + '" r=".8" fill="#fff" opacity=".8"/>';
      });
    });
    LUGARES.forEach(function (l, i) {
      s += i < n ? '<g transform="translate(' + l[0] + " " + l[1] + ')">' + ADORNOS[i] + "</g>"
        : '<circle cx="' + l[0] + '" cy="' + l[1] + '" r="7.5" fill="#0B4A28" fill-opacity=".25" stroke="#FFF3E2" stroke-width="1.6" stroke-dasharray="3 3" stroke-opacity=".5"/>';
    });
    var estrella = "M100 4 L106 17 L120 18.5 L109.5 28 L112.5 42 L100 35 L87.5 42 L90.5 28 L80 18.5 L94 17 Z";
    s += completo
      ? '<circle cx="100" cy="24" r="24" fill="#FFD23F" opacity=".22"/><circle cx="100" cy="24" r="15" fill="#FFE780" opacity=".3"/>' +
        '<path d="' + estrella + '" fill="url(#' + st + ')" stroke="#E8A400" stroke-width="1.8" stroke-linejoin="round"/><path d="M96 14 L100 6 L103 13" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7" stroke-linecap="round"/>'
      : '<path d="' + estrella + '" fill="#FFF3E2" fill-opacity=".08" stroke="#FFF3E2" stroke-width="1.8" stroke-dasharray="3 3" stroke-linejoin="round" stroke-opacity=".55"/>';
    return s + "</svg>";
  }
  APP.arbolSvg = arbolSvg;

  // ---------- Progreso (en la cuenta) ----------
  function leer() {
    var p = getProgress(), d = p.arbolito, t = temporada();
    if (!d || d.temp !== t) d = { temp: t, dias: [], premio5: false, premio10: false };
    d.dias = (d.dias || []).slice(0, META);
    d.n = d.dias.length;
    return d;
  }
  function guardar(d) { bumpProgress(function (p) { p.arbolito = { temp: d.temp, dias: d.dias.slice(0, META), premio5: !!d.premio5, premio10: !!d.premio10 }; }); }
  var juntarAntes = window.mergeSyncValue;
  if (typeof juntarAntes === "function") window.mergeSyncValue = function (key, localRaw, remoteRaw) {
    var r = juntarAntes.apply(this, arguments);
    if (key !== "tuttifruti_progress") return r;
    try {
      var L = JSON.parse(localRaw || "null"), R = JSON.parse(remoteRaw || "null"), out = JSON.parse(r || "null");
      var a = L && L.arbolito, b = R && R.arbolito;
      if (!out || (!a && !b)) return r;
      if (!a || !b || a.temp !== b.temp) out.arbolito = !a ? b : !b ? a : (a.temp > b.temp ? a : b);
      else {
        var dias = [];
        (a.dias || []).concat(b.dias || []).forEach(function (x) { if (dias.indexOf(x) < 0) dias.push(x); });
        out.arbolito = { temp: a.temp, dias: dias.slice(0, META), premio5: !!(a.premio5 || b.premio5), premio10: !!(a.premio10 || b.premio10) };
      }
      return JSON.stringify(out);
    } catch (e) { return r; }
  };

  // ---------- Premios ----------
  function premio(d) {
    var w = getWallet();
    if (d.n >= MITAD && !d.premio5) {
      d.premio5 = true; guardar(d);
      w.seeds += PREMIO_5; saveWallet(w);
      if (APP.evento) APP.evento("arbolito_premio", { adornos: MITAD });
      APP.cuandoTranquilo(function () { // (10/11) no encima de las estrellas ni del podio del final
        APP.abrirHoja('<div class="ar-premio">' + arbolSvg(d.n) + "</div><h2>" + esc(tx("p5_t")) + "</h2><p>" + esc(tx("p5_b", { n: MITAD, s: PREMIO_5, m: META })) + "</p>", "ar-hoja");
        if (window.launchConfetti) launchConfetti();
      });
    }
    if (d.n >= META && !d.premio10) {
      d.premio10 = true; guardar(d);
      w = getWallet();
      if (w.owned.includes(accOwnedKey("estrella"))) { tarjeta(); return; } // ya la cobró en otro teléfono
      w.owned.push(accOwnedKey("estrella"));
      w.seeds += PREMIO_10; saveWallet(w);
      if (APP.evento) APP.evento("arbolito_premio", { adornos: META });
      APP.cuandoTranquilo(function () { // (10/11) no encima de las estrellas ni del podio del final
        var h = APP.abrirHoja('<div class="ar-premio">' + mascotSvg("happy", getMyAvatar(), Object.assign({}, myEquipped(), { hat: "estrella" })) + "</div>" +
          "<h2>" + esc(tx("p10_t")) + "</h2><p>" + esc(tx("p10_b", { s: PREMIO_10 })) + "</p>" +
          '<button type="button" class="btn btn-primary btn-block ar-ponerla">' + esc(tx("ponerla")) + "</button>", "ar-hoja");
        h.tarjeta.querySelector(".ar-ponerla").addEventListener("click", function () {
          if (myEquipped().hat !== "estrella" && window.toggleAccessory) toggleAccessory("estrella");
          h.cerrar(); tarjeta();
        });
        if (window.launchConfetti) launchConfetti();
      });
    }
    if (window.renderShopButton) renderShopButton();
  }
  // Una vez por día: la primera partida que terminás.
  var terminadaAntes = APP.partidaTerminada;
  APP.partidaTerminada = function () {
    var r = terminadaAntes ? terminadaAntes.apply(this, arguments) : undefined;
    try {
      if (activo()) {
        var d = leer(), hoy = dayKey();
        if (d.n < META && d.dias.indexOf(hoy) < 0) {
          d.dias.push(hoy); d.n = d.dias.length; guardar(d);
          if (d.n !== MITAD && d.n < META) seedToast(tx("sumo", { n: d.n, m: META }));
          premio(d);
          tarjeta();
        }
      }
    } catch (e) { console.error(e); }
    return r;
  };

  // ---------- Hoja con el arbolito ----------
  window.appArbolito = function () {
    var d = leer();
    var h = APP.abrirHoja(
      '<p class="mu-kicker">' + esc(tx("titulo")) + "</p>" +
      "<h2>" + esc(tx(d.n >= META ? "tarjeta_lista" : "tarjeta")) + "</h2>" +
      '<div class="ar-altar"><div class="ar-arbol">' + arbolSvg(d.n) + '</div><span class="mu-progreso">' + esc(tx("progreso", { n: d.n, m: META })) + "</span>" +
        (d.n < META ? '<small class="mu-hoy">' + esc(tx(d.dias.indexOf(dayKey()) >= 0 ? "hoy_listo" : "hoy_falta")) + "</small>" : "") +
        '<small class="mu-termina">' + esc(tx("termina")) + "</small></div>" +
      "<p>" + esc(tx("explica", { m: MITAD, s: PREMIO_5, n: META, s2: PREMIO_10 })) + "</p>" +
      '<button type="button" class="btn btn-primary btn-block ar-jugar">' + esc(tx("jugar")) + "</button>" +
      (d.n > 0 ? '<button type="button" class="btn btn-secondary btn-block ar-compartir">' + esc(tx("compartir")) + "</button>" : ""), "mu-hoja ar-hoja");
    h.tarjeta.querySelector(".ar-jugar").addEventListener("click", function () {
      h.cerrar();
      if (APP.evento) APP.evento("arbolito_jugar", {});
      // La partida rápida contra Frutibot usa estas categorías; al volver al inicio se restauran solas (app-rapida.js).
      RANDOM_MATCH_CONFIG.categories = CATEGORIAS.slice();
      appPartidaRapida();
    });
    var c = h.tarjeta.querySelector(".ar-compartir");
    if (c) c.addEventListener("click", function () { c.disabled = true; compartir().then(function () { c.disabled = false; }); });
  };

  // ---------- Compartir: una escena con tu arbolito y tu fruta ----------
  // Cielo de noche con luna y estrellitas, resplandor cálido detrás del árbol, el árbol apoyado en un piso de nieve
  // con su sombra, regalos al pie y copos cayendo (todo en un dibujo); encima van tu fruta y los textos.
  function destello(x, y, r, o) { return '<path d="M' + x + " " + (y - r) + " Q" + x + " " + y + " " + (x + r) + " " + y + " Q" + x + " " + y + " " + x + " " + (y + r) + " Q" + x + " " + y + " " + (x - r) + " " + y + " Q" + x + " " + y + " " + x + " " + (y - r) + 'Z" fill="#FFF6D6" opacity="' + o + '"/>'; }
  function regalo(x, y, w, h, c1, c2, cinta) {
    return '<g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" fill="' + c1 + '"/>' +
      '<rect x="' + (x + w * 0.55) + '" y="' + y + '" width="' + (w * 0.45) + '" height="' + h + '" rx="8" fill="' + c2 + '"/>' +
      '<rect x="' + (x + w / 2 - 9) + '" y="' + y + '" width="18" height="' + h + '" fill="' + cinta + '"/>' +
      '<rect x="' + x + '" y="' + (y + h * 0.32) + '" width="' + w + '" height="16" fill="' + cinta + '"/>' +
      '<path d="M' + (x + w / 2) + " " + y + " C" + (x + w / 2 - 44) + " " + (y - 40) + " " + (x + w / 2 - 50) + " " + (y + 4) + " " + (x + w / 2) + " " + y +
      " C" + (x + w / 2 + 50) + " " + (y + 4) + " " + (x + w / 2 + 44) + " " + (y - 40) + " " + (x + w / 2) + " " + y + 'Z" fill="' + cinta + '"/>' +
      '<rect x="' + (x + 6) + '" y="' + (y + 6) + '" width="' + (w * 0.3) + '" height="8" rx="4" fill="#fff" opacity=".25"/></g>';
  }
  function escenaSvg(n) {
    var copos = "";
    [[80, 380, 7, .8], [210, 210, 5, .6], [330, 520, 4, .5], [960, 470, 6, .7], [1010, 760, 5, .6], [60, 860, 6, .7], [990, 1040, 4, .5], [150, 1120, 5, .6],
      [420, 140, 4, .5], [700, 560, 3, .4], [270, 980, 3, .5], [860, 920, 4, .5]].forEach(function (k) { copos += '<circle cx="' + k[0] + '" cy="' + k[1] + '" r="' + k[2] + '" fill="#fff" opacity="' + k[3] + '"/>'; });
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1400" width="1080" height="1400"><defs>' +
      '<linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A3F7E"/><stop offset=".55" stop-color="#17255A"/><stop offset="1" stop-color="#0E1838"/></linearGradient>' +
      '<radialGradient id="calor" cx="520" cy="760" r="470" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFD98A" stop-opacity=".42"/><stop offset=".5" stop-color="#FF9E5E" stop-opacity=".12"/><stop offset="1" stop-color="#FF9E5E" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="luna" cx="880" cy="230" r="190" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF6D6" stop-opacity=".45"/><stop offset="1" stop-color="#FFF6D6" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="nieve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C9DBF7"/></linearGradient>' +
      '<linearGradient id="nieveAtras" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FA9DA"/><stop offset="1" stop-color="#5B74AE"/></linearGradient>' +
      "</defs>" +
      '<rect width="1080" height="1400" fill="url(#cielo)"/>' +
      destello(130, 170, 16, .9) + destello(300, 330, 10, .7) + destello(720, 420, 12, .8) + destello(1010, 330, 9, .6) + destello(80, 620, 9, .6) + destello(990, 640, 12, .7) + destello(470, 300, 7, .5) +
      '<circle cx="880" cy="230" r="190" fill="url(#luna)"/><circle cx="880" cy="230" r="78" fill="#FFF3D1"/><circle cx="852" cy="208" r="14" fill="#F2E2B4" opacity=".7"/><circle cx="905" cy="262" r="10" fill="#F2E2B4" opacity=".6"/><circle cx="902" cy="196" r="7" fill="#F2E2B4" opacity=".6"/>' +
      '<rect width="1080" height="1400" fill="url(#calor)"/>' +
      // Lomas de nieve atrás y adelante
      '<path d="M0 1120 C200 1060 380 1090 560 1120 C760 1150 920 1080 1080 1100 L1080 1400 L0 1400 Z" fill="url(#nieveAtras)" opacity=".75"/>' +
      '<path d="M0 1215 C240 1170 480 1190 640 1200 C820 1212 960 1176 1080 1190 L1080 1400 L0 1400 Z" fill="url(#nieve)"/>' +
      // Sombras en la nieve
      '<ellipse cx="530" cy="1222" rx="330" ry="34" fill="#7E97C9" opacity=".45"/><ellipse cx="850" cy="1238" rx="120" ry="18" fill="#7E97C9" opacity=".45"/>' +
      // El arbolito (dibujo de 200 x 240, escalado y apoyado en la nieve)
      '<g transform="translate(170 425) scale(3.6)">' + arbolSvg(n).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") + "</g>" +
      // Regalos al pie
      regalo(300, 1112, 130, 104, "#E23A4E", "#B82238", "#FFD23F") + regalo(620, 1140, 104, 80, "#35C8F2", "#1F95C2", "#FF5E5B") + regalo(430, 1150, 92, 70, "#9C6BFF", "#7B4FE0", "#B6EF3C") +
      // Nieve sobre el piso, adelante, y copos
      '<path d="M0 1300 C300 1270 700 1290 1080 1270 L1080 1400 L0 1400 Z" fill="#fff" opacity=".55"/>' + copos + "</svg>";
  }
  function compartir() {
    var d = leer();
    if (APP.evento) APP.evento("share", { type: "arbolito", adornos: d.n });
    var W = 1080, H = 1920, cx = W / 2;
    var canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext("2d");
    var g = ctx.createLinearGradient(0, 1300, 0, H);
    g.addColorStop(0, "#0E1838"); g.addColorStop(1, "#0A1128");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // La escena no es cuadrada: se carga tal cual (loadSvgImage le pone ancho y alto iguales).
    var escena = new Promise(function (listo) {
      var img = new Image();
      img.onload = function () { listo(img); };
      img.onerror = function () { listo(null); };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(escenaSvg(d.n));
    });
    return Promise.all([escena, loadSvgImage(mascotSvg("happy", getMyAvatar(), myEquipped()), 400)]).then(function (imgs) {
      // La escena ocupa toda la imagen (la nieve sigue hasta abajo) y los textos van en una tarjeta apoyada encima.
      if (imgs[0]) ctx.drawImage(imgs[0], 0, 0, 1080, 1400);
      var piso = ctx.createLinearGradient(0, 1390, 0, H);
      piso.addColorStop(0, "#DCE8FB"); piso.addColorStop(1, "#B9CDEF");
      ctx.fillStyle = piso; ctx.fillRect(0, 1399, W, H - 1399);
      if (imgs[1]) ctx.drawImage(imgs[1], 720, 990, 260, 260);
      ctx.save(); ctx.shadowColor = "rgba(14,24,56,.45)"; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18;
      var tarjeta = ctx.createLinearGradient(0, 1380, 0, 1880);
      tarjeta.addColorStop(0, "#1B2A5E"); tarjeta.addColorStop(1, "#111B40");
      ctx.fillStyle = tarjeta; ctx.beginPath(); ctx.roundRect(48, 1380, W - 96, 500, 56); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "rgba(255,210,63,.35)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(48, 1380, W - 96, 500, 56); ctx.stroke();
      // Logo arriba, sobre el cielo
      ctx.textAlign = "center";
      if (typeof drawShareLogoIcon === "function") drawShareLogoIcon(ctx, cx - 190, 150, 110, { primary: "#FF5E5B", lima: "#B6EF3C", limaOscura: "#8FD32E" });
      ctx.fillStyle = "#FFF3E2"; ctx.font = "800 76px 'Bricolage Grotesque', sans-serif"; ctx.textAlign = "left";
      ctx.fillText("tutti.frutti", cx - 120, 176); ctx.textAlign = "center";
      var nombre = (state.playerName || (document.getElementById("playerName") || {}).value || "").trim().slice(0, 30);
      ctx.fillStyle = "rgba(255,243,226,.85)"; ctx.font = "700 46px 'Instrument Sans', sans-serif";
      ctx.fillText(nombre ? nombre + " · " + tx("sh_titulo") : tx("sh_titulo"), cx, 1465);
      ctx.save(); ctx.shadowColor = "rgba(255,210,63,.55)"; ctx.shadowBlur = 40;
      ctx.fillStyle = "#FFD23F"; ctx.font = "800 124px 'Bricolage Grotesque', sans-serif";
      ctx.fillText(d.n >= META ? tx("sh_completo") : tx("sh_adornos", { n: d.n, m: META }), cx, 1595); ctx.restore();
      ctx.fillStyle = "#FFF3E2"; ctx.font = "800 70px 'Bricolage Grotesque', sans-serif";
      ctx.fillText(tx("sh_pregunta"), cx, 1700);
      ctx.fillStyle = "rgba(255,243,226,.7)"; ctx.font = "500 38px 'Instrument Sans', sans-serif";
      ctx.fillText(tx("sh_donde"), cx, 1760);
      ctx.fillStyle = "rgba(182,239,60,.14)"; ctx.beginPath(); ctx.roundRect(cx - 280, 1790, 560, 64, 32); ctx.fill();
      ctx.fillStyle = "#B6EF3C"; ctx.font = "700 40px 'Instrument Sans', sans-serif"; ctx.fillText("tuttipuntofrutti.com", cx, 1835);
      shareCanvasImage(canvas, tx("sh_texto"), "https://tuttipuntofrutti.com/jugar");
    }).catch(function (e) { console.error("compartir arbolito", e); });
  }
  APP.compartirArbolito = compartir;

  // ---------- Botón en la pantalla de modos (solo en Navidad) ----------
  function tarjeta() {
    var viejo = document.getElementById("arBanner");
    if (!activo()) { if (viejo) viejo.remove(); return; }
    var d = leer();
    var b = APP.banner("arBanner", "ar-banner", function () { appArbolito(); }, document.getElementById("fgBanner") ? "fgBanner" : "dailyBanner");
    if (!b) return;
    b.pintar('<span class="ar-t-arbol">' + arbolSvg(d.n) + "</span>", tx(d.n >= META ? "tarjeta_lista" : "tarjeta"),
      esc(tx("titulo")) + ' · <b class="ar-t-cuenta">' + d.n + "/" + META + "</b>");
  }
  APP.alPintarInicio(tarjeta);
  tarjeta();
  APP.arbolito = { activo: activo, probar: function (si) { forzado = !!si; tarjeta(); } };
})();
