/* tutti.frutti · app · dibujos que reemplazan a los emojis dentro de la app.
   Mismo estilo plano que los íconos del juego (fruits.js): se suman a iconSvg(nombre).
   APP.conDibujos(html) cambia los emojis conocidos de un texto ya escapado por su dibujo (para avisos y textos
   que vienen de traducciones). Fuera de la app (compartir por WhatsApp, notificaciones) siguen los emojis.
   Se carga apenas después de app-nativo.js. */
(function () {
  var C = {
    pomelo: "#FF5E5B", pomeloOscuro: "#E0413E", lima: "#B6EF3C", limaOscura: "#8FD32E", mandarina: "#FFA62B",
    mandarinaOscura: "#E8891A", uva: "#9C6BFF", uvaOscura: "#7B4FE0", amarillo: "#FFD23F", amarilloOscuro: "#EDB800",
    tinta: "#14101F", crema: "#FFF3E2", cielo: "#35C8F2", rosa: "#FF8FAE", marron: "#8B5A2B", gris: "#B9B4C7",
  };
  function svg(inner) { return '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' + inner + "</svg>"; }
  function flor(cx, cy, r, color, centro) {
    var s = "";
    for (var k = 0; k < 8; k++) {
      var a = k * Math.PI / 4;
      s += '<circle cx="' + (cx + Math.cos(a) * r * 0.6).toFixed(1) + '" cy="' + (cy + Math.sin(a) * r * 0.6).toFixed(1) + '" r="' + (r * 0.45).toFixed(1) + '" fill="' + color + '"/>';
    }
    return s + '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.45).toFixed(1) + '" fill="' + centro + '"/>';
  }
  function medalla(color, oscuro) {
    return svg('<path d="M30 6 L44 6 L56 40 L42 40 Z" fill="' + C.cielo + '"/><path d="M70 6 L56 6 L44 40 L58 40 Z" fill="' + C.pomelo + '"/>' +
      '<circle cx="50" cy="64" r="28" fill="' + oscuro + '"/><circle cx="50" cy="64" r="22" fill="' + color + '"/>' +
      '<path d="M50 50 L54 60 L65 61 L56 68 L59 79 L50 73 L41 79 L44 68 L35 61 L46 60 Z" fill="' + oscuro + '" opacity=".55"/>' +
      '<ellipse cx="41" cy="55" rx="4" ry="7" fill="#fff" opacity=".35"/>');
  }
  var DIBUJOS = {
    hielo: svg('<path d="M18 34 L50 18 L82 34 L82 70 L50 86 L18 70 Z" fill="#8FDCF7"/><path d="M18 34 L50 18 L82 34 L50 50 Z" fill="#C9EEFB"/>' +
      '<path d="M50 50 L82 34 L82 70 L50 86 Z" fill="#5BC3EA"/><path d="M28 40 L28 60" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>' +
      '<circle cx="62" cy="44" r="3" fill="#fff" opacity=".8"/>'),
    regalo: svg('<rect x="14" y="40" width="72" height="48" rx="6" fill="' + C.pomelo + '"/><rect x="10" y="30" width="80" height="16" rx="5" fill="' + C.pomeloOscuro + '"/>' +
      '<rect x="44" y="30" width="12" height="58" fill="' + C.amarillo + '"/>' +
      '<path d="M50 30 C40 12 22 14 26 24 C29 31 42 30 50 30 Z M50 30 C60 12 78 14 74 24 C71 31 58 30 50 30 Z" fill="' + C.amarillo + '"/>'),
    espadas: svg('<g transform="rotate(45 50 50)"><rect x="46" y="6" width="8" height="58" rx="3" fill="#D9DFEA"/><path d="M46 8 L50 0 L54 8 Z" fill="#D9DFEA"/>' +
      '<rect x="36" y="62" width="28" height="7" rx="3" fill="' + C.amarillo + '"/><rect x="46" y="68" width="8" height="18" rx="3" fill="' + C.marron + '"/></g>' +
      '<g transform="rotate(-45 50 50)"><rect x="46" y="6" width="8" height="58" rx="3" fill="#EEF1F6"/><path d="M46 8 L50 0 L54 8 Z" fill="#EEF1F6"/>' +
      '<rect x="36" y="62" width="28" height="7" rx="3" fill="' + C.mandarina + '"/><rect x="46" y="68" width="8" height="18" rx="3" fill="' + C.marron + '"/></g>'),
    candado: svg('<path d="M32 44 V32 C32 20 40 12 50 12 C60 12 68 20 68 32 V44" stroke="' + C.gris + '" stroke-width="9" fill="none"/>' +
      '<rect x="20" y="42" width="60" height="46" rx="10" fill="' + C.amarillo + '"/><circle cx="50" cy="61" r="7" fill="' + C.tinta + '"/><rect x="47" y="63" width="6" height="14" rx="3" fill="' + C.tinta + '"/>'),
    sinanuncios: svg('<rect x="22" y="30" width="56" height="40" rx="8" fill="' + C.crema + '"/>' +
      '<text x="50" y="59" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="' + C.tinta + '">AD</text>' +
      '<circle cx="50" cy="50" r="38" fill="none" stroke="' + C.pomelo + '" stroke-width="9"/><path d="M23 23 L77 77" stroke="' + C.pomelo + '" stroke-width="9" stroke-linecap="round"/>'),
    sinwifi: svg('<path d="M14 42 C34 22 66 22 86 42" stroke="' + C.gris + '" stroke-width="8" fill="none" stroke-linecap="round"/>' +
      '<path d="M27 56 C41 43 59 43 73 56" stroke="' + C.gris + '" stroke-width="8" fill="none" stroke-linecap="round"/>' +
      '<circle cx="50" cy="72" r="7" fill="' + C.gris + '"/><path d="M20 18 L80 84" stroke="' + C.pomelo + '" stroke-width="8" stroke-linecap="round"/>'),
    vela: svg('<rect x="36" y="40" width="28" height="50" rx="5" fill="' + C.crema + '"/><path d="M36 50 C44 54 56 46 64 50" stroke="#E9D9C0" stroke-width="3" fill="none"/>' +
      '<path d="M50 8 C60 20 60 30 50 36 C40 30 40 20 50 8 Z" fill="' + C.mandarina + '"/><path d="M50 18 C55 24 55 30 50 33 C45 30 45 24 50 18 Z" fill="' + C.amarillo + '"/>' +
      '<rect x="48" y="34" width="4" height="7" fill="' + C.tinta + '"/>'),
    cempasuchil: svg('<path d="M50 60 L50 94" stroke="' + C.limaOscura + '" stroke-width="5"/><path d="M50 80 C38 72 30 76 28 82 C38 86 46 84 50 80 Z" fill="' + C.limaOscura + '"/>' +
      flor(50, 40, 30, "#F28C0F", "#FFC23D")),
    pan: svg('<ellipse cx="50" cy="78" rx="38" ry="12" fill="#B9672A"/><path d="M12 76 C12 44 30 28 50 28 C70 28 88 44 88 76 Z" fill="#E39A4F"/>' +
      '<path d="M22 64 C30 50 38 60 46 46 C54 60 62 50 78 64" stroke="#C47A35" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M50 32 C46 42 54 46 50 58" stroke="#C47A35" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="50" cy="28" r="8" fill="#C47A35"/>' +
      '<g fill="' + C.crema + '"><circle cx="30" cy="54" r="2"/><circle cx="68" cy="52" r="2"/><circle cx="40" cy="68" r="2"/><circle cx="62" cy="68" r="2"/></g>'),
    foto: svg('<rect x="12" y="16" width="76" height="68" rx="6" fill="' + C.marron + '"/><rect x="20" y="24" width="60" height="52" rx="3" fill="#8FDCF7"/>' +
      '<circle cx="64" cy="38" r="7" fill="' + C.amarillo + '"/><path d="M20 76 L40 50 L54 64 L62 56 L80 76 Z" fill="' + C.limaOscura + '"/>'),
    calavera: svg('<path d="M50 10 C28 10 16 26 16 44 C16 56 22 64 30 68 L30 82 C30 86 34 90 40 90 L60 90 C66 90 70 86 70 82 L70 68 C78 64 84 56 84 44 C84 26 72 10 50 10 Z" fill="#FFFBF4"/>' +
      '<circle cx="36" cy="48" r="11" fill="' + C.uva + '"/><circle cx="64" cy="48" r="11" fill="' + C.cielo + '"/><circle cx="36" cy="48" r="5" fill="' + C.tinta + '"/><circle cx="64" cy="48" r="5" fill="' + C.tinta + '"/>' +
      '<path d="M46 66 L50 58 L54 66 Z" fill="' + C.tinta + '"/><path d="M38 78 H62 M44 74 V84 M50 74 V84 M56 74 V84" stroke="' + C.tinta + '" stroke-width="3" stroke-linecap="round"/>' +
      flor(50, 26, 9, C.rosa, C.amarillo)),
    calabaza: svg('<path d="M50 20 C52 12 58 8 64 8" stroke="' + C.limaOscura + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="32" cy="58" rx="20" ry="30" fill="' + C.mandarinaOscura + '"/><ellipse cx="68" cy="58" rx="20" ry="30" fill="' + C.mandarinaOscura + '"/>' +
      '<ellipse cx="50" cy="58" rx="22" ry="32" fill="' + C.mandarina + '"/><path d="M38 52 L44 46 L48 54 Z M62 52 L56 46 L52 54 Z" fill="' + C.tinta + '"/>' +
      '<path d="M36 66 C42 74 58 74 64 66 C58 70 42 70 36 66 Z" fill="' + C.tinta + '"/>'),
    cerezo: svg(flor(50, 50, 40, C.rosa, C.amarillo)),
    mascara: svg('<path d="M10 44 C10 30 30 28 50 36 C70 28 90 30 90 44 C90 62 74 70 62 64 C56 61 54 56 50 56 C46 56 44 61 38 64 C26 70 10 62 10 44 Z" fill="' + C.uva + '"/>' +
      '<ellipse cx="32" cy="46" rx="9" ry="6" fill="' + C.tinta + '"/><ellipse cx="68" cy="46" rx="9" ry="6" fill="' + C.tinta + '"/>' +
      '<path d="M84 34 C90 20 96 14 98 8 C94 20 92 28 88 36 Z" fill="' + C.amarillo + '"/><path d="M80 32 C82 18 86 10 90 6 C88 18 86 26 84 34 Z" fill="' + C.pomelo + '"/>' +
      '<circle cx="50" cy="44" r="3" fill="' + C.amarillo + '"/>'),
    bronce: medalla("#E39A63", "#B86B3A"),
    plata: medalla("#E3E6EE", "#A9AEBE"),
    oro: medalla(C.amarillo, C.amarilloOscuro),
    burbuja: svg('<path d="M14 22 C14 16 18 12 24 12 H76 C82 12 86 16 86 22 V60 C86 66 82 70 76 70 H44 L26 86 L30 70 H24 C18 70 14 66 14 60 Z" fill="' + C.cielo + '"/>' +
      '<circle cx="34" cy="41" r="5" fill="#fff"/><circle cx="50" cy="41" r="5" fill="#fff"/><circle cx="66" cy="41" r="5" fill="#fff"/>'),
    fiesta: svg('<path d="M14 88 L36 30 L70 64 Z" fill="' + C.uva + '"/><path d="M24 62 L48 46 M19 76 L60 56" stroke="' + C.amarillo + '" stroke-width="5"/>' +
      '<g><circle cx="72" cy="20" r="5" fill="' + C.pomelo + '"/><circle cx="86" cy="40" r="4" fill="' + C.cielo + '"/><circle cx="56" cy="12" r="3.5" fill="' + C.lima + '"/>' +
      '<rect x="78" y="58" width="9" height="4" rx="2" fill="' + C.amarillo + '" transform="rotate(30 82 60)"/><rect x="46" y="22" width="9" height="4" rx="2" fill="' + C.mandarina + '" transform="rotate(-30 50 24)"/></g>'),
    comodin: svg('<rect x="18" y="8" width="64" height="84" rx="9" fill="#FFFBF4" stroke="#E2D6C2" stroke-width="3"/>' +
      '<path d="M30 58 C30 40 36 30 44 26 C42 34 46 40 50 42 C54 40 58 34 56 26 C64 30 70 40 70 58 Z" fill="' + C.uva + '"/>' +
      '<path d="M30 58 C34 46 40 40 44 26 M70 58 C66 46 60 40 56 26" stroke="' + C.uvaOscura + '" stroke-width="2" fill="none"/>' +
      '<circle cx="44" cy="25" r="5" fill="' + C.amarillo + '"/><circle cx="56" cy="25" r="5" fill="' + C.amarillo + '"/>' +
      '<rect x="28" y="56" width="44" height="8" rx="4" fill="' + C.pomelo + '"/>' +
      '<circle cx="42" cy="73" r="2.6" fill="' + C.tinta + '"/><circle cx="58" cy="73" r="2.6" fill="' + C.tinta + '"/><path d="M42 80 C46 84 54 84 58 80" stroke="' + C.tinta + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '<text x="27" y="24" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="' + C.pomelo + '">J</text>'),
    // Letra prohibida (vuelta de tuerca del online): una ficha con una letra, tachada.
    prohibida: svg('<rect x="24" y="24" width="52" height="52" rx="12" fill="' + C.crema + '"/>' +
      '<text x="50" y="62" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="34" fill="' + C.tinta + '">R</text>' +
      '<circle cx="50" cy="50" r="38" fill="none" stroke="' + C.pomelo + '" stroke-width="9"/><path d="M23 23 L77 77" stroke="' + C.pomelo + '" stroke-width="9" stroke-linecap="round"/>'),
    objetivo: svg('<circle cx="50" cy="50" r="40" fill="' + C.pomelo + '"/><circle cx="50" cy="50" r="30" fill="#fff"/><circle cx="50" cy="50" r="20" fill="' + C.pomelo + '"/>' +
      '<circle cx="50" cy="50" r="10" fill="#fff"/><path d="M50 50 L84 16" stroke="' + C.tinta + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M84 16 L92 14 L86 22 Z M84 16 L86 8 L78 14 Z" fill="' + C.lima + '"/>'),
  };
  // Algunos dibujos del juego reusados para emojis frecuentes.
  var EMOJIS = {
    "🧊": "hielo", "🎁": "regalo", "⚔️": "espadas", "⚔": "espadas", "🔒": "candado", "🚫": "sinanuncios", "📴": "sinwifi",
    "🕯️": "vela", "🕯": "vela", "🌼": "cempasuchil", "🍞": "pan", "🖼️": "foto", "🖼": "foto", "💀": "calavera", "🎃": "calabaza",
    "🌸": "cerezo", "🎭": "mascara", "🥉": "bronce", "🥈": "plata", "🥇": "oro", "💬": "burbuja", "🎉": "fiesta", "🃏": "comodin",
    "🔥": "flame", "⚡": "bolt", "☀️": "sun", "☀": "sun", "💎": "gem", "⭐": "star",
  };
  var iconoAntes = window.iconSvg;
  window.iconSvg = function (nombre) { return DIBUJOS[nombre] || iconoAntes.apply(this, arguments); };

  // El dibujo para un emoji (o "" si no hay).
  APP.dibujo = function (emoji) { var n = EMOJIS[emoji]; return n ? iconSvg(n) : ""; };
  // Cambia los emojis conocidos de un HTML (ya escapado) por su dibujo chiquito, en línea con el texto.
  var claves = Object.keys(EMOJIS).sort(function (a, b) { return b.length - a.length; });
  var re = new RegExp(claves.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + "|\\uFE0F", "g");
  APP.conDibujos = function (html) {
    return String(html).replace(re, function (e) { return e === "️" ? "" : '<span class="inline-icon">' + iconSvg(EMOJIS[e]) + "</span>"; });
  };
  // Botón del pack de Halloween (el texto lo pone la traducción; el dibujo va aparte).
  document.querySelectorAll('[data-icon="prohibida"]').forEach(function (el) { el.innerHTML = iconSvg("prohibida"); });
  document.querySelectorAll(".pack-calabaza").forEach(function (el) { el.innerHTML = iconSvg("calabaza"); });

  // Saca los emojis de un texto que no puede llevar dibujos (placeholder, títulos simples).
  APP.sinEmojis = function (texto) { return String(texto).replace(re, "").replace(/\s{2,}/g, " ").trim(); };
})();
