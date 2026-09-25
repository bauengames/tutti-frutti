/* tutti.frutti · traducción de las páginas de contenido (home, reglas, privacidad, términos, contacto).
   Usa la misma clave de localStorage que el juego (tuttifruti_lang) para que el idioma
   elegido en cualquiera de los dos lugares quede consistente en el resto del sitio. */

var SITE_I18N = {
  es: {
    nav_home: "Inicio",
    nav_reglas: "Reglas del juego",
    nav_privacidad: "Privacidad",
    nav_terminos: "Términos de uso",
    nav_contacto: "Contacto",
    play_now_btn: "Jugar ahora",
    last_updated_prefix: "Última actualización:",

    home_title: "tutti.frutti · Tutti frutti online con amigos",
    home_description: "Jugá al tutti frutti online gratis con amigos o con un rival al azar (el mismo juego que en otros países se conoce como Stop o Basta). Armá la sala, se sortea la letra y un juez con IA resuelve las dudas.",
    home_hero_lead: "Tutti frutti online —también conocido como Stop o Basta—, con amigos o con un rival al azar. Armá una sala, invitá a quien quieras y jueguen en tiempo real: se sortea una letra, completan categorías a contrarreloj y un juez con inteligencia artificial resuelve las palabras en disputa.",
    home_card1_title: "Salas privadas",
    home_card1_body: "Creá una sala, compartí el código o el link con tus amigos y jueguen todos juntos en tiempo real.",
    home_card2_title: "Rival al azar",
    home_card2_body: "Si no tenés con quién jugar, buscamos un rival disponible en ese momento para armar la partida.",
    home_card3_title: "Juez con IA",
    home_card3_body: "Cuando una respuesta se objeta y no hay acuerdo, un juez automático decide si vale o no, sin discusiones eternas.",
    home_quickplay_kicker: "Jugá ahora",
    label_player_name: "Tu nombre",
    avatar_label: "Tu fruta",
    install_app_btn: "Instalar la app",
    player_name_placeholder: "¿Cómo te llamás?",
    home_how_link: "¿Cómo se juega? Mirá las reglas completas →",
    home_how_heading: "¿Cómo se juega?",
    home_step1_title: "Se sortea una letra",
    home_step1_desc: "Al arrancar la ronda se elige una letra al azar entre las habilitadas para la sala.",
    home_step2_title: "Completá las categorías",
    home_step2_desc: "Escribí una palabra que empiece con esa letra en cada categoría, antes de que se acabe el tiempo.",
    home_step3_title: "Tocá ¡Basta!",
    home_step3_desc: "En cuanto termines, cualquiera puede tocar ¡Basta! y la ronda se corta para todos.",
    home_step4_title: "El juez resuelve las dudas",
    home_step4_desc: "Si una respuesta se objeta y no hay acuerdo, un juez con IA decide si vale, sin discusiones eternas.",
    home_how_p2_html: 'Para conocer el detalle completo de puntajes, objeciones y el funcionamiento del juez con IA, mirá la página de <a href="reglas.html">reglas del juego</a>.',

    reglas_title: "Reglas del juego · tutti.frutti",
    reglas_description: "Cómo se juega al tutti frutti online (también llamado Stop o Basta según el país): rondas, letras, puntajes, objeciones y el juez con inteligencia artificial.",
    reglas_h1: "Reglas del juego",
    reglas_lead: "Todo lo que necesitás saber para jugar una partida, desde armar la sala hasta entender cómo se resuelven las disputas.",
    reglas_s1_heading: "Armar una partida",
    reglas_s1_li1_html: '<strong>Crear sala:</strong> elegís categorías, tiempo por ronda, cantidad de rondas y qué letras entran en juego. Se genera un código de 5 caracteres que podés compartir por código o por link — quien abra el link entra directo a la sala.',
    reglas_s1_li2_html: '<strong>Unirme a sala:</strong> pedís el código a quien creó la sala y jugás con la configuración que eligió esa persona.',
    reglas_s1_li3_html: '<strong>Sala al azar:</strong> te empareja con quien esté buscando partida en ese momento, con categorías y reglas fijas. Si nadie aparece en unos segundos, podés seguir esperando o cancelar la búsqueda.',
    reglas_s2_heading: "Cómo se juega una ronda",
    reglas_s2_p_html: 'Al arrancar la ronda se sortea una letra entre las habilitadas para esa sala. Todos los jugadores completan al mismo tiempo las categorías elegidas (por ejemplo Nombre, Animal, Comida, Color) con palabras que empiecen con esa letra. Apenas alguien termina, toca <strong>¡Basta!</strong> y la ronda se corta para todos los jugadores en simultáneo.',
    reglas_s3_heading: "Revisión y objeciones",
    reglas_s3_intro: "Antes de calcular el puntaje hay una breve ventana de revisión donde se pueden objetar respuestas:",
    reglas_s3_li1: "Una palabra que no empieza con la letra de la ronda vale 0 automáticamente, sin necesidad de objetarla.",
    reglas_s3_li2_html: 'Si alguien objeta una respuesta, queda "en disputa". El autor puede tocar <strong>"La acepto"</strong> y la palabra vale 0 directamente.',
    reglas_s3_li3: "En salas de 3 o más jugadores, si todos los demás (menos el autor) objetan la misma palabra, vale 0 sin necesidad de nada más.",
    reglas_s3_li4_html: 'Si la disputa sigue abierta al cerrarse la revisión, decide un <strong>juez con inteligencia artificial</strong>: evalúa si la palabra empieza con la letra correcta y si pertenece razonablemente a la categoría, aceptando regionalismos y errores menores de ortografía.',
    reglas_s3_li5_html: 'Si el juez determina que la palabra es <strong>válida</strong>, cada jugador que la objetó sin razón pierde 5 puntos. Si la determina <strong>inválida</strong>, la palabra vale 0 y no hay penalidad para nadie.',
    reglas_s3_li6: "Si el juez no llega a responder a tiempo, todas las palabras en disputa de esa ronda se dan por válidas y no se aplica ninguna penalidad — la partida nunca queda trabada esperando.",
    reglas_s4_heading: "Puntaje por categoría",
    reglas_table_th_points: "Puntos",
    reglas_table_th_situation: "Situación",
    reglas_table_row0: "Dejaste la categoría vacía, o la palabra quedó invalidada.",
    reglas_table_row5: "Otro jugador escribió la misma palabra (comparando sin tildes ni mayúsculas).",
    reglas_table_row10: "Tu respuesta fue única — nadie más puso esa palabra.",
    reglas_table_row20: "Fuiste la única persona que completó esa categoría.",
    reglas_s4_p: "Gana quien acumule más puntos al cabo de la cantidad de rondas elegida.",
    reglas_faq_heading: "Preguntas frecuentes",
    reglas_faq_q1: "¿Necesito crear una cuenta?",
    reglas_faq_a1: "No. Solo elegís un nombre para esa partida; no hace falta registro ni contraseña.",
    reglas_faq_q2: "¿Puedo jugar solo desde el celular?",
    reglas_faq_a2: "Sí, el juego funciona igual en celular y en computadora, adaptándose a la pantalla.",
    reglas_faq_q3: "¿Qué pasa si me quedo sin internet a mitad de partida?",
    reglas_faq_a3: "La sala sigue activa para el resto de los jugadores; podés volver a entrar con el mismo código mientras la partida siga en curso.",

    privacidad_title: "Política de privacidad · tutti.frutti",
    privacidad_description: "Política de privacidad de tutti.frutti: qué datos se recolectan, cómo se usan las cookies de publicidad y cómo contactarnos.",
    privacidad_h1: "Política de privacidad",
    privacidad_intro: 'Esta política explica qué información recolecta tutti.frutti (el "Sitio"), cómo se usa y qué opciones tenés al respecto. Al usar el Sitio, aceptás esta política.',
    privacidad_s1_heading: "Qué datos recolectamos",
    privacidad_s1_sub1_heading: "Datos que ingresás vos",
    privacidad_s1_li1_html: '<strong>Nombre de jugador:</strong> el que escribís antes de jugar. No pedimos apellido, email ni ningún dato que te identifique fuera del juego.',
    privacidad_s1_li2_html: '<strong>Respuestas de la partida:</strong> las palabras que escribís en cada categoría durante una ronda, para poder compararlas con las de los demás jugadores y calcular el puntaje.',
    privacidad_s1_li3_html: '<strong>Código de sala:</strong> se genera automáticamente al crear una partida.',
    privacidad_s1_p1: "Estos datos se guardan temporalmente en una base de datos (Firebase, de Google) asociados a un identificador aleatorio de sesión, no a tu identidad real. Las salas y sus datos no están pensados para conservarse indefinidamente.",
    privacidad_s1_sub2_heading: "Datos guardados en tu dispositivo",
    privacidad_s1_sub2_p: "Usamos el almacenamiento local del navegador (localStorage) para recordar, únicamente en tu propio dispositivo, tu nombre de jugador, si preferís el sonido silenciado y el tema de color elegido. Esta información nunca se envía a nuestros servidores ni a terceros.",
    privacidad_s1_sub3_heading: "El juez con inteligencia artificial",
    privacidad_s1_sub3_p: "Cuando una respuesta queda en disputa y nadie la resuelve antes, la palabra objetada y su categoría se envían a un servicio de inteligencia artificial (Anthropic) para que decida si es válida. Solo se envían la palabra, la categoría y la letra de la ronda — nunca tu nombre ni ningún otro dato personal.",
    privacidad_s2_heading: "Publicidad y cookies",
    privacidad_s2_p: "Este Sitio puede mostrar anuncios a través de Google AdSense. Google y sus socios publicitarios pueden usar cookies y tecnologías similares para mostrar anuncios en base a tus visitas a este y otros sitios. La primera vez que entrás, un aviso te permite aceptar o rechazar estas cookies antes de que se usen.",
    privacidad_s2_li1_html: 'Podés conocer cómo Google usa esta información en <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">policies.google.com/technologies/ads</a>.',
    privacidad_s2_li2_html: 'Podés inhabilitar la publicidad personalizada en <a href="https://adssettings.google.com" target="_blank" rel="noopener">adssettings.google.com</a>.',
    privacidad_s2b_heading: "Estadísticas de uso (Google Analytics)",
    privacidad_s2b_p: "Usamos Google Analytics para entender cuánta gente visita el Sitio y qué páginas usa más, con el fin de mejorarlo. Al igual que con la publicidad, esto solo se activa si aceptás las cookies en el aviso inicial.",
    privacidad_s3_heading: "Con quién compartimos información",
    privacidad_s3_p: "No vendemos datos personales. Compartimos información únicamente con los proveedores necesarios para que el Sitio funcione: Firebase (Google) para la sincronización de salas en tiempo real, Anthropic para el juez con inteligencia artificial, y Google AdSense y Google Analytics para publicidad y estadísticas, cada uno sujeto a sus propias políticas de privacidad.",
    privacidad_s4_heading: "Menores de edad",
    privacidad_s4_p: "Este Sitio no está dirigido específicamente a menores de 13 años y no recolectamos a sabiendas datos personales de niños. Si creés que un menor nos proporcionó información personal, escribinos y lo eliminaremos.",
    privacidad_s5_heading: "Cambios a esta política",
    privacidad_s5_p: "Podemos actualizar esta política ocasionalmente. Los cambios se van a reflejar en esta misma página con su fecha de actualización.",
    privacidad_s6_heading: "Contacto",
    privacidad_s6_p_html: 'Si tenés preguntas sobre esta política, escribinos a <a href="mailto:bauengames@gmail.com">bauengames@gmail.com</a>.',

    terminos_title: "Términos de uso · tutti.frutti",
    terminos_description: "Términos de uso de tutti.frutti: qué es el servicio, cómo funciona el juez con IA y las condiciones para jugar.",
    terminos_h1: "Términos de uso",
    terminos_intro: 'Al usar tutti.frutti (el "Sitio") aceptás estos términos. Si no estás de acuerdo, te pedimos que no lo uses.',
    terminos_s1_heading: "Qué es el Sitio",
    terminos_s1_p: "tutti.frutti es un juego de palabras multijugador, gratuito, pensado para jugar entre amigos o con un rival al azar. No requiere registro ni pago para jugar.",
    terminos_s2_heading: "Uso del servicio",
    terminos_s2_li1: 'El Sitio se ofrece "tal cual", sin garantía de disponibilidad permanente ni de estar libre de errores.',
    terminos_s2_li2: "No está permitido usar el Sitio para publicar contenido ofensivo, discriminatorio o ilegal en los nombres de jugador o en las respuestas de las partidas.",
    terminos_s2_li3: "Nos reservamos el derecho de restringir el acceso a quien haga un uso abusivo del servicio (por ejemplo, saturar salas o el sistema de objeciones de forma automatizada).",
    terminos_s3_heading: "El juez con inteligencia artificial",
    terminos_s3_p: "Cuando una respuesta objetada no se resuelve entre los jugadores, un sistema automático basado en inteligencia artificial decide si la palabra es válida según la letra y la categoría de la ronda. Es una herramienta para agilizar el juego, no un árbitro infalible: sus decisiones pueden ocasionalmente no coincidir con lo que un jugador esperaría. Si el sistema no responde a tiempo, la palabra se da por válida y no se aplica ninguna penalidad.",
    terminos_s4_heading: "Publicidad",
    terminos_s4_p_html: 'El Sitio puede mostrar publicidad de terceros, incluyendo Google AdSense, para poder mantenerse gratuito. Ver la <a href="privacidad.html">política de privacidad</a> para más detalle sobre cookies y datos.',
    terminos_s5_heading: "Límite de responsabilidad",
    terminos_s5_p: "El uso del Sitio es bajo tu propia responsabilidad. No nos hacemos responsables por pérdida de datos de partidas, interrupciones del servicio, ni por decisiones del juez automático con las que no estés de acuerdo.",
    terminos_s6_heading: "Cambios a estos términos",
    terminos_s6_p: "Podemos actualizar estos términos ocasionalmente. Los cambios se reflejan en esta misma página con su fecha de actualización. Seguir usando el Sitio después de un cambio implica aceptar los nuevos términos.",
    terminos_s7_heading: "Contacto",
    terminos_s7_p_html: 'Ante cualquier consulta sobre estos términos, escribinos a <a href="mailto:bauengames@gmail.com">bauengames@gmail.com</a>.',

    contacto_title: "Contacto · tutti.frutti",
    contacto_description: "Contactate con el equipo de tutti.frutti por consultas, sugerencias o problemas con el juego.",
    contacto_h1: "Contacto",
    contacto_lead: "¿Encontraste un error, tenés una sugerencia o una consulta sobre privacidad? Escribinos.",
    contacto_email_label: "Email",
    contacto_p_html: 'Este es también el contacto para lo que mencionamos en la <a href="privacidad.html">política de privacidad</a> y en los <a href="terminos.html">términos de uso</a>: pedidos de eliminación de datos, dudas sobre el juez con inteligencia artificial, o reportes de mal uso del juego.',
  },
  en: {
    nav_home: "Home",
    nav_reglas: "Game rules",
    nav_privacidad: "Privacy",
    nav_terminos: "Terms of use",
    nav_contacto: "Contact",
    play_now_btn: "Play now",
    last_updated_prefix: "Last updated:",

    home_title: "tutti.frutti · Play tutti frutti online with friends",
    home_description: "Play tutti frutti online for free with friends or a random opponent (the same game known in other countries as Stop or Basta). Set up the room, a letter is drawn, and an AI judge settles any disputes.",
    home_hero_lead: "Tutti frutti online — also known as Stop or Basta — with friends or a random opponent. Set up a room, invite whoever you want and play in real time: a letter is drawn, everyone fills in categories against the clock, and an AI judge resolves any disputed words.",
    home_card1_title: "Private rooms",
    home_card1_body: "Create a room, share the code or link with your friends, and play together in real time.",
    home_card2_title: "Random opponent",
    home_card2_body: "If you don't have anyone to play with, we'll find you an available opponent to set up a game.",
    home_card3_title: "AI judge",
    home_card3_body: "When an answer is challenged and there's no agreement, an automatic judge decides whether it counts — no endless arguing.",
    home_quickplay_kicker: "Play now",
    label_player_name: "Your name",
    avatar_label: "Your fruit",
    install_app_btn: "Install the app",
    player_name_placeholder: "What's your name?",
    home_how_link: "How do you play? Check out the full rules →",
    home_how_heading: "How do you play?",
    home_step1_title: "A letter is drawn",
    home_step1_desc: "When the round starts, a letter is drawn at random from the ones enabled for the room.",
    home_step2_title: "Fill in the categories",
    home_step2_desc: "Write a word starting with that letter in each category before time runs out.",
    home_step3_title: "Tap Stop!",
    home_step3_desc: "As soon as you finish, anyone can tap Stop! and the round ends for everyone.",
    home_step4_title: "The judge settles disputes",
    home_step4_desc: "If an answer is challenged and there's no agreement, an AI judge decides — no endless arguing.",
    home_how_p2_html: 'For the full details on scoring, challenges and how the AI judge works, check out the <a href="reglas.html">game rules</a> page.',

    reglas_title: "Game rules · tutti.frutti",
    reglas_description: "How to play tutti frutti online (also called Stop or Basta depending on the country): rounds, letters, scoring, challenges and the AI judge.",
    reglas_h1: "Game rules",
    reglas_lead: "Everything you need to know to play a game, from setting up a room to understanding how disputes get resolved.",
    reglas_s1_heading: "Setting up a game",
    reglas_s1_li1_html: '<strong>Create room:</strong> pick categories, time per round, number of rounds and which letters are in play. A 5-character code is generated that you can share as a code or a link — whoever opens the link jumps straight into the room.',
    reglas_s1_li2_html: '<strong>Join room:</strong> ask whoever created the room for the code and you\'ll play with the setup that person chose.',
    reglas_s1_li3_html: '<strong>Random room:</strong> matches you with whoever is looking for a game right now, with fixed categories and rules. If no one shows up in a few seconds, you can keep waiting or cancel the search.',
    reglas_s2_heading: "How a round works",
    reglas_s2_p_html: 'When the round starts, a letter is drawn from the ones enabled for that room. All players fill in the chosen categories at the same time (for example Name, Animal, Food, Color) with words starting with that letter. As soon as someone finishes, they tap <strong>Stop!</strong> and the round ends for every player at once.',
    reglas_s3_heading: "Review and challenges",
    reglas_s3_intro: "Before the score is calculated there's a brief review window where answers can be challenged:",
    reglas_s3_li1: "A word that doesn't start with the round's letter is worth 0 automatically, no challenge needed.",
    reglas_s3_li2_html: 'If someone challenges an answer, it becomes "disputed." The author can tap <strong>"I accept it"</strong> and the word is worth 0 right away.',
    reglas_s3_li3: "In rooms of 3 or more players, if everyone else (besides the author) challenges the same word, it's worth 0 without anything further needed.",
    reglas_s3_li4_html: 'If the dispute is still open when the review closes, an <strong>AI judge</strong> decides: it checks whether the word starts with the correct letter and reasonably belongs to the category, accepting regional terms and minor spelling mistakes.',
    reglas_s3_li5_html: 'If the judge decides the word is <strong>valid</strong>, every player who challenged it without reason loses 5 points. If it decides it\'s <strong>invalid</strong>, the word is worth 0 and no one is penalized.',
    reglas_s3_li6: "If the judge doesn't respond in time, all disputed words for that round are treated as valid and no penalty is applied — the game never gets stuck waiting.",
    reglas_s4_heading: "Scoring per category",
    reglas_table_th_points: "Points",
    reglas_table_th_situation: "Situation",
    reglas_table_row0: "You left the category empty, or the word was invalidated.",
    reglas_table_row5: "Another player wrote the same word (compared ignoring accents and capitalization).",
    reglas_table_row10: "Your answer was unique — no one else wrote that word.",
    reglas_table_row20: "You were the only person who filled in that category.",
    reglas_s4_p: "Whoever racks up the most points after the chosen number of rounds wins.",
    reglas_faq_heading: "Frequently asked questions",
    reglas_faq_q1: "Do I need to create an account?",
    reglas_faq_a1: "No. You just pick a name for that game; no sign-up or password needed.",
    reglas_faq_q2: "Can I play from my phone only?",
    reglas_faq_a2: "Yes, the game works the same on phone and computer, adapting to the screen.",
    reglas_faq_q3: "What happens if I lose internet mid-game?",
    reglas_faq_a3: "The room stays active for the rest of the players; you can rejoin with the same code while the game is still going.",

    privacidad_title: "Privacy policy · tutti.frutti",
    privacidad_description: "tutti.frutti privacy policy: what data is collected, how advertising cookies are used, and how to contact us.",
    privacidad_h1: "Privacy policy",
    privacidad_intro: 'This policy explains what information tutti.frutti (the "Site") collects, how it\'s used, and what choices you have about it. By using the Site, you accept this policy.',
    privacidad_s1_heading: "What data we collect",
    privacidad_s1_sub1_heading: "Data you enter",
    privacidad_s1_li1_html: '<strong>Player name:</strong> the one you type before playing. We don\'t ask for a last name, email, or any data that identifies you outside the game.',
    privacidad_s1_li2_html: '<strong>Game answers:</strong> the words you type in each category during a round, so they can be compared with other players\' answers to calculate the score.',
    privacidad_s1_li3_html: '<strong>Room code:</strong> generated automatically when a game is created.',
    privacidad_s1_p1: "This data is stored temporarily in a database (Firebase, by Google) tied to a random session identifier, not your real identity. Rooms and their data aren't meant to be kept indefinitely.",
    privacidad_s1_sub2_heading: "Data stored on your device",
    privacidad_s1_sub2_p: "We use your browser's local storage (localStorage) to remember, only on your own device, your player name, whether you prefer sound muted, and the color theme you chose. This information is never sent to our servers or to third parties.",
    privacidad_s1_sub3_heading: "The AI judge",
    privacidad_s1_sub3_p: "When an answer is disputed and no one resolves it beforehand, the challenged word and its category are sent to an AI service (Anthropic) to decide whether it's valid. Only the word, the category and the round's letter are sent — never your name or any other personal data.",
    privacidad_s2_heading: "Advertising and cookies",
    privacidad_s2_p: "This Site may show ads through Google AdSense. Google and its advertising partners may use cookies and similar technologies to show ads based on your visits to this and other sites. The first time you visit, a notice lets you accept or decline these cookies before they're used.",
    privacidad_s2_li1_html: 'You can learn how Google uses this information at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">policies.google.com/technologies/ads</a>.',
    privacidad_s2_li2_html: 'You can turn off personalized advertising at <a href="https://adssettings.google.com" target="_blank" rel="noopener">adssettings.google.com</a>.',
    privacidad_s2b_heading: "Usage statistics (Google Analytics)",
    privacidad_s2b_p: "We use Google Analytics to understand how many people visit the Site and which pages they use most, so we can improve it. Just like with advertising, this only activates if you accept cookies in the initial notice.",
    privacidad_s3_heading: "Who we share information with",
    privacidad_s3_p: "We don't sell personal data. We share information only with the providers needed for the Site to work: Firebase (Google) for real-time room syncing, Anthropic for the AI judge, and Google AdSense and Google Analytics for advertising and statistics, each subject to their own privacy policies.",
    privacidad_s4_heading: "Children's privacy",
    privacidad_s4_p: "This Site isn't specifically directed at children under 13, and we don't knowingly collect personal data from children. If you believe a child provided us with personal information, contact us and we'll delete it.",
    privacidad_s5_heading: "Changes to this policy",
    privacidad_s5_p: "We may update this policy from time to time. Changes will be reflected on this same page along with the update date.",
    privacidad_s6_heading: "Contact",
    privacidad_s6_p_html: 'If you have questions about this policy, write to us at <a href="mailto:bauengames@gmail.com">bauengames@gmail.com</a>.',

    terminos_title: "Terms of use · tutti.frutti",
    terminos_description: "tutti.frutti terms of use: what the service is, how the AI judge works, and the conditions for playing.",
    terminos_h1: "Terms of use",
    terminos_intro: 'By using tutti.frutti (the "Site") you accept these terms. If you disagree, please don\'t use it.',
    terminos_s1_heading: "What the Site is",
    terminos_s1_p: "tutti.frutti is a free multiplayer word game meant to be played among friends or against a random opponent. It requires no sign-up or payment to play.",
    terminos_s2_heading: "Use of the service",
    terminos_s2_li1: 'The Site is offered "as is," with no guarantee of permanent availability or being error-free.',
    terminos_s2_li2: "You may not use the Site to post offensive, discriminatory or illegal content in player names or game answers.",
    terminos_s2_li3: "We reserve the right to restrict access for anyone who abuses the service (for example, flooding rooms or the challenge system in an automated way).",
    terminos_s3_heading: "The AI judge",
    terminos_s3_p: "When a challenged answer isn't resolved between players, an automated AI-based system decides whether the word is valid based on the round's letter and category. It's a tool to speed up the game, not an infallible referee: its decisions may occasionally not match what a player expected. If the system doesn't respond in time, the word is treated as valid and no penalty is applied.",
    terminos_s4_heading: "Advertising",
    terminos_s4_p_html: 'The Site may show third-party advertising, including Google AdSense, to stay free. See the <a href="privacidad.html">privacy policy</a> for more detail on cookies and data.',
    terminos_s5_heading: "Limitation of liability",
    terminos_s5_p: "Use of the Site is at your own risk. We're not responsible for lost game data, service interruptions, or decisions by the automated judge that you disagree with.",
    terminos_s6_heading: "Changes to these terms",
    terminos_s6_p: "We may update these terms from time to time. Changes are reflected on this same page along with the update date. Continuing to use the Site after a change means accepting the new terms.",
    terminos_s7_heading: "Contact",
    terminos_s7_p_html: 'For any questions about these terms, write to us at <a href="mailto:bauengames@gmail.com">bauengames@gmail.com</a>.',

    contacto_title: "Contact · tutti.frutti",
    contacto_description: "Get in touch with the tutti.frutti team with questions, suggestions or issues with the game.",
    contacto_h1: "Contact",
    contacto_lead: "Found a bug, have a suggestion, or a question about privacy? Get in touch.",
    contacto_email_label: "Email",
    contacto_p_html: 'This is also the contact for what we mention in the <a href="privacidad.html">privacy policy</a> and <a href="terminos.html">terms of use</a>: data deletion requests, questions about the AI judge, or reports of misuse of the game.',
  },
  pt: {
    nav_home: "Início",
    nav_reglas: "Regras do jogo",
    nav_privacidad: "Privacidade",
    nav_terminos: "Termos de uso",
    nav_contacto: "Contato",
    play_now_btn: "Jogar agora",
    last_updated_prefix: "Última atualização:",

    home_title: "tutti.frutti · Jogue Adedanha/Stop online com amigos",
    home_description: "Jogue tutti frutti online grátis com amigos ou com um adversário aleatório (o mesmo jogo conhecido como Adedanha, Stop ou Basta). Monte a sala, sorteia-se a letra e um juiz com IA resolve as dúvidas.",
    home_hero_lead: "Tutti frutti online — também conhecido como Adedanha ou Stop — com amigos ou com um adversário aleatório. Monte uma sala, convide quem quiser e joguem em tempo real: sorteia-se uma letra, todos preenchem categorias contra o relógio e um juiz com inteligência artificial resolve as palavras em disputa.",
    home_card1_title: "Salas privadas",
    home_card1_body: "Crie uma sala, compartilhe o código ou o link com seus amigos e joguem todos juntos em tempo real.",
    home_card2_title: "Adversário aleatório",
    home_card2_body: "Se você não tem com quem jogar, procuramos um adversário disponível nesse momento para montar a partida.",
    home_card3_title: "Juiz com IA",
    home_card3_body: "Quando uma resposta é contestada e não há acordo, um juiz automático decide se ela vale ou não, sem discussões intermináveis.",
    home_quickplay_kicker: "Jogue agora",
    label_player_name: "Seu nome",
    avatar_label: "Sua fruta",
    install_app_btn: "Instalar o app",
    player_name_placeholder: "Qual é o seu nome?",
    home_how_link: "Como se joga? Veja as regras completas →",
    home_how_heading: "Como se joga?",
    home_step1_title: "Sorteia-se uma letra",
    home_step1_desc: "Ao começar a rodada, sorteia-se uma letra entre as habilitadas para a sala.",
    home_step2_title: "Preencha as categorias",
    home_step2_desc: "Escreva uma palavra que comece com essa letra em cada categoria, antes que o tempo acabe.",
    home_step3_title: "Aperte Basta!",
    home_step3_desc: "Assim que terminar, qualquer um pode apertar Basta! e a rodada é encerrada para todos.",
    home_step4_title: "O juiz resolve as dúvidas",
    home_step4_desc: "Se uma resposta é contestada e não há acordo, um juiz com IA decide — sem discussões intermináveis.",
    home_how_p2_html: 'Para conhecer todos os detalhes sobre pontuação, contestações e o funcionamento do juiz com IA, veja a página de <a href="reglas.html">regras do jogo</a>.',

    reglas_title: "Regras do jogo · tutti.frutti",
    reglas_description: "Como se joga tutti frutti online (também chamado de Adedanha, Stop ou Basta conforme o país): rodadas, letras, pontuação, contestações e o juiz com inteligência artificial.",
    reglas_h1: "Regras do jogo",
    reglas_lead: "Tudo o que você precisa saber para jogar uma partida, desde montar a sala até entender como as disputas são resolvidas.",
    reglas_s1_heading: "Montando uma partida",
    reglas_s1_li1_html: '<strong>Criar sala:</strong> você escolhe categorias, tempo por rodada, quantidade de rodadas e quais letras entram em jogo. É gerado um código de 5 caracteres que pode ser compartilhado por código ou por link — quem abrir o link entra direto na sala.',
    reglas_s1_li2_html: '<strong>Entrar em uma sala:</strong> peça o código a quem criou a sala e jogue com a configuração que essa pessoa escolheu.',
    reglas_s1_li3_html: '<strong>Sala aleatória:</strong> você é pareado com quem estiver procurando partida nesse momento, com categorias e regras fixas. Se ninguém aparecer em alguns segundos, você pode continuar esperando ou cancelar a busca.',
    reglas_s2_heading: "Como funciona uma rodada",
    reglas_s2_p_html: 'Ao começar a rodada, sorteia-se uma letra entre as habilitadas para essa sala. Todos os jogadores preenchem ao mesmo tempo as categorias escolhidas (por exemplo Nome, Animal, Comida, Cor) com palavras que comecem com essa letra. Assim que alguém termina, aperta <strong>Basta!</strong> e a rodada é encerrada para todos os jogadores simultaneamente.',
    reglas_s3_heading: "Revisão e contestações",
    reglas_s3_intro: "Antes de calcular a pontuação há uma breve janela de revisão em que as respostas podem ser contestadas:",
    reglas_s3_li1: "Uma palavra que não começa com a letra da rodada vale 0 automaticamente, sem precisar contestar.",
    reglas_s3_li2_html: 'Se alguém contesta uma resposta, ela fica "em disputa". O autor pode apertar <strong>"Aceito"</strong> e a palavra vale 0 diretamente.',
    reglas_s3_li3: "Em salas com 3 ou mais jogadores, se todos os demais (menos o autor) contestarem a mesma palavra, ela vale 0 sem necessidade de mais nada.",
    reglas_s3_li4_html: 'Se a disputa continuar aberta ao fechar a revisão, um <strong>juiz com inteligência artificial</strong> decide: ele avalia se a palavra começa com a letra correta e se pertence razoavelmente à categoria, aceitando regionalismos e pequenos erros de ortografia.',
    reglas_s3_li5_html: 'Se o juiz decidir que a palavra é <strong>válida</strong>, cada jogador que a contestou sem razão perde 5 pontos. Se decidir que é <strong>inválida</strong>, a palavra vale 0 e ninguém é penalizado.',
    reglas_s3_li6: "Se o juiz não conseguir responder a tempo, todas as palavras em disputa dessa rodada são consideradas válidas e nenhuma penalidade é aplicada — a partida nunca fica travada esperando.",
    reglas_s4_heading: "Pontuação por categoria",
    reglas_table_th_points: "Pontos",
    reglas_table_th_situation: "Situação",
    reglas_table_row0: "Você deixou a categoria vazia, ou a palavra foi invalidada.",
    reglas_table_row5: "Outro jogador escreveu a mesma palavra (comparando sem acentos nem maiúsculas).",
    reglas_table_row10: "Sua resposta foi única — ninguém mais escreveu essa palavra.",
    reglas_table_row20: "Você foi a única pessoa que preencheu essa categoria.",
    reglas_s4_p: "Vence quem acumular mais pontos ao final da quantidade de rodadas escolhida.",
    reglas_faq_heading: "Perguntas frequentes",
    reglas_faq_q1: "Preciso criar uma conta?",
    reglas_faq_a1: "Não. Você só escolhe um nome para essa partida; não é preciso cadastro nem senha.",
    reglas_faq_q2: "Posso jogar só pelo celular?",
    reglas_faq_a2: "Sim, o jogo funciona igual no celular e no computador, se adaptando à tela.",
    reglas_faq_q3: "O que acontece se eu ficar sem internet no meio da partida?",
    reglas_faq_a3: "A sala continua ativa para os demais jogadores; você pode voltar a entrar com o mesmo código enquanto a partida ainda estiver em andamento.",

    privacidad_title: "Política de privacidade · tutti.frutti",
    privacidad_description: "Política de privacidade do tutti.frutti: quais dados são coletados, como são usados os cookies de publicidade e como entrar em contato.",
    privacidad_h1: "Política de privacidade",
    privacidad_intro: 'Esta política explica quais informações o tutti.frutti (o "Site") coleta, como são usadas e quais opções você tem a respeito. Ao usar o Site, você aceita esta política.',
    privacidad_s1_heading: "Quais dados coletamos",
    privacidad_s1_sub1_heading: "Dados que você digita",
    privacidad_s1_li1_html: '<strong>Nome de jogador:</strong> o que você digita antes de jogar. Não pedimos sobrenome, e-mail nem nenhum dado que te identifique fora do jogo.',
    privacidad_s1_li2_html: '<strong>Respostas da partida:</strong> as palavras que você digita em cada categoria durante uma rodada, para poder compará-las com as dos outros jogadores e calcular a pontuação.',
    privacidad_s1_li3_html: '<strong>Código da sala:</strong> gerado automaticamente ao criar uma partida.',
    privacidad_s1_p1: "Esses dados são armazenados temporariamente em um banco de dados (Firebase, do Google) associados a um identificador aleatório de sessão, não à sua identidade real. As salas e seus dados não são pensados para serem mantidos indefinidamente.",
    privacidad_s1_sub2_heading: "Dados salvos no seu dispositivo",
    privacidad_s1_sub2_p: "Usamos o armazenamento local do navegador (localStorage) para lembrar, somente no seu próprio dispositivo, seu nome de jogador, se você prefere o som mudo e o tema de cor escolhido. Essa informação nunca é enviada aos nossos servidores nem a terceiros.",
    privacidad_s1_sub3_heading: "O juiz com inteligência artificial",
    privacidad_s1_sub3_p: "Quando uma resposta fica em disputa e ninguém a resolve antes, a palavra contestada e sua categoria são enviadas a um serviço de inteligência artificial (Anthropic) para que decida se é válida. Só são enviadas a palavra, a categoria e a letra da rodada — nunca seu nome nem qualquer outro dado pessoal.",
    privacidad_s2_heading: "Publicidade e cookies",
    privacidad_s2_p: "Este Site pode exibir anúncios através do Google AdSense. O Google e seus parceiros publicitários podem usar cookies e tecnologias semelhantes para exibir anúncios com base nas suas visitas a este e outros sites. Na primeira vez que você entra, um aviso permite aceitar ou recusar esses cookies antes de serem usados.",
    privacidad_s2_li1_html: 'Você pode saber como o Google usa essa informação em <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">policies.google.com/technologies/ads</a>.',
    privacidad_s2_li2_html: 'Você pode desativar a publicidade personalizada em <a href="https://adssettings.google.com" target="_blank" rel="noopener">adssettings.google.com</a>.',
    privacidad_s2b_heading: "Estatísticas de uso (Google Analytics)",
    privacidad_s2b_p: "Usamos o Google Analytics para entender quantas pessoas visitam o Site e quais páginas usam mais, para poder melhorá-lo. Assim como com a publicidade, isso só é ativado se você aceitar os cookies no aviso inicial.",
    privacidad_s3_heading: "Com quem compartilhamos informações",
    privacidad_s3_p: "Não vendemos dados pessoais. Compartilhamos informações apenas com os provedores necessários para o Site funcionar: Firebase (Google) para a sincronização de salas em tempo real, Anthropic para o juiz com inteligência artificial, e Google AdSense e Google Analytics para publicidade e estatísticas, cada um sujeito às suas próprias políticas de privacidade.",
    privacidad_s4_heading: "Menores de idade",
    privacidad_s4_p: "Este Site não é direcionado especificamente a menores de 13 anos e não coletamos intencionalmente dados pessoais de crianças. Se você acredita que um menor nos forneceu informações pessoais, entre em contato e nós as removeremos.",
    privacidad_s5_heading: "Mudanças nesta política",
    privacidad_s5_p: "Podemos atualizar esta política ocasionalmente. As mudanças serão refletidas nesta mesma página com sua data de atualização.",
    privacidad_s6_heading: "Contato",
    privacidad_s6_p_html: 'Se você tiver dúvidas sobre esta política, escreva para <a href="mailto:bauengames@gmail.com">bauengames@gmail.com</a>.',

    terminos_title: "Termos de uso · tutti.frutti",
    terminos_description: "Termos de uso do tutti.frutti: o que é o serviço, como funciona o juiz com IA e as condições para jogar.",
    terminos_h1: "Termos de uso",
    terminos_intro: 'Ao usar o tutti.frutti (o "Site") você aceita estes termos. Se não concordar, pedimos que não o utilize.',
    terminos_s1_heading: "O que é o Site",
    terminos_s1_p: "tutti.frutti é um jogo de palavras multijogador, gratuito, pensado para jogar entre amigos ou contra um adversário aleatório. Não é preciso cadastro nem pagamento para jogar.",
    terminos_s2_heading: "Uso do serviço",
    terminos_s2_li1: 'O Site é oferecido "como está", sem garantia de disponibilidade permanente nem de estar livre de erros.',
    terminos_s2_li2: "Não é permitido usar o Site para publicar conteúdo ofensivo, discriminatório ou ilegal nos nomes de jogador ou nas respostas das partidas.",
    terminos_s2_li3: "Reservamo-nos o direito de restringir o acesso a quem fizer uso abusivo do serviço (por exemplo, sobrecarregar salas ou o sistema de contestações de forma automatizada).",
    terminos_s3_heading: "O juiz com inteligência artificial",
    terminos_s3_p: "Quando uma resposta contestada não é resolvida entre os jogadores, um sistema automático baseado em inteligência artificial decide se a palavra é válida de acordo com a letra e a categoria da rodada. É uma ferramenta para agilizar o jogo, não um árbitro infalível: suas decisões podem ocasionalmente não coincidir com o que um jogador esperaria. Se o sistema não responder a tempo, a palavra é considerada válida e nenhuma penalidade é aplicada.",
    terminos_s4_heading: "Publicidade",
    terminos_s4_p_html: 'O Site pode exibir publicidade de terceiros, incluindo Google AdSense, para se manter gratuito. Veja a <a href="privacidad.html">política de privacidade</a> para mais detalhes sobre cookies e dados.',
    terminos_s5_heading: "Limite de responsabilidade",
    terminos_s5_p: "O uso do Site é por sua conta e risco. Não nos responsabilizamos por perda de dados de partidas, interrupções do serviço, nem por decisões do juiz automático com as quais você não concorde.",
    terminos_s6_heading: "Mudanças a estes termos",
    terminos_s6_p: "Podemos atualizar estes termos ocasionalmente. As mudanças são refletidas nesta mesma página com sua data de atualização. Continuar usando o Site depois de uma mudança implica aceitar os novos termos.",
    terminos_s7_heading: "Contato",
    terminos_s7_p_html: 'Para qualquer dúvida sobre estes termos, escreva para <a href="mailto:bauengames@gmail.com">bauengames@gmail.com</a>.',

    contacto_title: "Contato · tutti.frutti",
    contacto_description: "Entre em contato com a equipe do tutti.frutti para dúvidas, sugestões ou problemas com o jogo.",
    contacto_h1: "Contato",
    contacto_lead: "Encontrou um erro, tem uma sugestão ou uma dúvida sobre privacidade? Escreva para nós.",
    contacto_email_label: "E-mail",
    contacto_p_html: 'Este é também o contato para o que mencionamos na <a href="privacidad.html">política de privacidade</a> e nos <a href="terminos.html">termos de uso</a>: pedidos de exclusão de dados, dúvidas sobre o juiz com inteligência artificial, ou denúncias de mau uso do jogo.',
  },
};

function siteDetectLanguage() {
  try {
    var saved = localStorage.getItem("tuttifruti_lang");
    if (saved === "en" || saved === "es" || saved === "pt") return saved;
  } catch (e) { /* storage unavailable */ }
  var browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || "es").toLowerCase();
  if (browserLang.indexOf("en") === 0) return "en";
  if (browserLang.indexOf("pt") === 0) return "pt";
  return "es";
}

function siteT(key) {
  var lang = window.__siteLang || "es";
  var table = SITE_I18N[lang] || SITE_I18N.es;
  return table[key] != null ? table[key] : (SITE_I18N.es[key] != null ? SITE_I18N.es[key] : key);
}

function applySiteTranslations() {
  document.documentElement.lang = window.__siteLang;
  document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = siteT(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = siteT(el.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) { el.placeholder = siteT(el.dataset.i18nPlaceholder); });
  var titleKey = document.body.getAttribute("data-i18n-title");
  if (titleKey) document.title = siteT(titleKey);
  var descKey = document.body.getAttribute("data-i18n-description");
  if (descKey) {
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", siteT(descKey));
  }
  document.querySelectorAll(".site-lang-option").forEach(function (btn) {
    btn.classList.toggle("selected", btn.dataset.lang === window.__siteLang);
  });
  var fechaEl = document.getElementById("fecha");
  if (fechaEl) {
    var localeMap = { en: "en-US", pt: "pt-BR" };
    fechaEl.textContent = new Date().toLocaleDateString(localeMap[window.__siteLang] || "es-AR", { year: "numeric", month: "long", day: "numeric" });
  }
}

function setSiteLanguage(lang) {
  window.__siteLang = (lang === "en" || lang === "pt") ? lang : "es";
  try { localStorage.setItem("tuttifruti_lang", window.__siteLang); } catch (e) { /* storage unavailable */ }
  applySiteTranslations();
  var menu = document.getElementById("langMenu");
  if (menu) menu.classList.remove("open");
}

function toggleSiteLangMenu() {
  var menu = document.getElementById("langMenu");
  if (menu) menu.classList.toggle("open");
}

document.addEventListener("click", function (e) {
  var picker = document.getElementById("langPicker");
  var menu = document.getElementById("langMenu");
  if (picker && menu && !picker.contains(e.target)) {
    menu.classList.remove("open");
  }
});

window.__siteLang = siteDetectLanguage();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applySiteTranslations);
} else {
  applySiteTranslations();
}
