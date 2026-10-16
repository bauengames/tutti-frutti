/* tutti.frutti · web (igual que en la app) · la gran actualización de la Aventura (la lógica está en jugar.html, sección Aventura).
   - 25 mundos de 10 niveles (el 10.º es el jefe) + mundos de temporada (Carnaval, desde el 28/12).
   - Reglas nuevas: palabras largas, termina con…, lluvia de ideas, cada acierto suma tiempo y cadena.
   - Categorías temáticas (cocina, viaje, casa, fiesta, naturaleza, ocio, carnaval).
   - Cofre al pasar cada jefe, modo experto con estrellas doradas, títulos y un marco exclusivos.
   Acá van los textos (es/en/pt), las explicaciones de cada regla, las frutas nuevas, dos íconos y la
   ventana del cofre. Se carga después de estilo.js. */
(function () {
  var MUNDOS = ADV_WORLDS.filter(function (W) { return !W.season; }).length;
  var NIVELES = MUNDOS * ADV_PER_WORLD;

  // ---------- Textos del juego (I18N) ----------
  var I = {
    es: {
      adv_map_lead: NIVELES + " niveles en " + MUNDOS + " mundos, y mundos de temporada. Llegá a la meta de puntos para pasar cada uno.",
      adv_banner_sub_done: "¡Completaste la Aventura! · {stars} estrellas",
      adv_wdesc_melon: "Todo lo aprendido",
      adv_wname_pera: "Pera", adv_wdesc_pera: "Cocina · palabras largas",
      adv_wname_manzanaverde: "Manzana verde", adv_wdesc_manzanaverde: "De viaje · termina con…",
      adv_wname_granada: "Granada", adv_wdesc_granada: "En casa · lluvia de ideas",
      adv_wname_higo: "Higo", adv_wdesc_higo: "De fiesta · cada acierto suma",
      adv_wname_ciruela: "Ciruela", adv_wdesc_ciruela: "Naturaleza · en cadena",
      adv_wname_frambuesa: "Frambuesa", adv_wdesc_frambuesa: "Todas las reglas nuevas",
      adv_wname_maracuya: "Maracuyá", adv_wdesc_maracuya: "Combos nuevos",
      adv_wname_carambola: "Carambola", adv_wdesc_carambola: "La gran final",
      adv_wname_carnaval: "Carnaval", adv_wdesc_carnaval: "Mundo de temporada",
      adv_rule_largas: "Palabras largas: cada palabra tiene que tener {m} letras o más.",
      adv_rule_termina: "Termina con {e}: todas las palabras tienen que terminar con la {e}.",
      adv_rule_lluvia: "Lluvia de ideas: una sola categoría ({c}) y {w} palabras distintas para escribir.",
      adv_rule_suma: "Cada acierto suma: las categorías salen de a una y cada palabra que completás suma {b} segundos al reloj.",
      adv_rule_cadena: "Cadena: las categorías salen de a una y cada palabra empieza con la última letra de la anterior.",
      adv_note_largas: "Mínimo {m} letras", adv_note_termina: "Terminan con {e}", adv_note_lluvia: "{w} de {c}",
      adv_note_suma: "+{b} s por palabra", adv_note_cadena: "En cadena",
      adv_reason_largas: "Tiene menos de {m} letras", adv_reason_termina: "No termina con {e}",
      adv_season_tag: "Temporada", adv_season_soon: "Llega el {date}",
      adv_chest_open: "Abrir el cofre del mundo", adv_chest_opened: "Cofre abierto", adv_gold_short: "doradas",
      adv_expert_hint: "Volvé a jugar los niveles en modo experto",
      adv_expert_title: "Experto", adv_expert_toggle: "Modo experto: menos tiempo y meta más alta · estrella dorada",
      adv_expert_done: "Modo experto (ya tenés la estrella dorada)", adv_gold_won: "¡Estrella dorada! +{n} semillas",
    },
    en: {
      adv_map_lead: NIVELES + " levels across " + MUNDOS + " worlds, plus seasonal worlds. Reach the target score to clear each one.",
      adv_banner_sub_done: "You beat the Adventure! · {stars} stars",
      adv_wdesc_melon: "Everything you learned",
      adv_wname_pera: "Pear", adv_wdesc_pera: "Kitchen · long words",
      adv_wname_manzanaverde: "Green apple", adv_wdesc_manzanaverde: "Travel · ends with…",
      adv_wname_granada: "Pomegranate", adv_wdesc_granada: "At home · brainstorm",
      adv_wname_higo: "Fig", adv_wdesc_higo: "Party · every word adds time",
      adv_wname_ciruela: "Plum", adv_wdesc_ciruela: "Nature · word chain",
      adv_wname_frambuesa: "Raspberry", adv_wdesc_frambuesa: "All the new rules",
      adv_wname_maracuya: "Passion fruit", adv_wdesc_maracuya: "New combos",
      adv_wname_carambola: "Star fruit", adv_wdesc_carambola: "The grand finale",
      adv_wname_carnaval: "Carnival", adv_wdesc_carnaval: "Seasonal world",
      adv_rule_largas: "Long words: every word must have {m} letters or more.",
      adv_rule_termina: "Ends with {e}: every word must end with the letter {e}.",
      adv_rule_lluvia: "Brainstorm: a single category ({c}) and {w} different words to write.",
      adv_rule_suma: "Every word adds time: categories appear one at a time and each word you complete adds {b} seconds.",
      adv_rule_cadena: "Word chain: categories appear one at a time and each word starts with the last letter of the previous one.",
      adv_note_largas: "{m}+ letters", adv_note_termina: "End with {e}", adv_note_lluvia: "{w} × {c}",
      adv_note_suma: "+{b} s per word", adv_note_cadena: "Word chain",
      adv_reason_largas: "Has fewer than {m} letters", adv_reason_termina: "Doesn't end with {e}",
      adv_season_tag: "Season", adv_season_soon: "Arrives on {date}",
      adv_chest_open: "Open the world chest", adv_chest_opened: "Chest opened", adv_gold_short: "gold",
      adv_expert_hint: "Replay the levels in expert mode",
      adv_expert_title: "Expert", adv_expert_toggle: "Expert mode: less time and a higher target · gold star",
      adv_expert_done: "Expert mode (you already have the gold star)", adv_gold_won: "Gold star! +{n} seeds",
    },
    pt: {
      adv_map_lead: NIVELES + " níveis em " + MUNDOS + " mundos, e mundos de temporada. Chegue à meta de pontos para passar cada um.",
      adv_banner_sub_done: "Você completou a Aventura! · {stars} estrelas",
      adv_wdesc_melon: "Tudo o que você aprendeu",
      adv_wname_pera: "Pera", adv_wdesc_pera: "Cozinha · palavras longas",
      adv_wname_manzanaverde: "Maçã verde", adv_wdesc_manzanaverde: "Viagem · termina com…",
      adv_wname_granada: "Romã", adv_wdesc_granada: "Em casa · chuva de ideias",
      adv_wname_higo: "Figo", adv_wdesc_higo: "Festa · cada acerto soma",
      adv_wname_ciruela: "Ameixa", adv_wdesc_ciruela: "Natureza · em corrente",
      adv_wname_frambuesa: "Framboesa", adv_wdesc_frambuesa: "Todas as regras novas",
      adv_wname_maracuya: "Maracujá", adv_wdesc_maracuya: "Combos novos",
      adv_wname_carambola: "Carambola", adv_wdesc_carambola: "A grande final",
      adv_wname_carnaval: "Carnaval", adv_wdesc_carnaval: "Mundo de temporada",
      adv_rule_largas: "Palavras longas: cada palavra precisa ter {m} letras ou mais.",
      adv_rule_termina: "Termina com {e}: todas as palavras precisam terminar com a letra {e}.",
      adv_rule_lluvia: "Chuva de ideias: uma só categoria ({c}) e {w} palavras diferentes para escrever.",
      adv_rule_suma: "Cada acerto soma: as categorias aparecem uma por vez e cada palavra completada soma {b} segundos.",
      adv_rule_cadena: "Corrente: as categorias aparecem uma por vez e cada palavra começa com a última letra da anterior.",
      adv_note_largas: "Mínimo {m} letras", adv_note_termina: "Terminam com {e}", adv_note_lluvia: "{w} de {c}",
      adv_note_suma: "+{b} s por palavra", adv_note_cadena: "Em corrente",
      adv_reason_largas: "Tem menos de {m} letras", adv_reason_termina: "Não termina com {e}",
      adv_season_tag: "Temporada", adv_season_soon: "Chega em {date}",
      adv_chest_open: "Abrir o baú do mundo", adv_chest_opened: "Baú aberto", adv_gold_short: "douradas",
      adv_expert_hint: "Jogue os níveis de novo no modo expert",
      adv_expert_title: "Expert", adv_expert_toggle: "Modo expert: menos tempo e meta mais alta · estrela dourada",
      adv_expert_done: "Modo expert (você já tem a estrela dourada)", adv_gold_won: "Estrela dourada! +{n} sementes",
    },
  };
  Object.keys(I).forEach(function (l) { if (I18N[l]) Object.assign(I18N[l], I[l]); });
  // Los textos fijos de la pantalla ya se tradujeron al cargar: se actualizan los que cambiaron.
  document.querySelectorAll('[data-i18n^="adv_"]').forEach(function (el) { el.textContent = t(el.dataset.i18n); });

  // ---------- Cómo se juega (la Aventura y cada regla nueva) ----------
  var H = {
    es: {
      adventure: ["Cómo se juega la Aventura", [
        "Son " + NIVELES + " niveles en " + MUNDOS + " mundos, y en cada temporada llega un mundo nuevo. Cada nivel tiene su letra, sus categorías y su tiempo.",
        "Llegá a la <strong>meta de puntos</strong> para pasarlo. Según cuántos hagas, ganás hasta 3 estrellas.",
        "Si no llegás a la meta, perdés una vida. Las vidas se recargan solas con el tiempo.",
        "Al final de cada mundo te espera un <strong>jefe</strong> y, si lo pasás, un <strong>cofre</strong> con premios. Con el mundo terminado, cada nivel se puede jugar en <strong>modo experto</strong> por una estrella dorada.",
      ]],
      rule_largas: ["Nueva regla: palabras largas", ["Cada palabra tiene que tener <strong>7 letras o más</strong>.", "Si es más corta, el casillero se pone rojo y no vale.", "Pensá en palabras como «Licuadora», «Mermelada», «Batidora»."]],
      rule_termina: ["Nueva regla: termina con…", ["Además de empezar con la letra de la ronda, cada palabra tiene que <strong>terminar con otra letra</strong>.", "Por ejemplo, con la M y terminando en A: «Mesa», «Marta», «Manzana».", "La letra del final la ves antes de empezar y arriba de las categorías."]],
      rule_lluvia: ["Nueva regla: lluvia de ideas", ["Hay <strong>una sola categoría</strong> y varios casilleros.", "Escribí todas las palabras distintas que puedas con la letra: «Perro», «Puma», «Pato»…", "Las repetidas no valen."]],
      rule_suma: ["Nueva regla: cada acierto suma", ["Arrancás con <strong>poco tiempo</strong> y las categorías salen de a una.", "Cada palabra que completás y tocás <strong>Siguiente</strong> suma <strong>8 segundos</strong> al reloj.", "Si pasás una categoría, no suma: ¡pensá rápido!"]],
      rule_cadena: ["Nueva regla: cadena", ["Las categorías salen de a una.", "La primera empieza con la letra de la ronda; cada una de las siguientes empieza con la <strong>última letra de tu palabra anterior</strong>.", "Ejemplo: «Gato» → «Oso» → «Oveja». Si pasás una, te toca una letra nueva."]],
    },
    en: {
      adventure: ["How Adventure works", [
        "There are " + NIVELES + " levels across " + MUNDOS + " worlds, and a new world arrives every season. Each level has its own letter, categories and time.",
        "Reach the <strong>target score</strong> to clear it. Depending on how many points you get, you earn up to 3 stars.",
        "If you miss the target, you lose a life. Lives refill on their own over time.",
        "At the end of each world there's a <strong>boss</strong> and, if you beat it, a <strong>chest</strong> with rewards. Once a world is done, every level can be replayed in <strong>expert mode</strong> for a gold star.",
      ]],
      rule_largas: ["New rule: long words", ["Every word must have <strong>7 letters or more</strong>.", "If it's shorter, the box turns red and it doesn't count.", "Think of words like “Blender”, “Marmalade”, “Saucepan”."]],
      rule_termina: ["New rule: ends with…", ["Besides starting with the round's letter, every word must <strong>end with another letter</strong>.", "For example, starting with M and ending in E: “Mouse”, “Maple”, “Mike”.", "You'll see the ending letter before you start and above the categories."]],
      rule_lluvia: ["New rule: brainstorm", ["There's <strong>a single category</strong> and several boxes.", "Write as many different words as you can with the letter: “Puma”, “Parrot”, “Panda”…", "Repeated words don't count."]],
      rule_suma: ["New rule: every word adds time", ["You start with <strong>little time</strong> and categories appear one at a time.", "Every word you complete and confirm with <strong>Next</strong> adds <strong>8 seconds</strong> to the clock.", "Skipping a category adds nothing — think fast!"]],
      rule_cadena: ["New rule: word chain", ["Categories appear one at a time.", "The first one starts with the round's letter; each next one starts with the <strong>last letter of your previous word</strong>.", "Example: “Cat” → “Tiger” → “Rabbit”. If you skip one, you get a new letter."]],
    },
    pt: {
      adventure: ["Como se joga a Aventura", [
        "São " + NIVELES + " níveis em " + MUNDOS + " mundos, e a cada temporada chega um mundo novo. Cada nível tem sua letra, suas categorias e seu tempo.",
        "Chegue à <strong>meta de pontos</strong> para passar. Dependendo de quantos pontos fizer, você ganha até 3 estrelas.",
        "Se não chegar à meta, perde uma vida. As vidas se recarregam sozinhas com o tempo.",
        "No fim de cada mundo há um <strong>chefe</strong> e, se você passar, um <strong>baú</strong> com prêmios. Com o mundo terminado, cada nível pode ser jogado no <strong>modo expert</strong> por uma estrela dourada.",
      ]],
      rule_largas: ["Nova regra: palavras longas", ["Cada palavra precisa ter <strong>7 letras ou mais</strong>.", "Se for mais curta, a casa fica vermelha e não vale.", "Pense em palavras como «Liquidificador», «Marmelada», «Batedeira»."]],
      rule_termina: ["Nova regra: termina com…", ["Além de começar com a letra da rodada, cada palavra precisa <strong>terminar com outra letra</strong>.", "Por exemplo, com M e terminando em A: «Mesa», «Marta», «Manga».", "A letra do final aparece antes de começar e acima das categorias."]],
      rule_lluvia: ["Nova regra: chuva de ideias", ["Há <strong>uma só categoria</strong> e várias casas.", "Escreva todas as palavras diferentes que puder com a letra: «Pato», «Puma», «Peixe»…", "As repetidas não valem."]],
      rule_suma: ["Nova regra: cada acerto soma", ["Você começa com <strong>pouco tempo</strong> e as categorias aparecem uma por vez.", "Cada palavra que você completa e confirma com <strong>Seguinte</strong> soma <strong>8 segundos</strong> ao relógio.", "Se pular uma categoria, não soma: pense rápido!"]],
      rule_cadena: ["Nova regra: corrente", ["As categorias aparecem uma por vez.", "A primeira começa com a letra da rodada; cada uma das seguintes começa com a <strong>última letra da sua palavra anterior</strong>.", "Exemplo: «Gato» → «Ovo» → «Ovelha». Se pular uma, você ganha uma letra nova."]],
    },
  };
  Object.keys(H).forEach(function (l) { if (HOWTO_TEXTS[l]) Object.assign(HOWTO_TEXTS[l], H[l]); });
  Object.assign(HOWTO_ICONS, { rule_largas: "scales", rule_termina: "ballot", rule_lluvia: "rainbow", rule_suma: "gem", rule_cadena: "cadena" });

  // ---------- Categorías temáticas ----------
  var CATS = {
    "Utensilio de cocina": ["Kitchen utensil", "Utensílio de cozinha"], "Ingrediente": ["Ingredient", "Ingrediente"],
    "Postre": ["Dessert", "Sobremesa"], "Algo de la heladera": ["Something in the fridge", "Algo da geladeira"],
    "Especia o condimento": ["Spice or seasoning", "Tempero ou condimento"], "Medio de transporte": ["Means of transport", "Meio de transporte"],
    "Algo para la valija": ["Something for your suitcase", "Algo para a mala"], "Lugar turístico": ["Tourist spot", "Ponto turístico"],
    "Idioma": ["Language", "Idioma"], "Capital": ["Capital city", "Capital"], "Mueble": ["Furniture", "Móvel"],
    "Algo del baño": ["Something in the bathroom", "Algo do banheiro"], "Herramienta": ["Tool", "Ferramenta"],
    "Electrodoméstico": ["Home appliance", "Eletrodoméstico"], "Prenda de ropa": ["Piece of clothing", "Peça de roupa"],
    "Planta o flor": ["Plant or flower", "Planta ou flor"], "Juego": ["Game", "Jogo"], "Canción": ["Song", "Música"],
    "Baile": ["Dance", "Dança"], "Algo de un cumpleaños": ["Something at a birthday party", "Algo de aniversário"],
    "Juguete": ["Toy", "Brinquedo"], "Insecto": ["Insect", "Inseto"], "Animal marino": ["Sea animal", "Animal marinho"],
    "Ave": ["Bird", "Ave"], "Árbol": ["Tree", "Árvore"], "Accidente geográfico": ["Landform", "Acidente geográfico"],
    "Superhéroe": ["Superhero", "Super-herói"], "Dibujo animado": ["Cartoon", "Desenho animado"], "Videojuego": ["Video game", "Videogame"],
    "Libro": ["Book", "Livro"], "Serie": ["TV series", "Série"], "Algo que brilla": ["Something that shines", "Algo que brilha"],
    "Algo de carnaval": ["Something from Carnival", "Algo de Carnaval"],
  };
  Object.keys(CATS).forEach(function (k) { if (!CATEGORY_LABELS[k]) CATEGORY_LABELS[k] = { es: k, en: CATS[k][0], pt: CATS[k][1] }; });

  // ---------- Frutas nuevas e íconos ----------
  function svg(inner) { return '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' + inner + "</svg>"; }
  var BRILLO = '<ellipse cx="34" cy="54" rx="5" ry="9" transform="rotate(20 34 54)" fill="#fff" opacity=".28"/>';
  var HOJA = function (x, y) { return '<path d="M' + x + " " + y + " C" + (x + 6) + " " + (y - 12) + " " + (x + 18) + " " + (y - 16) + " " + (x + 29) + " " + (y - 14) + " C" + (x + 25) + " " + (y - 4) + " " + (x + 14) + " " + (y + 1) + " " + x + " " + y + ' Z" fill="#8FD32E"/>'; };
  var FRUTAS = {
    granada: svg('<circle cx="50" cy="60" r="32" fill="#E23A4E"/>' +
      '<path d="M28 74 C38 88 62 90 74 76 C62 84 40 84 28 74 Z" fill="#B82238" opacity=".7"/>' +
      '<path d="M40 30 L42 18 L47 25 L50 15 L53 25 L58 18 L60 30 Z" fill="#B82238"/>' + BRILLO),
    higo: svg('<path d="M50 16 L50 26" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M50 24 C57 24 59 33 63 40 C75 49 82 58 80 71 C78 84 65 92 50 92 C35 92 22 84 20 71 C18 58 25 49 37 40 C41 33 43 24 50 24 Z" fill="#7B4FE0"/>' +
      '<path d="M30 78 C40 89 62 89 72 78 C60 84 42 84 30 78 Z" fill="#5A35B8"/>' + HOJA(52, 22) + BRILLO),
    ciruela: svg('<path d="M50 30 L48 16" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/>' + HOJA(50, 24) +
      '<ellipse cx="50" cy="60" rx="31" ry="30" fill="#B0407F"/>' +
      '<path d="M50 32 C42 48 42 72 50 89" stroke="#842D5E" stroke-width="3" fill="none" stroke-linecap="round"/>' + BRILLO),
    frambuesa: svg('<path d="M50 30 C42 22 32 22 26 26 C32 32 42 33 50 30 Z M50 30 C58 22 68 22 74 26 C68 32 58 33 50 30 Z" fill="#6FB51F"/>' +
      '<g fill="#F0476F"><circle cx="38" cy="42" r="9"/><circle cx="50" cy="40" r="9"/><circle cx="62" cy="42" r="9"/>' +
      '<circle cx="33" cy="56" r="9"/><circle cx="45" cy="55" r="9"/><circle cx="57" cy="55" r="9"/><circle cx="68" cy="56" r="9"/>' +
      '<circle cx="39" cy="69" r="9"/><circle cx="51" cy="69" r="9"/><circle cx="62" cy="69" r="9"/><circle cx="50" cy="81" r="9"/></g>' +
      '<g fill="#fff" opacity=".35"><circle cx="35" cy="39" r="2.4"/><circle cx="42" cy="52" r="2.4"/><circle cx="36" cy="66" r="2.4"/></g>'),
    maracuya: svg('<circle cx="50" cy="54" r="38" fill="#6B2E5E"/>' +
      '<circle cx="50" cy="54" r="31" fill="#FFF3E2"/><circle cx="50" cy="54" r="27" fill="#FFC83D"/>' +
      '<g fill="#14101F"><circle cx="40" cy="44" r="2.6"/><circle cx="55" cy="40" r="2.6"/><circle cx="63" cy="52" r="2.6"/><circle cx="46" cy="56" r="2.6"/>' +
      '<circle cx="58" cy="64" r="2.6"/><circle cx="40" cy="66" r="2.6"/><circle cx="52" cy="72" r="2.6"/><circle cx="36" cy="55" r="2.6"/></g>' +
      '<ellipse cx="40" cy="38" rx="6" ry="3" transform="rotate(-30 40 38)" fill="#fff" opacity=".45"/>'),
    carambola: svg('<path d="M50 10 L61 38 L91 39 L67 57 L76 87 L50 70 L24 87 L33 57 L9 39 L39 38 Z" fill="#FFD23F" stroke="#FFD23F" stroke-width="8" stroke-linejoin="round"/>' +
      '<path d="M50 30 L55 45 L71 46 L58 55 L63 71 L50 62 L37 71 L42 55 L29 46 L45 45 Z" fill="#EDB800"/>' +
      '<ellipse cx="38" cy="36" rx="5" ry="3" transform="rotate(-25 38 36)" fill="#fff" opacity=".45"/>'),
    carnaval: svg('<path d="M50 30 C44 14 34 8 26 8 C30 18 38 26 50 30 Z" fill="#9C6BFF"/><path d="M50 30 C56 14 66 8 74 8 C70 18 62 26 50 30 Z" fill="#FFD23F"/>' +
      '<path d="M50 30 C48 18 50 10 54 4 C56 14 55 22 50 30 Z" fill="#35C8F2"/>' +
      '<path d="M8 50 C8 36 22 30 36 33 C42 34 46 38 50 38 C54 38 58 34 64 33 C78 30 92 36 92 50 C92 66 80 74 66 72 C58 71 54 64 50 64 C46 64 42 71 34 72 C20 74 8 66 8 50 Z" fill="#FF4FA3"/>' +
      '<ellipse cx="32" cy="52" rx="10" ry="7" fill="#14101F"/><ellipse cx="68" cy="52" rx="10" ry="7" fill="#14101F"/>' +
      '<g fill="#FFD23F"><circle cx="18" cy="46" r="2"/><circle cx="50" cy="50" r="2.4"/><circle cx="82" cy="46" r="2"/><circle cx="24" cy="62" r="2"/><circle cx="76" cy="62" r="2"/></g>'),
  };
  var frutaAntes = window.fruitSvg;
  window.fruitSvg = function (clave) { return FRUTAS[clave] || frutaAntes.apply(this, arguments); };

  var ICONOS = {
    cadena: svg('<rect x="10" y="34" width="46" height="32" rx="16" fill="none" stroke="#9C6BFF" stroke-width="10"/>' +
      '<rect x="44" y="34" width="46" height="32" rx="16" fill="none" stroke="#FFD23F" stroke-width="10"/>' +
      '<path d="M44 40 V60" stroke="#9C6BFF" stroke-width="10"/>'),
    cofre: svg('<path d="M14 44 C14 26 30 18 50 18 C70 18 86 26 86 44 Z" fill="#B7824E"/>' +
      '<rect x="14" y="44" width="72" height="40" rx="6" fill="#8B5A2B"/>' +
      '<rect x="14" y="40" width="72" height="9" fill="#FFC83D"/><rect x="44" y="18" width="12" height="66" fill="#FFC83D" opacity=".9"/>' +
      '<rect x="41" y="44" width="18" height="18" rx="4" fill="#FFF3E2"/><circle cx="50" cy="52" r="3" fill="#14101F"/><path d="M50 52 V58" stroke="#14101F" stroke-width="3" stroke-linecap="round"/>'),
  };
  var iconoAntes = window.iconSvg;
  window.iconSvg = function (nombre) { return ICONOS[nombre] || iconoAntes.apply(this, arguments); };

  // ---------- Cofre ----------
  var T = {
    es: { titulo: "¡Cofre del Mundo {m}!", semillas: "{n} semillas", seguir: "¡Genial!", nuevo_titulo: "Nuevo título: «{t}»", nuevo_marco: "Nuevo marco: «{t}»",
      hint: "Pista", clock: "Reloj extra", shield: "Escudo", joker: "Comodín", reroll: "Cambiar letra", experto: "Ahora podés jugar este mundo en modo experto para ganar estrellas doradas." },
    en: { titulo: "{m} World chest!", semillas: "{n} seeds", seguir: "Great!", nuevo_titulo: "New title: “{t}”", nuevo_marco: "New frame: “{t}”",
      hint: "Hint", clock: "Extra time", shield: "Shield", joker: "Joker", reroll: "New letter", experto: "You can now replay this world in expert mode to earn gold stars." },
    pt: { titulo: "Baú do Mundo {m}!", semillas: "{n} sementes", seguir: "Legal!", nuevo_titulo: "Novo título: «{t}»", nuevo_marco: "Nova moldura: «{t}»",
      hint: "Dica", clock: "Relógio extra", shield: "Escudo", joker: "Coringa", reroll: "Trocar letra", experto: "Agora você pode jogar este mundo no modo expert para ganhar estrelas douradas." },
  };
  function tx(clave, vars) {
    var str = (T[state.lang] || T.es)[clave] || T.es[clave] || clave;
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return str;
  }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }
  // Premios de estilo que se anuncian una sola vez (títulos y marco por mundos pasados).
  var ANUNCIOS = [[5, "titulo", "explorador"], [10, "marco", "madera"], [15, "titulo", "conquistador"], [25, "titulo", "maestro"]];
  var KEY_ANUNCIOS = "tuttifruti_app_aventura_anuncios";
  window.appAventuraCofre = function (w, premio) {
    var d = advLoad();
    var principales = ADV_WORLDS.filter(function (W, k) { return !W.season && advWorldDone(d, k); }).length;
    var vistos = [];
    try { vistos = JSON.parse(localStorage.getItem(KEY_ANUNCIOS) || "[]"); } catch (e) { vistos = []; }
    var nuevos = ANUNCIOS.filter(function (a) { return principales >= a[0] && vistos.indexOf(a[2]) < 0; });
    try { localStorage.setItem(KEY_ANUNCIOS, JSON.stringify(vistos.concat(nuevos.map(function (a) { return a[2]; })))); } catch (e) { /* nada */ }
    var W = ADV_WORLDS[w];
    var filas = '<li>' + seedIcon() + "<span>" + esc(tx("semillas", { n: premio.seeds })) + "</span></li>" +
      '<li><span class="av-cofre-item">' + premio.qty + "×</span><span>" + esc(tx(premio.item)) + "</span></li>" +
      nuevos.map(function (a) {
        var nombre = APP.txCosmeticos ? APP.txCosmeticos((a[1] === "marco" ? "m_" : "t_") + a[2]) : a[2];
        return "<li>" + iconSvg("crown") + "<span><strong>" + esc(tx(a[1] === "marco" ? "nuevo_marco" : "nuevo_titulo", { t: nombre })) + "</strong></span></li>";
      }).join("");
    var hoja = APP.abrirHoja(
      '<div class="av-cofre">' + '<span class="av-cofre-arte">' + iconSvg("cofre") + '<span class="av-cofre-fruta">' + fruitSvg(W.fruit) + "</span></span>" +
      "<h2>" + esc(tx("titulo", { m: advWorldName(W) })) + '</h2><ul class="av-cofre-lista">' + filas + "</ul>" +
      '<p class="hint">' + esc(tx("experto")) + "</p>" +
      '<button type="button" class="btn btn-primary btn-block av-cofre-ok">' + esc(tx("seguir")) + "</button></div>", "av-cofre-hoja");
    hoja.tarjeta.querySelector(".av-cofre-ok").onclick = hoja.cerrar;
    launchConfetti();
    if (typeof playDing === "function") playDing();
    if (window.vibrar) vibrar("bien");
  };
})();
