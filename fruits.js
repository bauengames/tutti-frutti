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
    crown:
      '<path d="M28 42 L30 16 L40 28 L50 8 L60 28 L70 16 L72 42 Z" fill="' + C.amarillo + '"/>' +
      '<rect x="28" y="36" width="44" height="8" rx="2" fill="' + C.mandarina + '"/>' +
      '<circle cx="38" cy="40" r="2.5" fill="' + C.pomelo + '"/><circle cx="50" cy="40" r="2.5" fill="' + C.cielo + '"/><circle cx="62" cy="40" r="2.5" fill="' + C.pomelo + '"/>' +
      '<circle cx="30" cy="15" r="3" fill="' + C.amarillo + '"/><circle cx="50" cy="7" r="3" fill="' + C.amarillo + '"/><circle cx="70" cy="15" r="3" fill="' + C.amarillo + '"/>',
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
  var SLOT_ORDER = ["neck", "glasses", "hat"];

  window.mascotSvg = function (mood, fruit, acc) {
    var face = FACES[mood] || FACES.neutral;
    var key = FRUITS[fruit] ? fruit : "🍎";
    // Las semillas negras (sandía, kiwi) se confunden con los ojos: en la
    // mascota se dibujan sin ellas.
    var body = key === "🍎" ? apple(C.pomelo, C.lima, C.limaOscura)
      : inner(FRUITS[key]).replace(/<ellipse[^>]*fill="#14101F"[^>]*\/>/g, "");
    var spot = FACE_SPOTS[key];
    var extras = "";
    if (acc) SLOT_ORDER.forEach(function (slot) { if (acc[slot] && ACCESSORIES[acc[slot]]) extras += ACCESSORIES[acc[slot]]; });
    var placed = '<g transform="translate(' + spot[0] + " " + spot[1] + ") scale(" + spot[2] + ') translate(-50 -64)">' + face + extras + "</g>";
    return '<svg class="mascot-svg" viewBox="0 0 100 100" style="overflow:visible" aria-hidden="true" focusable="false">' + body + placed + "</svg>";
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
