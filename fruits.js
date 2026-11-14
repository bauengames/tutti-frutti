/* tutti.frutti · frutas dibujadas y mascota, en el mismo estilo plano del logo.
   Los avatares se siguen guardando como emoji (así los datos viejos siguen
   sirviendo): acá solo se decide cómo se DIBUJA cada uno. */
(function () {
  var C = {
    pomelo: "#FF5E5B", pomeloOscuro: "#E0413E", lima: "#B6EF3C", limaOscura: "#8FD32E",
    mandarina: "#FFA62B", mandarinaOscura: "#E8891A", uva: "#9C6BFF", uvaOscura: "#7B4FE0",
    amarillo: "#FFD23F", amarilloOscuro: "#EDB800", durazno: "#FF9B7A", duraznoOscuro: "#F07A5A",
    marron: "#8B5A2B", tinta: "#14101F", crema: "#FFF3E2", rosa: "#FF8583", cielo: "#35C8F2",
    pera: "#CDE55A", peraOscura: "#A9C93A", arandano: "#5B6CF0", arandanoOscuro: "#3F4FC9",
    palta: "#4E7D2A", paltaClara: "#D6E88C", tomate: "#F2473F", tomateOscuro: "#C9302A",
    melon: "#D9E58A", melonRed: "#B7C764", oro: "#FFC83D", oroOscuro: "#E0A21A",
  };
  var APPLE_BODY = "M50 36 C41 27 26 28 19 42 C12 56 15 71 25 80 C34 88 44 90 50 90 C56 90 66 88 75 80 C85 71 88 56 81 42 C74 28 59 27 50 36 Z";
  var LEAF_R = "M51 35 C57 19 73 9 85 7 C84 22 71 34 51 35 Z";
  var LEAF_L = "M48 35 C43 22 32 14 22 12 C23 26 33 34 48 35 Z";
  var SHINE = '<ellipse cx="34" cy="54" rx="5" ry="9" transform="rotate(20 34 54)" fill="#fff" opacity=".28"/>';

  function svg(inner) {
    return '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' + inner + "</svg>";
  }

  function apple(body, leafR, leafL) {
    return '<path d="' + APPLE_BODY + '" fill="' + body + '"/><path d="' + LEAF_R + '" fill="' + leafR + '"/><path d="' + LEAF_L + '" fill="' + leafL + '"/>';
  }

  var FRUITS = {
    "🍎": svg(apple(C.pomelo, C.lima, C.limaOscura) + SHINE),
    "🍏": svg(apple(C.limaOscura, C.lima, "#6FB51F") + SHINE),
    "🍊": svg(
      '<circle cx="50" cy="57" r="33" fill="' + C.mandarina + '"/>' +
      '<circle cx="50" cy="27" r="3" fill="' + C.mandarinaOscura + '"/>' +
      '<circle cx="38" cy="66" r="1.8" fill="' + C.mandarinaOscura + '"/><circle cx="62" cy="72" r="1.8" fill="' + C.mandarinaOscura + '"/><circle cx="66" cy="52" r="1.8" fill="' + C.mandarinaOscura + '"/>' +
      '<path d="M52 26 C58 13 71 8 83 9 C80 20 68 27 52 26 Z" fill="' + C.lima + '"/>' + SHINE
    ),
    "🍋": svg(
      '<path d="M8 57 C15 52 18 42 30 34 C42 26 58 26 70 34 C82 42 85 52 92 57 C85 62 82 72 70 80 C58 88 42 88 30 80 C18 72 15 62 8 57 Z" fill="' + C.amarillo + '"/>' +
      '<path d="M22 64 C34 78 62 80 78 66 C64 74 38 74 22 64 Z" fill="' + C.amarilloOscuro + '" opacity=".6"/>' +
      '<path d="M50 32 C54 19 66 13 77 13 C74 23 65 30 50 32 Z" fill="' + C.limaOscura + '"/>' +
      '<ellipse cx="36" cy="48" rx="8" ry="4" transform="rotate(-20 36 48)" fill="#fff" opacity=".35"/>'
    ),
    "🍌": svg(
      '<path d="M14 22 C18 64 44 92 86 86 C93 85 94 76 88 73 C62 70 42 54 36 22 C35 12 15 12 14 22 Z" fill="' + C.amarillo + '"/>' +
      '<path d="M24 32 C30 62 50 78 82 80 C54 82 30 64 24 32 Z" fill="' + C.amarilloOscuro + '"/>' +
      '<path d="M14 22 C14 12 35 11 36 22 C29 19 21 19 14 22 Z" fill="' + C.marron + '"/>' +
      '<path d="M86 72 L95 69 L96 79 L88 83 Z" fill="' + C.marron + '"/>'
    ),
    "🍉": svg(
      '<path d="M6 32 A44 44 0 0 0 94 32 Z" fill="' + C.limaOscura + '"/>' +
      '<path d="M12 32 A38 38 0 0 0 88 32 Z" fill="' + C.crema + '"/>' +
      '<path d="M16 32 A34 34 0 0 0 84 32 Z" fill="' + C.pomelo + '"/>' +
      '<ellipse cx="36" cy="44" rx="2.4" ry="3.6" fill="' + C.tinta + '"/><ellipse cx="50" cy="52" rx="2.4" ry="3.6" fill="' + C.tinta + '"/>' +
      '<ellipse cx="64" cy="44" rx="2.4" ry="3.6" fill="' + C.tinta + '"/><ellipse cx="44" cy="60" rx="2.4" ry="3.6" fill="' + C.tinta + '"/>' +
      '<ellipse cx="57" cy="60" rx="2.4" ry="3.6" fill="' + C.tinta + '"/>'
    ),
    "🍇": svg(
      '<path d="M52 30 L50 16" stroke="' + C.marron + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M52 26 C56 15 67 10 79 11 C76 21 67 27 52 26 Z" fill="' + C.limaOscura + '"/>' +
      '<circle cx="36" cy="40" r="11" fill="' + C.uva + '"/><circle cx="54" cy="38" r="11" fill="' + C.uvaOscura + '"/><circle cx="71" cy="42" r="11" fill="' + C.uva + '"/>' +
      '<circle cx="44" cy="57" r="11" fill="' + C.uvaOscura + '"/><circle cx="62" cy="58" r="11" fill="' + C.uva + '"/>' +
      '<circle cx="53" cy="75" r="11" fill="' + C.uvaOscura + '"/>' +
      '<circle cx="33" cy="36" r="3" fill="#fff" opacity=".35"/><circle cx="41" cy="53" r="3" fill="#fff" opacity=".35"/><circle cx="59" cy="54" r="3" fill="#fff" opacity=".35"/>'
    ),
    "🍓": svg(
      '<path d="M50 90 C30 80 15 60 17 44 C19 32 33 28 50 33 C67 28 81 32 83 44 C85 60 70 80 50 90 Z" fill="' + C.pomelo + '"/>' +
      '<g fill="' + C.crema + '"><ellipse cx="34" cy="46" rx="1.8" ry="2.6"/><ellipse cx="50" cy="44" rx="1.8" ry="2.6"/><ellipse cx="66" cy="46" rx="1.8" ry="2.6"/>' +
      '<ellipse cx="42" cy="58" rx="1.8" ry="2.6"/><ellipse cx="58" cy="58" rx="1.8" ry="2.6"/><ellipse cx="30" cy="60" rx="1.8" ry="2.6"/><ellipse cx="70" cy="60" rx="1.8" ry="2.6"/>' +
      '<ellipse cx="50" cy="70" rx="1.8" ry="2.6"/><ellipse cx="40" cy="74" rx="1.8" ry="2.6"/><ellipse cx="60" cy="74" rx="1.8" ry="2.6"/></g>' +
      '<path d="M50 36 C42 30 34 28 26 30 C32 36 42 38 50 36 Z M50 36 C58 30 66 28 74 30 C68 36 58 38 50 36 Z M50 36 C46 28 46 20 50 14 C54 20 54 28 50 36 Z" fill="' + C.limaOscura + '"/>'
    ),
    "🍒": svg(
      '<path d="M34 56 C38 38 48 24 60 15" stroke="' + C.marron + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M66 60 C63 42 61 28 60 15" stroke="' + C.marron + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M60 15 C68 6 80 6 89 10 C83 19 70 21 60 15 Z" fill="' + C.lima + '"/>' +
      '<circle cx="33" cy="70" r="17" fill="' + C.pomelo + '"/><circle cx="67" cy="73" r="17" fill="' + C.pomeloOscuro + '"/>' +
      '<circle cx="27" cy="64" r="4" fill="#fff" opacity=".35"/><circle cx="61" cy="67" r="4" fill="#fff" opacity=".3"/>'
    ),
    "🍑": svg(
      '<path d="M50 89 C28 89 15 73 15 57 C15 41 29 31 43 32 C47 32 50 35 50 35 C50 35 53 32 57 32 C71 31 85 41 85 57 C85 73 72 89 50 89 Z" fill="' + C.durazno + '"/>' +
      '<path d="M50 37 C43 52 43 72 50 87 C47 72 47 52 50 37 Z" fill="' + C.duraznoOscuro + '"/>' +
      '<path d="M52 33 C58 20 70 15 81 17 C77 28 66 33 52 33 Z" fill="' + C.limaOscura + '"/>' + SHINE
    ),
    "🍍": svg(
      '<path d="M50 40 L38 8 L50 26 L50 6 L56 26 L68 10 L60 40 Z" fill="' + C.limaOscura + '"/>' +
      '<path d="M50 40 L44 18 L52 30 L62 16 L56 40 Z" fill="' + C.lima + '"/>' +
      '<ellipse cx="50" cy="65" rx="25" ry="28" fill="' + C.mandarina + '"/>' +
      '<g fill="' + C.mandarinaOscura + '"><path d="M40 50 l4 4 -4 4 -4 -4 Z"/><path d="M56 50 l4 4 -4 4 -4 -4 Z"/><path d="M48 60 l4 4 -4 4 -4 -4 Z"/>' +
      '<path d="M64 60 l4 4 -4 4 -4 -4 Z"/><path d="M32 60 l4 4 -4 4 -4 -4 Z"/><path d="M40 70 l4 4 -4 4 -4 -4 Z"/><path d="M56 70 l4 4 -4 4 -4 -4 Z"/><path d="M48 80 l4 4 -4 4 -4 -4 Z"/></g>'
    ),
    "🥝": svg(
      '<circle cx="50" cy="52" r="38" fill="' + C.marron + '"/>' +
      '<circle cx="50" cy="52" r="33" fill="' + C.limaOscura + '"/>' +
      '<circle cx="50" cy="52" r="24" fill="' + C.lima + '"/>' +
      '<ellipse cx="50" cy="52" rx="9" ry="11" fill="' + C.crema + '"/>' +
      '<g fill="' + C.tinta + '"><ellipse cx="50" cy="33" rx="1.6" ry="2.6"/><ellipse cx="63" cy="38" rx="1.6" ry="2.6" transform="rotate(45 63 38)"/><ellipse cx="69" cy="52" rx="2.6" ry="1.6"/>' +
      '<ellipse cx="63" cy="66" rx="1.6" ry="2.6" transform="rotate(-45 63 66)"/><ellipse cx="50" cy="71" rx="1.6" ry="2.6"/><ellipse cx="37" cy="66" rx="1.6" ry="2.6" transform="rotate(45 37 66)"/>' +
      '<ellipse cx="31" cy="52" rx="2.6" ry="1.6"/><ellipse cx="37" cy="38" rx="1.6" ry="2.6" transform="rotate(-45 37 38)"/></g>'
    ),
    "🥥": svg(
      '<circle cx="50" cy="52" r="38" fill="' + C.marron + '"/>' +
      '<circle cx="50" cy="52" r="30" fill="' + C.crema + '"/>' +
      '<circle cx="50" cy="52" r="22" fill="#FFFBF4"/>' +
      '<g fill="#6B4320"><circle cx="30" cy="22" r="2"/><circle cx="74" cy="26" r="2"/><circle cx="84" cy="62" r="2"/><circle cx="18" cy="68" r="2"/></g>' +
      '<ellipse cx="40" cy="42" rx="6" ry="3" transform="rotate(-30 40 42)" fill="#fff" opacity=".6"/>'
    ),
    // Frutas de la tienda (se compran con semillas).
    "🍐": svg(
      '<path d="M52 30 L50 16" stroke="' + C.marron + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M52 26 C57 16 68 12 78 14 C74 23 65 27 52 26 Z" fill="' + C.limaOscura + '"/>' +
      '<path d="M50 28 C41 28 38 38 38 46 C38 54 24 60 24 73 C24 85 36 92 50 92 C64 92 76 85 76 73 C76 60 62 54 62 46 C62 38 59 28 50 28 Z" fill="' + C.pera + '"/>' +
      '<path d="M30 78 C38 88 62 90 72 78 C62 85 40 85 30 78 Z" fill="' + C.peraOscura + '"/>' + SHINE
    ),
    "🥭": svg(
      '<path d="M28 38 C38 20 70 18 82 38 C92 58 80 86 56 89 C32 92 16 68 28 38 Z" fill="' + C.mandarina + '"/>' +
      '<path d="M28 38 C38 20 70 18 82 38 C72 30 50 30 40 44 C34 52 30 62 24 64 C20 54 22 46 28 38 Z" fill="' + C.pomelo + '" opacity=".75"/>' +
      '<path d="M56 89 C74 86 86 70 84 52 C80 70 70 82 56 89 Z" fill="' + C.amarilloOscuro + '" opacity=".7"/>' +
      '<path d="M58 22 C64 10 76 6 88 8 C84 18 74 24 58 22 Z" fill="' + C.limaOscura + '"/>' +
      '<ellipse cx="42" cy="44" rx="5" ry="9" transform="rotate(35 42 44)" fill="#fff" opacity=".28"/>'
    ),
    "🫐": svg(
      '<path d="M50 30 C54 20 64 15 74 16 C71 25 62 30 50 30 Z" fill="' + C.limaOscura + '"/>' +
      '<circle cx="31" cy="50" r="17" fill="' + C.arandanoOscuro + '"/><circle cx="69" cy="50" r="17" fill="' + C.arandano + '"/>' +
      '<circle cx="50" cy="68" r="21" fill="' + C.arandano + '"/>' +
      '<path d="M50 50 l3 4 5 0 -4 3 2 5 -6 -3 -6 3 2 -5 -4 -3 5 0 Z" fill="' + C.arandanoOscuro + '" transform="translate(0 -3)"/>' +
      '<circle cx="24" cy="44" r="3.5" fill="#fff" opacity=".3"/><circle cx="62" cy="44" r="3.5" fill="#fff" opacity=".3"/><circle cx="40" cy="60" r="4" fill="#fff" opacity=".3"/>'
    ),
    "🍅": svg(
      '<ellipse cx="50" cy="60" rx="36" ry="31" fill="' + C.tomate + '"/>' +
      '<path d="M34 72 C42 84 62 86 74 74 C62 80 44 80 34 72 Z" fill="' + C.tomateOscuro + '" opacity=".7"/>' +
      '<path d="M50 34 L44 24 L50 28 L54 18 L57 29 L66 24 L60 33 L70 36 L58 38 L50 42 L42 38 L30 36 L40 33 Z" fill="' + C.limaOscura + '"/>' +
      '<path d="M50 30 L50 18" stroke="' + C.limaOscura + '" stroke-width="4" stroke-linecap="round"/>' + SHINE
    ),
    "🥑": svg(
      '<path d="M50 10 C38 10 33 24 31 36 C28 50 18 58 18 72 C18 86 32 94 50 94 C68 94 82 86 82 72 C82 58 72 50 69 36 C67 24 62 10 50 10 Z" fill="' + C.palta + '"/>' +
      '<path d="M50 18 C41 18 38 29 37 38 C35 50 26 58 26 71 C26 82 37 87 50 87 C63 87 74 82 74 71 C74 58 65 50 63 38 C62 29 59 18 50 18 Z" fill="' + C.paltaClara + '"/>' +
      '<circle cx="50" cy="68" r="13" fill="' + C.marron + '"/>' +
      '<ellipse cx="46" cy="64" rx="3.5" ry="5" fill="#fff" opacity=".3"/>'
    ),
    "🍈": svg(
      '<circle cx="50" cy="56" r="36" fill="' + C.melon + '"/>' +
      '<g fill="none" stroke="' + C.melonRed + '" stroke-width="2" opacity=".9">' +
      '<path d="M22 44 C34 52 40 66 38 86"/><path d="M34 26 C46 38 52 60 50 92"/><path d="M58 22 C64 40 66 62 62 90"/><path d="M78 36 C80 52 80 70 74 82"/>' +
      '<path d="M16 60 C34 56 60 58 86 62"/><path d="M22 76 C40 72 62 74 80 78"/><path d="M24 40 C42 38 62 38 80 42"/></g>' +
      '<path d="M50 20 L50 10" stroke="' + C.marron + '" stroke-width="4" stroke-linecap="round"/>' + SHINE
    ),
    // La manzana dorada: el premio más caro de la tienda.
    "🍎✨": svg(
      apple(C.oro, C.lima, C.limaOscura) +
      '<path d="M25 75 C34 86 56 90 72 80 C58 86 38 84 25 75 Z" fill="' + C.oroOscuro + '" opacity=".6"/>' + SHINE +
      '<path d="M82 60 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" fill="#FFF3E2"/>' +
      '<path d="M18 30 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#FFF3E2"/>'
    ),
  };

  window.fruitSvg = function (emoji) {
    return FRUITS[emoji] || FRUITS["🍏"];
  };
  // La manzana verde y la dorada no aparecen en el confeti ni en la ruleta (la dorada es un premio).
  window.FRUIT_KEYS = Object.keys(FRUITS).filter(function (k) { return k !== "🍏" && k !== "🍎✨"; });

  // ---------- Mascota: la manzana del logo, con caras ----------
  var EYE_OPEN = function (x, y, lookX, lookY) {
    return '<circle cx="' + x + '" cy="' + y + '" r="4.6" fill="' + C.tinta + '"/>' +
      '<circle cx="' + (x + 1.4 + (lookX || 0)) + '" cy="' + (y - 1.6 + (lookY || 0)) + '" r="1.5" fill="#fff"/>';
  };
  var CHEEKS = '<ellipse cx="31" cy="69" rx="6" ry="3.5" fill="' + C.rosa + '" opacity=".7"/><ellipse cx="69" cy="69" rx="6" ry="3.5" fill="' + C.rosa + '" opacity=".7"/>';
  var S = 'stroke="' + C.tinta + '" stroke-width="3.6" stroke-linecap="round" fill="none"';

  var FACES = {
    happy:
      '<path d="M35 60 Q40 53 45 60" ' + S + '/><path d="M55 60 Q60 53 65 60" ' + S + '/>' + CHEEKS +
      '<path d="M40 68 Q50 83 60 68 Z" fill="' + C.tinta + '"/><path d="M45 74 Q50 79 55 74 Q50 72 45 74 Z" fill="' + C.rosa + '"/>',
    neutral:
      EYE_OPEN(40, 60) + EYE_OPEN(60, 60) + CHEEKS + '<path d="M44 72 Q50 76 56 72" ' + S + '/>',
    sad:
      '<path d="M33 55 L45 50" ' + S + '/><path d="M67 55 L55 50" ' + S + '/>' +
      EYE_OPEN(40, 61, 0, 1.5) + EYE_OPEN(60, 61, 0, 1.5) +
      '<path d="M43 77 Q50 70 57 77" ' + S + '/>' +
      '<path d="M65 66 C62 71 62 75 65 76 C68 75 68 71 65 66 Z" fill="' + C.cielo + '"/>',
    angry:
      '<path d="M32 50 L46 57" stroke="' + C.tinta + '" stroke-width="4.4" stroke-linecap="round"/><path d="M68 50 L54 57" stroke="' + C.tinta + '" stroke-width="4.4" stroke-linecap="round"/>' +
      EYE_OPEN(40, 62) + EYE_OPEN(60, 62) +
      '<path d="M41 75 L59 75" ' + S + '/>' +
      '<g fill="' + C.crema + '" opacity=".85"><circle cx="16" cy="30" r="4"/><circle cx="10" cy="24" r="3"/><circle cx="84" cy="30" r="4"/><circle cx="90" cy="24" r="3"/></g>',
    thinking:
      EYE_OPEN(40, 59, 1.2, -1.6) + EYE_OPEN(60, 59, 1.2, -1.6) + CHEEKS +
      '<path d="M46 74 Q52 72 58 75" ' + S + '/>' +
      '<g fill="' + C.crema + '"><circle cx="80" cy="30" r="2.5"/><circle cx="86" cy="22" r="3.2"/><circle cx="92" cy="12" r="4"/></g>',
    sleepy:
      '<path d="M35 61 Q40 64 45 61" ' + S + '/><path d="M55 61 Q60 64 65 61" ' + S + '/>' + CHEEKS +
      '<ellipse cx="50" cy="74" rx="3.5" ry="4" fill="' + C.tinta + '"/>' +
      '<text x="74" y="30" font-family="sans-serif" font-weight="800" font-size="13" fill="' + C.crema + '">z</text>' +
      '<text x="84" y="18" font-family="sans-serif" font-weight="800" font-size="9" fill="' + C.crema + '">z</text>',
    surprised:
      '<circle cx="40" cy="59" r="6" fill="#fff"/><circle cx="40" cy="59" r="3.6" fill="' + C.tinta + '"/>' +
      '<circle cx="60" cy="59" r="6" fill="#fff"/><circle cx="60" cy="59" r="3.6" fill="' + C.tinta + '"/>' +
      '<ellipse cx="50" cy="75" rx="5" ry="6" fill="' + C.tinta + '"/>',
  };

  // ---------- Íconos dibujados (reemplazan a los emojis dentro del juego) ----------
  var RAYS = "";
  for (var r = 0; r < 8; r++) {
    RAYS += '<path d="M47 4 L53 4 L51 20 L49 20 Z" fill="' + C.amarillo + '" transform="rotate(' + (r * 45) + ' 50 50)"/>';
  }
  var ICONS = {
    sun: svg(RAYS + '<circle cx="50" cy="50" r="24" fill="' + C.mandarina + '"/><circle cx="50" cy="50" r="17" fill="' + C.amarillo + '"/>'),
    flame: svg(
      '<path d="M50 6 C62 26 82 40 82 63 C82 81 67 94 50 94 C33 94 18 81 18 63 C18 48 28 40 33 29 C37 41 43 46 47 46 C45 33 43 20 50 6 Z" fill="' + C.pomelo + '"/>' +
      '<path d="M50 44 C59 57 67 63 67 75 C67 86 59 93 50 93 C41 93 33 86 33 75 C33 66 42 60 50 44 Z" fill="' + C.mandarina + '"/>' +
      '<path d="M50 66 C55 73 58 77 58 82 C58 88 54 92 50 92 C46 92 42 88 42 82 C42 77 46 73 50 66 Z" fill="' + C.amarillo + '"/>'
    ),
    bolt: svg('<path d="M60 4 L20 56 L46 56 L38 96 L80 40 L54 40 Z" fill="' + C.amarillo + '"/><path d="M60 4 L46 40 L54 40 Z M46 56 L38 96 L50 56 Z" fill="' + C.mandarina + '"/>'),
    ballot: svg(
      '<rect x="36" y="8" width="30" height="40" rx="4" fill="' + C.crema + '" transform="rotate(8 51 28)"/>' +
      '<path d="M42 26 L49 33 L61 19" stroke="' + C.limaOscura + '" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="rotate(8 51 28)"/>' +
      '<rect x="14" y="46" width="72" height="44" rx="7" fill="' + C.uva + '"/>' +
      '<rect x="30" y="44" width="40" height="8" rx="4" fill="' + C.uvaOscura + '"/>'
    ),
    star: svg('<path d="M50 6 L62 36 L94 38 L69 59 L77 92 L50 74 L23 92 L31 59 L6 38 L38 36 Z" fill="' + C.mandarina + '"/><path d="M50 6 L62 36 L94 38 L69 59 L50 74 Z" fill="' + C.amarillo + '" opacity=".7"/>'),
    trophy: svg(
      '<path d="M28 20 H14 C14 40 22 48 32 50" stroke="' + C.mandarinaOscura + '" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M72 20 H86 C86 40 78 48 68 50" stroke="' + C.mandarinaOscura + '" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M26 10 H74 V36 C74 54 63 64 50 64 C37 64 26 54 26 36 Z" fill="' + C.mandarina + '"/>' +
      '<rect x="44" y="62" width="12" height="14" fill="' + C.mandarinaOscura + '"/>' +
      '<rect x="28" y="76" width="44" height="14" rx="4" fill="' + C.mandarinaOscura + '"/>' +
      '<ellipse cx="40" cy="26" rx="4" ry="9" fill="#fff" opacity=".35"/>'
    ),
    crown: svg(
      '<path d="M12 76 L18 28 L36 50 L50 16 L64 50 L82 28 L88 76 Z" fill="' + C.amarillo + '"/>' +
      '<rect x="12" y="72" width="76" height="14" rx="3" fill="' + C.mandarina + '"/>' +
      '<circle cx="30" cy="79" r="4" fill="' + C.pomelo + '"/><circle cx="50" cy="79" r="4" fill="' + C.cielo + '"/><circle cx="70" cy="79" r="4" fill="' + C.pomelo + '"/>' +
      '<circle cx="18" cy="26" r="5" fill="' + C.amarillo + '"/><circle cx="50" cy="14" r="5" fill="' + C.amarillo + '"/><circle cx="82" cy="26" r="5" fill="' + C.amarillo + '"/>'
    ),
    gem: svg(
      '<path d="M26 26 H74 L92 44 L50 92 L8 44 Z" fill="' + C.cielo + '"/>' +
      '<path d="M26 26 L38 44 L50 26 Z M50 26 L62 44 L74 26 Z" fill="#fff" opacity=".45"/>' +
      '<path d="M8 44 H92 L50 92 Z" fill="#1FA8D6" opacity=".55"/><path d="M38 44 L50 92 L62 44 Z" fill="#fff" opacity=".25"/>'
    ),
    books: svg(
      '<rect x="14" y="66" width="72" height="18" rx="4" fill="' + C.pomelo + '"/>' +
      '<rect x="20" y="46" width="64" height="18" rx="4" fill="' + C.cielo + '" transform="rotate(-4 52 55)"/>' +
      '<rect x="18" y="26" width="60" height="18" rx="4" fill="' + C.limaOscura + '" transform="rotate(3 48 35)"/>' +
      '<rect x="22" y="71" width="56" height="4" rx="2" fill="#fff" opacity=".5"/><rect x="28" y="51" width="50" height="4" rx="2" fill="#fff" opacity=".5"/>'
    ),
    scales: svg(
      '<rect x="46" y="16" width="8" height="66" rx="3" fill="' + C.uva + '"/>' +
      '<rect x="30" y="80" width="40" height="10" rx="4" fill="' + C.uvaOscura + '"/>' +
      '<rect x="14" y="22" width="72" height="7" rx="3.5" fill="' + C.uva + '"/>' +
      '<path d="M20 28 L10 56 M20 28 L30 56 M80 28 L70 56 M80 28 L90 56" stroke="' + C.uvaOscura + '" stroke-width="2.5"/>' +
      '<path d="M6 56 H34 C34 66 28 72 20 72 C12 72 6 66 6 56 Z" fill="' + C.mandarina + '"/>' +
      '<path d="M66 56 H94 C94 66 88 72 80 72 C72 72 66 66 66 56 Z" fill="' + C.mandarina + '"/>' +
      '<circle cx="50" cy="14" r="6" fill="' + C.uva + '"/>'
    ),
    globe: svg(
      '<circle cx="50" cy="50" r="42" fill="' + C.cielo + '"/>' +
      '<path d="M30 22 C40 26 44 34 38 40 C32 46 22 44 18 52 C14 44 18 30 30 22 Z M56 30 C66 28 78 34 82 46 C76 50 70 46 64 50 C58 54 62 64 56 70 C50 64 48 56 52 48 C56 42 50 36 56 30 Z M40 66 C48 68 52 76 48 88 C40 86 34 80 32 72 C34 68 36 66 40 66 Z" fill="' + C.lima + '"/>'
    ),
    stopwatch: svg(
      '<rect x="42" y="6" width="16" height="10" rx="3" fill="' + C.cielo + '"/>' +
      '<rect x="72" y="18" width="10" height="8" rx="3" fill="' + C.cielo + '" transform="rotate(40 77 22)"/>' +
      '<circle cx="50" cy="56" r="38" fill="' + C.cielo + '"/><circle cx="50" cy="56" r="30" fill="#fff"/>' +
      '<path d="M50 56 L50 34" stroke="' + C.tinta + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M50 56 L64 64" stroke="' + C.pomelo + '" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="56" r="4" fill="' + C.tinta + '"/>'
    ),
    calendar: svg(
      '<rect x="12" y="18" width="76" height="72" rx="10" fill="#fff" stroke="#E2D6C2" stroke-width="3"/>' +
      '<path d="M12 28 C12 22 16 18 22 18 H78 C84 18 88 22 88 28 V40 H12 Z" fill="' + C.pomelo + '"/>' +
      '<rect x="28" y="8" width="8" height="20" rx="4" fill="' + C.tinta + '"/><rect x="64" y="8" width="8" height="20" rx="4" fill="' + C.tinta + '"/>' +
      '<g fill="' + C.limaOscura + '"><rect x="24" y="50" width="12" height="10" rx="2"/><rect x="44" y="50" width="12" height="10" rx="2"/><rect x="64" y="50" width="12" height="10" rx="2"/>' +
      '<rect x="24" y="68" width="12" height="10" rx="2"/><rect x="44" y="68" width="12" height="10" rx="2"/></g>' +
      '<rect x="64" y="68" width="12" height="10" rx="2" fill="' + C.pomelo + '"/>'
    ),
    rainbow: svg(
      '<g fill="none" stroke-width="7">' +
      '<path d="M8 80 A42 42 0 0 1 92 80" stroke="' + C.pomelo + '"/><path d="M15 80 A35 35 0 0 1 85 80" stroke="' + C.mandarina + '"/>' +
      '<path d="M22 80 A28 28 0 0 1 78 80" stroke="' + C.amarillo + '"/><path d="M29 80 A21 21 0 0 1 71 80" stroke="' + C.limaOscura + '"/>' +
      '<path d="M36 80 A14 14 0 0 1 64 80" stroke="' + C.cielo + '"/></g>' +
      '<ellipse cx="14" cy="82" rx="12" ry="7" fill="#fff"/><ellipse cx="86" cy="82" rx="12" ry="7" fill="#fff"/>'
    ),
    dice: svg(
      '<rect x="14" y="14" width="72" height="72" rx="16" fill="' + C.pomelo + '" transform="rotate(-8 50 50)"/>' +
      '<g fill="#fff" transform="rotate(-8 50 50)"><circle cx="34" cy="34" r="7"/><circle cx="66" cy="34" r="7"/><circle cx="50" cy="50" r="7"/><circle cx="34" cy="66" r="7"/><circle cx="66" cy="66" r="7"/></g>'
    ),
    thumb: svg(
      '<rect x="10" y="44" width="20" height="46" rx="5" fill="' + C.cielo + '"/>' +
      '<path d="M34 48 L50 16 C54 8 66 10 65 22 L62 40 H82 C89 40 93 46 91 53 L84 82 C82 88 78 90 72 90 H34 Z" fill="' + C.amarillo + '"/>' +
      '<path d="M36 62 H86 M38 74 H82" stroke="' + C.amarilloOscuro + '" stroke-width="3" stroke-linecap="round" opacity=".6"/>'
    ),
  };

  window.iconSvg = function (name) {
    return ICONS[name] || "";
  };

  // Dónde va la cara en cada fruta: centro (x, y) y tamaño respecto de la manzana.
  var FACE_SPOTS = {
    "🍎": [50, 64, 1], "🍏": [50, 64, 1], "🍊": [50, 60, 0.9], "🍋": [50, 60, 0.8],
    "🍌": [47, 63, 0.56], "🍉": [50, 46, 0.62], "🍇": [53, 58, 0.72], "🍓": [50, 60, 0.8],
    "🍒": [33, 71, 0.46], "🍑": [50, 62, 0.9], "🍍": [50, 67, 0.72], "🥝": [50, 54, 0.62], "🥥": [50, 54, 0.66],
    "🍐": [50, 74, 0.7], "🥭": [53, 60, 0.82], "🫐": [50, 72, 0.6],
    "🍅": [50, 62, 0.85], "🥑": [50, 47, 0.5], "🍈": [50, 58, 0.85], "🍎✨": [50, 64, 1],
  };

  function inner(markup) {
    return markup.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  }

  // ---------- Accesorios de la tienda (se dibujan sobre la cara de la mascota) ----------
  // Coordenadas pensadas sobre la manzana (ojos en y=60, frente en y=40, base en y=88);
  // después se ubican en cada fruta con la misma posición y escala que la cara.
  var ACCESSORIES = {
    // Gorros
    cap:
      '<path d="M28 40 C28 22 38 14 50 14 C62 14 72 22 72 40 Z" fill="' + C.cielo + '"/>' +
      '<path d="M60 38 C72 36 84 38 92 43 C80 45 68 44 60 42 Z" fill="#1FA6D0"/>' +
      '<path d="M50 14 L50 40" stroke="#1FA6D0" stroke-width="2"/><circle cx="50" cy="14" r="3" fill="' + C.crema + '"/>',
    straw:
      '<ellipse cx="50" cy="40" rx="40" ry="8" fill="#E9C46A"/>' +
      '<path d="M32 40 C32 22 40 14 50 14 C60 14 68 22 68 40 Z" fill="#F2D27E"/>' +
      '<path d="M32 33 C44 36 56 36 68 33 L68 39 C56 42 44 42 32 39 Z" fill="' + C.pomelo + '"/>' +
      '<path d="M16 42 C30 45 70 45 84 42" stroke="#D4A843" stroke-width="1.5" fill="none"/>',
    beanie:
      '<path d="M26 42 C26 20 38 10 50 10 C62 10 74 20 74 42 Z" fill="' + C.uva + '"/>' +
      '<rect x="24" y="34" width="52" height="10" rx="5" fill="' + C.uvaOscura + '"/>' +
      '<g stroke="' + C.uva + '" stroke-width="2"><path d="M32 35 V43"/><path d="M40 35 V43"/><path d="M48 35 V43"/><path d="M56 35 V43"/><path d="M64 35 V43"/></g>' +
      '<circle cx="50" cy="9" r="7" fill="' + C.crema + '"/>',
    tophat:
      '<ellipse cx="50" cy="40" rx="28" ry="6" fill="' + C.tinta + '"/>' +
      '<rect x="35" y="4" width="30" height="36" rx="3" fill="' + C.tinta + '"/>' +
      '<rect x="35" y="30" width="30" height="6" fill="' + C.pomelo + '"/>' +
      '<rect x="38" y="7" width="4" height="20" rx="2" fill="#fff" opacity=".15"/>',
    party:
      '<path d="M34 42 L50 4 L66 42 Z" fill="' + C.lima + '"/>' +
      '<path d="M40 28 L46 14 L50 22 Z M44 42 L52 22 L58 36 Z" fill="' + C.cielo + '"/>' +
      '<path d="M37 36 L63 36 L66 42 L34 42 Z" fill="' + C.pomelo + '"/>' +
      '<circle cx="50" cy="5" r="5" fill="' + C.mandarina + '"/>',
    witch:
      '<ellipse cx="50" cy="40" rx="34" ry="7" fill="' + C.uvaOscura + '"/>' +
      '<path d="M34 40 L46 12 C48 5 57 2 66 6 C59 8 55 12 54 17 L66 40 Z" fill="' + C.uva + '"/>' +
      '<path d="M36 33 L64 33 L66 40 L34 40 Z" fill="' + C.mandarina + '"/>' +
      '<rect x="46" y="32" width="8" height="8" rx="1.5" fill="none" stroke="' + C.amarillo + '" stroke-width="2"/>' +
      '<path d="M48 14 C50 10 55 7 60 7" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".15"/>',
    // Colección de temporada (Primavera / Verano): se venden solo durante su temporada.
    coronaflores:
      '<path d="M24 41 C34 33 66 33 76 41" stroke="' + C.limaOscura + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M35 36 C33 32 36 30 38 31 M65 36 C67 32 64 30 62 31" stroke="' + C.lima + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<circle cx="30.0" cy="34.6" r="3.1" fill="#FF8FAE"/><circle cx="33.2" cy="37.0" r="3.1" fill="#FF8FAE"/><circle cx="32.0" cy="40.8" r="3.1" fill="#FF8FAE"/><circle cx="28.0" cy="40.8" r="3.1" fill="#FF8FAE"/><circle cx="26.8" cy="37.0" r="3.1" fill="#FF8FAE"/><circle cx="30" cy="38" r="2" fill="' + C.amarillo + '"/><circle cx="40.0" cy="30.1" r="3.1" fill="#FFFFFF"/><circle cx="43.2" cy="32.5" r="3.1" fill="#FFFFFF"/><circle cx="42.0" cy="36.3" r="3.1" fill="#FFFFFF"/><circle cx="38.0" cy="36.3" r="3.1" fill="#FFFFFF"/><circle cx="36.8" cy="32.5" r="3.1" fill="#FFFFFF"/><circle cx="40" cy="33.5" r="2" fill="' + C.amarillo + '"/><circle cx="50.0" cy="28.1" r="3.1" fill="#C9A8FF"/><circle cx="53.2" cy="30.5" r="3.1" fill="#C9A8FF"/><circle cx="52.0" cy="34.3" r="3.1" fill="#C9A8FF"/><circle cx="48.0" cy="34.3" r="3.1" fill="#C9A8FF"/><circle cx="46.8" cy="30.5" r="3.1" fill="#C9A8FF"/><circle cx="50" cy="31.5" r="2" fill="' + C.amarillo + '"/><circle cx="60.0" cy="30.1" r="3.1" fill="#FFFFFF"/><circle cx="63.2" cy="32.5" r="3.1" fill="#FFFFFF"/><circle cx="62.0" cy="36.3" r="3.1" fill="#FFFFFF"/><circle cx="58.0" cy="36.3" r="3.1" fill="#FFFFFF"/><circle cx="56.8" cy="32.5" r="3.1" fill="#FFFFFF"/><circle cx="60" cy="33.5" r="2" fill="' + C.amarillo + '"/><circle cx="70.0" cy="34.6" r="3.1" fill="#FF8FAE"/><circle cx="73.2" cy="37.0" r="3.1" fill="#FF8FAE"/><circle cx="72.0" cy="40.8" r="3.1" fill="#FF8FAE"/><circle cx="68.0" cy="40.8" r="3.1" fill="#FF8FAE"/><circle cx="66.8" cy="37.0" r="3.1" fill="#FF8FAE"/><circle cx="70" cy="38" r="2" fill="' + C.amarillo + '"/>',
    // Halloween (se venden del 25/9 al 5/11, como el Sombrero de bruja)
    calabaza:
      '<ellipse cx="50" cy="31" rx="23" ry="14" fill="#F57C12"/><ellipse cx="38" cy="31" rx="10" ry="13" fill="#FF8F26"/><ellipse cx="62" cy="31" rx="10" ry="13" fill="#FF8F26"/>' +
      '<ellipse cx="50" cy="31" rx="9" ry="14" fill="#FFA23F"/>' +
      '<path d="M43.5 28.5 L46.5 24 L49 28.5 Z M51 28.5 L53.5 24 L56.5 28.5 Z" fill="#5A2B00"/>' +
      '<path d="M42 34 C45 38.5 55 38.5 58 34 L55.5 35 L53.5 33.2 L51.5 35.2 L48.5 35.2 L46.5 33.2 L44.5 35 Z" fill="#5A2B00"/>' +
      '<path d="M50 18 C49.4 13 51.2 9 55 7" stroke="#5B7F2A" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M52 13 C56.5 9 63.5 9.5 64.5 13.5 C60 15.5 55.5 15 52 13 Z" fill="#7DBB3A"/>' +
      '<path d="M41 22 C44 19.5 48 18.8 51 19.2" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".25"/>',
    murcielago:
      '<path d="M50 55 C46 51.5 41 51 36 53 C30 50 24 49 16 51.5 C19.5 55 20 59 17.5 63 C23 61.5 27 64 31 68.5 C37.5 69 43.5 65.5 50 63.5 C56.5 65.5 62.5 69 69 68.5 C73 64 77 61.5 82.5 63 C80 59 80.5 55 84 51.5 C76 49 70 50 64 53 C59 51 54 51.5 50 55 Z" fill="#2A1E3D"/>' +
      '<path d="M44.5 53.5 L46.2 47.5 L49 52.5 Z M55.5 53.5 L53.8 47.5 L51 52.5 Z" fill="#2A1E3D"/>' +
      '<ellipse cx="38" cy="59.5" rx="6.5" ry="4.2" fill="' + C.tinta + '"/><ellipse cx="62" cy="59.5" rx="6.5" ry="4.2" fill="' + C.tinta + '"/>' +
      '<path d="M22 55 C25 54 28 54.5 30 56" stroke="#5B4785" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M78 55 C75 54 72 54.5 70 56" stroke="#5B4785" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
    colmillos:
      '<path d="M42.6 68.2 L45 75 L47.4 68.6 Z M52.6 68.6 L55 75 L57.4 68.2 Z" fill="#fff"/>' +
      '<path d="M43.6 69 L45 72.5" stroke="' + C.tinta + '" stroke-width=".6" opacity=".25"/><path d="M56.4 69 L55 72.5" stroke="' + C.tinta + '" stroke-width=".6" opacity=".25"/>' +
      '<path d="M20 86 C30 79 40 82 50 86 C60 82 70 79 80 86 L74 96 L50 90 L26 96 Z" fill="#B3122E"/><path d="M26 96 L50 90 L74 96" stroke="#7A0C20" stroke-width="1.5" fill="none"/>',
    // Día de Muertos (evento del 25/10 al 5/11)
    cempasuchil:
      '<path d="M22 42 C34 32 66 32 78 42" stroke="#4E9A2A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M33 37 C29 33 30 29 33 29 C35 31 35 34 33 37 Z M67 37 C71 33 70 29 67 29 C65 31 65 34 67 37 Z" fill="#6FB51F"/><circle cx="26" cy="40" r="6.2" fill="#F28C0F"/><circle cx="29.8" cy="40" r="2.6" fill="#FFA62B"/><circle cx="28.7" cy="42.7" r="2.6" fill="#FFA62B"/><circle cx="26" cy="43.8" r="2.6" fill="#FFA62B"/><circle cx="23.3" cy="42.7" r="2.6" fill="#FFA62B"/><circle cx="22.2" cy="40" r="2.6" fill="#FFA62B"/><circle cx="23.3" cy="37.3" r="2.6" fill="#FFA62B"/><circle cx="26" cy="36.2" r="2.6" fill="#FFA62B"/><circle cx="28.7" cy="37.3" r="2.6" fill="#FFA62B"/><circle cx="26" cy="40" r="2.6" fill="#FFC23D"/><circle cx="37.5" cy="33.5" r="6.8" fill="#F28C0F"/><circle cx="41.7" cy="33.5" r="2.9" fill="#FFA62B"/><circle cx="40.5" cy="36.5" r="2.9" fill="#FFA62B"/><circle cx="37.5" cy="37.7" r="2.9" fill="#FFA62B"/><circle cx="34.5" cy="36.5" r="2.9" fill="#FFA62B"/><circle cx="33.3" cy="33.5" r="2.9" fill="#FFA62B"/><circle cx="34.5" cy="30.5" r="2.9" fill="#FFA62B"/><circle cx="37.5" cy="29.3" r="2.9" fill="#FFA62B"/><circle cx="40.5" cy="30.5" r="2.9" fill="#FFA62B"/><circle cx="37.5" cy="33.5" r="2.9" fill="#FFC23D"/><circle cx="50" cy="31" r="7.4" fill="#F28C0F"/><circle cx="54.6" cy="31" r="3.1" fill="#FFA62B"/><circle cx="53.2" cy="34.2" r="3.1" fill="#FFA62B"/><circle cx="50" cy="35.6" r="3.1" fill="#FFA62B"/><circle cx="46.8" cy="34.2" r="3.1" fill="#FFA62B"/><circle cx="45.4" cy="31" r="3.1" fill="#FFA62B"/><circle cx="46.8" cy="27.8" r="3.1" fill="#FFA62B"/><circle cx="50" cy="26.4" r="3.1" fill="#FFA62B"/><circle cx="53.2" cy="27.8" r="3.1" fill="#FFA62B"/><circle cx="50" cy="31" r="3.1" fill="#FFC23D"/><circle cx="62.5" cy="33.5" r="6.8" fill="#F28C0F"/><circle cx="66.7" cy="33.5" r="2.9" fill="#FFA62B"/><circle cx="65.5" cy="36.5" r="2.9" fill="#FFA62B"/><circle cx="62.5" cy="37.7" r="2.9" fill="#FFA62B"/><circle cx="59.5" cy="36.5" r="2.9" fill="#FFA62B"/><circle cx="58.3" cy="33.5" r="2.9" fill="#FFA62B"/><circle cx="59.5" cy="30.5" r="2.9" fill="#FFA62B"/><circle cx="62.5" cy="29.3" r="2.9" fill="#FFA62B"/><circle cx="65.5" cy="30.5" r="2.9" fill="#FFA62B"/><circle cx="62.5" cy="33.5" r="2.9" fill="#FFC23D"/><circle cx="74" cy="40" r="6.2" fill="#F28C0F"/><circle cx="77.8" cy="40" r="2.6" fill="#FFA62B"/><circle cx="76.7" cy="42.7" r="2.6" fill="#FFA62B"/><circle cx="74" cy="43.8" r="2.6" fill="#FFA62B"/><circle cx="71.3" cy="42.7" r="2.6" fill="#FFA62B"/><circle cx="70.2" cy="40" r="2.6" fill="#FFA62B"/><circle cx="71.3" cy="37.3" r="2.6" fill="#FFA62B"/><circle cx="74" cy="36.2" r="2.6" fill="#FFA62B"/><circle cx="76.7" cy="37.3" r="2.6" fill="#FFA62B"/><circle cx="74" cy="40" r="2.6" fill="#FFC23D"/>',
    catrina:
      '<circle cx="40" cy="60" r="10.5" fill="none" stroke="#FFF3E2" stroke-width="1.6" opacity=".9"/><ellipse cx="53.2" cy="60" rx="1.6" ry="2.8" transform="rotate(90 53.2 60)" fill="#FF5E5B"/><ellipse cx="50.7" cy="67.8" rx="1.6" ry="2.8" transform="rotate(126 50.7 67.8)" fill="#9C6BFF"/><ellipse cx="44.1" cy="72.6" rx="1.6" ry="2.8" transform="rotate(162 44.1 72.6)" fill="#35C8F2"/><ellipse cx="35.9" cy="72.6" rx="1.6" ry="2.8" transform="rotate(198 35.9 72.6)" fill="#FFD23F"/><ellipse cx="29.3" cy="67.8" rx="1.6" ry="2.8" transform="rotate(234 29.3 67.8)" fill="#FF5E5B"/><ellipse cx="26.8" cy="60" rx="1.6" ry="2.8" transform="rotate(270 26.8 60)" fill="#9C6BFF"/><ellipse cx="29.3" cy="52.2" rx="1.6" ry="2.8" transform="rotate(306 29.3 52.2)" fill="#35C8F2"/><ellipse cx="35.9" cy="47.4" rx="1.6" ry="2.8" transform="rotate(342 35.9 47.4)" fill="#FFD23F"/><ellipse cx="44.1" cy="47.4" rx="1.6" ry="2.8" transform="rotate(378 44.1 47.4)" fill="#FF5E5B"/><ellipse cx="50.7" cy="52.2" rx="1.6" ry="2.8" transform="rotate(414 50.7 52.2)" fill="#9C6BFF"/><circle cx="60" cy="60" r="10.5" fill="none" stroke="#FFF3E2" stroke-width="1.6" opacity=".9"/><ellipse cx="73.2" cy="60" rx="1.6" ry="2.8" transform="rotate(90 73.2 60)" fill="#FF5E5B"/><ellipse cx="70.7" cy="67.8" rx="1.6" ry="2.8" transform="rotate(126 70.7 67.8)" fill="#9C6BFF"/><ellipse cx="64.1" cy="72.6" rx="1.6" ry="2.8" transform="rotate(162 64.1 72.6)" fill="#35C8F2"/><ellipse cx="55.9" cy="72.6" rx="1.6" ry="2.8" transform="rotate(198 55.9 72.6)" fill="#FFD23F"/><ellipse cx="49.3" cy="67.8" rx="1.6" ry="2.8" transform="rotate(234 49.3 67.8)" fill="#FF5E5B"/><ellipse cx="46.8" cy="60" rx="1.6" ry="2.8" transform="rotate(270 46.8 60)" fill="#9C6BFF"/><ellipse cx="49.3" cy="52.2" rx="1.6" ry="2.8" transform="rotate(306 49.3 52.2)" fill="#35C8F2"/><ellipse cx="55.9" cy="47.4" rx="1.6" ry="2.8" transform="rotate(342 55.9 47.4)" fill="#FFD23F"/><ellipse cx="64.1" cy="47.4" rx="1.6" ry="2.8" transform="rotate(378 64.1 47.4)" fill="#FF5E5B"/><ellipse cx="70.7" cy="52.2" rx="1.6" ry="2.8" transform="rotate(414 70.7 52.2)" fill="#9C6BFF"/><circle cx="50" cy="38.8" r="2.6" fill="#FF8FAE"/><circle cx="53" cy="41" r="2.6" fill="#FF8FAE"/><circle cx="51.9" cy="44.6" r="2.6" fill="#FF8FAE"/><circle cx="48.1" cy="44.6" r="2.6" fill="#FF8FAE"/><circle cx="47" cy="41" r="2.6" fill="#FF8FAE"/><circle cx="50" cy="42" r="1.8" fill="#FFD23F"/><path d="M48 63 Q50 60 52 63 Q50 66 48 63 Z" fill="#14101F"/><circle cx="40" cy="77" r="1.2" fill="#14101F" opacity=".75"/><circle cx="45" cy="78" r="1.2" fill="#14101F" opacity=".75"/><circle cx="50" cy="78.4" r="1.2" fill="#14101F" opacity=".75"/><circle cx="55" cy="78" r="1.2" fill="#14101F" opacity=".75"/><circle cx="60" cy="77" r="1.2" fill="#14101F" opacity=".75"/>',
    pandemuerto:
      '<ellipse cx="90" cy="77" rx="13" ry="5" fill="#B9672A"/><path d="M77 77 C77 64 84 58 90 58 C96 58 103 64 103 77 Z" fill="#E39A4F"/><path d="M80 72 C83 66 86 70 89 64 C92 70 95 66 100 72" stroke="#C47A35" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M90 60 C88 64 92 66 90 71" stroke="#C47A35" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="90" cy="58" r="3.4" fill="#C47A35"/><g fill="#FFF3E2" opacity=".9"><circle cx="82" cy="68" r=".9"/><circle cx="86" cy="63" r=".9"/><circle cx="95" cy="63" r=".9"/><circle cx="98" cy="69" r=".9"/><circle cx="93" cy="74" r=".9"/><circle cx="85" cy="74" r=".9"/></g>',
    mariposa:
      '<g transform="rotate(-12 74 66)"><path d="M74 66 C68 56 60 58 62 65 C63 69 69 69 74 66 Z" fill="#FF8FAE"/><path d="M74 66 C80 56 88 58 86 65 C85 69 79 69 74 66 Z" fill="#FF8FAE"/>' +
      '<path d="M74 66 C69 70 66 76 70 77 C73 77 74 72 74 66 Z" fill="#C9A8FF"/><path d="M74 66 C79 70 82 76 78 77 C75 77 74 72 74 66 Z" fill="#C9A8FF"/>' +
      '<rect x="73" y="59" width="2" height="15" rx="1" fill="' + C.tinta + '"/><path d="M74 59 L71 54 M74 59 L77 54" stroke="' + C.tinta + '" stroke-width="1.2" stroke-linecap="round"/></g>',
    margarita:
      '<path d="M92 92 C91 80 91 68 90 56" stroke="' + C.limaOscura + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M91 76 C84 72 82 66 84 64 C88 66 91 70 91 76 Z" fill="' + C.lima + '"/>' +
      '<g fill="#fff"><ellipse cx="90" cy="44" rx="3" ry="6"/><ellipse cx="90" cy="60" rx="3" ry="6"/><ellipse cx="82" cy="52" rx="6" ry="3"/><ellipse cx="98" cy="52" rx="6" ry="3"/>' +
      '<ellipse cx="84.5" cy="46.5" rx="3" ry="5.5" transform="rotate(-45 84.5 46.5)"/><ellipse cx="95.5" cy="46.5" rx="3" ry="5.5" transform="rotate(45 95.5 46.5)"/>' +
      '<ellipse cx="84.5" cy="57.5" rx="3" ry="5.5" transform="rotate(45 84.5 57.5)"/><ellipse cx="95.5" cy="57.5" rx="3" ry="5.5" transform="rotate(-45 95.5 57.5)"/></g>' +
      '<circle cx="90" cy="52" r="4.5" fill="' + C.amarillo + '"/>',
    flotador:
      '<ellipse cx="50" cy="88" rx="38" ry="10" fill="none" stroke="' + C.pomelo + '" stroke-width="9"/>' +
      '<ellipse cx="50" cy="88" rx="38" ry="10" fill="none" stroke="#fff" stroke-width="9" stroke-dasharray="11 15"/>' +
      '<ellipse cx="38" cy="81" rx="5" ry="1.6" fill="#fff" opacity=".5"/>',
    sombrilla:
      '<path d="M93 98 L93 46" stroke="' + C.crema + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M73 48 C73 34 83 28 93 28 C103 28 113 34 113 48 Z" fill="' + C.pomelo + '"/>' +
      '<path d="M86 48 C86 36 89 29 93 28 C97 29 100 36 100 48 Z" fill="#fff"/>' +
      '<path d="M73 48 C76 45 80 45 83 48 C86 45 90 45 93 48 C96 45 100 45 103 48 C106 45 110 45 113 48" stroke="' + C.pomeloOscuro + '" stroke-width="1.6" fill="none"/>' +
      '<circle cx="93" cy="27" r="2" fill="' + C.amarillo + '"/>',
    gafacorazon:
      '<path d="M38 70 C30 64 26 60 28 56 C30 52 35 53 38 57 C41 53 46 52 48 56 C50 60 46 64 38 70 Z" fill="#FF5C8A" stroke="' + C.tinta + '" stroke-width="1.6"/>' +
      '<path d="M62 70 C54 64 50 60 52 56 C54 52 59 53 62 57 C65 53 70 52 72 56 C74 60 70 64 62 70 Z" fill="#FF5C8A" stroke="' + C.tinta + '" stroke-width="1.6"/>' +
      '<path d="M47 57 C49 55 51 55 53 57" stroke="' + C.tinta + '" stroke-width="2" fill="none"/>' +
      '<path d="M28 57 L20 54 M72 57 L80 54" stroke="' + C.tinta + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<ellipse cx="33" cy="58" rx="2" ry="1.2" fill="#fff" opacity=".7"/><ellipse cx="57" cy="58" rx="2" ry="1.2" fill="#fff" opacity=".7"/>',
    antifaz:
      '<path d="M22 56 C26 50 36 50 42 54 C46 56 54 56 58 54 C64 50 74 50 78 56 C80 62 76 70 68 70 C61 70 57 64 50 64 C43 64 39 70 32 70 C24 70 20 62 22 56 Z" fill="' + C.uva + '"/>' +
      '<ellipse cx="34" cy="60" rx="6.5" ry="4.5" fill="' + C.tinta + '"/><ellipse cx="66" cy="60" rx="6.5" ry="4.5" fill="' + C.tinta + '"/>' +
      '<g fill="' + C.amarillo + '"><circle cx="50" cy="56" r="2"/><circle cx="26" cy="54" r="1.4"/><circle cx="74" cy="54" r="1.4"/></g>' +
      '<path d="M78 56 C86 48 90 40 88 30" stroke="' + C.pomelo + '" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M88 30 C84 26 86 20 92 22 C96 24 94 30 88 30 Z" fill="' + C.cielo + '"/>',
    serpentina:
      '<path d="M18 84 C24 78 30 90 36 84 C42 78 48 90 54 84 C60 78 66 90 72 84 C78 78 84 90 88 84" stroke="' + C.pomelo + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M16 90 C22 84 28 96 34 90 C40 84 46 96 52 90 C58 84 64 96 70 90" stroke="' + C.cielo + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M76 92 C80 86 86 92 84 98" stroke="' + C.amarillo + '" stroke-width="3" fill="none" stroke-linecap="round"/>',
    maraca:
      '<path d="M92 94 L90 70" stroke="' + C.marron + '" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="89" cy="58" rx="11" ry="14" fill="' + C.pomelo + '"/>' +
      '<path d="M79 54 C86 58 92 58 99 54" stroke="' + C.amarillo + '" stroke-width="3" fill="none"/><path d="M80 63 C86 67 92 67 98 63" stroke="' + C.lima + '" stroke-width="3" fill="none"/>' +
      '<ellipse cx="85" cy="50" rx="3" ry="4" fill="#fff" opacity=".45"/>',
    crown:
      '<path d="M28 42 L30 16 L40 28 L50 8 L60 28 L70 16 L72 42 Z" fill="' + C.amarillo + '"/>' +
      '<rect x="28" y="36" width="44" height="8" rx="2" fill="' + C.mandarina + '"/>' +
      '<circle cx="38" cy="40" r="2.5" fill="' + C.pomelo + '"/><circle cx="50" cy="40" r="2.5" fill="' + C.cielo + '"/><circle cx="62" cy="40" r="2.5" fill="' + C.pomelo + '"/>' +
      '<circle cx="30" cy="15" r="3" fill="' + C.amarillo + '"/><circle cx="50" cy="7" r="3" fill="' + C.amarillo + '"/><circle cx="70" cy="15" r="3" fill="' + C.amarillo + '"/>',
    sombrero:
      '<ellipse cx="50" cy="40" rx="44" ry="9" fill="' + C.amarillo + '"/>' +
      '<ellipse cx="50" cy="40" rx="44" ry="9" fill="none" stroke="' + C.amarilloOscuro + '" stroke-width="2"/>' +
      '<path d="M34 40 C34 20 40 12 50 12 C60 12 66 20 66 40 Z" fill="' + C.amarillo + '"/>' +
      '<path d="M35 34 L40 29 L45 34 L50 29 L55 34 L60 29 L65 34 L65 39 L35 39 Z" fill="' + C.pomelo + '"/>' +
      '<path d="M12 42 C30 47 70 47 88 42" stroke="' + C.lima + '" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/>',
    santa:
      '<path d="M30 40 C32 22 44 10 60 12 C70 14 78 22 82 30 C76 26 70 26 66 30 L70 40 Z" fill="' + C.pomelo + '"/>' +
      '<rect x="26" y="34" width="48" height="10" rx="5" fill="#fff"/>' +
      '<circle cx="84" cy="32" r="6" fill="#fff"/>',
    // Pase de temporada del hemisferio norte (app-norte.js): Otoño (t1n) e Invierno (t2n)
    boina:
      '<path d="M22 42 C18 30 30 18 50 17 C72 16 84 26 80 38 C72 44 32 46 22 42 Z" fill="#B5651D"/>' +
      '<path d="M24 41 C38 45.5 62 45.5 78 39" stroke="#7A3F12" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M50 18 C50 14 52 11 55 10" stroke="#7A3F12" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M32 26 C40 21 52 20 62 21" stroke="#D9894A" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>' +
      '<g transform="translate(70 33) rotate(-20)"><path d="M0 9 C-7 9 -11 4 -10 -3 C-6 -2 -3 -6 0 -10 C3 -6 6 -2 10 -3 C11 4 7 9 0 9 Z" fill="#F2C230"/>' +
      '<path d="M0 8 V-6" stroke="#B5651D" stroke-width="1.4"/></g>',
    paraguas:
      '<path d="M88 63 L88 89 C88 95 81 95 81 90" stroke="#5A3A22" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M69 63 C69 46 107 46 107 63 C104 60 101 60 97.5 63 C94 60 91 60 88 63 C85 60 82 60 78.5 63 C75 60 72 60 69 63 Z" fill="#E23A4E"/>' +
      '<path d="M88 47.5 C83 52 80.5 57 78.5 63 M88 47.5 C93 52 95.5 57 97.5 63" stroke="#B02236" stroke-width="1.6" fill="none"/>' +
      '<path d="M88 47.5 V44" stroke="#5A3A22" stroke-width="2.4" stroke-linecap="round"/>',
    escocesa:
      '<path d="M22 80 C36 90 64 90 78 80 L80 88 C64 98 36 98 20 88 Z" fill="#D64541"/>' +
      '<path d="M60 88 L64 104 L74 102 L68 86 Z" fill="#D64541"/>' +
      '<path d="M21 86 C36 95 64 95 79 86" stroke="#F2C230" stroke-width="1.6" fill="none"/>' +
      '<g stroke="#A8322A" stroke-width="2"><path d="M30 89 L29.5 94"/><path d="M40 91 L39.5 96"/><path d="M50 92 L50 97"/><path d="M60 91 L60.5 96"/><path d="M70 89 L70.5 93"/></g>' +
      '<g stroke="#1F5F3A" stroke-width="2.2"><path d="M61.5 93 L71 91.5"/><path d="M63 99 L72.5 97.5"/></g><path d="M66 87.5 L70 102.5" stroke="#F2C230" stroke-width="1.2"/>' +
      '<g stroke="#FFF3E2" stroke-width="1.6" stroke-linecap="round"><path d="M65 103 L65 106"/><path d="M68.5 102.5 L68.5 105.5"/><path d="M72 102 L72 105"/></g>',
    orejeras:
      '<path d="M24 58 C22 30 36 16 50 16 C64 16 78 30 76 58" stroke="#5B6B8C" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<circle cx="23" cy="60" r="10" fill="#FFF3E2"/><circle cx="77" cy="60" r="10" fill="#FFF3E2"/>' +
      '<circle cx="23" cy="60" r="6" fill="#9FD8F5"/><circle cx="77" cy="60" r="6" fill="#9FD8F5"/>' +
      '<g fill="#fff" opacity=".7"><circle cx="20" cy="57" r="1.8"/><circle cx="74" cy="57" r="1.8"/></g>',
    chocolate:
      '<path d="M101 72 C108 72 108 82 101 82" stroke="#E9E2F2" stroke-width="3.4" fill="none"/>' +
      '<path d="M78 66 H102 V84 C102 90 97 93 90 93 C83 93 78 90 78 84 Z" fill="#E9E2F2"/>' +
      '<ellipse cx="90" cy="66" rx="12" ry="3.4" fill="#6B3A1E"/>' +
      '<g fill="#FFF3E2"><circle cx="86" cy="64" r="2.6"/><circle cx="92" cy="63.4" r="2.4"/><circle cx="89" cy="61.6" r="2.2"/></g>' +
      '<path d="M85 58 C83 54 87 52 85 48 M93 57 C91 53 95 51 93 47" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".6"/>' +
      '<path d="M81 76 H99" stroke="#E23A4E" stroke-width="3"/>',
    antiparras:
      '<path d="M18 60 C18 52 30 50 50 50 C70 50 82 52 82 60 C82 68 72 71 62 70 C56 69 54 65 50 65 C46 65 44 69 38 70 C28 71 18 68 18 60 Z" fill="#35C8F2" stroke="' + C.tinta + '" stroke-width="2.4"/>' +
      '<path d="M24 56 C32 53 44 53 50 54" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".7"/>' +
      '<path d="M18 59 H10 M82 59 H90" stroke="#E23A4E" stroke-width="5" stroke-linecap="round"/>',
    // Navidad (se venden del 1/12 al 6/1, como el Gorro de Papá Noel; app-navidad.js)
    renos:
      '<g stroke="#8A5527" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
      '<path d="M33 44 C27 32 20 22 10 10"/><path d="M24 30 C17 29 11 27 4 22"/><path d="M17 20 C18 13 17 7 14 1"/>' +
      '<path d="M67 44 C73 32 80 22 90 10"/><path d="M76 30 C83 29 89 27 96 22"/><path d="M83 20 C82 13 83 7 86 1"/></g>' +
      '<g stroke="#B9824B" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M31 39 C26 30 20 22 12 13"/><path d="M69 39 C74 30 80 22 88 13"/></g>' +
      '<ellipse cx="27" cy="47" rx="7" ry="4.2" transform="rotate(-30 27 47)" fill="#B9824B"/><ellipse cx="73" cy="47" rx="7" ry="4.2" transform="rotate(30 73 47)" fill="#B9824B"/>' +
      '<ellipse cx="27" cy="47" rx="3.6" ry="2" transform="rotate(-30 27 47)" fill="#E8A9A0"/><ellipse cx="73" cy="47" rx="3.6" ry="2" transform="rotate(30 73 47)" fill="#E8A9A0"/>',
    // Premio de "Decorá tu arbolito" (app-arbolito.js): no se vende.
    estrella:
      '<path d="M50 2 L57.5 17.5 L74.5 19.5 L62 31 L65.5 48 L50 39.5 L34.5 48 L38 31 L25.5 19.5 L42.5 17.5 Z" fill="#FFD23F" stroke="#E8A400" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M50 11 L54 20 L63.5 21 L56.5 27.5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>' +
      '<g fill="#FFF3B0"><circle cx="20" cy="10" r="2.2"/><circle cx="82" cy="8" r="2.6"/><circle cx="86" cy="34" r="1.8"/><circle cx="15" cy="34" r="1.6"/></g>',
    luces:
      '<path d="M18 80 C30 89 42 92 50 92 C58 92 70 89 82 80" stroke="#2F6B2A" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<g stroke="#2F6B2A" stroke-width="1.6"><path d="M24 84.5 V87"/><path d="M34 89 V91.5"/><path d="M44.5 91.4 V94"/><path d="M55.5 91.4 V94"/><path d="M66 89 V91.5"/><path d="M76 84.5 V87"/></g>' +
      '<ellipse cx="24" cy="91" rx="3.2" ry="4.6" fill="#FF4D5E"/><ellipse cx="34" cy="95.5" rx="3.2" ry="4.6" fill="#FFD23F"/><ellipse cx="44.5" cy="98" rx="3.2" ry="4.6" fill="#35C8F2"/>' +
      '<ellipse cx="55.5" cy="98" rx="3.2" ry="4.6" fill="#7DD13B"/><ellipse cx="66" cy="95.5" rx="3.2" ry="4.6" fill="#FF4D5E"/><ellipse cx="76" cy="91" rx="3.2" ry="4.6" fill="#FFD23F"/>' +
      '<g fill="#fff" opacity=".55"><circle cx="23" cy="89.5" r="1"/><circle cx="33" cy="94" r="1"/><circle cx="43.5" cy="96.5" r="1"/><circle cx="54.5" cy="96.5" r="1"/><circle cx="65" cy="94" r="1"/><circle cx="75" cy="89.5" r="1"/></g>',
    baston:
      '<path d="M88 96 L88 62 C88 52 100 52 100 62" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M88 96 L88 62 C88 52 100 52 100 62" stroke="#E23A4E" stroke-width="7" fill="none" stroke-linecap="butt" stroke-dasharray="4.5 4.5"/>' +
      '<path d="M86.6 92 L86.6 63" stroke="#fff" stroke-width="1.4" opacity=".5" stroke-linecap="round"/>',
    // Cara
    mustache:
      '<path d="M50 67 C45 61 36 60 30 66 C33 69 38 70 42 69 C45 68.5 48 68 50 69 C52 68 55 68.5 58 69 C62 70 67 69 70 66 C64 60 55 61 50 67 Z" fill="#5A3A22"/>',
    facepaint:
      '<g stroke-width="2.6" stroke-linecap="round"><path d="M22 65 L33 65" stroke="' + C.cielo + '"/><path d="M22 70 L33 70" stroke="#fff"/><path d="M22 75 L33 75" stroke="' + C.cielo + '"/>' +
      '<path d="M67 65 L78 65" stroke="' + C.cielo + '"/><path d="M67 70 L78 70" stroke="#fff"/><path d="M67 75 L78 75" stroke="' + C.cielo + '"/></g>',
    bandaid:
      '<g transform="rotate(-28 66 47)"><rect x="55" y="43" width="22" height="8" rx="4" fill="#F2C9A0"/><rect x="63" y="43" width="6" height="8" fill="#E3B283"/>' +
      '<circle cx="58.5" cy="47" r=".9" fill="#C99A6E"/><circle cx="73.5" cy="47" r=".9" fill="#C99A6E"/></g>',
    sparkles:
      '<g fill="' + C.amarillo + '"><path d="M22 50 L24 55 L29 57 L24 59 L22 64 L20 59 L15 57 L20 55 Z"/>' +
      '<path d="M80 46 L81.5 50 L85.5 51.5 L81.5 53 L80 57 L78.5 53 L74.5 51.5 L78.5 50 Z"/>' +
      '<path d="M76 78 L77 81 L80 82 L77 83 L76 86 L75 83 L72 82 L75 81 Z"/></g>',
    // En la mano (se dibujan al costado de la fruta)
    balloon:
      '<path d="M88 86 C84 76 92 66 90 50" stroke="' + C.crema + '" stroke-width="1.5" fill="none"/>' +
      '<ellipse cx="91" cy="38" rx="11" ry="13" fill="' + C.pomelo + '"/><path d="M89 51 L93 51 L91 48 Z" fill="' + C.pomeloOscuro + '"/>' +
      '<ellipse cx="87" cy="33" rx="3" ry="5" fill="#fff" opacity=".35"/>',
    mic:
      '<rect x="84" y="66" width="7" height="24" rx="3.5" transform="rotate(18 87 78)" fill="' + C.tinta + '"/>' +
      '<circle cx="92" cy="63" r="8" fill="#B9B4C7"/><path d="M86 60 L98 66 M87 66 L97 60" stroke="#8C87A0" stroke-width="1.2"/>',
    icecream:
      '<rect x="88" y="72" width="4" height="18" rx="2" fill="#E3B283"/>' +
      '<rect x="80" y="44" width="20" height="32" rx="10" fill="' + C.rosa + '"/>' +
      '<path d="M80 56 C86 60 94 52 100 56 L100 66 C94 62 86 70 80 66 Z" fill="' + C.crema + '" opacity=".85"/>',
    trophy:
      '<path d="M80 58 L100 58 L98 70 C97 76 94 78 90 78 C86 78 83 76 82 70 Z" fill="' + C.amarillo + '"/>' +
      '<path d="M80 60 C74 60 74 68 81 69 M100 60 C106 60 106 68 99 69" stroke="' + C.amarilloOscuro + '" stroke-width="2.4" fill="none"/>' +
      '<rect x="88" y="78" width="4" height="6" fill="' + C.amarilloOscuro + '"/><rect x="83" y="84" width="14" height="5" rx="1.5" fill="' + C.amarilloOscuro + '"/>',
    mate:
      '<path d="M97 48 L91 70" stroke="#C9C4D6" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M78 70 C78 62 84 60 90 60 C96 60 102 62 102 70 C102 82 96 90 90 90 C84 90 78 82 78 70 Z" fill="' + C.marron + '"/>' +
      '<ellipse cx="90" cy="62" rx="10" ry="3" fill="' + C.palta + '"/>' +
      '<path d="M80 74 C86 77 94 77 100 74" stroke="' + C.mandarina + '" stroke-width="2" fill="none"/>',
    // Anteojos
    sunglasses:
      '<path d="M28 56 H48 V62 C48 67 44 70 39 70 C33 70 28 67 28 62 Z" fill="' + C.tinta + '"/>' +
      '<path d="M52 56 H72 V62 C72 67 67 70 61 70 C56 70 52 67 52 62 Z" fill="' + C.tinta + '"/>' +
      '<path d="M46 57 H54" stroke="' + C.tinta + '" stroke-width="3"/>' +
      '<path d="M28 57 L20 54 M72 57 L80 54" stroke="' + C.tinta + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M31 59 L36 59" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/><path d="M55 59 L60 59" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/>',
    roundglasses:
      '<circle cx="40" cy="60" r="9" fill="#fff" fill-opacity=".18" stroke="' + C.marron + '" stroke-width="3"/>' +
      '<circle cx="60" cy="60" r="9" fill="#fff" fill-opacity=".18" stroke="' + C.marron + '" stroke-width="3"/>' +
      '<path d="M49 59 Q50 56 51 59" stroke="' + C.marron + '" stroke-width="3" fill="none"/>' +
      '<path d="M31 58 L22 55 M69 58 L78 55" stroke="' + C.marron + '" stroke-width="2.5" stroke-linecap="round"/>',
    // Cuello
    bowtie:
      '<path d="M50 88 L34 80 L34 96 Z" fill="' + C.pomelo + '"/><path d="M50 88 L66 80 L66 96 Z" fill="' + C.pomelo + '"/>' +
      '<rect x="45" y="83" width="10" height="10" rx="3" fill="' + C.pomeloOscuro + '"/>',
    scarf:
      '<path d="M22 80 C36 90 64 90 78 80 L80 88 C64 98 36 98 20 88 Z" fill="' + C.cielo + '"/>' +
      '<path d="M60 88 L64 104 L74 102 L68 86 Z" fill="' + C.cielo + '"/>' +
      '<g stroke="' + C.crema + '" stroke-width="2.5"><path d="M34 88 L32 94"/><path d="M46 90 L45 96"/><path d="M58 90 L58 96"/><path d="M65 95 L72 94"/></g>',
  };
  var SLOT_ORDER = ["neck", "face", "glasses", "hat", "hand"];
  // Frutas que no tienen forma de manzana: el gorro, lo del cuello y lo que se tiene en la mano no
  // siguen a la cara (quedarían adentro de la fruta o chiquitos) sino que van a su lugar en cada una.
  // [x, y, escala]: dónde cae el ala del gorro (en la manzana: 50,40), el centro del cuello (50,88)
  // y la mano (85,72). Con un cuarto valor "izq", lo de la mano se dibuja del lado izquierdo.
  var ANCLA_MANZANA = { hat: [50, 40], neck: [50, 88], hand: [85, 72] };
  var FIT = {
    "🥑": { hat: [50, 22, 0.62], neck: [50, 91, 0.72], hand: [80, 70, 0.72] },
    "🥝": { hat: [50, 23, 0.9], neck: [50, 89, 0.85], hand: [86, 66, 0.85] },
    "🥥": { hat: [50, 23, 0.9], neck: [50, 89, 0.85], hand: [86, 66, 0.85] },
    "🍉": { hat: [50, 34, 0.8], neck: [50, 74, 0.7], hand: [86, 50, 0.75] },
    "🫐": { hat: [50, 52, 0.72], neck: [50, 88, 0.7], hand: [85, 68, 0.72] },
    "🍇": { neck: [53, 85, 0.75], hand: [80, 62, 0.75] },
    "🍍": { hat: [50, 45, 0.78], neck: [50, 91, 0.78], hand: [75, 72, 0.78] },
    "🍐": { hat: [50, 40, 0.62], neck: [50, 91, 0.75], hand: [77, 76, 0.75] },
    "🍌": { hat: [46, 48, 0.68], neck: [52, 80, 0.62], hand: [84, 62, 0.65] },
    "🍒": { hat: [33, 58, 0.52], neck: [33, 87, 0.52], hand: [17, 74, 0.55, "izq"] },
    "🍋": { neck: [50, 84, 0.8], hand: [88, 62, 0.8] },
  };
  // Accesorios de la cabeza que van a la altura de la cara (orejeras): siguen a la cara en cualquier fruta, no al
  // lugar del gorro (en la banana, la uva o la palta quedaban corridas, tapando la cara o flotando arriba).
  var SIGUEN_CARA = { orejeras: true };
  function ubicar(slot, fit, item) {
    var r = ANCLA_MANZANA[slot];
    var espejo = fit[3] === "izq" ? -1 : 1;
    return '<g transform="translate(' + fit[0] + " " + fit[1] + ") scale(" + (espejo * fit[2]) + " " + fit[2] + ") translate(" + (-r[0]) + " " + (-r[1]) + ')">' + item + "</g>";
  }

  window.mascotSvg = function (mood, fruit, acc) {
    var face = FACES[mood] || FACES.neutral;
    var key = Object.prototype.hasOwnProperty.call(FRUITS, fruit) ? fruit : "🍎";
    // Las semillas negras (sandía, kiwi) se confunden con los ojos: en la
    // mascota se dibujan sin ellas.
    var body = key === "🍎" ? apple(C.pomelo, C.lima, C.limaOscura)
      : inner(FRUITS[key]).replace(/<ellipse[^>]*fill="#14101F"[^>]*\/>/g, "");
    var spot = FACE_SPOTS[key];
    var extras = "", antes = "", despues = "", fit = FIT[key] || {};
    if (acc) SLOT_ORDER.forEach(function (slot) {
      if (!acc[slot] || !Object.prototype.hasOwnProperty.call(ACCESSORIES, acc[slot])) return;
      var item = ACCESSORIES[acc[slot]];
      if (!fit[slot] || SIGUEN_CARA[acc[slot]]) extras += item;
      else if (slot === "neck") antes += ubicar(slot, fit[slot], item);
      else despues += ubicar(slot, fit[slot], item);
    });
    var placed = '<g transform="translate(' + spot[0] + " " + spot[1] + ") scale(" + spot[2] + ') translate(-50 -64)">' + face + extras + "</g>";
    return '<svg class="mascot-svg" viewBox="0 0 100 100" style="overflow:visible" aria-hidden="true" focusable="false">' + body + antes + placed + despues + "</svg>";
  };
  // Accesorios que tiene puestos este jugador (se guardan con la billetera de semillas).
  window.myAccessories = function () {
    try {
      var w = JSON.parse(localStorage.getItem("tuttifruti_wallet") || "null");
      return (w && w.equipped && typeof w.equipped === "object") ? w.equipped : {};
    } catch (e) { return {}; }
  };

  // ---------- Logo: la fruta elegida por el jugador reemplaza a la manzana ----------
  var AVATAR_KEY = "tuttifruti_avatar";

  function logoFruitSvg(emoji) {
    if (emoji === "🍎" || !FRUITS[emoji]) {
      // La manzana original del logo, que toma el color del tema.
      return '<svg viewBox="10 4 80 88" aria-hidden="true" focusable="false">' +
        '<path d="' + APPLE_BODY + '" fill="var(--primary, #FF5E5B)"/><path d="' + LEAF_R + '" fill="#B6EF3C"/><path d="' + LEAF_L + '" fill="#8FD32E"/></svg>';
    }
    return FRUITS[emoji].replace('viewBox="0 0 100 100"', 'viewBox="6 6 88 88"');
  }

  window.applyLogoFruit = function (emoji) {
    var markup = logoFruitSvg(emoji);
    document.querySelectorAll(".apple-dot, .punto").forEach(function (el) { el.innerHTML = markup; });
    document.querySelectorAll("svg.simbolo").forEach(function (el) {
      el.outerHTML = markup.replace("<svg ", '<svg class="simbolo" ');
    });
  };

  function savedFruit() {
    try {
      var saved = localStorage.getItem(AVATAR_KEY);
      return FRUITS[saved] ? saved : null;
    } catch (e) {
      return null;
    }
  }

  function applySavedLogo() {
    var fruit = savedFruit();
    if (fruit && fruit !== "🍎") window.applyLogoFruit(fruit);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", applySavedLogo);
  else applySavedLogo();
})();
