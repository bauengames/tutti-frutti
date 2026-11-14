/* tutti.frutti · web (igual que en la app) · Frutigrama: el acertijo de cada día (estilo Wordle, pero con categorías).
   Una palabra secreta por día, la misma para todos los que juegan en el mismo idioma. Desde el 21/10/2026 siempre
   tiene 6 letras (antes cambiaba de largo y era fácil de adivinar) y solo se ve la categoría; hay 6 intentos. Las pistas solo si se piden ("Ver pista", con un video o
   75 semillas): una definición, la última letra y dos letras más. Las palabras del mismo largo se pintan como en el Wordle (verde: letra
   en su lugar; amarillo: está en otro lugar). Estrellas: 1-2 intentos ★★★, 3-4 ★★, 5-6 ★.
   Semillas una vez por día (10 / 6 / 3) y racha de días ganados. Resultado para compartir con cuadraditos.
   Se guarda en tuttifruti_app_frutigrama (también en la cuenta). En la web: botón en la pantalla de modos, debajo del desafío del día. */
(function () {
  var INICIO = "2026-10-12"; // Frutigrama #1
  var INTENTOS = 6;
  var SEMILLAS = { 3: 10, 2: 6, 1: 3 };
  var KEY = "tuttifruti_app_frutigrama";

  // [categoría, es, en, pt, pista es, pista en, pista pt]
  var PALABRAS = [
    ["Fruta", "Mandarina", "Tangerine", "Tangerina", "Parecida a la naranja, más chica y fácil de pelar", "Like an orange, but smaller and easy to peel", "Parecida com a laranja, menor e fácil de descascar", "Mandarine", "Wie eine Orange, nur kleiner und leicht zu schälen", "Mandarine", "Comme une orange, mais plus petite et facile à éplucher", "Mandarino", "Come un'arancia, ma più piccolo e facile da sbucciare"],
    ["Animal", "Jirafa", "Giraffe", "Girafa", "El animal con el cuello más largo", "The animal with the longest neck", "O animal com o pescoço mais comprido", "Giraffe", "Das Tier mit dem längsten Hals", "Girafe", "L'animal au plus long cou", "Giraffa", "L'animale con il collo più lungo"],
    ["País", "Japón", "Japan", "Japão", "El país del sol naciente", "The land of the rising sun", "O país do sol nascente", "Japan", "Das Land der aufgehenden Sonne", "Japon", "Le pays du soleil levant", "Giappone", "Il paese del sol levante"],
    ["Color", "Violeta", "Violet", "Violeta", "Mezcla de rojo y azul", "A mix of red and blue", "Mistura de vermelho e azul", "Violett", "Eine Mischung aus Rot und Blau", "Violet", "Un mélange de rouge et de bleu", "Viola", "Un misto di rosso e blu"],
    ["Profesión", "Bombero", "Firefighter", "Bombeiro", "Apaga incendios", "Puts out fires", "Apaga incêndios", "Feuerwehrmann", "Löscht Brände", "Pompier", "Il éteint les incendies", "Pompiere", "Spegne gli incendi"],
    ["Deporte", "Natación", "Swimming", "Natação", "Se practica en una pileta", "You do it in a pool", "Se pratica numa piscina", "Schwimmen", "Das machst du im Becken", "Natation", "Ça se pratique dans une piscine", "Nuoto", "Si fa in piscina"],
    ["Instrumento musical", "Guitarra", "Guitar", "Violão", "Tiene seis cuerdas", "It has six strings", "Tem seis cordas", "Gitarre", "Sie hat sechs Saiten", "Guitare", "Elle a six cordes", "Chitarra", "Ha sei corde"],
    ["Verdura", "Zanahoria", "Carrot", "Cenoura", "Naranja, larga y les encanta a los conejos", "Orange, long and loved by rabbits", "Laranja, comprida e os coelhos adoram", "Karotte", "Orange, lang und bei Hasen beliebt", "Carotte", "Orange, longue et adorée des lapins", "Carota", "Arancione, lunga e amata dai conigli"],
    ["Parte del cuerpo", "Rodilla", "Knee", "Joelho", "Está en el medio de la pierna y se dobla", "It's in the middle of your leg and it bends", "Fica no meio da perna e dobra", "Knie", "In der Mitte des Beins, und es lässt sich beugen", "Genou", "Au milieu de la jambe, il se plie", "Ginocchio", "Sta a metà della gamba e si piega"],
    ["Bebida", "Limonada", "Lemonade", "Limonada", "Agua, limón y azúcar", "Water, lemon and sugar", "Água, limão e açúcar", "Limonade", "Wasser, Zitrone und Zucker", "Limonade", "Eau, citron et sucre", "Limonata", "Acqua, limone e zucchero"],
    ["Ciudad", "Roma", "Rome", "Roma", "La capital de Italia", "The capital of Italy", "A capital da Itália", "Rom", "Die Hauptstadt Italiens", "Rome", "La capitale de l'Italie", "Roma", "La capitale d'Italia"],
    ["Fruta", "Frutilla", "Strawberry", "Morango", "Roja, con semillitas por fuera", "Red, with tiny seeds on the outside", "Vermelho, com sementinhas por fora", "Erdbeere", "Rot, mit winzigen Kernen außen", "Fraise", "Rouge, avec des petites graines dehors", "Fragola", "Rossa, con i semini fuori"],
    ["Animal", "Pingüino", "Penguin", "Pinguim", "Ave que no vuela y vive en el frío", "A bird that can't fly and lives in the cold", "Ave que não voa e vive no frio", "Pinguin", "Ein Vogel, der nicht fliegen kann und in der Kälte lebt", "Pingouin", "Un oiseau qui vit dans le froid, en noir et blanc", "Pinguino", "Un uccello che non vola e vive al freddo"],
    ["País", "Brasil", "Brazil", "Brasil", "El país más grande de Sudamérica", "The biggest country in South America", "O maior país da América do Sul", "Brasilien", "Das größte Land Südamerikas", "Brésil", "Le plus grand pays d'Amérique du Sud", "Brasile", "Il paese più grande del Sud America"],
    ["Color", "Amarillo", "Yellow", "Amarelo", "El color del sol y del limón", "The color of the sun and lemons", "A cor do sol e do limão", "Gelb", "Die Farbe der Sonne und der Zitronen", "Jaune", "La couleur du soleil et des citrons", "Giallo", "Il colore del sole e dei limoni"],
    ["Objeto", "Tijera", "Scissors", "Tesoura", "Sirve para cortar papel", "Used to cut paper", "Serve para cortar papel", "Schere", "Damit schneidest du Papier", "Ciseaux", "Pour couper le papier", "Forbici", "Servono a tagliare la carta"],
    ["Profesión", "Dentista", "Dentist", "Dentista", "Te cuida los dientes", "Takes care of your teeth", "Cuida dos seus dentes", "Zahnarzt", "Kümmert sich um deine Zähne", "Dentiste", "Il soigne tes dents", "Dentista", "Si prende cura dei tuoi denti"],
    ["Instrumento musical", "Batería", "Drums", "Bateria", "Se toca con palillos", "You play it with sticks", "Se toca com baquetas", "Schlagzeug", "Wird mit Stöcken gespielt", "Batterie", "On en joue avec des baguettes", "Batteria", "Si suona con le bacchette"],
    ["Verdura", "Lechuga", "Lettuce", "Alface", "Hojas verdes de la ensalada", "The green leaves in a salad", "Folhas verdes da salada", "Kopfsalat", "Die grünen Blätter in einer Schüssel mit Dressing", "Laitue", "Les feuilles vertes de la salade", "Lattuga", "Le foglie verdi dell'insalata"],
    ["Parte del cuerpo", "Codo", "Elbow", "Cotovelo", "Con él doblás el brazo", "It lets you bend your arm", "Com ele você dobra o braço", "Ellbogen", "Damit beugst du den Arm", "Coude", "Il permet de plier le bras", "Gomito", "Ti permette di piegare il braccio"],
    ["Ciudad", "París", "Paris", "Paris", "La ciudad de la Torre Eiffel", "The city of the Eiffel Tower", "A cidade da Torre Eiffel", "Paris", "Die Stadt des Eiffelturms", "Paris", "La ville de la tour Eiffel", "Parigi", "La città della Torre Eiffel"],
    ["Fruta", "Sandía", "Watermelon", "Melancia", "Verde por fuera, roja por dentro", "Green outside, red inside", "Verde por fora, vermelha por dentro", "Wassermelone", "Außen grün, innen rot", "Pastèque", "Verte dehors, rouge dedans", "Anguria", "Verde fuori, rossa dentro"],
    ["Animal", "Elefante", "Elephant", "Elefante", "Tiene trompa y orejas enormes", "It has a trunk and huge ears", "Tem tromba e orelhas enormes", "Elefant", "Hat einen Rüssel und riesige Ohren", "Éléphant", "Il a une trompe et d'énormes oreilles", "Elefante", "Ha la proboscide e orecchie enormi"],
    ["País", "Egipto", "Egypt", "Egito", "El país de las pirámides", "The country of the pyramids", "O país das pirâmides", "Ägypten", "Das Land der Pyramiden", "Égypte", "Le pays des pyramides", "Egitto", "Il paese delle piramidi"],
    ["Color", "Marrón", "Brown", "Marrom", "El color del chocolate", "The color of chocolate", "A cor do chocolate", "Braun", "Die Farbe von Schokolade", "Marron", "La couleur du chocolat", "Marrone", "Il colore del cioccolato"],
    ["Comida", "Pizza", "Pizza", "Pizza", "Masa redonda con salsa y queso", "Round dough with sauce and cheese", "Massa redonda com molho e queijo", "Pizza", "Runder Teig mit Soße und Käse", "Pizza", "Pâte ronde avec sauce et fromage", "Pizza", "Pasta tonda con pomodoro e mozzarella"],
    ["Objeto", "Reloj", "Clock", "Relógio", "Te dice la hora", "It tells you the time", "Diz a hora", "Uhr", "Sie zeigt dir die Zeit", "Horloge", "Elle te donne l'heure", "Orologio", "Ti dice che ore sono"],
    ["Profesión", "Cocinero", "Chef", "Cozinheiro", "Trabaja en la cocina de un restaurante", "Works in a restaurant kitchen", "Trabalha na cozinha de um restaurante", "Koch", "Arbeitet in einer Restaurantküche", "Cuisinier", "Il travaille dans la cuisine d'un restaurant", "Cuoco", "Lavora nella cucina di un ristorante"],
    ["Deporte", "Tenis", "Tennis", "Tênis", "Raqueta y pelotita amarilla", "Racket and a little yellow ball", "Raquete e bolinha amarela", "Tennis", "Schläger und ein kleiner gelber Ball", "Tennis", "Raquette et petite balle jaune", "Tennis", "Racchetta e pallina gialla"],
    ["Instrumento musical", "Piano", "Piano", "Piano", "Teclas blancas y negras", "Black and white keys", "Teclas brancas e pretas", "Klavier", "Schwarze und weiße Tasten", "Piano", "Touches noires et blanches", "Pianoforte", "Tasti bianchi e neri"],
    ["Parte del cuerpo", "Ombligo", "Bellybutton", "Umbigo", "Está en el medio de la panza", "It's in the middle of your belly", "Fica no meio da barriga", "Nabel", "In der Mitte deines Bauchs", "Nombril", "Au milieu du ventre", "Ombelico", "Sta in mezzo alla pancia"],
    ["Bebida", "Jugo", "Juice", "Suco", "Se hace exprimiendo frutas", "Made by squeezing fruit", "Feito espremendo frutas", "Saft", "Entsteht beim Auspressen von Obst", "Jus", "On le fait en pressant des fruits", "Succo", "Si fa spremendo la frutta"],
    ["Ciudad", "Madrid", "Madrid", "Madri", "La capital de España", "The capital of Spain", "A capital da Espanha", "Madrid", "Die Hauptstadt Spaniens", "Madrid", "La capitale de l'Espagne", "Madrid", "La capitale della Spagna"],
    ["Fruta", "Banana", "Banana", "Banana", "Amarilla y curva", "Yellow and curved", "Amarela e curva", "Banane", "Gelb und krumm", "Banane", "Jaune et courbée", "Banana", "Gialla e curva"],
    ["Animal", "Tortuga", "Turtle", "Tartaruga", "Lleva su casa en la espalda", "It carries its home on its back", "Carrega a casa nas costas", "Schildkröte", "Trägt ihr Haus auf dem Rücken", "Tortue", "Elle porte sa maison sur le dos", "Tartaruga", "Porta la casa sulla schiena"],
    ["País", "México", "Mexico", "México", "El país de los tacos y los mariachis", "The country of tacos and mariachis", "O país dos tacos e dos mariachis", "Mexiko", "Das Land der Tacos und Mariachis", "Mexique", "Le pays des tacos et des mariachis", "Messico", "Il paese dei tacos e dei mariachi"],
    ["Color", "Rosa", "Pink", "Rosa", "Mezcla de rojo y blanco", "A mix of red and white", "Mistura de vermelho e branco", "Rosa", "Eine Mischung aus Rot und Weiß", "Rose", "Un mélange de rouge et de blanc", "Rosa", "Un misto di rosso e bianco"],
    ["Comida", "Hamburguesa", "Hamburger", "Hambúrguer", "Pan, carne y queso", "Bun, meat and cheese", "Pão, carne e queijo", "Hamburger", "Brötchen, Fleisch und Käse", "Hamburger", "Pain, steak et fromage", "Hamburger", "Panino, carne e formaggio"],
    ["Objeto", "Escoba", "Broom", "Vassoura", "Sirve para barrer", "Used for sweeping", "Serve para varrer", "Besen", "Damit wird gefegt", "Balai", "Pour nettoyer le sol de la cuisine", "Scopa", "Serve a spazzare"],
    ["Profesión", "Piloto", "Pilot", "Piloto", "Maneja aviones", "Flies planes", "Pilota aviões", "Pilot", "Fliegt Flugzeuge", "Pilote", "Il est aux commandes des avions", "Pilota", "Guida gli aerei"],
    ["Instrumento musical", "Flauta", "Flute", "Flauta", "Se toca soplando", "You play it by blowing", "Se toca soprando", "Flöte", "Wird durch Blasen gespielt", "Flûte", "On en joue en soufflant", "Flauto", "Si suona soffiando"],
    ["Verdura", "Cebolla", "Onion", "Cebola", "Te hace llorar cuando la cortás", "It makes you cry when you cut it", "Faz você chorar quando corta", "Zwiebel", "Beim Schneiden bringt sie dich zum Weinen", "Oignon", "Il fait pleurer quand on le coupe", "Cipolla", "Ti fa piangere quando la tagli"],
    ["Parte del cuerpo", "Ceja", "Eyebrow", "Sobrancelha", "Los pelitos arriba de los ojos", "The little hairs above your eyes", "Os pelinhos acima dos olhos", "Braue", "Die kleinen Haare über deinen Augen", "Sourcil", "Les petits poils au-dessus des yeux", "Sopracciglio", "I peletti sopra gli occhi"],
    ["Bebida", "Leche", "Milk", "Leite", "Blanca, la da la vaca", "White, it comes from cows", "Branco, vem da vaca", "Milch", "Weiß, sie kommt von der Kuh", "Lait", "Blanc, il vient des vaches", "Latte", "Bianco, viene dalle mucche"],
    ["Ciudad", "Londres", "London", "Londres", "La capital de Inglaterra", "The capital of England", "A capital da Inglaterra", "London", "Die Hauptstadt Englands", "Londres", "La capitale de l'Angleterre", "Londra", "La capitale dell'Inghilterra"],
    ["Fruta", "Durazno", "Peach", "Pêssego", "Piel aterciopelada y un carozo grande", "Fuzzy skin and a big pit", "Casca aveludada e um caroço grande", "Pfirsich", "Pelzige Haut und ein großer Kern", "Pêche", "Peau douce et gros noyau", "Pesca", "Buccia vellutata e nocciolo grande"],
    ["Animal", "Delfín", "Dolphin", "Golfinho", "Mamífero del mar, muy inteligente", "A very smart sea mammal", "Mamífero do mar, muito inteligente", "Delfin", "Ein sehr kluges Meeressäugetier", "Dauphin", "Un mammifère marin très intelligent", "Delfino", "Un mammifero marino molto intelligente"],
    ["País", "Canadá", "Canada", "Canadá", "Tiene una hoja de arce en la bandera", "It has a maple leaf on its flag", "Tem uma folha de bordo na bandeira", "Kanada", "Hat ein Ahornblatt auf der Flagge", "Canada", "Une feuille d'érable sur son drapeau", "Canada", "Ha una foglia d'acero sulla bandiera"],
    ["Color", "Dorado", "Golden", "Dourado", "El color del oro", "The color of gold", "A cor do ouro", "Golden", "Die Farbe von Gold", "Doré", "La couleur de l'or", "Dorato", "Il colore dell'oro"],
    ["Objeto", "Mochila", "Backpack", "Mochila", "Se lleva en la espalda a la escuela", "You carry it on your back to school", "Se leva nas costas para a escola", "Rucksack", "Den trägst du auf dem Rücken zur Schule", "Cartable", "On le porte sur le dos pour aller à l'école", "Zaino", "Lo porti sulle spalle a scuola"],
    ["Profesión", "Cartero", "Mailman", "Carteiro", "Reparte las cartas", "Delivers the mail", "Entrega as cartas", "Postbote", "Bringt Briefe und Pakete", "Facteur", "Il distribue le courrier", "Postino", "Consegna la posta"],
    ["Deporte", "Boxeo", "Boxing", "Boxe", "Se pelea con guantes en un ring", "Fighting with gloves in a ring", "Luta com luvas num ringue", "Boxen", "Kampf mit Handschuhen im Ring", "Boxe", "Combat avec des gants sur un ring", "Pugilato", "Si combatte con i guantoni su un ring"],
    ["Instrumento musical", "Violín", "Violin", "Violino", "Se toca con un arco", "You play it with a bow", "Se toca com um arco", "Geige", "Wird mit einem Bogen gespielt", "Violon", "On en joue avec un archet", "Violino", "Si suona con l'archetto"],
    ["Verdura", "Papa", "Potato", "Batata", "Con ella se hace el puré", "Used to make mashed potatoes", "Com ela se faz purê", "Kartoffel", "Daraus wird Kartoffelbrei gemacht", "Patate", "On en fait de la purée", "Patata", "Si usa per fare il purè"],
    ["Parte del cuerpo", "Hombro", "Shoulder", "Ombro", "Une el brazo con el cuerpo", "Joins your arm to your body", "Liga o braço ao corpo", "Schulter", "Verbindet den Arm mit dem Körper", "Épaule", "Elle relie le bras au corps", "Spalla", "Unisce il braccio al corpo"],
    ["Bebida", "Mate", "Mate", "Chimarrão", "Infusión que se toma con bombilla", "A herbal drink sipped through a metal straw", "Infusão que se toma com bomba", "Mate", "Kräutergetränk, das mit einem Metallröhrchen getrunken wird", "Maté", "Infusion d'herbe bue avec une paille en métal", "Mate", "Infuso d'erba bevuto con una cannuccia di metallo"],
    ["Ciudad", "Tokio", "Tokyo", "Tóquio", "La capital de Japón", "The capital of Japan", "A capital do Japão", "Tokio", "Die Hauptstadt Japans", "Tokyo", "La capitale du Japon", "Tokyo", "La capitale del Giappone"],
    ["Fruta", "Cereza", "Cherry", "Cereja", "Chiquita, roja y viene de a dos", "Small, red and comes in pairs", "Pequena, vermelha e vem de duas em duas", "Kirsche", "Klein, rot und kommt oft paarweise", "Cerise", "Petite, rouge, souvent par deux", "Ciliegia", "Piccola, rossa e spesso in coppia"],
    ["Animal", "Canguro", "Kangaroo", "Canguru", "Salta y lleva a la cría en una bolsa", "It hops and carries its baby in a pouch", "Pula e leva o filhote numa bolsa", "Känguru", "Springt und trägt sein Junges im Beutel", "Kangourou", "Il saute et porte son petit dans une poche", "Canguro", "Salta e porta il piccolo nel marsupio"],
    ["País", "Italia", "Italy", "Itália", "Tiene forma de bota", "It's shaped like a boot", "Tem forma de bota", "Italien", "Es hat die Form eines Stiefels", "Italie", "Elle a la forme d'une botte", "Italia", "Ha la forma di uno stivale"],
    ["Color", "Naranja", "Orange", "Laranja", "Mezcla de rojo y amarillo", "A mix of red and yellow", "Mistura de vermelho e amarelo", "Orange", "Eine Mischung aus Rot und Gelb", "Orange", "Un mélange de rouge et de jaune", "Arancione", "Un misto di rosso e giallo"],
    ["Comida", "Asado", "Barbecue", "Churrasco", "Carne a la parrilla", "Meat cooked on the grill", "Carne na grelha", "Grillen", "Fleisch, das auf dem Rost gegart wird", "Barbecue", "Viande cuite sur la grille", "Grigliata", "Carne cotta sulla brace"],
    ["Profesión", "Maestra", "Teacher", "Professora", "Enseña en la escuela", "Teaches at school", "Ensina na escola", "Lehrer", "Unterrichtet in der Schule", "Maîtresse", "Elle fait la classe à l'école", "Maestra", "Insegna a scuola"],
    ["Deporte", "Ciclismo", "Cycling", "Ciclismo", "Se practica en bicicleta", "You do it on a bike", "Se pratica de bicicleta", "Radfahren", "Das machst du auf dem Fahrrad", "Cyclisme", "Ça se pratique à vélo", "Ciclismo", "Si fa in bicicletta"],
    ["Instrumento musical", "Trompeta", "Trumpet", "Trompete", "De metal, se sopla y tiene pistones", "Made of metal, you blow it and it has valves", "De metal, se sopra e tem pistões", "Trompete", "Aus Metall, man bläst hinein und sie hat Ventile", "Trompette", "En métal, on souffle dedans, elle a des pistons", "Tromba", "Di metallo, ci soffi dentro e ha i pistoni"],
    ["Verdura", "Brócoli", "Broccoli", "Brócolis", "Parece un arbolito verde", "Looks like a little green tree", "Parece uma arvorezinha verde", "Brokkoli", "Sieht aus wie ein kleiner grüner Baum", "Brocoli", "On dirait un petit arbre vert", "Broccolo", "Sembra un alberello verde"],
    ["Parte del cuerpo", "Tobillo", "Ankle", "Tornozelo", "Une el pie con la pierna", "Joins your foot to your leg", "Liga o pé à perna", "Knöchel", "Verbindet den Fuß mit dem Bein", "Cheville", "Elle relie le pied à la jambe", "Caviglia", "Unisce il piede alla gamba"],
    ["Bebida", "Batido", "Smoothie", "Vitamina", "Fruta licuada, a veces con leche", "Blended fruit, sometimes with milk", "Fruta batida, às vezes com leite", "Smoothie", "Püriertes Obst, manchmal mit Milch", "Smoothie", "Fruits mixés, parfois avec du lait", "Frullato", "Frutta passata nel mixer, a volte con il latte"],
    ["Ciudad", "Lima", "Lima", "Lima", "La capital de Perú", "The capital of Peru", "A capital do Peru", "Lima", "Die Hauptstadt Perus", "Lima", "La capitale du Pérou", "Lima", "La capitale del Perù"],
    ["Fruta", "Ananá", "Pineapple", "Abacaxi", "Tiene corona y es muy dulce", "It has a crown and is very sweet", "Tem coroa e é muito doce", "Ananas", "Hat eine Krone und ist sehr süß", "Ananas", "Il a une couronne et il est très sucré", "Ananas", "Ha una corona ed è dolcissimo"],
    ["Animal", "Murciélago", "Bat", "Morcego", "Vuela de noche y duerme colgado", "Flies at night and sleeps upside down", "Voa à noite e dorme de cabeça para baixo", "Fledermaus", "Fliegt nachts und schläft kopfüber", "Chauve-souris", "Elle vole la nuit et dort la tête en bas", "Pipistrello", "Vola di notte e dorme a testa in giù"],
    ["País", "Alemania", "Germany", "Alemanha", "Su capital es Berlín", "Its capital is Berlin", "A capital é Berlim", "Deutschland", "Seine Hauptstadt ist Berlin", "Allemagne", "Sa capitale est Berlin", "Germania", "La sua capitale è Berlino"],
    ["Color", "Gris", "Gray", "Cinza", "Mezcla de blanco y negro", "A mix of black and white", "Mistura de branco e preto", "Grau", "Eine Mischung aus Schwarz und Weiß", "Gris", "Un mélange de noir et de blanc", "Grigio", "Un misto di nero e bianco"],
    ["Comida", "Ensalada", "Salad", "Salada", "Lechuga, tomate y algo más", "Lettuce, tomato and something else", "Alface, tomate e mais alguma coisa", "Salat", "Grüne Blätter, Tomate und noch etwas", "Salade", "Laitue, tomate et autre chose", "Insalata", "Lattuga, pomodoro e qualcos'altro"],
    ["Objeto", "Almohada", "Pillow", "Travesseiro", "Ahí apoyás la cabeza para dormir", "You rest your head on it to sleep", "Onde você apoia a cabeça para dormir", "Kissen", "Darauf legst du zum Schlafen den Kopf", "Oreiller", "On y pose la tête pour dormir", "Cuscino", "Ci appoggi la testa per dormire"],
    ["Deporte", "Vóley", "Volleyball", "Vôlei", "Se pasa la pelota por arriba de una red", "You hit the ball over a net", "Passa-se a bola por cima de uma rede", "Volleyball", "Der Ball wird über ein Netz geschlagen", "Volley", "On envoie le ballon par-dessus un filet", "Pallavolo", "Si manda la palla oltre una rete"],
    ["Instrumento musical", "Arpa", "Harp", "Harpa", "Muchas cuerdas en un marco grande", "Lots of strings on a big frame", "Muitas cordas numa moldura grande", "Harfe", "Viele Saiten in einem großen Rahmen", "Harpe", "Beaucoup de cordes sur un grand cadre", "Arpa", "Tante corde su un grande telaio"],
    ["Verdura", "Pepino", "Cucumber", "Pepino", "Verde, largo y fresco", "Green, long and fresh", "Verde, comprido e fresco", "Gurke", "Grün, lang und frisch", "Concombre", "Vert, long et frais", "Cetriolo", "Verde, lungo e fresco"],
    ["Ciudad", "Moscú", "Moscow", "Moscou", "La capital de Rusia", "The capital of Russia", "A capital da Rússia", "Moskau", "Die Hauptstadt Russlands", "Moscou", "La capitale de la Russie", "Mosca", "La capitale della Russia"],
    ["Fruta", "Kiwi", "Kiwi", "Kiwi", "Marrón y peludo por fuera, verde por dentro", "Brown and fuzzy outside, green inside", "Marrom e peludo por fora, verde por dentro", "Kiwi", "Außen braun und pelzig, innen grün", "Kiwi", "Brun et poilu dehors, vert dedans", "Kiwi", "Marrone e peloso fuori, verde dentro"],
    ["Animal", "Pulpo", "Octopus", "Polvo", "Tiene ocho brazos", "It has eight arms", "Tem oito braços", "Krake", "Hat acht Arme", "Pieuvre", "Elle a huit bras", "Polpo", "Ha otto tentacoli"],
    ["País", "Australia", "Australia", "Austrália", "El país de los canguros", "The land of kangaroos", "O país dos cangurus", "Australien", "Das Land der Kängurus", "Australie", "Le pays des kangourous", "Australia", "La terra dei canguri"],
    ["Insecto", "Mariposa", "Butterfly", "Borboleta", "Antes de volar fue oruga", "It was a caterpillar before it could fly", "Antes de voar foi lagarta", "Falter", "War eine Raupe, bevor er fliegen konnte", "Papillon", "Il était chenille avant de voler", "Farfalla", "Era un bruco prima di volare"],
    ["Ave", "Loro", "Parrot", "Papagaio", "Puede imitar palabras", "It can copy words", "Consegue imitar palavras", "Papagei", "Kann Wörter nachsprechen", "Perroquet", "Il sait répéter des mots", "Pappagallo", "Sa ripetere le parole"],
    ["Mueble", "Sillón", "Sofa", "Sofá", "Ahí se sientan varios a ver la tele", "Several people sit on it to watch TV", "Onde várias pessoas sentam para ver TV", "Sofa", "Mehrere setzen sich darauf zum Fernsehen", "Canapé", "On s'y assoit à plusieurs pour regarder la télé", "Divano", "Ci si siede in tanti a guardare la TV"],
    ["Herramienta", "Martillo", "Hammer", "Martelo", "Sirve para clavar clavos", "Used to drive in nails", "Serve para pregar pregos", "Hammer", "Damit schlägt man Nägel ein", "Marteau", "Pour planter des clous", "Martello", "Serve a piantare i chiodi"],
    ["Medio de transporte", "Avión", "Airplane", "Avião", "Vuela lleno de pasajeros", "It flies full of passengers", "Voa cheio de passageiros", "Flugzeug", "Fliegt voller Passagiere", "Avion", "Il vole plein de passagers", "Aereo", "Vola pieno di passeggeri"],
    ["Prenda de ropa", "Bufanda", "Scarf", "Cachecol", "Te abriga el cuello", "Keeps your neck warm", "Esquenta o pescoço", "Schal", "Hält deinen Hals warm", "Écharpe", "Elle tient le cou au chaud", "Sciarpa", "Ti tiene caldo il collo"],
    ["Electrodoméstico", "Heladera", "Fridge", "Geladeira", "Mantiene fría la comida", "Keeps food cold", "Mantém a comida gelada", "Kühlschrank", "Hält das Essen kalt", "Frigo", "Il garde la nourriture au froid", "Frigorifero", "Tiene il cibo al freddo"],
    ["Postre", "Flan", "Custard", "Pudim", "Con caramelo, tiembla en el plato", "Wobbly, often with caramel on top", "Com calda de caramelo, treme no prato", "Pudding", "Wackelig, oft mit Karamell obendrauf", "Flan", "Tremblotant, souvent avec du caramel", "Budino", "Tremolante, spesso con il caramello"],
    ["Fruta", "Manzana", "Apple", "Maçã", "Roja o verde, y la mordió Blancanieves", "Red or green, Snow White took a bite", "Vermelha ou verde, a Branca de Neve mordeu", "Apfel", "Rot oder grün, Schneewittchen hat hineingebissen", "Pomme", "Rouge ou verte, Blanche-Neige y a croqué", "Mela", "Rossa o verde, Biancaneve le ha dato un morso"],
    ["Animal", "Cocodrilo", "Crocodile", "Crocodilo", "Reptil enorme con muchos dientes", "A huge reptile with lots of teeth", "Réptil enorme com muitos dentes", "Krokodil", "Ein riesiges Reptil mit vielen Zähnen", "Crocodile", "Un énorme reptile plein de dents", "Coccodrillo", "Un rettile enorme con tantissimi denti"],
    ["Objeto", "Paraguas", "Umbrella", "Sombrinha", "Te protege de la lluvia", "Keeps you dry in the rain", "Protege da chuva", "Schirm", "Hält dich bei Regen trocken", "Parapluie", "Il te garde au sec sous la pluie", "Ombrello", "Ti tiene asciutto sotto la pioggia"],
    ["Insecto", "Hormiga", "Ant", "Formiga", "Chiquita, trabajadora y vive en un hormiguero", "Tiny, hard-working and lives in a colony", "Pequena, trabalhadora e vive num formigueiro", "Ameise", "Winzig, fleißig und lebt in einer Kolonie", "Fourmi", "Minuscule, travailleuse, elle vit en colonie", "Formica", "Piccolissima, lavoratrice, vive in colonia"],
    ["Medio de transporte", "Bicicleta", "Bicycle", "Bicicleta", "Dos ruedas y pedales", "Two wheels and pedals", "Duas rodas e pedais", "Fahrrad", "Zwei Räder und Pedale", "Vélo", "Deux roues et des pédales", "Bicicletta", "Due ruote e i pedali"],
    ["Herramienta", "Serrucho", "Saw", "Serrote", "Sirve para cortar madera", "Used to cut wood", "Serve para cortar madeira", "Säge", "Damit wird Holz geschnitten", "Scie", "Pour couper le bois", "Sega", "Serve a tagliare il legno"],
    ["Prenda de ropa", "Campera", "Jacket", "Jaqueta", "Abrigo con cierre o botones", "A coat with a zipper or buttons", "Agasalho com zíper ou botões", "Jacke", "Mit Reißverschluss oder Knöpfen", "Blouson", "Un manteau avec une fermeture ou des boutons", "Giubbotto", "Un cappotto con la cerniera o i bottoni"],
    ["Ave", "Colibrí", "Hummingbird", "Colibri", "El pájaro más chiquito, aletea rapidísimo", "The tiniest bird, it flaps super fast", "O menor pássaro, bate as asas rapidíssimo", "Kolibri", "Der kleinste Vogel, schlägt superschnell mit den Flügeln", "Colibri", "Le plus petit oiseau, il bat des ailes très vite", "Colibrì", "L'uccello più piccolo, batte le ali velocissimo"],
    // ---- Palabras nuevas (14/10/2026): van después de las 98 primeras, así no cambia ningún día ya jugado. ----
    ["Fruta", "Pera", "Pear", "Pera", "Verde o amarilla, con forma de gota", "Green or yellow, shaped like a drop", "Verde ou amarela, com formato de gota", "Birne", "Grün oder gelb, geformt wie ein Tropfen", "Poire", "Verte ou jaune, en forme de goutte", "Pera", "Verde o gialla, a forma di goccia"],
    ["Fruta", "Uva", "Grape", "Uva", "Viene en racimos y con ella se hace vino", "Comes in bunches and is used to make wine", "Vem em cachos e com ela se faz vinho", "Traube", "Wächst in Rispen, daraus wird Wein gemacht", "Raisin", "En grappes, on en fait du vin", "Uva", "Viene a grappoli e ci si fa il vino"],
    ["Fruta", "Limón", "Lemon", "Limão", "Amarillo y muy ácido", "Yellow and very sour", "Azedo e muito usado em sucos", "Zitrone", "Gelb und sehr sauer", "Citron", "Jaune et très acide", "Limone", "Giallo e molto aspro"],
    ["Fruta", "Mango", "Mango", "Manga", "Tropical, con un carozo grande y plano", "Tropical, with a big flat pit", "Tropical, com um caroço grande e achatado", "Mango", "Tropisch, mit einem großen flachen Kern", "Mangue", "Tropicale, avec un gros noyau plat", "Mango", "Tropicale, con un nocciolo grande e piatto"],
    ["Fruta", "Coco", "Coconut", "Coco", "Peludo por fuera, con agua por dentro", "Hairy outside, with water inside", "Peludo por fora, com água por dentro", "Kokosnuss", "Außen haarig, innen mit Wasser", "Noix de coco", "Poilue dehors, avec de l'eau dedans", "Cocco", "Peloso fuori, con l'acqua dentro"],
    ["Fruta", "Ciruela", "Plum", "Ameixa", "Violeta, chica, y seca se vuelve pasa", "Purple and small; dried, it becomes a prune", "Roxa e pequena; seca, vira passa", "Pflaume", "Lila und klein; getrocknet wird sie zur Backpflaume", "Prune", "Violette et petite ; séchée, elle devient toute ridée", "Prugna", "Viola e piccola; secca, diventa tutta rugosa"],
    ["Fruta", "Melón", "Melon", "Melão", "Grande, redondo y de pulpa dulce", "Big, round and sweet inside", "Grande, redondo e de polpa doce", "Melone", "Groß, rund und innen süß", "Melon", "Gros, rond et sucré dedans", "Melone", "Grande, tondo e dolce dentro"],
    ["Fruta", "Higo", "Fig", "Figo", "Fruta morada llena de semillitas por dentro", "Purple fruit full of tiny seeds inside", "Fruta roxa cheia de sementinhas por dentro", "Feige", "Lila Frucht mit vielen winzigen Kernen innen", "Figue", "Fruit violet plein de petites graines", "Fico", "Frutto viola pieno di semini"],
    ["Fruta", "Frambuesa", "Raspberry", "Framboesa", "Roja, chiquita y hueca por dentro", "Small, red and hollow inside", "Vermelha, pequena e oca por dentro", "Himbeere", "Klein, rot und innen hohl", "Framboise", "Petite, rouge et creuse", "Lampone", "Piccolo, rosso e vuoto dentro"],
    ["Fruta", "Granada", "Pomegranate", "Romã", "Por dentro tiene cientos de granitos rojos", "Inside it has hundreds of red seeds", "Por dentro tem centenas de grãozinhos vermelhos", "Granatapfel", "Innen hat er Hunderte rote Kerne", "Grenade", "Elle a des centaines de grains rouges dedans", "Melograno", "Dentro ha centinaia di chicchi rossi"],
    ["Fruta", "Arándano", "Blueberry", "Mirtilo", "Bolita azul oscura, muy chiquita", "A tiny dark blue berry", "Bolinha azul-escura, bem pequena", "Heidelbeere", "Eine winzige dunkelblaue Beere", "Myrtille", "Une toute petite baie bleu foncé", "Mirtillo", "Una bacca piccolissima blu scuro"],
    ["Fruta", "Papaya", "Papaya", "Mamão", "Tropical, naranja por dentro con semillas negras", "Tropical, orange inside with black seeds", "Tropical, laranja por dentro com sementes pretas", "Papaya", "Tropisch, innen orange mit schwarzen Kernen", "Papaye", "Tropicale, orange dedans avec des graines noires", "Papaia", "Tropicale, arancione dentro con semi neri"],
    ["Fruta", "Guayaba", "Guava", "Goiaba", "Tropical, rosada por dentro, ideal para dulces", "Tropical, pink inside, great for jams", "Tropical, rosada por dentro, ótima para doces", "Guave", "Tropisch, innen rosa, super für Marmelade", "Goyave", "Tropicale, rose dedans, parfaite en confiture", "Guava", "Tropicale, rosa dentro, ottima per le marmellate"],
    ["Fruta", "Mora", "Blackberry", "Amora", "Negra, crece en arbustos con espinas", "Black, grows on thorny bushes", "Preta, cresce em arbustos com espinhos", "Brombeere", "Schwarz, wächst an dornigen Sträuchern", "Mûre", "Noire, elle pousse sur des buissons épineux", "Mora", "Nera, cresce sui rovi"],
    ["Fruta", "Dátil", "Date", "Tâmara", "Fruta de la palmera, muy dulce", "The very sweet fruit of a palm tree", "Fruta da palmeira, muito doce", "Dattel", "Die sehr süße Frucht einer Palme", "Datte", "Le fruit très sucré d'un palmier", "Dattero", "Il frutto dolcissimo di una palma"],
    ["Fruta", "Membrillo", "Quince", "Marmelo", "Con ella se hace un dulce para comer con queso", "Used to make a paste eaten with cheese", "Com ela se faz um doce para comer com queijo", "Quitte", "Daraus wird ein Gelee gemacht, das man zu Käse isst", "Coing", "On en fait une pâte qu'on mange avec du fromage", "Mela cotogna", "Ci si fa una pasta da mangiare col formaggio"],
    ["Animal", "León", "Lion", "Leão", "El rey de la selva", "The king of the jungle", "O rei da selva", "Löwe", "Der König des Dschungels", "Lion", "Le roi de la jungle", "Leone", "Il re della giungla"],
    ["Animal", "Tigre", "Tiger", "Tigre", "Felino naranja con rayas negras", "Orange cat with black stripes", "Felino laranja com listras pretas", "Tiger", "Orange Raubkatze mit schwarzen Streifen", "Tigre", "Félin orange rayé de noir", "Tigre", "Felino arancione a strisce nere"],
    ["Animal", "Cebra", "Zebra", "Zebra", "Caballo con rayas blancas y negras", "A horse with black and white stripes", "Cavalo com listras brancas e pretas", "Zebra", "Ein Pferd mit schwarzen und weißen Streifen", "Zèbre", "Un cheval à rayures noires et blanches", "Zebra", "Un cavallo a strisce bianche e nere"],
    ["Animal", "Caballo", "Horse", "Cavalo", "Se lo monta y relincha", "You ride it and it neighs", "Você monta nele e ele relincha", "Pferd", "Man reitet darauf und es wiehert", "Cheval", "On le monte et il hennit", "Cavallo", "Lo monti e nitrisce"],
    ["Animal", "Conejo", "Rabbit", "Coelho", "Orejas largas y le encanta la zanahoria", "Long ears and loves carrots", "Orelhas compridas e adora cenoura", "Hase", "Lange Ohren und liebt Karotten", "Lapin", "Longues oreilles et fou de carottes", "Coniglio", "Orecchie lunghe e pazzo per le carote"],
    ["Animal", "Ballena", "Whale", "Baleia", "El animal más grande del mar", "The biggest animal in the sea", "O maior animal do mar", "Wal", "Das größte Tier im Meer", "Baleine", "Le plus grand animal de la mer", "Balena", "L'animale più grande del mare"],
    ["Animal", "Tiburón", "Shark", "Tubarão", "Pez con muchos dientes y una aleta en la espalda", "A fish with lots of teeth and a fin on its back", "Peixe com muitos dentes e uma barbatana nas costas", "Hai", "Ein Fisch mit vielen Zähnen und einer Flosse auf dem Rücken", "Requin", "Un poisson plein de dents avec un aileron sur le dos", "Squalo", "Un pesce pieno di denti con una pinna sulla schiena"],
    ["Animal", "Oso", "Bear", "Urso", "Grande, peludo y le gusta la miel", "Big, furry and loves honey", "Grande, peludo e gosta de mel", "Bär", "Groß, pelzig und liebt Honig", "Ours", "Gros, poilu et fou de miel", "Orso", "Grande, peloso e goloso di miele"],
    ["Animal", "Lobo", "Wolf", "Lobo", "Le aúlla a la luna", "Howls at the moon", "Uiva para a lua", "Wolf", "Heult den Mond an", "Loup", "Il hurle à la lune", "Lupo", "Ulula alla luna"],
    ["Animal", "Zorro", "Fox", "Raposa", "Astuto, de cola esponjosa", "Clever, with a fluffy tail", "Esperta, de rabo felpudo", "Fuchs", "Schlau, mit buschigem Schwanz", "Renard", "Rusé, avec une queue touffue", "Volpe", "Furba, con la coda folta"],
    ["Animal", "Mono", "Monkey", "Macaco", "Salta de árbol en árbol y come bananas", "Swings from tree to tree and eats bananas", "Pula de árvore em árvore e come banana", "Affe", "Schwingt von Baum zu Baum und frisst Bananen", "Singe", "Il saute d'arbre en arbre et mange des bananes", "Scimmia", "Salta da un albero all'altro e mangia banane"],
    ["Animal", "Camello", "Camel", "Camelo", "Vive en el desierto y tiene jorobas", "Lives in the desert and has humps", "Vive no deserto e tem corcovas", "Kamel", "Lebt in der Wüste und hat Höcker", "Chameau", "Il vit dans le désert et a des bosses", "Cammello", "Vive nel deserto e ha le gobbe"],
    ["Animal", "Ardilla", "Squirrel", "Esquilo", "Junta nueces y vive en los árboles", "Collects nuts and lives in trees", "Junta nozes e vive nas árvores", "Hörnchen", "Sammelt Nüsse und lebt in Bäumen", "Écureuil", "Il ramasse des noisettes et vit dans les arbres", "Scoiattolo", "Raccoglie noci e vive sugli alberi"],
    ["Animal", "Gallina", "Hen", "Galinha", "Pone huevos y cacarea", "Lays eggs and clucks", "Bota ovos e cacareja", "Huhn", "Legt Eier und gackert", "Poule", "Elle pond des œufs et caquette", "Gallina", "Fa le uova e chioccia"],
    ["Animal", "Vaca", "Cow", "Vaca", "Nos da la leche", "Gives us milk", "Nos dá o leite", "Kuh", "Gibt uns Milch", "Vache", "Elle nous donne du lait", "Mucca", "Ci dà il latte"],
    ["Animal", "Cerdo", "Pig", "Porco", "Rosado, con cola enrulada", "Pink, with a curly tail", "Rosado, com rabo enrolado", "Schwein", "Rosa, mit Ringelschwanz", "Cochon", "Rose, avec une queue en tire-bouchon", "Maiale", "Rosa, con la coda a ricciolo"],
    ["Animal", "Oveja", "Sheep", "Ovelha", "De su lana se hacen abrigos", "Its wool is used to make sweaters", "Da sua lã se fazem agasalhos", "Schaf", "Aus seiner Wolle werden Pullover gemacht", "Mouton", "Sa laine sert à faire des pulls", "Pecora", "Con la sua lana si fanno i maglioni"],
    ["Animal", "Burro", "Donkey", "Burro", "Parecido al caballo, de orejas largas", "Like a horse, with long ears", "Parecido com o cavalo, de orelhas compridas", "Esel", "Wie ein Pferd, mit langen Ohren", "Âne", "Comme un cheval, avec de longues oreilles", "Asino", "Come un cavallo, ma con le orecchie lunghe"],
    ["Animal", "Rana", "Frog", "Sapo", "Verde, salta y croa", "Green, jumps and croaks", "Verde, pula e coaxa", "Frosch", "Grün, springt und quakt", "Grenouille", "Verte, elle saute et coasse", "Rana", "Verde, salta e gracida"],
    ["Animal", "Serpiente", "Snake", "Cobra", "No tiene patas y se arrastra", "Has no legs and slithers", "Não tem patas e se arrasta", "Schlange", "Hat keine Beine und schlängelt sich", "Serpent", "Il n'a pas de pattes et rampe", "Serpente", "Non ha zampe e striscia"],
    ["Animal", "Hipopótamo", "Hippo", "Hipopótamo", "Enorme, vive en los ríos de África", "Huge, lives in African rivers", "Enorme, vive nos rios da África", "Nilpferd", "Riesig, lebt in afrikanischen Flüssen", "Hippopotame", "Énorme, il vit dans les fleuves d'Afrique", "Ippopotamo", "Enorme, vive nei fiumi africani"],
    ["Animal", "Rinoceronte", "Rhino", "Rinoceronte", "Tiene un cuerno en la nariz", "Has a horn on its nose", "Tem um chifre no nariz", "Nashorn", "Hat ein Horn auf der Nase", "Rhinocéros", "Il a une corne sur le nez", "Rinoceronte", "Ha un corno sul naso"],
    ["Animal", "Koala", "Koala", "Coala", "Abraza árboles en Australia", "Hugs trees in Australia", "Abraça árvores na Austrália", "Koala", "Umarmt Bäume in Australien", "Koala", "Il fait des câlins aux arbres en Australie", "Koala", "Abbraccia gli alberi in Australia"],
    ["Animal", "Panda", "Panda", "Panda", "Oso blanco y negro que come bambú", "Black and white bear that eats bamboo", "Urso branco e preto que come bambu", "Panda", "Schwarz-weißer Bär, der Bambus frisst", "Panda", "Ours noir et blanc qui mange du bambou", "Panda", "Orso bianco e nero che mangia bambù"],
    ["Animal", "Foca", "Seal", "Foca", "Vive en el hielo y aplaude con las aletas", "Lives on the ice and claps with its flippers", "Vive no gelo e bate palmas com as nadadeiras", "Robbe", "Lebt auf dem Eis und klatscht mit den Flossen", "Phoque", "Il vit sur la glace et applaudit avec ses nageoires", "Foca", "Vive sul ghiaccio e applaude con le pinne"],
    ["Animal", "Medusa", "Jellyfish", "Medusa", "Transparente, flota en el mar y pica", "Transparent, floats in the sea and stings", "Transparente, flutua no mar e queima", "Qualle", "Durchsichtig, schwebt im Meer und brennt", "Méduse", "Transparente, elle flotte dans la mer et pique", "Medusa", "Trasparente, galleggia nel mare e punge"],
    ["Animal", "Caracol", "Snail", "Caracol", "Lento, lleva su casa en la espalda", "Slow, carries its shell on its back", "Lento, leva a casinha nas costas", "Schnecke", "Langsam, trägt ihr Haus auf dem Rücken", "Escargot", "Lent, il porte sa coquille sur le dos", "Lumaca", "Lenta, porta il guscio sulla schiena"],
    ["Animal", "Ratón", "Mouse", "Rato", "Chiquito, le encanta el queso", "Tiny and loves cheese", "Pequenino, adora queijo", "Maus", "Winzig und liebt Käse", "Souris", "Toute petite et fan de fromage", "Topo", "Piccolissimo e ama il formaggio"],
    ["Animal", "Gato", "Cat", "Gato", "Maúlla y ronronea", "Meows and purrs", "Mia e ronrona", "Katze", "Miaut und schnurrt", "Chat", "Il miaule et ronronne", "Gatto", "Miagola e fa le fusa"],
    ["Animal", "Perro", "Dog", "Cachorro", "El mejor amigo del hombre", "Man's best friend", "O melhor amigo do homem", "Hund", "Der beste Freund des Menschen", "Chien", "Le meilleur ami de l'homme", "Cane", "Il migliore amico dell'uomo"],
    ["Animal", "Pato", "Duck", "Pato", "Nada en la laguna y hace cuac", "Swims in the pond and quacks", "Nada na lagoa e faz quá-quá", "Ente", "Schwimmt im Teich und quakt", "Canard", "Il nage dans la mare et fait coin-coin", "Anatra", "Nuota nello stagno e fa qua qua"],
    ["Animal", "Mapache", "Raccoon", "Guaxinim", "Tiene antifaz y revuelve la basura", "Wears a mask and digs through trash", "Tem máscara e revira o lixo", "Waschbär", "Trägt eine Maske und wühlt im Müll", "Raton", "Avec son masque, il fouille les poubelles", "Procione", "Ha una mascherina e fruga nella spazzatura"],
    ["Ave", "Águila", "Eagle", "Águia", "Ave de presa que vuela muy alto", "A bird of prey that flies very high", "Ave de rapina que voa bem alto", "Adler", "Ein Greifvogel, der sehr hoch fliegt", "Aigle", "Un rapace qui vole très haut", "Aquila", "Un rapace che vola altissimo"],
    ["Ave", "Búho", "Owl", "Coruja", "Sale de noche y gira la cabeza", "Comes out at night and turns its head around", "Sai à noite e gira a cabeça", "Eule", "Kommt nachts heraus und dreht den Kopf weit herum", "Hibou", "Il sort la nuit et tourne la tête", "Gufo", "Esce di notte e gira la testa"],
    ["Ave", "Paloma", "Pigeon", "Pombo", "Está en todas las plazas", "Found in every city square", "Está em todas as praças", "Taube", "Findet man auf jedem Stadtplatz", "Pigeon", "On le trouve sur toutes les places des villes", "Piccione", "Lo trovi in tutte le piazze"],
    ["Ave", "Gaviota", "Seagull", "Gaivota", "Vuela sobre el mar y la playa", "Flies over the sea and the beach", "Voa sobre o mar e a praia", "Möwe", "Fliegt über Meer und Strand", "Mouette", "Elle vole au-dessus de la mer et de la plage", "Gabbiano", "Vola sopra il mare e la spiaggia"],
    ["Ave", "Flamenco", "Flamingo", "Flamingo", "Rosado y se para en una pata", "Pink and stands on one leg", "Rosado e fica numa perna só", "Flamingo", "Rosa und steht auf einem Bein", "Flamant", "Rose, il tient sur une patte", "Fenicottero", "Rosa e sta su una zampa sola"],
    ["Ave", "Avestruz", "Ostrich", "Avestruz", "El ave más grande, no vuela pero corre", "The biggest bird; it can't fly but it runs", "A maior ave; não voa, mas corre", "Strauss", "Der größte Vogel; er kann nicht fliegen, aber rennen", "Autruche", "Le plus grand oiseau ; elle ne vole pas mais court", "Struzzo", "L'uccello più grande; non vola ma corre"],
    ["Ave", "Cisne", "Swan", "Cisne", "Blanco y elegante, nada en los lagos", "White and elegant, swims in lakes", "Branco e elegante, nada nos lagos", "Schwan", "Weiß und elegant, schwimmt auf Seen", "Cygne", "Blanc et élégant, il nage sur les lacs", "Cigno", "Bianco ed elegante, nuota nei laghi"],
    ["Ave", "Tucán", "Toucan", "Tucano", "Tiene un pico enorme y colorido", "Has a huge colorful beak", "Tem um bico enorme e colorido", "Tukan", "Hat einen riesigen bunten Schnabel", "Toucan", "Il a un énorme bec coloré", "Tucano", "Ha un becco enorme e colorato"],
    ["Ave", "Cuervo", "Crow", "Corvo", "Negro, muy inteligente", "Black and very smart", "Preto e muito inteligente", "Rabe", "Schwarz und sehr schlau", "Corbeau", "Noir et très intelligent", "Corvo", "Nero e molto intelligente"],
    ["Ave", "Halcón", "Falcon", "Falcão", "El ave más rápida en picada", "The fastest bird when diving", "A ave mais rápida no mergulho", "Falke", "Im Sturzflug der schnellste Vogel", "Faucon", "L'oiseau le plus rapide en piqué", "Falco", "L'uccello più veloce in picchiata"],
    ["Ave", "Gorrión", "Sparrow", "Pardal", "Pajarito marrón de la ciudad", "A little brown city bird", "Passarinho marrom da cidade", "Spatz", "Ein kleiner brauner Stadtvogel", "Moineau", "Petit oiseau brun des villes", "Passero", "Uccellino marrone di città"],
    ["Ave", "Cigüeña", "Stork", "Cegonha", "Dicen que trae a los bebés", "They say it brings the babies", "Dizem que traz os bebês", "Storch", "Man sagt, er bringt die Babys", "Cigogne", "On dit qu'elle apporte les bébés", "Cicogna", "Dicono che porti i bambini"],
    ["Ave", "Pelícano", "Pelican", "Pelicano", "Guarda los peces en una bolsa del pico", "Keeps fish in a pouch in its beak", "Guarda os peixes numa bolsa do bico", "Pelikan", "Bewahrt Fische in einem Beutel am Schnabel auf", "Pélican", "Il garde les poissons dans une poche sous le bec", "Pellicano", "Tiene i pesci in una sacca sotto il becco"],
    ["Ave", "Canario", "Canary", "Canário", "Amarillo y canta muy lindo", "Yellow and sings beautifully", "Amarelo e canta muito bonito", "Kanarienvogel", "Gelb und singt wunderschön", "Canari", "Jaune, il chante très bien", "Canarino", "Giallo e canta benissimo"],
    ["Ave", "Golondrina", "Swallow", "Andorinha", "Viaja lejos cuando llega el frío", "Flies far away when the cold comes", "Viaja para longe quando chega o frio", "Schwalbe", "Fliegt weit weg, wenn es kalt wird", "Hirondelle", "Elle part très loin quand vient le froid", "Rondine", "Vola lontano quando arriva il freddo"],
    ["Insecto", "Abeja", "Bee", "Abelha", "Hace miel y zumba", "Makes honey and buzzes", "Faz mel e zumbe", "Biene", "Macht Honig und summt", "Abeille", "Elle fait du miel et bourdonne", "Ape", "Fa il miele e ronza"],
    ["Insecto", "Mosca", "Fly", "Mosca", "Molesta zumbando alrededor de la comida", "Buzzes annoyingly around food", "Incomoda zumbindo em volta da comida", "Fliege", "Summt nervig ums Essen herum", "Mouche", "Elle bourdonne autour de la nourriture", "Mosca", "Ronza fastidiosa intorno al cibo"],
    ["Insecto", "Mosquito", "Mosquito", "Mosquito", "Pica de noche y deja ronchas", "Bites at night and leaves itchy bumps", "Pica à noite e deixa coceira", "Mücke", "Sticht nachts und hinterlässt juckende Beulen", "Moustique", "Il pique la nuit et laisse des boutons", "Zanzara", "Punge di notte e lascia brufoli che prudono"],
    ["Insecto", "Grillo", "Cricket", "Grilo", "Canta de noche frotando las patas", "Chirps at night by rubbing its legs", "Canta à noite esfregando as patas", "Grille", "Zirpt nachts, indem sie die Beine reibt", "Grillon", "Il chante la nuit en frottant ses pattes", "Grillo", "Canta di notte sfregando le zampe"],
    ["Insecto", "Libélula", "Dragonfly", "Libélula", "Cuatro alas transparentes, vuela sobre el agua", "Four clear wings, flies over water", "Quatro asas transparentes, voa sobre a água", "Libelle", "Vier durchsichtige Flügel, fliegt über dem Wasser", "Libellule", "Quatre ailes transparentes, elle vole sur l'eau", "Libellula", "Quattro ali trasparenti, vola sull'acqua"],
    ["Insecto", "Escarabajo", "Beetle", "Besouro", "Tiene un caparazón duro y brillante", "Has a hard, shiny shell", "Tem uma carapaça dura e brilhante", "Käfer", "Hat einen harten, glänzenden Panzer", "Scarabée", "Il a une carapace dure et brillante", "Scarabeo", "Ha un guscio duro e lucido"],
    ["Insecto", "Cucaracha", "Cockroach", "Barata", "Corre rápido y a casi todos les da asco", "Runs fast and grosses out almost everyone", "Corre rápido e quase todo mundo tem nojo", "Kakerlake", "Rennt schnell und ekelt fast alle", "Cafard", "Il court vite et dégoûte presque tout le monde", "Scarafaggio", "Corre veloce e fa schifo a quasi tutti"],
    ["Insecto", "Avispa", "Wasp", "Vespa", "Parecida a la abeja, pero pica más", "Like a bee, but stings more", "Parecida com a abelha, mas pica mais", "Wespe", "Wie eine Biene, sticht aber öfter", "Guêpe", "Comme une abeille, mais elle pique plus", "Vespa", "Come un'ape, ma punge di più"],
    ["Insecto", "Saltamontes", "Grasshopper", "Gafanhoto", "Verde y da saltos enormes", "Green and makes huge jumps", "Verde e dá saltos enormes", "Heuschrecke", "Grün und macht riesige Sprünge", "Sauterelle", "Verte, elle fait des bonds énormes", "Cavalletta", "Verde e fa salti enormi"],
    ["Insecto", "Luciérnaga", "Firefly", "Pirilampo", "Brilla de noche", "Glows at night", "Brilha à noite", "Glühwurm", "Leuchtet in der Nacht", "Luciole", "Elle brille la nuit", "Lucciola", "Si illumina di notte"],
    ["País", "Francia", "France", "França", "El país de la Torre Eiffel", "The country of the Eiffel Tower", "O país da Torre Eiffel", "Frankreich", "Das Land des Eiffelturms", "France", "Le pays de la tour Eiffel", "Francia", "Il paese della Torre Eiffel"],
    ["País", "España", "Spain", "Espanha", "El país del flamenco y la paella", "The country of flamenco and paella", "O país do flamenco e da paella", "Spanien", "Das Land von Flamenco und Paella", "Espagne", "Le pays du flamenco et de la paella", "Spagna", "Il paese del flamenco e della paella"],
    ["País", "Chile", "Chile", "Chile", "Largo y angosto, junto a la cordillera", "Long and narrow, along the Andes", "Comprido e estreito, junto à cordilheira", "Chile", "Lang und schmal, entlang der Anden", "Chili", "Long et étroit, le long des Andes", "Cile", "Lungo e stretto, lungo le Ande"],
    ["País", "Perú", "Peru", "Peru", "El país de Machu Picchu", "The country of Machu Picchu", "O país de Machu Picchu", "Peru", "Das Land von Machu Picchu", "Pérou", "Le pays du Machu Picchu", "Perù", "Il paese di Machu Picchu"],
    ["País", "Uruguay", "Uruguay", "Uruguai", "Su capital es Montevideo", "Its capital is Montevideo", "Sua capital é Montevidéu", "Uruguay", "Seine Hauptstadt ist Montevideo", "Uruguay", "Sa capitale est Montevideo", "Uruguay", "La sua capitale è Montevideo"],
    ["País", "Colombia", "Colombia", "Colômbia", "Famoso por su café", "Famous for its coffee", "Famoso pelo seu café", "Kolumbien", "Berühmt für seinen Kaffee", "Colombie", "Célèbre pour son café", "Colombia", "Famosa per il suo caffè"],
    ["País", "Argentina", "Argentina", "Argentina", "El país del tango y del mate", "The land of tango and mate", "O país do tango e do chimarrão", "Argentinien", "Das Land von Tango und Mate", "Argentine", "Le pays du tango et du maté", "Argentina", "La terra del tango e del mate"],
    ["País", "China", "China", "China", "El país de la Gran Muralla", "The country of the Great Wall", "O país da Grande Muralha", "China", "Das Land der Chinesischen Mauer", "Chine", "Le pays de la Grande Muraille", "Cina", "Il paese della Grande Muraglia"],
    ["País", "India", "India", "Índia", "El país del Taj Mahal", "The country of the Taj Mahal", "O país do Taj Mahal", "Indien", "Das Land des Taj Mahal", "Inde", "Le pays du Taj Mahal", "India", "Il paese del Taj Mahal"],
    ["País", "Rusia", "Russia", "Rússia", "El país más grande del mundo", "The largest country in the world", "O maior país do mundo", "Russland", "Das größte Land der Welt", "Russie", "Le plus grand pays du monde", "Russia", "Il paese più grande del mondo"],
    ["País", "Grecia", "Greece", "Grécia", "Allí nacieron los Juegos Olímpicos", "Where the Olympic Games were born", "Onde nasceram os Jogos Olímpicos", "Griechenland", "Hier entstanden die Olympischen Spiele", "Grèce", "Là où sont nés les Jeux olympiques", "Grecia", "Dove sono nati i Giochi olimpici"],
    ["País", "Portugal", "Portugal", "Portugal", "Su capital es Lisboa", "Its capital is Lisbon", "Sua capital é Lisboa", "Portugal", "Seine Hauptstadt ist Lissabon", "Portugal", "Sa capitale est Lisbonne", "Portogallo", "La sua capitale è Lisbona"],
    ["País", "Noruega", "Norway", "Noruega", "Tierra de fiordos y vikingos", "Land of fjords and Vikings", "Terra de fiordes e vikings", "Norwegen", "Land der Fjorde und Wikinger", "Norvège", "Le pays des fjords et des Vikings", "Norvegia", "Terra di fiordi e vichinghi"],
    ["País", "Suecia", "Sweden", "Suécia", "Su capital es Estocolmo", "Its capital is Stockholm", "Sua capital é Estocolmo", "Schweden", "Seine Hauptstadt ist Stockholm", "Suède", "Sa capitale est Stockholm", "Svezia", "La sua capitale è Stoccolma"],
    ["País", "Marruecos", "Morocco", "Marrocos", "País africano frente a España", "An African country across from Spain", "País africano em frente à Espanha", "Marokko", "Ein afrikanisches Land gegenüber von Spanien", "Maroc", "Un pays d'Afrique en face de l'Espagne", "Marocco", "Un paese africano di fronte alla Spagna"],
    ["País", "Turquía", "Turkey", "Turquia", "Está entre Europa y Asia", "Lies between Europe and Asia", "Fica entre a Europa e a Ásia", "Türkei", "Liegt zwischen Europa und Asien", "Turquie", "Entre l'Europe et l'Asie", "Turchia", "Sta tra l'Europa e l'Asia"],
    ["País", "Cuba", "Cuba", "Cuba", "Isla del Caribe, su capital es La Habana", "Caribbean island; its capital is Havana", "Ilha do Caribe; a capital é Havana", "Kuba", "Karibikinsel; ihre Hauptstadt ist Havanna", "Cuba", "Île des Caraïbes ; sa capitale est La Havane", "Cuba", "Isola dei Caraibi; la sua capitale è L'Avana"],
    ["País", "Venezuela", "Venezuela", "Venezuela", "Ahí está el Salto Ángel", "Home of Angel Falls", "Lá fica o Salto Ángel", "Venezuela", "Heimat des Salto Ángel", "Venezuela", "Le pays du Salto Ángel", "Venezuela", "Il paese del Salto Angel"],
    ["País", "Ecuador", "Ecuador", "Equador", "Lo cruza la línea que divide el mundo en dos", "Crossed by the line that splits the world in two", "Cruzado pela linha que divide o mundo em dois", "Ecuador", "Die Linie, die die Welt teilt, geht hindurch", "Équateur", "Traversé par la ligne qui coupe le monde en deux", "Ecuador", "Attraversato dalla linea che divide il mondo in due"],
    ["País", "Paraguay", "Paraguay", "Paraguai", "Su capital es Asunción", "Its capital is Asunción", "Sua capital é Assunção", "Paraguay", "Seine Hauptstadt ist Asunción", "Paraguay", "Sa capitale est Asunción", "Paraguay", "La sua capitale è Asunción"],
    ["País", "Bolivia", "Bolivia", "Bolívia", "Tiene el salar más grande del mundo", "Has the largest salt flat in the world", "Tem o maior deserto de sal do mundo", "Bolivien", "Hat die größte Salzwüste der Welt", "Bolivie", "Elle a le plus grand désert de sel du monde", "Bolivia", "Ha il deserto di sale più grande del mondo"],
    ["País", "Irlanda", "Ireland", "Irlanda", "La isla verde del trébol", "The green island of the shamrock", "A ilha verde do trevo", "Irland", "Die grüne Insel des Kleeblatts", "Irlande", "L'île verte du trèfle", "Irlanda", "L'isola verde del trifoglio"],
    ["País", "Suiza", "Switzerland", "Suíça", "Famosa por sus relojes y chocolates", "Famous for its watches and chocolate", "Famosa pelos relógios e chocolates", "Schweiz", "Berühmt für Uhren und Schokolade", "Suisse", "Célèbre pour ses montres et son chocolat", "Svizzera", "Famosa per gli orologi e il cioccolato"],
    ["País", "Kenia", "Kenya", "Quênia", "País africano de safaris", "An African country of safaris", "País africano dos safáris", "Kenia", "Ein afrikanisches Land der Safaris", "Kenya", "Un pays d'Afrique des safaris", "Kenya", "Un paese africano dei safari"],
    ["País", "Corea", "Korea", "Coreia", "País asiático del kimchi", "The Asian country of kimchi", "País asiático do kimchi", "Korea", "Das asiatische Land des Kimchi", "Corée", "Le pays asiatique du kimchi", "Corea", "Il paese asiatico del kimchi"],
    ["País", "Vietnam", "Vietnam", "Vietnã", "País asiático famoso por su sopa pho", "An Asian country famous for pho", "País asiático famoso pela sopa pho", "Vietnam", "Ein asiatisches Land, berühmt für Pho", "Vietnam", "Un pays d'Asie célèbre pour le pho", "Vietnam", "Un paese asiatico famoso per il pho"],
    ["Ciudad", "Barcelona", "Barcelona", "Barcelona", "Ciudad de la Sagrada Familia", "City of the Sagrada Família", "Cidade da Sagrada Família", "Barcelona", "Stadt der Sagrada Família", "Barcelone", "La ville de la Sagrada Família", "Barcellona", "La città della Sagrada Família"],
    ["Ciudad", "Berlín", "Berlin", "Berlim", "La capital de Alemania", "The capital of Germany", "A capital da Alemanha", "Berlin", "Die Hauptstadt Deutschlands", "Berlin", "La capitale de l'Allemagne", "Berlino", "La capitale della Germania"],
    ["Ciudad", "Lisboa", "Lisbon", "Lisboa", "La capital de Portugal", "The capital of Portugal", "A capital de Portugal", "Lissabon", "Die Hauptstadt Portugals", "Lisbonne", "La capitale du Portugal", "Lisbona", "La capitale del Portogallo"],
    ["Ciudad", "Atenas", "Athens", "Atenas", "La capital de Grecia", "The capital of Greece", "A capital da Grécia", "Athen", "Die Hauptstadt Griechenlands", "Athènes", "La capitale de la Grèce", "Atene", "La capitale della Grecia"],
    ["Ciudad", "Venecia", "Venice", "Veneza", "Ciudad con canales en vez de calles", "A city with canals instead of streets", "Cidade com canais em vez de ruas", "Venedig", "Eine Stadt mit Kanälen statt Straßen", "Venise", "Une ville avec des canaux au lieu de rues", "Venezia", "Una città con i canali al posto delle strade"],
    ["Ciudad", "Dubái", "Dubai", "Dubai", "Tiene el edificio más alto del mundo", "Has the tallest building in the world", "Tem o prédio mais alto do mundo", "Dubai", "Hat das höchste Gebäude der Welt", "Dubaï", "Elle a le plus haut gratte-ciel du monde", "Dubai", "Ha il grattacielo più alto del mondo"],
    ["Ciudad", "Sídney", "Sydney", "Sydney", "Ciudad australiana de la famosa ópera", "Australian city with the famous opera house", "Cidade australiana da famosa ópera", "Sydney", "Australische Stadt mit dem berühmten Opernhaus", "Sydney", "Ville australienne à l'opéra célèbre", "Sydney", "Città australiana con il famoso teatro dell'opera"],
    ["Ciudad", "Bogotá", "Bogota", "Bogotá", "La capital de Colombia", "The capital of Colombia", "A capital da Colômbia", "Bogota", "Die Hauptstadt Kolumbiens", "Bogota", "La capitale de la Colombie", "Bogotà", "La capitale della Colombia"],
    ["Ciudad", "Santiago", "Santiago", "Santiago", "La capital de Chile", "The capital of Chile", "A capital do Chile", "Santiago", "Die Hauptstadt Chiles", "Santiago", "La capitale du Chili", "Santiago", "La capitale del Cile"],
    ["Ciudad", "Montevideo", "Montevideo", "Montevidéu", "La capital de Uruguay", "The capital of Uruguay", "A capital do Uruguai", "Montevideo", "Die Hauptstadt Uruguays", "Montevideo", "La capitale de l'Uruguay", "Montevideo", "La capitale dell'Uruguay"],
    ["Ciudad", "Caracas", "Caracas", "Caracas", "La capital de Venezuela", "The capital of Venezuela", "A capital da Venezuela", "Caracas", "Die Hauptstadt Venezuelas", "Caracas", "La capitale du Venezuela", "Caracas", "La capitale del Venezuela"],
    ["Ciudad", "Quito", "Quito", "Quito", "La capital de Ecuador", "The capital of Ecuador", "A capital do Equador", "Quito", "Die Hauptstadt Ecuadors", "Quito", "La capitale de l'Équateur", "Quito", "La capitale dell'Ecuador"],
    ["Ciudad", "Cancún", "Cancun", "Cancún", "Playas del Caribe mexicano", "Beaches of the Mexican Caribbean", "Praias do Caribe mexicano", "Cancun", "Strände der mexikanischen Karibik", "Cancún", "Les plages des Caraïbes mexicaines", "Cancún", "Le spiagge dei Caraibi messicani"],
    ["Ciudad", "Toronto", "Toronto", "Toronto", "La ciudad más grande de Canadá", "The biggest city in Canada", "A maior cidade do Canadá", "Toronto", "Die größte Stadt Kanadas", "Toronto", "La plus grande ville du Canada", "Toronto", "La città più grande del Canada"],
    ["Ciudad", "Chicago", "Chicago", "Chicago", "Ciudad de Estados Unidos junto a un gran lago", "A US city on a great lake", "Cidade dos Estados Unidos junto a um grande lago", "Chicago", "Eine US-Stadt an einem großen See", "Chicago", "Ville américaine au bord d'un grand lac", "Chicago", "Città americana su un grande lago"],
    ["Ciudad", "Miami", "Miami", "Miami", "Ciudad de playas en Florida", "A beach city in Florida", "Cidade de praias na Flórida", "Miami", "Eine Strandstadt in Florida", "Miami", "Ville de plage en Floride", "Miami", "Città di mare in Florida"],
    ["Ciudad", "Pekín", "Beijing", "Pequim", "La capital de China", "The capital of China", "A capital da China", "Peking", "Die Hauptstadt Chinas", "Pékin", "La capitale de la Chine", "Pechino", "La capitale della Cina"],
    ["Ciudad", "Viena", "Vienna", "Viena", "La capital de Austria", "The capital of Austria", "A capital da Áustria", "Wien", "Die Hauptstadt Österreichs", "Vienne", "La capitale de l'Autriche", "Vienna", "La capitale dell'Austria"],
    ["Ciudad", "Praga", "Prague", "Praga", "La capital de la República Checa", "The capital of the Czech Republic", "A capital da República Tcheca", "Prag", "Die Hauptstadt Tschechiens", "Prague", "La capitale de la Tchéquie", "Praga", "La capitale della Repubblica Ceca"],
    ["Ciudad", "Ámsterdam", "Amsterdam", "Amsterdã", "Ciudad de canales y bicicletas", "A city of canals and bicycles", "Cidade de canais e bicicletas", "Amsterdam", "Eine Stadt der Kanäle und Fahrräder", "Amsterdam", "Une ville de canaux et de vélos", "Amsterdam", "Una città di canali e biciclette"],
    ["Ciudad", "Florencia", "Florence", "Florença", "Ciudad italiana del Renacimiento", "The Italian city of the Renaissance", "Cidade italiana do Renascimento", "Florenz", "Die italienische Stadt der Renaissance", "Florence", "La ville italienne de la Renaissance", "Firenze", "La città italiana del Rinascimento"],
    ["Ciudad", "Sevilla", "Seville", "Sevilha", "Ciudad española del flamenco", "The Spanish city of flamenco", "Cidade espanhola do flamenco", "Sevilla", "Die spanische Stadt des Flamenco", "Séville", "La ville espagnole du flamenco", "Siviglia", "La città spagnola del flamenco"],
    ["Color", "Rojo", "Red", "Vermelho", "El color de la frutilla y del fuego", "The color of strawberries and fire", "A cor do morango e do fogo", "Rot", "Die Farbe von Erdbeeren und Feuer", "Rouge", "La couleur des fraises et du feu", "Rosso", "Il colore delle fragole e del fuoco"],
    ["Color", "Azul", "Blue", "Azul", "El color del cielo y del mar", "The color of the sky and the sea", "A cor do céu e do mar", "Blau", "Die Farbe von Himmel und Meer", "Bleu", "La couleur du ciel et de la mer", "Blu", "Il colore del cielo e del mare"],
    ["Color", "Verde", "Green", "Verde", "El color de las hojas de los árboles", "The color of grass", "A cor da grama", "Grün", "Die Farbe des Grases", "Vert", "La couleur de l'herbe", "Verde", "Il colore dell'erba"],
    ["Color", "Negro", "Black", "Preto", "El color de la noche", "The color of the night", "A cor da noite", "Schwarz", "Die Farbe der Nacht", "Noir", "La couleur de la nuit", "Nero", "Il colore della notte"],
    ["Color", "Blanco", "White", "Branco", "El color de la nieve", "The color of snow", "A cor da neve", "Weiß", "Die Farbe des Schnees", "Blanc", "La couleur de la neige", "Bianco", "Il colore della neve"],
    ["Color", "Plateado", "Silver", "Prateado", "El color de la plata", "The color of silver", "A cor da prata", "Silber", "Die Farbe von Silber", "Argenté", "La couleur d'un métal précieux gris et brillant", "Argento", "Un metallo prezioso grigio e lucente"],
    ["Color", "Turquesa", "Turquoise", "Turquesa", "Entre azul y verde, como el mar del Caribe", "Between blue and green, like the Caribbean", "Entre azul e verde, como o mar do Caribe", "Türkis", "Zwischen Blau und Grün, wie die Karibik", "Turquoise", "Entre bleu et vert, comme les Caraïbes", "Turchese", "Tra il blu e il verde, come i Caraibi"],
    ["Color", "Lila", "Lilac", "Lilás", "Violeta clarito", "A light purple", "Roxo clarinho", "Flieder", "Ein helles Lila", "Lilas", "Un violet clair", "Lilla", "Un viola chiaro"],
    ["Color", "Beige", "Beige", "Bege", "Color arena, muy claro", "A very light sand color", "Cor de areia, bem clara", "Beige", "Ein sehr helles Sandfarben", "Beige", "Une couleur sable très claire", "Beige", "Un color sabbia molto chiaro"],
    ["Color", "Fucsia", "Fuchsia", "Fúcsia", "Rosa muy fuerte", "A very bright pink", "Rosa bem forte", "Fuchsia", "Ein sehr kräftiges Pink", "Fuchsia", "Un rose très vif", "Fucsia", "Un rosa molto acceso"],
    ["Color", "Morado", "Purple", "Roxo", "El color de la berenjena", "The color of an eggplant", "A cor da berinjela", "Purpur", "Die Farbe einer Aubergine", "Pourpre", "La couleur d'une aubergine", "Porpora", "Il colore di una melanzana"],
    ["Color", "Coral", "Coral", "Coral", "Entre rosa y naranja", "Between pink and orange", "Entre rosa e laranja", "Koralle", "Zwischen Rosa und Orange", "Corail", "Entre rose et orange", "Corallo", "Tra il rosa e l'arancione"],
    ["Color", "Ocre", "Ochre", "Ocre", "Amarillo tierra", "An earthy yellow", "Amarelo terroso", "Ocker", "Ein erdiges Gelb", "Ocre", "Un jaune terreux", "Ocra", "Un giallo terroso"],
    ["Profesión", "Médico", "Doctor", "Médico", "Te cura cuando estás enfermo", "Treats you when you're sick", "Cuida de você quando está doente", "Arzt", "Behandelt dich, wenn du krank bist", "Médecin", "Il te soigne quand tu es malade", "Medico", "Ti cura quando sei malato"],
    ["Profesión", "Enfermera", "Nurse", "Enfermeira", "Cuida a los pacientes en el hospital", "Takes care of patients in the hospital", "Cuida dos pacientes no hospital", "Pfleger", "Kümmert sich im Krankenhaus um Patienten", "Infirmière", "Elle s'occupe des patients à l'hôpital", "Infermiera", "Si prende cura dei pazienti in ospedale"],
    ["Profesión", "Abogado", "Lawyer", "Advogado", "Te defiende en un juicio", "Defends you in court", "Defende você num julgamento", "Anwalt", "Verteidigt dich vor Gericht", "Avocat", "Il te défend au tribunal", "Avvocato", "Ti difende in tribunale"],
    ["Profesión", "Carpintero", "Carpenter", "Carpinteiro", "Hace muebles de madera", "Makes wooden furniture", "Faz móveis de madeira", "Tischler", "Baut Möbel aus Holz", "Menuisier", "Il fabrique des meubles en bois", "Falegname", "Costruisce mobili di legno"],
    ["Profesión", "Panadero", "Baker", "Padeiro", "Hornea el pan de cada día", "Bakes the daily bread", "Assa o pão de cada dia", "Bäcker", "Backt das tägliche Brot", "Boulanger", "Il fait le pain de tous les jours", "Fornaio", "Fa il pane di ogni giorno"],
    ["Profesión", "Pintor", "Painter", "Pintor", "Trabaja con pinceles y colores", "Works with brushes and colors", "Trabalha com pincéis e cores", "Maler", "Arbeitet mit Pinseln und Farben", "Peintre", "Il travaille avec des pinceaux et des couleurs", "Pittore", "Lavora con pennelli e colori"],
    ["Profesión", "Veterinario", "Vet", "Veterinário", "El médico de los animales", "The doctor for animals", "O médico dos animais", "Tierarzt", "Behandelt kranke Haustiere", "Vétérinaire", "Le docteur des animaux", "Veterinario", "Il dottore degli animali"],
    ["Profesión", "Arquitecto", "Architect", "Arquiteto", "Diseña casas y edificios", "Designs houses and buildings", "Projeta casas e prédios", "Architekt", "Entwirft Häuser und Gebäude", "Architecte", "Il dessine des maisons et des immeubles", "Architetto", "Progetta case ed edifici"],
    ["Profesión", "Astronauta", "Astronaut", "Astronauta", "Viaja al espacio", "Travels to space", "Viaja para o espaço", "Astronaut", "Reist ins All", "Astronaute", "Il voyage dans l'espace", "Astronauta", "Viaggia nello spazio"],
    ["Profesión", "Granjero", "Farmer", "Fazendeiro", "Trabaja en el campo con animales", "Works on a farm with animals", "Trabalha no campo com animais", "Bauer", "Arbeitet auf einem Hof mit Tieren", "Fermier", "Il travaille dans une ferme avec des animaux", "Contadino", "Lavora in una fattoria con gli animali"],
    ["Profesión", "Peluquero", "Hairdresser", "Cabeleireiro", "Te corta el pelo", "Cuts your hair", "Corta o seu cabelo", "Friseur", "Schneidet dir die Haare", "Coiffeur", "Il te coupe les cheveux", "Parrucchiere", "Ti taglia i capelli"],
    ["Profesión", "Mecánico", "Mechanic", "Mecânico", "Arregla autos", "Fixes cars", "Conserta carros", "Mechaniker", "Repariert Autos", "Mécanicien", "Il répare les voitures", "Meccanico", "Ripara le auto"],
    ["Profesión", "Fotógrafo", "Photographer", "Fotógrafo", "Saca fotos", "Takes pictures", "Tira fotos", "Fotograf", "Macht Fotos", "Photographe", "Son métier, c'est de faire des clichés", "Fotografo", "Il suo mestiere è scattare immagini"],
    ["Profesión", "Periodista", "Journalist", "Jornalista", "Escribe las noticias", "Writes the news", "Escreve as notícias", "Reporter", "Schreibt die Nachrichten", "Journaliste", "Il écrit les nouvelles", "Giornalista", "Scrive le notizie"],
    ["Profesión", "Cantante", "Singer", "Cantor", "Vive de su voz", "Makes a living with their voice", "Vive da própria voz", "Sänger", "Lebt von seiner Stimme", "Chanteur", "Il vit de sa voix", "Cantante", "Vive della sua voce"],
    ["Profesión", "Actor", "Actor", "Ator", "Trabaja en películas y obras de teatro", "Works in movies and plays", "Trabalha em filmes e peças de teatro", "Schauspieler", "Spielt in Filmen und Theaterstücken", "Acteur", "Il joue dans des films et des pièces", "Attore", "Recita nei film e a teatro"],
    ["Profesión", "Electricista", "Electrician", "Eletricista", "Arregla los cables y los enchufes", "Fixes wires and outlets", "Conserta fios e tomadas", "Elektriker", "Repariert Kabel und Steckdosen", "Électricien", "Il répare les câbles et les prises", "Elettricista", "Ripara fili e prese"],
    ["Profesión", "Jardinero", "Gardener", "Jardineiro", "Cuida las plantas y el césped", "Takes care of plants and the lawn", "Cuida das plantas e da grama", "Gärtner", "Pflegt Pflanzen und Rasen", "Jardinier", "Il s'occupe des plantes et de la pelouse", "Giardiniere", "Si prende cura delle piante e del prato"],
    ["Profesión", "Carnicero", "Butcher", "Açougueiro", "Vende y corta la carne", "Sells and cuts meat", "Vende e corta a carne", "Metzger", "Verkauft und schneidet Fleisch", "Boucher", "Il vend et coupe la viande", "Macellaio", "Vende e taglia la carne"],
    ["Profesión", "Científico", "Scientist", "Cientista", "Hace experimentos en un laboratorio", "Does experiments in a lab", "Faz experimentos num laboratório", "Forscher", "Macht Experimente im Labor", "Chercheur", "Il fait des expériences dans un labo", "Scienziato", "Fa esperimenti in laboratorio"],
    ["Deporte", "Fútbol", "Soccer", "Futebol", "Once contra once y una pelota", "Eleven against eleven and one ball", "Onze contra onze e uma bola", "Fußball", "Elf gegen elf und ein Ball", "Football", "Onze contre onze et un ballon", "Calcio", "Undici contro undici e un pallone"],
    ["Deporte", "Golf", "Golf", "Golfe", "Hoyos, palos y una pelotita blanca", "Holes, clubs and a little white ball", "Buracos, tacos e uma bolinha branca", "Golf", "Löcher, Schläger und ein kleiner weißer Ball", "Golf", "Des trous, des clubs et une petite balle blanche", "Golf", "Buche, mazze e una pallina bianca"],
    ["Deporte", "Rugby", "Rugby", "Rúgbi", "Pelota ovalada y muchos tackles", "An oval ball and lots of tackles", "Bola oval e muitos tackles", "Rugby", "Ein ovaler Ball und viele Tacklings", "Rugby", "Un ballon ovale et plein de plaquages", "Rugby", "Una palla ovale e tanti placcaggi"],
    ["Deporte", "Hockey", "Hockey", "Hóquei", "Se juega con palo y una bola o un disco", "Played with a stick and a ball or puck", "Se joga com taco e bola ou disco", "Hockey", "Gespielt mit Schläger und Ball oder Puck", "Hockey", "Avec une crosse et une balle ou un palet", "Hockey", "Si gioca con un bastone e una palla o un disco"],
    ["Deporte", "Esquí", "Skiing", "Esqui", "Deslizarse por la nieve", "Sliding down the snow", "Deslizar pela neve", "Skifahren", "Den Schnee hinunterrutschen", "Ski", "On glisse sur la neige", "Sci", "Si scende sulla neve con due assi ai piedi"],
    ["Deporte", "Surf", "Surfing", "Surfe", "Se practica sobre las olas", "Done on the waves", "Se pratica sobre as ondas", "Surfen", "Das machst du auf den Wellen", "Surf", "Ça se pratique sur les vagues", "Surf", "Si fa sulle onde"],
    ["Deporte", "Karate", "Karate", "Caratê", "Arte marcial japonesa con cinturones", "A Japanese martial art with belts", "Arte marcial japonesa com faixas", "Karate", "Japanische Kampfkunst mit Gürteln", "Karaté", "Art martial japonais avec des ceintures", "Karate", "Arte marziale giapponese con le cinture"],
    ["Deporte", "Judo", "Judo", "Judô", "Arte marcial de agarres y caídas", "A martial art of grips and throws", "Arte marcial de agarrões e quedas", "Judo", "Kampfkunst mit Griffen und Würfen", "Judo", "Art martial de prises et de projections", "Judo", "Arte marziale di prese e proiezioni"],
    ["Deporte", "Remo", "Rowing", "Remo", "Se practica en un bote", "Done in a boat", "Se pratica num barco", "Rudern", "Das machst du im Boot", "Aviron", "Ça se pratique en bateau", "Canottaggio", "Si fa su una barca a remi"],
    ["Deporte", "Atletismo", "Athletics", "Atletismo", "Carreras, saltos y lanzamientos", "Running, jumping and throwing", "Corridas, saltos e arremessos", "Leichtathletik", "Laufen, Springen und Werfen", "Athlétisme", "Courir, sauter et lancer", "Atletica", "Correre, saltare e lanciare"],
    ["Deporte", "Esgrima", "Fencing", "Esgrima", "Duelo con espadas", "Dueling with swords", "Duelo com espadas", "Fechten", "Duell mit Degen", "Escrime", "Un duel à l'épée", "Scherma", "Un duello con la spada"],
    ["Deporte", "Ajedrez", "Chess", "Xadrez", "Reyes, reinas y caballos en un tablero", "Kings, queens and knights on a board", "Reis, rainhas e cavalos num tabuleiro", "Schach", "Könige, Damen und Springer auf einem Brett", "Échecs", "Rois, reines et cavaliers sur un plateau", "Scacchi", "Re, regine e alfieri su una tavola a quadretti"],
    ["Deporte", "Polo", "Polo", "Polo", "Se juega a caballo con tacos", "Played on horseback with mallets", "Se joga a cavalo com tacos", "Polo", "Wird zu Pferd mit Schlägern gespielt", "Polo", "Se joue à cheval avec des maillets", "Polo", "Si gioca a cavallo con le mazze"],
    ["Deporte", "Béisbol", "Baseball", "Beisebol", "Bate, guante y carreras", "A bat, a glove and runs", "Taco, luva e corridas", "Baseball", "Schläger, Handschuh und Läufe", "Baseball", "Une batte, un gant et des courses", "Baseball", "Una mazza, un guantone e le basi"],
    ["Deporte", "Patinaje", "Skating", "Patinação", "Deslizarse con patines", "Gliding on skates", "Deslizar de patins", "Eislaufen", "Gleiten auf Kufen", "Patinage", "On glisse sur des patins", "Pattinaggio", "Si scivola sui pattini"],
    ["Deporte", "Gimnasia", "Gymnastics", "Ginástica", "Saltos y piruetas en colchonetas", "Flips and spins on mats", "Saltos e piruetas em colchonetes", "Turnen", "Saltos und Drehungen auf Matten", "Gymnastique", "Saltos et pirouettes sur des tapis", "Ginnastica", "Salti mortali e piroette sui tappeti"],
    ["Deporte", "Escalada", "Climbing", "Escalada", "Subir paredes de roca", "Going up rock walls", "Subir paredes de pedra", "Klettern", "Felswände hinauf", "Escalade", "On grimpe des parois rocheuses", "Arrampicata", "Si salgono pareti di roccia"],
    ["Deporte", "Handball", "Handball", "Handebol", "Se juega con las manos y un arco", "Played with your hands and a goal", "Se joga com as mãos e um gol", "Handball", "Wird mit den Händen und einem Tor gespielt", "Handball", "Se joue avec les mains et un but", "Pallamano", "Si gioca con le mani e una porta"],
    ["Deporte", "Maratón", "Marathon", "Maratona", "Una carrera de 42 kilómetros", "A 42-kilometer race", "Uma corrida de 42 quilômetros", "Marathon", "Ein Lauf über 42 Kilometer", "Marathon", "Une course de 42 kilomètres", "Maratona", "Una corsa di 42 chilometri"],
    ["Instrumento musical", "Saxofón", "Saxophone", "Saxofone", "De metal, se sopla y suena en el jazz", "Brass, you blow it, it sounds in jazz", "De metal, se sopra e soa no jazz", "Saxofon", "Aus Messing, man bläst hinein, klingt im Jazz", "Saxophone", "En cuivre, on souffle dedans, il sonne dans le jazz", "Sassofono", "Di ottone, ci soffi dentro e suona nel jazz"],
    ["Instrumento musical", "Tambor", "Drum", "Tambor", "Se toca con las manos o con palillos", "Played with your hands or sticks", "Se toca com as mãos ou com baquetas", "Trommel", "Wird mit Händen oder Stöcken gespielt", "Tambour", "On en joue avec les mains ou des baguettes", "Tamburo", "Si suona con le mani o con le bacchette"],
    ["Instrumento musical", "Acordeón", "Accordion", "Acordeão", "Se estira y se aprieta, con teclas", "You stretch and squeeze it, and it has keys", "Se estica e se aperta, com teclas", "Akkordeon", "Man zieht und drückt es, und es hat Tasten", "Accordéon", "On l'étire et on le serre, et il a des touches", "Fisarmonica", "La allunghi e la stringi, e ha i tasti"],
    ["Instrumento musical", "Ukelele", "Ukulele", "Ukulele", "Guitarrita de cuatro cuerdas", "A small four-string guitar", "Violãozinho de quatro cordas", "Ukulele", "Eine kleine Gitarre mit vier Saiten", "Ukulélé", "Une petite guitare à quatre cordes", "Ukulele", "Una piccola chitarra a quattro corde"],
    ["Instrumento musical", "Clarinete", "Clarinet", "Clarinete", "De madera, negro, se sopla", "Wooden, black, you blow it", "De madeira, preto, se sopra", "Klarinette", "Aus Holz, schwarz, man bläst hinein", "Clarinette", "En bois, noire, on souffle dedans", "Clarinetto", "Di legno, nero, ci soffi dentro"],
    ["Instrumento musical", "Violonchelo", "Cello", "Violoncelo", "Como un violín grande que se toca sentado", "Like a big violin played sitting down", "Como um violino grande tocado sentado", "Cello", "Wie eine große Geige, im Sitzen gespielt", "Violoncelle", "Comme un gros violon, joué assis", "Violoncello", "Come un violino grande, si suona seduti"],
    ["Instrumento musical", "Bajo", "Bass", "Baixo", "Guitarra de sonido grave", "A guitar with a deep sound", "Guitarra de som grave", "Bass", "Eine Gitarre mit tiefem Klang", "Basse", "Une guitare au son grave", "Basso", "Una chitarra dal suono grave"],
    ["Instrumento musical", "Órgano", "Organ", "Órgão", "Está en las iglesias, con tubos enormes", "Found in churches, with huge pipes", "Fica nas igrejas, com tubos enormes", "Orgel", "Steht in Kirchen, mit riesigen Pfeifen", "Orgue", "Dans les églises, avec d'énormes tuyaux", "Organo", "Nelle chiese, con canne enormi"],
    ["Instrumento musical", "Banjo", "Banjo", "Banjo", "Cuerdas sobre un parche redondo", "Strings over a round drumhead", "Cordas sobre uma pele redonda", "Banjo", "Saiten über einem runden Fell", "Banjo", "Des cordes sur une peau ronde", "Banjo", "Corde sopra una pelle rotonda"],
    ["Instrumento musical", "Armónica", "Harmonica", "Gaita", "Chiquita, se sopla moviéndola por la boca", "Small, you blow it moving it along your lips", "Pequena, se sopra deslizando pela boca", "Mundharmonika", "Klein, man bläst und schiebt sie an den Lippen entlang", "Harmonica", "Petit, on souffle en le glissant sur les lèvres", "Armonica", "Piccola, ci soffi facendola scorrere sulle labbra"],
    ["Instrumento musical", "Xilófono", "Xylophone", "Xilofone", "Barritas de colores que se golpean", "Colored bars you hit", "Barrinhas coloridas que se batem", "Xylofon", "Bunte Stäbe, auf die man schlägt", "Xylophone", "Des lames colorées qu'on frappe", "Xilofono", "Barrette colorate da percuotere"],
    ["Instrumento musical", "Maracas", "Maracas", "Maracas", "Se sacuden y suenan", "You shake them and they rattle", "Se sacodem e fazem barulho", "Rassel", "Man schüttelt sie und sie rasselt", "Maracas", "On les secoue et elles crépitent", "Maracas", "Le scuoti e fanno rumore"],
    ["Instrumento musical", "Trombón", "Trombone", "Trombone", "De metal, con una vara que se estira", "Brass, with a slide you push and pull", "De metal, com uma vara que se estica", "Posaune", "Aus Messing, mit einem Zug zum Schieben", "Trombone", "En cuivre, avec une coulisse qu'on pousse et tire", "Trombone", "Di ottone, con una coulisse da spingere e tirare"],
    ["Instrumento musical", "Bandoneón", "Bandoneon", "Bandoneon", "El fuelle del tango", "The bellows of tango", "O fole do tango", "Bandoneon", "Der Balg des Tangos", "Bandonéon", "Le soufflet du tango", "Bandoneon", "Il mantice del tango"],
    ["Verdura", "Tomate", "Tomato", "Tomate", "Rojo, va en la ensalada y en la salsa", "Red, goes in salads and sauces", "Vermelho, vai na salada e no molho", "Tomate", "Rot, kommt in Salate und Soßen", "Tomate", "Rouge, dans les salades et les sauces", "Pomodoro", "Rosso, va nelle insalate e nei sughi"],
    ["Verdura", "Ajo", "Garlic", "Alho", "Tiene dientes y mucho olor", "Has cloves and a strong smell", "Tem dentes e cheiro forte", "Knoblauch", "Hat Zehen und riecht stark", "Ail", "Il a des gousses et sent fort", "Aglio", "Fatto a spicchi, ha un odore forte"],
    ["Verdura", "Espinaca", "Spinach", "Espinafre", "Hojas verdes que le daban fuerza a Popeye", "Green leaves that made Popeye strong", "Folhas verdes que davam força ao Popeye", "Spinat", "Grüne Blätter, die Popeye stark gemacht haben", "Épinard", "Les feuilles vertes qui rendaient Popeye fort", "Spinaci", "Le foglie verdi che rendevano forte Braccio di Ferro"],
    ["Verdura", "Calabaza", "Pumpkin", "Abóbora", "Naranja y grande, se usa en Halloween", "Orange and big, used at Halloween", "Laranja e grande, usada no Halloween", "Kürbis", "Orange und groß, beliebt zu Halloween", "Citrouille", "Orange et grosse, star d'Halloween", "Zucca", "Arancione e grande, regina di Halloween"],
    ["Verdura", "Berenjena", "Eggplant", "Berinjela", "Violeta oscura y brillante", "Dark purple and shiny", "Roxa escura e brilhante", "Aubergine", "Dunkellila und glänzend", "Aubergine", "Violet foncé et brillante", "Melanzana", "Viola scuro e lucida"],
    ["Verdura", "Apio", "Celery", "Aipo", "Tallos verdes y crujientes", "Crunchy green stalks", "Talos verdes e crocantes", "Sellerie", "Knackige grüne Stangen", "Céleri", "Des tiges vertes croquantes", "Sedano", "Gambi verdi e croccanti"],
    ["Verdura", "Rábano", "Radish", "Rabanete", "Chiquito, rojo y picante", "Small, red and peppery", "Pequeno, vermelho e picante", "Radieschen", "Klein, rot und scharf", "Radis", "Petit, rouge et piquant", "Ravanello", "Piccolo, rosso e piccante"],
    ["Verdura", "Espárrago", "Asparagus", "Aspargo", "Tallo verde y finito", "A thin green stalk", "Talo verde e fininho", "Spargel", "Eine dünne Stange", "Asperge", "Une fine tige verte", "Asparago", "Un gambo verde e sottile"],
    ["Verdura", "Acelga", "Chard", "Acelga", "Hojas grandes con tallo blanco", "Big leaves with a white stem", "Folhas grandes com talo branco", "Mangold", "Große Blätter mit weißem Stiel", "Blette", "De grandes feuilles avec une côte blanche", "Bietola", "Foglie grandi con una costa bianca"],
    ["Parte del cuerpo", "Nariz", "Nose", "Nariz", "Con ella olés", "You smell with it", "Com ele você sente cheiros", "Nase", "Damit riechst du", "Nez", "Tu sens les odeurs avec lui", "Naso", "Con lui senti gli odori"],
    ["Parte del cuerpo", "Oreja", "Ear", "Orelha", "Con ella escuchás", "You hear with it", "Com ela você escuta", "Ohr", "Damit hörst du", "Oreille", "Tu entends avec elle", "Orecchio", "Ci senti i suoni"],
    ["Parte del cuerpo", "Boca", "Mouth", "Boca", "Por acá entra la comida", "Food goes in here", "Por aqui entra a comida", "Mund", "Hier kommt das Essen hinein", "Bouche", "La nourriture entre par là", "Bocca", "Il cibo entra da qui"],
    ["Parte del cuerpo", "Mano", "Hand", "Mão", "Tiene cinco dedos", "Has five fingers", "Tem cinco dedos", "Hand", "Hat fünf Finger", "Main", "Elle a cinq doigts", "Mano", "Ha cinque dita"],
    ["Parte del cuerpo", "Dedo", "Finger", "Dedo", "Tenés diez en las manos", "You have ten on your hands", "Você tem dez nas mãos", "Finger", "Du hast zehn an den Händen", "Doigt", "Tu en as dix aux mains", "Dito", "Ne hai dieci nelle mani"],
    ["Parte del cuerpo", "Cabeza", "Head", "Cabeça", "Arriba de todo, donde está el pelo", "At the very top, where your hair is", "Lá no alto, onde fica o cabelo", "Kopf", "Ganz oben, wo deine Haare sind", "Tête", "Tout en haut, là où sont tes cheveux", "Testa", "In cima, dove hai i capelli"],
    ["Parte del cuerpo", "Espalda", "Back", "Costas", "Detrás, desde el cuello hasta la cintura", "Behind you, from your neck to your waist", "Atrás, do pescoço até a cintura", "Rücken", "Hinter dir, vom Nacken bis zur Taille", "Dos", "Derrière toi, de la nuque à la taille", "Schiena", "Dietro di te, dal collo alla vita"],
    ["Parte del cuerpo", "Cuello", "Neck", "Pescoço", "Une la cabeza con el cuerpo", "Joins your head to your body", "Liga a cabeça ao corpo", "Hals", "Verbindet den Kopf mit dem Körper", "Cou", "Il relie la tête au corps", "Collo", "Unisce la testa al corpo"],
    ["Parte del cuerpo", "Pierna", "Leg", "Perna", "Con ellas caminás", "You walk with them", "Com elas você anda", "Bein", "Damit gehst du", "Jambe", "Tu marches avec elles", "Gamba", "Ci cammini"],
    ["Parte del cuerpo", "Lengua", "Tongue", "Língua", "Con ella sentís los sabores", "You taste flavors with it", "Com ela você sente os sabores", "Zunge", "Damit schmeckst du", "Langue", "Tu goûtes les saveurs avec elle", "Lingua", "Ci senti i sapori"],
    ["Parte del cuerpo", "Diente", "Tooth", "Dente", "Se cepilla después de comer", "You brush it after eating", "Se escova depois de comer", "Zahn", "Den putzt du nach dem Essen", "Dent", "Tu la brosses après avoir mangé", "Dente", "Lo lavi dopo mangiato"],
    ["Parte del cuerpo", "Muñeca", "Wrist", "Pulso", "Une la mano con el brazo", "Joins your hand to your arm", "Liga a mão ao braço", "Handgelenk", "Verbindet die Hand mit dem Arm", "Poignet", "Il relie la main au bras", "Polso", "Unisce la mano al braccio"],
    ["Parte del cuerpo", "Pestaña", "Eyelash", "Cílio", "Pelito en el borde del ojo", "A little hair on the edge of your eye", "Pelinho na borda do olho", "Wimper", "Ein kleines Haar am Rand des Auges", "Cil", "Un petit poil au bord de l'œil", "Ciglio", "Un peletto sul bordo dell'occhio"],
    ["Parte del cuerpo", "Corazón", "Heart", "Coração", "Late todo el día", "Beats all day long", "Bate o dia todo", "Herz", "Schlägt den ganzen Tag", "Cœur", "Il bat toute la journée", "Cuore", "Batte tutto il giorno"],
    ["Parte del cuerpo", "Talón", "Heel", "Calcanhar", "La parte de atrás del pie", "The back of your foot", "A parte de trás do pé", "Ferse", "Der hintere Teil des Fußes", "Talon", "L'arrière du pied", "Tallone", "La parte dietro del piede"],
    ["Parte del cuerpo", "Mejilla", "Cheek", "Bochecha", "Se pone colorada cuando te da vergüenza", "Turns red when you're embarrassed", "Fica vermelha quando você tem vergonha", "Wange", "Wird rot, wenn dir etwas peinlich ist", "Joue", "Elle rougit quand tu as honte", "Guancia", "Diventa rossa quando ti vergogni"],
    ["Parte del cuerpo", "Uña", "Nail", "Unha", "Crece en la punta de los dedos", "Grows at the tip of your fingers", "Cresce na ponta dos dedos", "Nagel", "Wächst an den Fingerspitzen", "Ongle", "Il pousse au bout des doigts", "Unghia", "Cresce sulla punta delle dita"],
    ["Parte del cuerpo", "Frente", "Forehead", "Testa", "Arriba de las cejas", "Above your eyebrows", "Acima das sobrancelhas", "Stirn", "Über deinen Augenbrauen", "Front", "Au-dessus de tes sourcils", "Fronte", "Sopra le sopracciglia"],
    ["Bebida", "Agua", "Water", "Água", "No tiene color ni sabor", "Has no color or taste", "Não tem cor nem sabor", "Wasser", "Hat keine Farbe und keinen Geschmack", "Eau", "Elle n'a ni couleur ni goût", "Acqua", "Non ha colore né sapore"],
    ["Bebida", "Café", "Coffee", "Café", "Te despierta a la mañana", "Wakes you up in the morning", "Acorda você de manhã", "Kaffee", "Macht dich morgens wach", "Café", "Il te réveille le matin", "Caffè", "Ti sveglia la mattina"],
    ["Bebida", "Cacao", "Cocoa", "Cacau", "Chocolate caliente para el invierno", "Hot chocolate for winter", "Chocolate quente para o inverno", "Kakao", "Heiße Schokolade für den Winter", "Cacao", "Le chocolat chaud de l'hiver", "Cacao", "La cioccolata calda d'inverno"],
    ["Bebida", "Sidra", "Cider", "Sidra", "Se hace con manzanas y burbujea", "Made from apples and bubbly", "Feita de maçã e borbulhante", "Cidre", "Aus Äpfeln und prickelnd", "Cidre", "Fait avec des pommes, il pétille", "Sidro", "Si fa con le mele e ha le bollicine"],
    ["Comida", "Pasta", "Pasta", "Massa", "Italiana, se hierve y va con salsa", "Italian, boiled and served with sauce", "Italiana, se cozinha e vai com molho", "Nudeln", "Italienisch, gekocht und mit Soße serviert", "Pâtes", "Italiennes, bouillies et servies avec une sauce", "Pasta", "Italiana, si fa bollire e si condisce con il sugo"],
    ["Comida", "Sopa", "Soup", "Sopa", "Se toma con cuchara, bien caliente", "Eaten hot with a spoon", "Se toma de colher, bem quente", "Suppe", "Wird heiß mit dem Löffel gegessen", "Soupe", "Se mange chaude à la cuillère", "Zuppa", "Si mangia calda con il cucchiaio"],
    ["Comida", "Arroz", "Rice", "Arroz", "Granitos blancos, base de muchos platos", "Little white grains in lots of dishes", "Grãozinhos brancos, base de muitos pratos", "Reis", "Kleine weiße Körner in vielen Gerichten", "Riz", "De petits grains blancs dans plein de plats", "Riso", "Chicchi bianchi in tantissimi piatti"],
    ["Comida", "Huevo", "Egg", "Ovo", "Lo pone la gallina", "The hen lays it", "A galinha bota", "Ei", "Das Huhn legt es", "Œuf", "La poule le pond", "Uovo", "Lo fa la gallina"],
    ["Comida", "Queso", "Cheese", "Queijo", "Se hace con leche y a los ratones les encanta", "Made from milk and mice love it", "É feito de leite e os ratos adoram", "Käse", "Aus Milch, und Mäuse lieben ihn", "Fromage", "Fait avec du lait, les souris l'adorent", "Formaggio", "Si fa col latte e i topi lo adorano"],
    ["Comida", "Pan", "Bread", "Pão", "Sale del horno de la panadería", "Comes out of the bakery's oven", "Sai do forno da padaria", "Brot", "Kommt aus dem Ofen der Bäckerei", "Pain", "Il sort du four de la boulangerie", "Pane", "Esce dal forno del fornaio"],
    ["Comida", "Taco", "Taco", "Taco", "Tortilla mexicana doblada con relleno", "A folded Mexican tortilla with filling", "Tortilha mexicana dobrada e recheada", "Taco", "Gefaltete mexikanische Tortilla mit Füllung", "Taco", "Tortilla mexicaine pliée et garnie", "Taco", "Tortilla messicana piegata e ripiena"],
    ["Comida", "Sushi", "Sushi", "Sushi", "Arroz y pescado crudo, de Japón", "Rice and raw fish, from Japan", "Arroz e peixe cru, do Japão", "Sushi", "Reis und roher Fisch aus Japan", "Sushi", "Du riz et du poisson cru, du Japon", "Sushi", "Riso e pesce crudo, dal Giappone"],
    ["Comida", "Empanada", "Empanada", "Empanada", "Masa rellena y cerrada, al horno o frita", "Stuffed pastry folded with a crimped edge", "Massa recheada, fechada com dobrinhas", "Empanada", "Gefüllte Teigtasche mit gerolltem Rand", "Empanada", "Chausson farci au bord tressé", "Empanada", "Fagottino ripieno con il bordo intrecciato"],
    ["Comida", "Lasaña", "Lasagna", "Lasanha", "Capas de pasta, carne y salsa", "Layers of pasta, meat and sauce", "Camadas de massa, carne e molho", "Lasagne", "Schichten aus Nudeln, Fleisch und Soße", "Lasagnes", "Des couches de pâtes, de viande et de sauce", "Lasagne", "Strati di pasta, carne e sugo"],
    ["Comida", "Paella", "Paella", "Paella", "Arroz con mariscos de Valencia", "Rice with seafood from Valencia", "Arroz com frutos do mar de Valência", "Paella", "Reis mit Meeresfrüchten aus Valencia", "Paella", "Du riz aux fruits de mer de Valence", "Paella", "Riso con frutti di mare di Valencia"],
    ["Comida", "Pollo", "Chicken", "Frango", "Se come al horno o frito", "Roasted in the oven with potatoes", "Se come assado no forno", "Hähnchen", "Im Ofen mit Kartoffeln gebraten", "Poulet", "Rôti au four avec des pommes de terre", "Pollo", "Arrosto al forno con le patate"],
    ["Comida", "Pescado", "Fish", "Peixe", "Viene del mar o del río", "Comes from the sea or the river", "Vem do mar ou do rio", "Fisch", "Kommt aus dem Meer oder dem Fluss", "Poisson", "Il vient de la mer ou de la rivière", "Pesce", "Viene dal mare o dal fiume"],
    ["Comida", "Salchicha", "Sausage", "Salsicha", "Va adentro del pan del hot dog", "Goes inside a hot dog", "Vai dentro do cachorro-quente", "Wurst", "Kommt in einen Hotdog", "Saucisse", "Elle va dans un hot-dog", "Salsiccia", "Va dentro un hot dog"],
    ["Comida", "Croqueta", "Croquette", "Croquete", "Bocadito empanado y frito", "A breaded, fried bite", "Bolinho empanado e frito", "Krokette", "Panierter, frittierter Happen", "Croquette", "Une bouchée panée et frite", "Crocchetta", "Un boccone impanato e fritto"],
    ["Comida", "Nachos", "Nachos", "Nachos", "Triangulitos de maíz con queso", "Corn chips with cheese", "Triângulos de milho com queijo", "Nachos", "Maischips mit Käse", "Nachos", "Des chips de maïs avec du fromage", "Nachos", "Chips di mais con formaggio"],
    ["Comida", "Hummus", "Hummus", "Homus", "Pasta de garbanzos", "A chickpea dip", "Pasta de grão-de-bico", "Hummus", "Ein Dip aus Kichererbsen", "Houmous", "Une purée de pois chiches", "Hummus", "Una crema di ceci"],
    ["Postre", "Gelatina", "Jelly", "Gelatina", "Tiembla y es de colores", "Wobbly and colorful", "Treme e é colorida", "Gelee", "Wackelig und bunt", "Gelée", "Tremblotante et colorée", "Gelatina", "Tremolante e colorata"],
    ["Postre", "Brownie", "Brownie", "Brownie", "Cuadradito de chocolate húmedo", "A moist chocolate square", "Quadradinho de chocolate úmido", "Brownie", "Ein saftiges Schokoladenquadrat", "Brownie", "Un carré de chocolat moelleux", "Brownie", "Un quadrotto di cioccolato morbido"],
    ["Postre", "Alfajor", "Alfajor", "Alfajor", "Dos tapitas con dulce de leche", "Two cookies with dulce de leche", "Duas bolachas com doce de leite", "Alfajor", "Zwei Kekse mit Dulce de Leche", "Alfajor", "Deux biscuits avec du dulce de leche", "Alfajor", "Due biscotti con dulce de leche"],
    ["Postre", "Churro", "Churro", "Churro", "Masa frita con azúcar", "Fried dough with sugar", "Massa frita com açúcar", "Churro", "Frittierter Teig mit Zucker", "Churro", "Pâte frite avec du sucre", "Churro", "Pasta fritta con lo zucchero"],
    ["Postre", "Budín", "Pudding", "Bolo", "Esponjoso, se hace en molde alargado", "Spongy, baked in a long pan", "Fofinho, feito em forma comprida", "Kuchen", "Locker, in einer langen Form gebacken", "Cake", "Moelleux, cuit dans un moule allongé", "Plumcake", "Soffice, cotto in uno stampo lungo"],
    ["Postre", "Tiramisú", "Tiramisu", "Tiramisu", "Postre italiano con café", "An Italian dessert with coffee", "Sobremesa italiana com café", "Tiramisu", "Ein italienisches Dessert mit Kaffee", "Tiramisu", "Un dessert italien au café", "Tiramisù", "Un dolce italiano al caffè"],
    ["Postre", "Mousse", "Mousse", "Mousse", "Espumoso, suele ser de chocolate", "Airy, often chocolate", "Aerado, costuma ser de chocolate", "Mousse", "Luftig, oft aus Schokolade", "Mousse", "Aérienne, souvent au chocolat", "Mousse", "Spumosa, spesso al cioccolato"],
    ["Postre", "Merengue", "Meringue", "Merengue", "Clara de huevo batida con azúcar", "Egg whites whipped with sugar", "Clara batida com açúcar", "Baiser", "Eiweiß, mit Zucker aufgeschlagen", "Meringue", "Blancs d'œufs battus avec du sucre", "Meringa", "Albumi montati con lo zucchero"],
    ["Postre", "Waffle", "Waffle", "Waffle", "Masa con cuadraditos, con miel o frutas", "Batter with little squares, with honey or fruit", "Massa quadriculada, com mel ou frutas", "Waffel", "Teig mit kleinen Quadraten, mit Honig oder Obst", "Gaufre", "Pâte à petits carreaux, avec du miel ou des fruits", "Waffle", "Pastella a quadretti, con miele o frutta"],
    ["Objeto", "Llave", "Key", "Chave", "Abre la puerta", "Opens the door", "Abre a porta", "Schlüssel", "Öffnet die Tür", "Clé", "Elle ouvre la porte", "Chiave", "Apre la porta"],
    ["Objeto", "Lápiz", "Pencil", "Lápis", "Escribe y se borra con goma", "Writes and can be erased", "Escreve e se apaga com borracha", "Bleistift", "Schreibt und lässt sich radieren", "Crayon", "Il écrit et peut s'effacer", "Matita", "Scrive e si può cancellare"],
    ["Objeto", "Espejo", "Mirror", "Espelho", "Te muestra tu reflejo", "Shows your reflection", "Mostra o seu reflexo", "Spiegel", "Zeigt dein Spiegelbild", "Miroir", "Il montre ton reflet", "Specchio", "Ti mostra il tuo riflesso"],
    ["Objeto", "Vela", "Candle", "Vela", "Se prende para el cumpleaños", "You light it on a birthday", "Se acende no aniversário", "Kerze", "Wird am Geburtstag angezündet", "Bougie", "On l'allume pour un anniversaire", "Candela", "La accendi a un compleanno"],
    ["Objeto", "Cuchara", "Spoon", "Colher", "Para tomar la sopa", "For eating soup", "Para tomar a sopa", "Löffel", "Zum Suppe essen", "Cuillère", "Pour manger la soupe", "Cucchiaio", "Per mangiare la minestra"],
    ["Objeto", "Tenedor", "Fork", "Garfo", "Tiene dientes para pinchar la comida", "Has prongs to stab your food", "Tem dentes para espetar a comida", "Gabel", "Hat Zinken, um das Essen aufzuspießen", "Fourchette", "Elle a des dents pour piquer la nourriture", "Forchetta", "Ha i rebbi per infilzare il cibo"],
    ["Objeto", "Cuchillo", "Knife", "Faca", "Sirve para cortar", "Used for cutting", "Serve para cortar", "Messer", "Damit wird geschnitten", "Couteau", "Il sert à couper", "Coltello", "Serve a tagliare"],
    ["Objeto", "Plato", "Plate", "Prato", "Ahí se sirve la comida", "Food is served on it", "Nele se serve a comida", "Teller", "Darauf wird das Essen serviert", "Assiette", "On y sert la nourriture", "Piatto", "Ci si serve il cibo"],
    ["Objeto", "Botella", "Bottle", "Garrafa", "Guarda bebidas y tiene tapa", "Holds drinks and has a cap", "Guarda bebidas e tem tampa", "Flasche", "Enthält Getränke und hat einen Deckel", "Bouteille", "Elle contient des boissons et a un bouchon", "Bottiglia", "Contiene bevande e ha un tappo"],
    ["Objeto", "Libro", "Book", "Livro", "Tiene páginas para leer", "Has pages to read", "Tem páginas para ler", "Buch", "Hat Seiten zum Lesen", "Livre", "Il a des pages à lire", "Libro", "Ha pagine da leggere"],
    ["Objeto", "Pelota", "Ball", "Bola", "Redonda, rebota", "Round and it bounces", "Redonda, quica", "Ball", "Rund und springt", "Ballon", "Rond, il rebondit", "Palla", "Rotonda, rimbalza"],
    ["Objeto", "Sombrero", "Hat", "Chapéu", "Se pone en la cabeza para el sol", "You wear it on your head in the sun", "Se põe na cabeça por causa do sol", "Hut", "Den trägst du in der Sonne auf dem Kopf", "Chapeau", "Tu le portes sur la tête au soleil", "Cappello", "Lo metti in testa sotto il sole"],
    ["Objeto", "Lámpara", "Lamp", "Luminária", "Da luz al lado de la cama", "Gives light on the nightstand", "Dá luz no criado-mudo", "Lampe", "Gibt Licht auf dem Nachttisch", "Lampe", "Elle éclaire la table de nuit", "Lampada", "Fa luce sul comodino"],
    ["Objeto", "Peine", "Comb", "Pente", "Para desenredar el pelo", "For untangling your hair", "Para desembaraçar o cabelo", "Kamm", "Zum Entwirren der Haare", "Peigne", "Pour démêler tes cheveux", "Pettine", "Per districare i capelli"],
    ["Objeto", "Toalla", "Towel", "Toalha", "Te secás con ella al salir de la ducha", "You dry off with it after a shower", "Você se seca com ela depois do banho", "Handtuch", "Damit trocknest du dich nach dem Duschen ab", "Serviette", "Tu t'essuies avec après la douche", "Asciugamano", "Ti asciughi con lui dopo la doccia"],
    ["Objeto", "Tetera", "Teapot", "Bule", "Para servir el té", "For pouring tea", "Para servir o chá", "Kanne", "Zum Einschenken von Tee", "Théière", "Pour servir le thé", "Teiera", "Per versare il tè"],
    ["Objeto", "Globo", "Balloon", "Balão", "Se infla en los cumpleaños", "Blown up at birthday parties", "Se enche nos aniversários", "Ballon", "Wird zu Geburtstagen aufgeblasen", "Baudruche", "On la gonfle aux anniversaires", "Palloncino", "Si gonfia alle feste di compleanno"],
    ["Objeto", "Regla", "Ruler", "Régua", "Sirve para medir y trazar líneas rectas", "Used to measure and draw straight lines", "Serve para medir e traçar linhas retas", "Lineal", "Zum Messen und für gerade Linien", "Règle", "Pour mesurer et tracer des lignes droites", "Righello", "Per misurare e tracciare linee dritte"],
    ["Objeto", "Moneda", "Coin", "Moeda", "Dinero redondo de metal", "Round metal money", "Dinheiro redondo de metal", "Münze", "Rundes Geld aus Metall", "Pièce", "De l'argent rond en métal", "Moneta", "Soldi rotondi di metallo"],
    ["Objeto", "Anillo", "Ring", "Anel", "Se lleva en el dedo", "Worn on your finger", "Se usa no dedo", "Ring", "Wird am Finger getragen", "Bague", "Elle se porte au doigt", "Anello", "Si porta al dito"],
    ["Objeto", "Collar", "Necklace", "Colar", "Se lleva en el cuello", "Worn around your neck", "Se usa no pescoço", "Kette", "Wird um den Hals getragen", "Collier", "Il se porte autour du cou", "Collana", "Si porta al collo"],
    ["Objeto", "Sobre", "Envelope", "Envelope", "Ahí va la carta", "The letter goes inside it", "Nele vai a carta", "Umschlag", "Darin steckt der Brief", "Enveloppe", "La lettre va dedans", "Busta", "Dentro ci va la lettera"],
    ["Objeto", "Cámara", "Camera", "Câmera", "Saca fotos", "Takes pictures", "Tira fotos", "Kamera", "Macht Fotos", "Appareil photo", "Il sert à prendre des clichés", "Macchina fotografica", "Serve a scattare immagini"],
    ["Objeto", "Teléfono", "Phone", "Telefone", "Sirve para llamar", "Used to make calls", "Serve para ligar", "Telefon", "Damit telefoniert man", "Téléphone", "Il sert à appeler", "Telefono", "Serve a chiamare"],
    ["Objeto", "Vaso", "Glass", "Copo", "Para tomar agua", "For drinking water", "Para beber água", "Glas", "Zum Wasser trinken", "Verre", "Pour boire de l'eau", "Bicchiere", "Per bere l'acqua"],
    ["Objeto", "Taza", "Cup", "Xícara", "Para el café con leche", "For coffee with milk", "Para o café com leite", "Tasse", "Für Milchkaffee", "Tasse", "Pour le café au lait", "Tazza", "Per il caffellatte"],
    ["Objeto", "Jabón", "Soap", "Sabão", "Hace espuma y te lava las manos", "Makes foam and cleans your hands", "Faz espuma e lava as mãos", "Seife", "Schäumt und macht die Hände sauber", "Savon", "Il mousse et lave les mains", "Sapone", "Fa schiuma e lava le mani"],
    ["Objeto", "Cepillo", "Brush", "Escova", "Para los dientes o para el pelo", "For your teeth or your hair", "Para os dentes ou para o cabelo", "Bürste", "Für die Zähne oder die Haare", "Brosse", "Pour les dents ou les cheveux", "Spazzola", "Per i denti o per i capelli"],
    ["Objeto", "Brújula", "Compass", "Bússola", "Siempre apunta al norte", "Always points north", "Sempre aponta para o norte", "Kompass", "Zeigt immer nach Norden", "Boussole", "Elle indique toujours le nord", "Bussola", "Indica sempre il nord"],
    ["Mueble", "Mesa", "Table", "Mesa", "Ahí se come o se trabaja", "Where you eat or work", "Onde se come ou se trabalha", "Tisch", "Hier isst oder arbeitest du", "Table", "Là où tu manges ou travailles", "Tavolo", "Dove mangi o lavori"],
    ["Mueble", "Silla", "Chair", "Cadeira", "Tiene cuatro patas y te sentás", "Has four legs and you sit on it", "Tem quatro pés e você senta", "Stuhl", "Hat vier Beine und du sitzt darauf", "Chaise", "Elle a quatre pieds et tu t'assois dessus", "Sedia", "Ha quattro gambe e ti ci siedi"],
    ["Mueble", "Cama", "Bed", "Cama", "Ahí dormís", "Where you sleep", "Onde você dorme", "Bett", "Hier schläfst du", "Lit", "Là où tu dors", "Letto", "Dove dormi"],
    ["Mueble", "Armario", "Wardrobe", "Armário", "Ahí se guarda la ropa", "Where you keep your clothes", "Onde se guarda a roupa", "Schrank", "Hier bewahrst du deine Kleidung auf", "Armoire", "Là où tu ranges tes vêtements", "Armadio", "Dove tieni i vestiti"],
    ["Mueble", "Estante", "Shelf", "Estante", "Para poner los libros", "For putting books on", "Para pôr os livros", "Regal", "Darauf stellt man Bücher", "Étagère", "Pour poser des livres", "Mensola", "Per appoggiare i libri"],
    ["Mueble", "Escritorio", "Desk", "Escrivaninha", "Mesa para estudiar o trabajar", "A table for studying or working", "Mesa para estudar ou trabalhar", "Pult", "Ein Tisch zum Lernen oder Arbeiten", "Bureau", "Une table pour étudier ou travailler", "Scrivania", "Un tavolo per studiare o lavorare"],
    ["Mueble", "Cómoda", "Dresser", "Cômoda", "Mueble con cajones", "Furniture with drawers", "Móvel com gavetas", "Kommode", "Ein Möbelstück mit Schubladen", "Commode", "Un meuble à tiroirs", "Cassettiera", "Un mobile con i cassetti"],
    ["Mueble", "Banco", "Bench", "Banco", "Asiento largo de la plaza", "A long seat in the park", "Assento comprido da praça", "Bank", "Ein langer Sitz im Park", "Banc", "Un long siège dans le parc", "Panchina", "Un sedile lungo al parco"],
    ["Mueble", "Cuna", "Crib", "Berço", "Cama del bebé", "A baby's bed", "Cama do bebê", "Wiege", "Das Bett eines Babys", "Berceau", "Le lit d'un bébé", "Culla", "Il letto di un neonato"],
    ["Mueble", "Hamaca", "Hammock", "Rede", "Se cuelga entre dos árboles", "Hangs between two trees", "Se pendura entre duas árvores", "Hängematte", "Hängt zwischen zwei Bäumen", "Hamac", "Il est suspendu entre deux arbres", "Amaca", "Si appende tra due alberi"],
    ["Mueble", "Taburete", "Stool", "Banqueta", "Asiento alto sin respaldo", "A tall seat without a back", "Assento alto sem encosto", "Hocker", "Ein hoher Sitz ohne Lehne", "Tabouret", "Un siège haut sans dossier", "Sgabello", "Un sedile alto senza schienale"],
    ["Herramienta", "Pinza", "Pliers", "Alicate", "Agarra y corta alambres", "Grips and cuts wires", "Segura e corta arames", "Zange", "Packt und schneidet Drähte", "Pince", "Elle attrape et coupe les fils", "Pinza", "Afferra e taglia i fili"],
    ["Herramienta", "Taladro", "Drill", "Furadeira", "Hace agujeros en la pared", "Makes holes in the wall", "Faz furos na parede", "Bohrer", "Macht Löcher in die Wand", "Perceuse", "Elle fait des trous dans le mur", "Trapano", "Fa i buchi nel muro"],
    ["Herramienta", "Rastrillo", "Rake", "Ancinho", "Junta las hojas del jardín", "Gathers leaves in the yard", "Junta as folhas do jardim", "Rechen", "Sammelt im Garten das Laub", "Râteau", "Il ramasse les feuilles du jardin", "Rastrello", "Raccoglie le foglie in giardino"],
    ["Herramienta", "Hacha", "Axe", "Machado", "Para cortar leña", "For chopping wood", "Para cortar lenha", "Axt", "Zum Holzhacken", "Hache", "Pour fendre le bois", "Ascia", "Per spaccare la legna"],
    ["Herramienta", "Lija", "Sandpaper", "Lixa", "Papel áspero para alisar la madera", "Rough paper for smoothing wood", "Papel áspero para alisar a madeira", "Schleifpapier", "Raues Papier, um Holz zu glätten", "Papier de verre", "Papier rugueux pour poncer le bois", "Carta vetrata", "Carta ruvida per levigare il legno"],
    ["Herramienta", "Tornillo", "Screw", "Parafuso", "Se enrosca con destornillador", "You turn it in with a screwdriver", "Se aperta com chave de fenda", "Schraube", "Wird mit dem Schraubenzieher eingedreht", "Vis", "Elle se serre en tournant pour fixer deux pièces", "Vite", "Si stringe girando, per fissare due pezzi"],
    ["Herramienta", "Nivel", "Level", "Nível", "Tiene una burbujita para ver si está derecho", "Has a little bubble to check it's straight", "Tem uma bolhinha para ver se está reto", "Wasserwaage", "Hat ein Bläschen, um zu prüfen, ob es gerade ist", "Niveau", "Il a une petite bulle pour vérifier que c'est droit", "Livella", "Ha una bollicina per vedere se è dritto"],
    ["Herramienta", "Cincel", "Chisel", "Cinzel", "Para tallar piedra o madera", "For carving stone or wood", "Para esculpir pedra ou madeira", "Meißel", "Zum Bearbeiten von Stein oder Holz", "Burin", "Pour tailler la pierre ou le bois", "Scalpello", "Per scolpire la pietra o il legno"],
    ["Medio de transporte", "Tren", "Train", "Trem", "Va por las vías", "Runs on tracks", "Anda nos trilhos", "Zug", "Fährt auf Schienen", "Train", "Il roule sur des rails", "Treno", "Corre sui binari"],
    ["Medio de transporte", "Barco", "Ship", "Navio", "Navega por el mar", "Sails on the sea", "Navega pelo mar", "Schiff", "Fährt über das Meer", "Bateau", "Il navigue sur la mer", "Nave", "Naviga sul mare"],
    ["Medio de transporte", "Moto", "Motorcycle", "Moto", "Dos ruedas y motor", "Two wheels and an engine", "Duas rodas e motor", "Motorrad", "Zwei Räder und ein Motor", "Moto", "Deux roues et un moteur", "Moto", "Due ruote, il casco e tanta velocità"],
    ["Medio de transporte", "Helicóptero", "Helicopter", "Helicóptero", "Vuela con hélices arriba", "Flies with blades on top", "Voa com hélices em cima", "Helikopter", "Fliegt mit Rotorblättern oben", "Hélicoptère", "Il vole avec des pales en haut", "Elicottero", "Vola con le pale in alto"],
    ["Medio de transporte", "Taxi", "Taxi", "Táxi", "Auto que te lleva y le pagás", "A car that takes you and you pay", "Carro que leva você e você paga", "Taxi", "Ein Auto, das dich fährt, und du bezahlst", "Taxi", "Une voiture qui te conduit et que tu paies", "Taxi", "Un'auto che ti porta e che paghi"],
    ["Medio de transporte", "Camión", "Truck", "Caminhão", "Grande, lleva cargas pesadas", "Big, carries heavy loads", "Grande, leva cargas pesadas", "Lastwagen", "Groß, transportiert schwere Lasten", "Camion", "Gros, il transporte de lourdes charges", "Camion", "Grande, trasporta carichi pesanti"],
    ["Medio de transporte", "Velero", "Sailboat", "Veleiro", "Barco que anda con el viento", "A boat moved by the wind", "Barco que anda com o vento", "Segelboot", "Ein Boot, das vom Wind angetrieben wird", "Voilier", "Un bateau poussé par le vent", "Veliero", "Una barca spinta dal vento"],
    ["Medio de transporte", "Submarino", "Submarine", "Submarino", "Viaja debajo del agua", "Travels underwater", "Viaja debaixo d'água", "U-Boot", "Fährt unter Wasser", "Sous-marin", "Il voyage sous l'eau", "Sottomarino", "Viaggia sott'acqua"],
    ["Medio de transporte", "Tranvía", "Tram", "Bonde", "Va por vías en medio de la calle", "Runs on tracks along the street", "Anda em trilhos no meio da rua", "Straßenbahn", "Fährt auf Schienen durch die Straßen", "Tramway", "Il roule sur des rails dans la rue", "Tram", "Corre sui binari in mezzo alla strada"],
    ["Medio de transporte", "Cohete", "Rocket", "Foguete", "Despega hacia el espacio", "Blasts off into space", "Decola rumo ao espaço", "Rakete", "Startet ins All", "Fusée", "Elle décolle vers l'espace", "Razzo", "Decolla verso lo spazio"],
    ["Medio de transporte", "Canoa", "Canoe", "Canoa", "Bote angosto que se rema", "A narrow boat you paddle", "Barco estreito que se rema", "Kanu", "Ein schmales Boot zum Paddeln", "Canoë", "Un bateau étroit qu'on fait avancer à la pagaie", "Canoa", "Una barca stretta che si spinge con la pagaia"],
    ["Medio de transporte", "Metro", "Subway", "Metrô", "Tren que va bajo tierra", "A train that runs underground", "Trem que anda debaixo da terra", "U-Bahn", "Ein Zug, der unter der Erde fährt", "Métro", "Un train qui roule sous terre", "Metro", "Un treno che corre sottoterra"],
    ["Medio de transporte", "Ambulancia", "Ambulance", "Ambulância", "Lleva enfermos al hospital con sirena", "Takes sick people to the hospital with a siren", "Leva doentes ao hospital com sirene", "Krankenwagen", "Bringt Kranke mit Sirene ins Krankenhaus", "Ambulance", "Elle emmène les malades à l'hôpital avec une sirène", "Ambulanza", "Porta i malati in ospedale a sirene spiegate"],
    ["Medio de transporte", "Tractor", "Tractor", "Trator", "Trabaja en el campo", "Works on the farm", "Trabalha no campo", "Traktor", "Arbeitet auf dem Bauernhof", "Tracteur", "Il travaille à la ferme", "Trattore", "Lavora nei campi"],
    ["Medio de transporte", "Yate", "Yacht", "Iate", "Barco de lujo", "A luxury boat", "Barco de luxo", "Jacht", "Ein Luxusboot", "Yacht", "Un bateau de luxe", "Yacht", "Una barca di lusso"],
    ["Prenda de ropa", "Camisa", "Shirt", "Camisa", "Tiene botones y cuello", "Has buttons and a collar", "Tem botões e gola", "Hemd", "Hat Knöpfe und einen Kragen", "Chemise", "Elle a des boutons et un col", "Camicia", "Ha i bottoni e il colletto"],
    ["Prenda de ropa", "Pantalón", "Pants", "Calça", "Te cubre las piernas", "Covers your legs", "Cobre as pernas", "Hose", "Bedeckt deine Beine", "Pantalon", "Il couvre tes jambes", "Pantaloni", "Ti coprono le gambe"],
    ["Prenda de ropa", "Vestido", "Dress", "Vestido", "Prenda de una sola pieza", "A one-piece outfit", "Peça de roupa inteira", "Kleid", "Ein Kleidungsstück aus einem Teil", "Robe", "Un vêtement d'une seule pièce", "Vestito", "Un abito tutto d'un pezzo"],
    ["Prenda de ropa", "Guantes", "Gloves", "Luvas", "Abrigan las manos", "Keep your hands warm", "Esquentam as mãos", "Handschuhe", "Halten deine Hände warm", "Gants", "Ils gardent tes mains au chaud", "Guanti", "Ti tengono calde le mani"],
    ["Prenda de ropa", "Zapato", "Shoe", "Sapato", "Se pone en el pie", "You wear it on your foot", "Se calça no pé", "Schuh", "Den trägst du am Fuß", "Chaussure", "Tu la portes au pied", "Scarpa", "La porti al piede"],
    ["Prenda de ropa", "Bota", "Boot", "Bota", "Calzado alto para la lluvia o el frío", "A tall shoe for rain or cold", "Calçado alto para chuva ou frio", "Stiefel", "Ein hoher Schuh für Regen oder Kälte", "Botte", "Une chaussure haute pour la pluie ou le froid", "Stivale", "Una scarpa alta per la pioggia o il freddo"],
    ["Prenda de ropa", "Corbata", "Tie", "Gravata", "Se anuda al cuello con traje", "Knotted around your neck with a suit", "Se amarra no pescoço com terno", "Krawatte", "Wird zum Anzug um den Hals gebunden", "Cravate", "Nouée autour du cou avec un costume", "Cravatta", "Si annoda al collo con il completo"],
    ["Prenda de ropa", "Pijama", "Pajamas", "Pijama", "Ropa para dormir", "Clothes for sleeping", "Roupa de dormir", "Schlafanzug", "Kleidung zum Schlafen", "Pyjama", "Les vêtements pour dormir", "Pigiama", "I vestiti per dormire"],
    ["Prenda de ropa", "Chaleco", "Vest", "Colete", "Abrigo sin mangas", "A sleeveless top layer", "Agasalho sem mangas", "Weste", "Ein Oberteil ohne Ärmel", "Gilet", "Un haut sans manches", "Gilet", "Un capo senza maniche"],
    ["Prenda de ropa", "Cinturón", "Belt", "Cinto", "Sostiene el pantalón", "Holds up your pants", "Segura a calça", "Gürtel", "Hält deine Hose", "Ceinture", "Elle tient ton pantalon", "Cintura", "Ti tiene su i pantaloni"],
    ["Prenda de ropa", "Sandalia", "Sandal", "Sandália", "Calzado abierto para el verano", "Open shoes for summer", "Calçado aberto para o verão", "Sandale", "Offene Schuhe für den Sommer", "Sandale", "Chaussure ouverte pour l'été", "Sandalo", "Scarpa aperta per l'estate"],
    ["Prenda de ropa", "Abrigo", "Coat", "Casaco", "Te protege del frío", "Protects you from the cold", "Protege você do frio", "Mantel", "Schützt dich vor der Kälte", "Manteau", "Il te protège du froid", "Cappotto", "Ti protegge dal freddo"],
    ["Prenda de ropa", "Bikini", "Bikini", "Biquíni", "Traje de baño de dos piezas", "A two-piece swimsuit", "Roupa de banho de duas peças", "Bikini", "Ein zweiteiliger Badeanzug", "Bikini", "Un maillot de bain deux pièces", "Bikini", "Un costume a due pezzi"],
    ["Electrodoméstico", "Microondas", "Microwave", "Microondas", "Calienta la comida en un minuto", "Heats food in a minute", "Esquenta a comida em um minuto", "Mikrowelle", "Macht Essen in einer Minute warm", "Micro-ondes", "Il chauffe la nourriture en une minute", "Microonde", "Scalda il cibo in un minuto"],
    ["Electrodoméstico", "Licuadora", "Blender", "Liquidificador", "Hace batidos y salsas", "Makes smoothies and shakes", "Faz vitaminas e batidas", "Mixer", "Macht Smoothies und Shakes", "Mixeur", "Il fait des smoothies et des milkshakes", "Frullatore", "Fa frullati e frappè"],
    ["Electrodoméstico", "Tostadora", "Toaster", "Torradeira", "Dora el pan", "Browns your bread", "Doura o pão", "Toaster", "Röstet dein Brot", "Grille-pain", "Il dore ton pain", "Tostapane", "Ti abbrustolisce il pane"],
    ["Electrodoméstico", "Horno", "Oven", "Forno", "Ahí se hornean el pollo y los postres", "Where you bake cakes and roast chicken", "Nele se fazem bolos e frango", "Ofen", "Hier backst du Kuchen und brätst Hähnchen", "Four", "Là où tu cuis les gâteaux et rôtis le poulet", "Forno", "Dove cuoci le torte e arrostisci il pollo"],
    ["Electrodoméstico", "Plancha", "Iron", "Ferro", "Saca las arrugas de la ropa", "Takes the wrinkles out of clothes", "Tira os amassados da roupa", "Bügeleisen", "Macht die Kleidung glatt", "Fer", "Il enlève les plis des vêtements", "Ferro da stiro", "Toglie le pieghe dai vestiti"],
    ["Electrodoméstico", "Ventilador", "Fan", "Ventilador", "Gira y te refresca en verano", "Spins and cools you in summer", "Gira e refresca no verão", "Ventilator", "Dreht sich und kühlt dich im Sommer", "Ventilateur", "Il tourne et te rafraîchit en été", "Ventilatore", "Gira e ti rinfresca d'estate"],
    ["Electrodoméstico", "Aspiradora", "Vacuum", "Aspirador", "Chupa el polvo del piso", "Sucks up dust from the floor", "Suga o pó do chão", "Staubsauger", "Saugt den Staub vom Boden", "Aspirateur", "Il aspire la poussière du sol", "Aspirapolvere", "Aspira la polvere dal pavimento"],
    ["Electrodoméstico", "Batidora", "Mixer", "Batedeira", "Bate la masa y la crema", "Beats cake batter", "Bate a massa dos bolos", "Rührgerät", "Schlägt den Kuchenteig", "Batteur", "Il bat la pâte à gâteau", "Sbattitore", "Monta l'impasto delle torte"],
    ["Electrodoméstico", "Televisor", "Television", "Televisão", "Ahí ves tus series", "Where you watch your shows", "Onde você vê suas séries", "Fernseher", "Hier schaust du deine Serien", "Télévision", "Là où tu regardes tes séries", "Televisore", "Dove guardi le tue serie"],
  ];
  var IDX = { es: 1, en: 2, pt: 3 };

  var TEXTOS = {
    es: {
      titulo: "Frutigrama", sub: "Adiviná la palabra del día",
      kicker: "Palabra del día · #{n}", largo_mal: "Tiene que tener {n} letras", f_empezar: "¿Se te ocurre?", f_otra: "¡Probá otra!", f_cerca: "¡Casi, casi!", f_gano: "¡Genial!", f_perdio: "Era {w}…",
      ver_pista: "Ver pista", pista_titulo: "¿Querés una pista?", pista_que_def: "Te mostramos una definición de la palabra.", pista_que_ultima: "Te destapamos la última letra.", pista_que_letra: "Te destapamos una letra más.", pista_video: "Ver un video", pista_semillas: "Usar {n} semillas", pista_sin: "No tenés semillas suficientes.", no_es: "No es esa. Te quedan {n} intentos.", numero: "Frutigrama #{n}", categoria: "Categoría",
      empieza: "Empieza con {l}", letras: "{n} letras", pista: "Pista", escribir: "Escribí tu intento…", probar: "Probar",
      intentos: "Intento {a} de {b}", empieza_mal: "Tiene que empezar con {l}", repetida: "Ya probaste esa palabra",
      pista_largo: "Pista: tiene {n} letras", pista_ultima: "Pista: termina con {l}", pista_def: "Pista: {d}", pista_letra: "Pista: destapaste una letra",
      gano: "¡La adivinaste!", perdio: "Era «{w}»", semillas: "+{n} semillas", racha: "Racha del Frutigrama: {n} días", racha_1: "Racha del Frutigrama: 1 día", compartir: "Compartir resultado",
      vuelve: "Nuevo Frutigrama en {t}", jugar: "Jugar", hecho_tarjeta: "Hecho · {s}", tarjeta_sub: "Adiviná la palabra", amigos_titulo: "Tus amigos hoy", amigos_cargando: "Buscando a tus amigos…", amigos_todavia: "todavía no", amigos_sin: "Sumá amigos y comparen cómo les fue cada día.", amigos_sin_cuenta: "Iniciá sesión y sumá amigos para comparar el Frutigrama.", amigos_agregar: "Agregar amigos", amigos_jugaron: "{n} amigos ya lo jugaron", amigos_jugo: "1 amigo ya lo jugó",
      inicio: "Modos", como: "Tenés 6 intentos. Verde: letra en su lugar. Amarillo: está, pero en otro lugar. Si te trabás, pedí una pista.", como_dalton: "Tenés 6 intentos. Naranja: letra en su lugar. Celeste: está, pero en otro lugar. Si te trabás, pedí una pista.",
    },
    en: {
      titulo: "Frutigram", sub: "Guess today's word",
      kicker: "Word of the day · #{n}", largo_mal: "It has to have {n} letters", f_empezar: "Any ideas?", f_otra: "Try another!", f_cerca: "So close!", f_gano: "Awesome!", f_perdio: "It was {w}…",
      ver_pista: "Get a hint", pista_titulo: "Want a hint?", pista_que_def: "We'll show you a definition of the word.", pista_que_ultima: "We'll reveal the last letter.", pista_que_letra: "We'll reveal one more letter.", pista_video: "Watch a video", pista_semillas: "Use {n} seeds", pista_sin: "You don't have enough seeds.", no_es: "Not that one. {n} guesses left.", numero: "Frutigram #{n}", categoria: "Category",
      empieza: "Starts with {l}", letras: "{n} letters", pista: "Hint", escribir: "Type your guess…", probar: "Guess",
      intentos: "Guess {a} of {b}", empieza_mal: "It has to start with {l}", repetida: "You already tried that word",
      pista_largo: "Hint: it has {n} letters", pista_ultima: "Hint: it ends with {l}", pista_def: "Hint: {d}", pista_letra: "Hint: a letter was revealed",
      gano: "You got it!", perdio: "It was “{w}”", semillas: "+{n} seeds", racha: "Frutigram streak: {n} days", racha_1: "Frutigram streak: 1 day", compartir: "Share result",
      vuelve: "New Frutigram in {t}", jugar: "Play", hecho_tarjeta: "Done · {s}", tarjeta_sub: "Guess the word", amigos_titulo: "Your friends today", amigos_cargando: "Looking for your friends…", amigos_todavia: "not yet", amigos_sin: "Add friends and compare how you all did each day.", amigos_sin_cuenta: "Sign in and add friends to compare the Frutigram.", amigos_agregar: "Add friends", amigos_jugaron: "{n} friends already played", amigos_jugo: "1 friend already played",
      inicio: "Modes", como: "You have 6 guesses. Green: right letter, right spot. Yellow: it's in the word, somewhere else. Stuck? Get a hint.", como_dalton: "You have 6 guesses. Orange: right letter, right spot. Blue: it's in the word, somewhere else. Stuck? Get a hint.",
    },
    pt: {
      titulo: "Frutigrama", sub: "Adivinhe a palavra do dia",
      kicker: "Palavra do dia · #{n}", largo_mal: "Tem que ter {n} letras", f_empezar: "Alguma ideia?", f_otra: "Tente outra!", f_cerca: "Quase, quase!", f_gano: "Genial!", f_perdio: "Era {w}…",
      ver_pista: "Ver dica", pista_titulo: "Quer uma dica?", pista_que_def: "Mostramos uma definição da palavra.", pista_que_ultima: "Revelamos a última letra.", pista_que_letra: "Revelamos mais uma letra.", pista_video: "Ver um vídeo", pista_semillas: "Usar {n} sementes", pista_sin: "Você não tem sementes suficientes.", no_es: "Não é essa. Restam {n} tentativas.", numero: "Frutigrama #{n}", categoria: "Categoria",
      empieza: "Começa com {l}", letras: "{n} letras", pista: "Dica", escribir: "Escreva seu palpite…", probar: "Tentar",
      intentos: "Tentativa {a} de {b}", empieza_mal: "Tem que começar com {l}", repetida: "Você já tentou essa palavra",
      pista_largo: "Dica: tem {n} letras", pista_ultima: "Dica: termina com {l}", pista_def: "Dica: {d}", pista_letra: "Dica: uma letra foi revelada",
      gano: "Você acertou!", perdio: "Era «{w}»", semillas: "+{n} sementes", racha: "Sequência no Frutigrama: {n} dias", racha_1: "Sequência no Frutigrama: 1 dia", compartir: "Compartilhar resultado",
      vuelve: "Novo Frutigrama em {t}", jugar: "Jogar", hecho_tarjeta: "Feito · {s}", tarjeta_sub: "Adivinhe a palavra", amigos_titulo: "Seus amigos hoje", amigos_cargando: "Procurando seus amigos…", amigos_todavia: "ainda não", amigos_sin: "Adicione amigos e comparem como foram a cada dia.", amigos_sin_cuenta: "Entre e adicione amigos para comparar o Frutigrama.", amigos_agregar: "Adicionar amigos", amigos_jugaron: "{n} amigos já jogaram", amigos_jugo: "1 amigo já jogou",
      inicio: "Modos", como: "Você tem 6 tentativas. Verde: letra no lugar certo. Amarelo: está na palavra, em outro lugar. Travou? Peça uma dica.", como_dalton: "Você tem 6 tentativas. Laranja: letra no lugar certo. Azul: está na palavra, em outro lugar. Travou? Peça uma dica.",
    },
    de: {
      titulo: "Frutigrama",
      sub: "Errate das Wort des Tages",
      kicker: "Wort des Tages · #{n}",
      largo_mal: "Es muss {n} Buchstaben haben",
      f_empezar: "Eine Idee?",
      f_otra: "Probier ein anderes!",
      f_cerca: "Ganz knapp!",
      f_gano: "Klasse!",
      f_perdio: "Es war {w}…",
      ver_pista: "Tipp holen",
      pista_titulo: "Möchtest du einen Tipp?",
      pista_que_def: "Wir zeigen dir eine Beschreibung des Wortes.",
      pista_que_ultima: "Wir verraten dir den letzten Buchstaben.",
      pista_que_letra: "Wir verraten dir einen weiteren Buchstaben.",
      pista_video: "Video ansehen",
      pista_semillas: "{n} Samen einsetzen",
      pista_sin: "Du hast nicht genug Samen.",
      no_es: "Das ist es nicht. Noch {n} Versuche.",
      numero: "Frutigrama #{n}",
      categoria: "Kategorie",
      empieza: "Beginnt mit {l}",
      letras: "{n} Buchstaben",
      pista: "Tipp",
      escribir: "Gib deinen Versuch ein…",
      probar: "Prüfen",
      intentos: "Versuch {a} von {b}",
      empieza_mal: "Es muss mit {l} beginnen",
      repetida: "Dieses Wort hast du schon probiert",
      pista_largo: "Tipp: Es hat {n} Buchstaben",
      pista_ultima: "Tipp: Es endet auf {l}",
      pista_def: "Tipp: {d}",
      pista_letra: "Tipp: Ein Buchstabe wurde aufgedeckt",
      gano: "Geschafft!",
      perdio: "Es war „{w}“",
      semillas: "+{n} Samen",
      racha: "Frutigrama-Serie: {n} Tage",
      racha_1: "Frutigrama-Serie: 1 Tag",
      compartir: "Ergebnis teilen",
      vuelve: "Neues Frutigrama in {t}",
      jugar: "Spielen",
      hecho_tarjeta: "Erledigt · {s}",
      tarjeta_sub: "Errate das Wort",
      amigos_titulo: "Deine Freunde heute",
      amigos_cargando: "Wir suchen deine Freunde…",
      amigos_todavia: "noch nicht",
      amigos_sin: "Füge Freunde hinzu und vergleicht jeden Tag, wie es gelaufen ist.",
      amigos_sin_cuenta: "Melde dich an und füge Freunde hinzu, um das Frutigrama zu vergleichen.",
      amigos_agregar: "Freunde hinzufügen",
      amigos_jugaron: "{n} Freunde haben schon gespielt",
      amigos_jugo: "1 Freund hat schon gespielt",
      inicio: "Start",
      como: "Du hast 6 Versuche. Grün: richtiger Buchstabe an der richtigen Stelle. Gelb: kommt vor, aber woanders. Kommst du nicht weiter? Hol dir einen Tipp.",
      como_dalton: "Du hast 6 Versuche. Orange: richtiger Buchstabe an der richtigen Stelle. Blau: kommt vor, aber woanders. Kommst du nicht weiter? Hol dir einen Tipp."
    },
    fr: {
      titulo: "Frutigrama",
      sub: "Devine le mot du jour",
      kicker: "Mot du jour · #{n}",
      largo_mal: "Il doit avoir {n} lettres",
      f_empezar: "Une idée ?",
      f_otra: "Essaie un autre !",
      f_cerca: "Presque !",
      f_gano: "Génial !",
      f_perdio: "C'était {w}…",
      ver_pista: "Voir un indice",
      pista_titulo: "Tu veux un indice ?",
      pista_que_def: "On te montre une définition du mot.",
      pista_que_ultima: "On te révèle la dernière lettre.",
      pista_que_letra: "On te révèle une lettre de plus.",
      pista_video: "Regarder une vidéo",
      pista_semillas: "Utiliser {n} graines",
      pista_sin: "Tu n'as pas assez de graines.",
      no_es: "Ce n'est pas ça. Il te reste {n} essais.",
      numero: "Frutigrama #{n}",
      categoria: "Catégorie",
      empieza: "Commence par {l}",
      letras: "{n} lettres",
      pista: "Indice",
      escribir: "Écris ton essai…",
      probar: "Essayer",
      intentos: "Essai {a} sur {b}",
      empieza_mal: "Il doit commencer par {l}",
      repetida: "Tu as déjà essayé ce mot",
      pista_largo: "Indice : il a {n} lettres",
      pista_ultima: "Indice : il finit par {l}",
      pista_def: "Indice : {d}",
      pista_letra: "Indice : une lettre a été révélée",
      gano: "Trouvé !",
      perdio: "C'était « {w} »",
      semillas: "+{n} graines",
      racha: "Série Frutigrama : {n} jours",
      racha_1: "Série Frutigrama : 1 jour",
      compartir: "Partager le résultat",
      vuelve: "Nouveau Frutigrama dans {t}",
      jugar: "Jouer",
      hecho_tarjeta: "Fait · {s}",
      tarjeta_sub: "Devine le mot",
      amigos_titulo: "Tes amis aujourd'hui",
      amigos_cargando: "On cherche tes amis…",
      amigos_todavia: "pas encore",
      amigos_sin: "Ajoute des amis et comparez vos résultats chaque jour.",
      amigos_sin_cuenta: "Connecte-toi et ajoute des amis pour comparer le Frutigrama.",
      amigos_agregar: "Ajouter des amis",
      amigos_jugaron: "{n} amis ont déjà joué",
      amigos_jugo: "1 ami a déjà joué",
      inicio: "Accueil",
      como: "Tu as 6 essais. Vert : bonne lettre, bonne place. Jaune : elle est dans le mot, ailleurs. Bloqué ? Demande un indice.",
      como_dalton: "Tu as 6 essais. Orange : bonne lettre, bonne place. Bleu : elle est dans le mot, ailleurs. Bloqué ? Demande un indice."
    },
    it: {
      titulo: "Frutigrama",
      sub: "Indovina la parola del giorno",
      kicker: "Parola del giorno · #{n}",
      largo_mal: "Deve avere {n} lettere",
      f_empezar: "Hai un'idea?",
      f_otra: "Provane un'altra!",
      f_cerca: "Quasi, quasi!",
      f_gano: "Grande!",
      f_perdio: "Era {w}…",
      ver_pista: "Chiedi un indizio",
      pista_titulo: "Vuoi un indizio?",
      pista_que_def: "Ti mostriamo una definizione della parola.",
      pista_que_ultima: "Ti sveliamo l'ultima lettera.",
      pista_que_letra: "Ti sveliamo un'altra lettera.",
      pista_video: "Guarda un video",
      pista_semillas: "Usa {n} semi",
      pista_sin: "Non hai abbastanza semi.",
      no_es: "Non è quella. Ti restano {n} tentativi.",
      numero: "Frutigrama #{n}",
      categoria: "Categoria",
      empieza: "Inizia con {l}",
      letras: "{n} lettere",
      pista: "Indizio",
      escribir: "Scrivi la parola…",
      probar: "Prova",
      intentos: "Tentativo {a} di {b}",
      empieza_mal: "Deve iniziare con {l}",
      repetida: "Hai già provato questa parola",
      pista_largo: "Indizio: ha {n} lettere",
      pista_ultima: "Indizio: finisce con {l}",
      pista_def: "Indizio: {d}",
      pista_letra: "Indizio: è stata svelata una lettera",
      gano: "Indovinata!",
      perdio: "Era “{w}”",
      semillas: "+{n} semi",
      racha: "Serie del Frutigrama: {n} giorni",
      racha_1: "Serie del Frutigrama: 1 giorno",
      compartir: "Condividi il risultato",
      vuelve: "Nuovo Frutigrama tra {t}",
      jugar: "Gioca",
      hecho_tarjeta: "Fatto · {s}",
      tarjeta_sub: "Indovina la parola",
      amigos_titulo: "I tuoi amici oggi",
      amigos_cargando: "Cerchiamo i tuoi amici…",
      amigos_todavia: "non ancora",
      amigos_sin: "Aggiungi amici e confrontate com'è andata ogni giorno.",
      amigos_sin_cuenta: "Accedi e aggiungi amici per confrontare il Frutigrama.",
      amigos_agregar: "Aggiungi amici",
      amigos_jugaron: "{n} amici hanno già giocato",
      amigos_jugo: "1 amico ha già giocato",
      inicio: "Inizio",
      como: "Hai 6 tentativi. Verde: lettera giusta al posto giusto. Giallo: c'è, ma in un altro posto. Ti sei bloccato? Chiedi un indizio.",
      como_dalton: "Hai 6 tentativi. Arancione: lettera giusta al posto giusto. Azzurro: c'è, ma in un altro posto. Ti sei bloccato? Chiedi un indizio."
    },
  };
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave;
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return APP.numeros(str);
  }
  function esc(s) { return escapeHtml(String(s == null ? "" : s)); }
  function limpiar(s) { return String(s || "").trim().toLowerCase().normalize("NFD").replace(/[̀-̂̄-ͯ]/g, "").replace(/ñ/g, "ñ").replace(/[̃]/g, "").replace(/[^a-zñ]/g, ""); }

  // ---------- La palabra del día ----------
  function diaNumero(clave) {
    var a = new Date(INICIO + "T12:00:00"), b = new Date((clave || dayKey()) + "T12:00:00");
    return Math.round((b - a) / 86400000) + 1;
  }
  // El orden se mezcla una sola vez (siempre igual), así no salen las categorías en fila.
  // Las primeras 98 conservan su orden de siempre (los días #1 a #98 no cambian); las que se sumaron
  // después van a continuación, mezcladas entre ellas.
  var PRIMERAS = 98;
  function mezclar(o, semilla) {
    var rnd = seededRandom(hashString(semilla));
    for (var k = o.length - 1; k > 0; k--) { var j = Math.floor(rnd() * (k + 1)); var x = o[k]; o[k] = o[j]; o[j] = x; }
    return o;
  }
  var ORDEN = (function () {
    var primeras = [], nuevas = [];
    PALABRAS.forEach(function (p, i) { (i < PRIMERAS ? primeras : nuevas).push(i); });
    return mezclar(primeras, "frutigrama").concat(mezclar(nuevas, "frutigrama-2"));
  })();
  // Fuera del Río de la Plata (ver app-tuteo.js) algunas palabras se dicen distinto: en México y en España
  // la palabra del día es la de allá, con su pista. [palabra, pista]; "mx" vale para toda Latinoamérica con "tú".
  var REGION = {
    Frutilla: { mx: ["Fresa", "Roja, con semillitas por fuera"], es: ["Fresa", "Roja, con semillitas por fuera"] },
    Banana: { mx: ["Plátano", "Amarillo y curvo"], es: ["Plátano", "Amarillo y curvo"] },
    "Ananá": { mx: ["Piña", "Tiene corona y es muy dulce"], es: ["Piña", "Tiene corona y es muy dulce"] },
    Durazno: { es: ["Melocotón", "Piel aterciopelada y un hueso grande"] },
    Papa: { es: ["Patata", "Con ella se hace el puré"] },
    Jugo: { es: ["Zumo", "Se hace exprimiendo frutas"] },
    Mate: { mx: ["Café", "Se toma para despertarse"], es: ["Café", "Se toma para despertarse"] },
    Asado: { mx: ["Tacos", "Tortilla doblada con relleno"], es: ["Paella", "Arroz con mariscos, de Valencia"] },
    Heladera: { mx: ["Refrigerador", "Mantiene fría la comida"], es: ["Nevera", "Mantiene fría la comida"] },
    Campera: { mx: ["Chamarra", "Abrigo con cierre o botones"], es: ["Chaqueta", "Abrigo con cierre o botones"] },
  };
  function habla() { return state.lang === "es" && APP.habla ? APP.habla() : "vos"; }
  function idioma() { var h = habla(); return h === "vos" ? state.lang : "es-" + h; }
  // Desde CAMBIO la palabra del día sale solo de las de LARGO letras (en tu idioma y tu forma de hablar), en un
  // orden mezclado fijo. Los días anteriores quedan como estaban (así no cambia un día ya jugado).
  var CAMBIO = "2026-10-21", LARGO = 6;
  function enMiIdioma(p) {
    var i = IDX[state.lang] || 1, palabra = p[i], pista = p[i + 3], otra = REGION[palabra] && REGION[palabra][habla()];
    // Alemán: la palabra y la pista van al final de cada fila (posiciones 7 y 8).
    if (state.lang === "de") { palabra = p[7] || p[2]; pista = p[8] || p[5]; }
    // Francés e italiano: posiciones 9-10 y 11-12.
    if (state.lang === "fr") { palabra = p[9] || p[2]; pista = p[10] || p[5]; }
    if (state.lang === "it") { palabra = p[11] || p[2]; pista = p[12] || p[5]; }
    if (state.lang === "es" && otra) { palabra = otra[0]; pista = otra[1]; }
    return [palabra, pista];
  }
  // (10/11) Palabras nuevas de 6 letras, propias de cada idioma ([categoría, palabra, pista]): las de antes se
  // terminaban en enero (italiano tenía 74). Van DESPUÉS de las que ya había, mezcladas entre ellas, así ningún día ya
  // jugado (ni el de hoy) cambia de palabra. En español sirven para las tres formas de hablar (palabras neutras).
  var NUEVAS = window.FRUTIGRAMA_NUEVAS || {};
  function filaNueva(f) { return [f[0], f[1], f[1], f[1], f[2], f[2], f[2], f[1], f[2], f[1], f[2], f[1], f[2]]; }
  var listas = {};
  function listaFija() {
    var k = idioma();
    if (!listas[k]) {
      var viejas = mezclar(PALABRAS.map(function (p, i) { return i; }).filter(function (i) { return limpiar(enMiIdioma(PALABRAS[i])[0]).length === LARGO; }), "frutigrama-" + LARGO + "-" + k)
        .map(function (i) { return PALABRAS[i]; });
      var nuevas = (NUEVAS[state.lang] || []).filter(function (f) { return limpiar(f[1]).length === LARGO; }).map(filaNueva);
      listas[k] = viejas.concat(mezclar(nuevas, "frutigrama-nuevas-" + LARGO + "-" + k));
    }
    return listas[k];
  }
  function delDia() {
    var n = Math.max(1, diaNumero());
    var p = PALABRAS[ORDEN[(n - 1) % ORDEN.length]];
    if (dayKey() >= CAMBIO) { var L6 = listaFija(); if (L6.length) p = L6[(n - diaNumero(CAMBIO)) % L6.length]; }
    var mi = enMiIdioma(p), palabra = mi[0], pista = mi[1];
    if (APP.tu) pista = APP.tu(pista);
    var limpia = limpiar(palabra);
    // Letras extra que se destapan con las pistas 4 y 5 (siempre las mismas para ese día).
    var rnd = seededRandom(hashString("fg-" + n)), medio = [];
    for (var k = 0; k < limpia.length - 1; k++) medio.push(k);
    for (var m = medio.length - 1; m > 0; m--) { var j = Math.floor(rnd() * (m + 1)); var x = medio[m]; medio[m] = medio[j]; medio[j] = x; }
    return { n: n, cat: p[0], palabra: palabra, limpia: limpia, pista: pista, extra: medio.slice(0, 2) };
  }

  // ---------- Lo guardado ----------
  function leer() {
    var d = null;
    try { d = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { d = null; }
    if (!d || typeof d !== "object") d = {};
    if (!d.hoy || d.hoy.dia !== dayKey() || d.hoy.lang !== idioma()) {
      var previo = d.hoy && d.hoy.dia === dayKey() ? d.hoy : null;
      d.hoy = previo && previo.fin ? previo : { dia: dayKey(), lang: idioma(), intentos: [], fin: false, gano: false, estrellas: 0 };
    }
    d.racha = d.racha || 0; d.mejor = d.mejor || 0; d.ultimoGanado = d.ultimoGanado || null;
    return d;
  }
  function guardar(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* nada */ } }
  if (typeof SYNC_KEYS !== "undefined" && SYNC_KEYS.indexOf(KEY) < 0) SYNC_KEYS.push(KEY);
  var juntarAntes = window.mergeSyncValue;
  if (typeof juntarAntes === "function") window.mergeSyncValue = function (key, localRaw, remoteRaw) {
    if (key !== KEY || localRaw == null || remoteRaw == null) return juntarAntes.apply(this, arguments);
    var L, R;
    try { L = JSON.parse(localRaw); R = JSON.parse(remoteRaw); } catch (e) { return localRaw; }
    if (!L || !R) return localRaw || remoteRaw;
    var hoyL = L.hoy || {}, hoyR = R.hoy || {};
    // El de hoy: si en un teléfono ya está terminado, manda ese; si no, el que tenga más intentos.
    var hoy = hoyL.dia === hoyR.dia ? ((hoyR.fin && !hoyL.fin) || ((hoyR.intentos || []).length > (hoyL.intentos || []).length && !hoyL.fin) ? hoyR : hoyL)
      : ((hoyL.dia || "") > (hoyR.dia || "") ? hoyL : hoyR);
    var masNuevo = (L.ultimoGanado || "") >= (R.ultimoGanado || "") ? L : R;
    return JSON.stringify({ hoy: hoy, racha: masNuevo.racha || 0, mejor: Math.max(L.mejor || 0, R.mejor || 0), ultimoGanado: masNuevo.ultimoGanado || null });
  };

  // ---------- Pistas y colores ----------
  // Pistas pedidas (con un video o con semillas), en orden: definición, última letra y dos letras más.
  // El largo de la palabra se ve siempre, como en el Wordle.
  var MAX_PISTAS = 4, PRECIO_PISTA = 75;
  function pistas(D, n) {
    var reveladas = []; // la primera letra ya no se muestra: solo la categoría
    if (n >= 2) reveladas.push(D.limpia.length - 1);
    if (n >= 3 && D.extra[0] != null) reveladas.push(D.extra[0]);
    if (n >= 4 && D.extra[1] != null) reveladas.push(D.extra[1]);
    return { largo: true, def: n >= 1, reveladas: reveladas };
  }
  function colores(intento, secreto) {
    if (intento.length !== secreto.length) return null;
    var res = [], resto = {};
    for (var i = 0; i < secreto.length; i++) {
      if (intento[i] === secreto[i]) res[i] = "v";
      else resto[secreto[i]] = (resto[secreto[i]] || 0) + 1;
    }
    for (var k = 0; k < intento.length; k++) {
      if (res[k]) continue;
      if (resto[intento[k]]) { res[k] = "a"; resto[intento[k]]--; } else res[k] = "g";
    }
    return res;
  }
  function estrellasPor(n) { return n <= 2 ? 3 : n <= 4 ? 2 : 1; }

  // ---------- Pantalla ----------
  var pantalla = document.createElement("div");
  pantalla.className = "screen";
  pantalla.id = "screen-frutigrama";
  pantalla.innerHTML = '<div class="wrap app-frutigrama" id="fgCont"></div>';
  document.body.insertBefore(pantalla, document.getElementById("appTabs"));
  var cont = pantalla.querySelector("#fgCont");
  var ultimoAviso = "";

  function estrellasHtml(n) { var h = ""; for (var i = 0; i < 3; i++) h += advStar(i < n); return '<span class="fg-estrellas">' + h + "</span>"; }

  var animarFila = -1; // fila que se acaba de probar: sus fichas se dan vuelta

  function render() {
    var D = delDia(), d = leer(), H = d.hoy;
    var P = pistas(D, H.pistas || 0), L = D.limpia.length;
    var quedan = INTENTOS - H.intentos.length;
    // La fruta del jugador comenta cómo va.
    var verdes = 0;
    if (H.intentos.length) { var c0 = colores(H.intentos[H.intentos.length - 1], D.limpia); if (c0) c0.forEach(function (x) { if (x === "v") verdes++; }); }
    var animo = H.fin ? (H.gano ? "f_gano" : "f_perdio") : !H.intentos.length ? "f_empezar" : verdes >= L - 2 ? "f_cerca" : "f_otra";
    var cara = H.fin ? (H.gano ? "happy" : "sad") : H.intentos.length ? "thinking" : "happy";
    var html = '<div class="screen-back-row"><button type="button" class="lobby-back" onclick="appIrAInicio()"><span aria-hidden="true">←</span> ' + esc(tx("inicio")) + "</button></div>" +
      '<div class="fg-hero' + (H.fin ? (H.gano ? " gano" : " perdio") : "") + '">' +
        '<div class="fg-hero-texto"><span class="ah-kicker">' + esc(tx("kicker", { n: D.n })) + "</span>" +
          "<h1>" + esc(tx("titulo")) + "</h1>" +
          '<span class="fg-chip"><small>' + esc(tx("categoria")) + "</small>" + esc(catLabel(D.cat)) + "</span></div>" +
        '<div class="fg-hero-fruta"><span class="fg-globo">' + esc(tx(animo, { w: D.palabra })) + "</span>" + mascotSvg(cara, getMyAvatar(), myEquipped()) + "</div>" +
      "</div>";
    // Lo que se sabe: las letras pedidas con pistas (y todo, al terminar).
    var patron = "";
    for (var i = 0; i < L; i++) {
      var ver = H.fin || P.reveladas.indexOf(i) >= 0;
      patron += '<span class="fg-p' + (ver ? " ver" : "") + '">' + (ver ? esc(D.limpia[i].toUpperCase()) : "") + "</span>";
    }
    // Las letras de las pistas: recién aparecen cuando pediste una (antes eran cuadraditos vacíos que parecían un error).
    if (!H.fin) html += '<div class="fg-patron-fila"><div class="fg-patron">' + (P.reveladas.length ? patron : "") + "</div>" +
      (!H.fin && (H.pistas || 0) < MAX_PISTAS ? '<button type="button" class="fg-pista-btn" onclick="appFrutigramaPista()">' + iconSvg("sun") + "<span>" + esc(tx("ver_pista")) + (H.pistas ? " " + H.pistas + "/" + MAX_PISTAS : "") + "</span></button>" : "") +
      "</div>";
    html += (P.def || H.fin ? '<p class="fg-def">' + iconSvg("sun") + "<span>" + esc(D.pista) + "</span></p>" : "");
    // Tablero de 6 filas, como el Wordle.
    html += '<div class="fg-board" style="--n:' + L + '">';
    // Al terminar, las filas vacías que sobraron ya no se muestran.
    for (var r = 0; r < (H.fin ? H.intentos.length : INTENTOS); r++) {
      var g = H.intentos[r], actual = !H.fin && r === H.intentos.length;
      var futura = !H.fin && r > H.intentos.length;
      html += '<div class="fg-row' + (actual ? " actual" : "") + (futura ? " futura" : "") + (r === animarFila ? " nueva" : "") + '"' + (actual ? ' id="fgActual"' : "") + ">";
      var c = g ? colores(g, D.limpia) : null;
      for (var k = 0; k < L; k++) {
        if (g) html += '<span class="fg-t ' + (c ? c[k] : "g") + '" style="--i:' + k + '">' + esc((g[k] || "").toUpperCase()) + "</span>";
        else html += '<span class="fg-t vacia"></span>';
      }
      html += "</div>";
    }
    html += "</div>";
    if (!H.fin && !H.intentos.length) html += '<p class="hint fg-como">' + esc(tx(APP.daltonismo && APP.daltonismo() ? "como_dalton" : "como")) + "</p>";
    animarFila = -1;
    if (!H.fin) {
      var fichas = "";
      for (var f = 0; f < INTENTOS; f++) fichas += '<span class="fg-dot' + (f < quedan ? " on" : "") + '"></span>';
      html += '<form class="fg-form" onsubmit="appFrutigramaProbar(event)">' +
        '<input id="fgInput" type="text" maxlength="' + L + '" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" placeholder="' + esc(tx("escribir")) + '">' +
        '<button type="submit" class="btn btn-primary">' + esc(tx("probar")) + "</button></form>" +
        '<div class="fg-quedan"><span class="fg-dots">' + fichas + "</span><span>" + esc(tx("intentos", { a: H.intentos.length + 1, b: INTENTOS })) + "</span></div>" +
        (ultimoAviso ? '<p class="fg-aviso">' + esc(ultimoAviso) + "</p>" : "");
    } else {
      html += '<div class="fg-final' + (H.gano ? " gano" : "") + '">' +
        (H.gano ? "<h2>" + esc(tx("gano")) + "</h2>" + estrellasHtml(H.estrellas) : "<h2>" + esc(tx("perdio", { w: D.palabra })) + "</h2>") +
        '<div class="fg-final-datos">' +
          (H.premio ? '<span class="fg-premio">' + seedIcon() + esc(tx("semillas", { n: H.premio })) + "</span>" : "") +
          (d.racha ? '<span class="fg-racha">' + iconSvg("flame") + esc(tx(d.racha === 1 ? "racha_1" : "racha", { n: d.racha })) + "</span>" : "") +
        "</div>" +
        '<button type="button" class="btn btn-primary btn-block" onclick="appFrutigramaCompartir()">' + esc(tx("compartir")) + "</button>" +
        '<p class="hint fg-vuelve">' + esc(tx("vuelve", { t: faltaManana() })) + "</p></div>" +
        '<div class="fg-amigos" id="fgAmigos">' + amigosHtml() + "</div>";
    }
    cont.innerHTML = html;
    if (H.fin) { cont.classList.remove("fg-tecleando"); cargarAmigos(false); }
    // Lo que se escribe aparece letra por letra en la fila actual.
    var input = document.getElementById("fgInput"), fila = document.getElementById("fgActual");
    // Con el teclado abierto se esconden la cabecera y las filas vacías de abajo: así la fila que estás
    // escribiendo y el cuadro de texto quedan juntos a la vista (antes el iPhone corría la pantalla y la
    // fila quedaba tapada). Al cerrar el teclado vuelve todo y la pantalla vuelve arriba.
    if (input) {
      // Se compacta apenas se apoya el dedo, antes de que aparezca el teclado: así el cuadro ya está arriba
      // y el iPhone no corre la pantalla (si se compacta después, la pantalla queda corrida).
      input.addEventListener("touchstart", function (e) {
        if (document.activeElement === input) return;
        e.preventDefault(); // el mismo toque compacta y abre el teclado (si no, el cuadro se corre y el toque cae en otro lado)
        cont.classList.add("fg-tecleando");
        input.focus();
      }, { passive: false });
      // Tocar los cuadrados también abre el teclado (antes solo el cuadro de texto).
      var tablero = cont.querySelector(".fg-board");
      if (tablero) {
        tablero.classList.add("tocable");
        tablero.addEventListener("click", function () {
          if (document.activeElement === input) return;
          cont.classList.add("fg-tecleando");
          input.focus();
        });
      }
      input.addEventListener("focus", function () {
        cont.classList.add("fg-tecleando");
        // Con la versión compacta todo entra arriba del teclado: la pantalla queda arriba de todo.
        setTimeout(function () { window.scrollTo({ top: 0, behavior: "smooth" }); }, 320);
      });
      input.addEventListener("blur", function () {
        setTimeout(function () {
          if (document.activeElement && document.activeElement.id === "fgInput") return; // se volvió a enfocar (intento nuevo)
          cont.classList.remove("fg-tecleando");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 150);
      });
    }
    if (input && fila) {
      input.addEventListener("input", function () {
        var v = limpiar(input.value).slice(0, L);
        fila.querySelectorAll(".fg-t").forEach(function (t, k) {
          t.textContent = v[k] ? v[k].toUpperCase() : "";
          t.classList.toggle("llena", !!v[k]);
        });
      });
    }
  }
  function sacudir() {
    var fila = document.getElementById("fgActual");
    if (!fila) return;
    fila.classList.remove("sacude"); void fila.offsetWidth; fila.classList.add("sacude");
  }
  function faltaManana() {
    var ahora = new Date(), manana = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);
    var min = Math.max(1, Math.round((manana - ahora) / 60000)), h = Math.floor(min / 60);
    return h > 0 ? h + " h " + (min % 60) + " min" : min + " min";
  }

  window.appFrutigramaProbar = function (e) {
    if (e) e.preventDefault();
    var input = document.getElementById("fgInput");
    var D = delDia(), d = leer(), H = d.hoy;
    if (H.fin) return;
    var g = limpiar(input && input.value);
    ultimoAviso = "";
    if (!g) return;
    var aviso = g.length !== D.limpia.length ? tx("largo_mal", { n: D.limpia.length })
      : H.intentos.indexOf(g) >= 0 ? tx("repetida") : "";
    if (aviso) {
      var av = cont.querySelector(".fg-aviso");
      if (!av) { av = document.createElement("p"); av.className = "fg-aviso"; cont.querySelector(".fg-quedan").after(av); }
      av.textContent = aviso;
      sacudir(); vibrar("error");
      return;
    }
    animarFila = H.intentos.length;
    H.intentos.push(g);
    if (g === D.limpia) {
      H.fin = true; H.gano = true; H.estrellas = estrellasPor(H.intentos.length);
      var ayer = new Date(); ayer.setDate(ayer.getDate() - 1);
      var claveAyer = ayer.getFullYear() + "-" + String(ayer.getMonth() + 1).padStart(2, "0") + "-" + String(ayer.getDate()).padStart(2, "0");
      d.racha = d.ultimoGanado === claveAyer ? d.racha + 1 : (d.ultimoGanado === dayKey() ? d.racha : 1);
      d.ultimoGanado = dayKey();
      d.mejor = Math.max(d.mejor || 0, d.racha);
      // Semillas una sola vez por día (aunque se juegue en otro idioma u otro teléfono).
      var clave = "frutigrama:" + dayKey();
      if ((getProgress().counted || []).indexOf(clave) < 0) {
        H.premio = SEMILLAS[H.estrellas];
        bumpProgress(function (p) { addMission(p, "valid_words", 1); }, clave);
        addSeeds(H.premio);
      }
      vibrar("bien"); launchConfetti();
      if (APP.evento) APP.evento("frutigrama", { gano: true, intentos: H.intentos.length });
    } else {
      vibrar("aviso");
      if (H.intentos.length >= INTENTOS) {
        H.fin = true; H.gano = false; d.racha = 0;
        if (APP.evento) APP.evento("frutigrama", { gano: false, intentos: H.intentos.length });
      } else {
        ultimoAviso = tx("no_es", { n: INTENTOS - H.intentos.length });
        // Último intento: se ofrece la pista sola, una vez por día (es cuando más sirve).
        // (Solo si la puede usar: con semillas suficientes o con un video listo.)
        var puede = getWallet().seeds >= PRECIO_PISTA || (APP.hayVideo && APP.hayVideo());
        if (INTENTOS - H.intentos.length === 1 && (H.pistas || 0) < MAX_PISTAS && !H.ultimaOfrecida && puede) { H.ultimaOfrecida = true; ofrecerPista = true; }
      }
    }
    delete H._limpia;
    d.hoy = H;
    guardar(d);
    render();
    if (H.fin && window.appRenderInicio) appRenderInicio();
    if (H.fin && APP.anuncioAlTerminar) APP.anuncioAlTerminar("frutigrama");
    if (H.fin && APP.reprogramarAvisos) APP.reprogramarAvisos();
    if (H.fin && APP.publicarHoy) APP.publicarHoy();
    var nuevo = document.getElementById("fgInput");
    if (ofrecerPista) {
      ofrecerPista = false;
      if (nuevo) nuevo.blur();
      if (APP.evento) APP.evento("semillas_oferta", { que: "frutigrama_pista" });
      setTimeout(function () { if (document.querySelector("#screen-frutigrama.active")) appFrutigramaPista(); }, 900);
    } else if (nuevo) nuevo.focus();
  };

  // Ver pista: con un video o pagando semillas (se muestran las dos opciones). Se pide con el botón; en el último intento
  // se ofrece sola una vez (ver appFrutigramaProbar).
  var ofrecerPista = false;
  window.appFrutigramaPista = function () {
    var d = leer(), H = d.hoy, n = H.pistas || 0;
    if (H.fin || n >= MAX_PISTAS) return;
    var que = n === 0 ? tx("pista_que_def") : n === 1 ? tx("pista_que_ultima") : tx("pista_que_letra");
    // El video se ofrece siempre que la app tenga videos (si todavía no cargó uno, al tocarlo avisa y lo carga).
    var video = !!(APP.verVideo && APP.hayVideo);
    var semillas = getWallet().seeds;
    var hoja = APP.abrirHoja(
      '<span class="confirm-art">' + iconSvg("sun") + "</span><h2>" + esc(tx("pista_titulo")) + "</h2><p>" + esc(que) + "</p>" +
      '<div class="fg-pista-opciones">' +
      (video ? '<button type="button" class="btn btn-primary btn-block ap-video-btn" data-p="video">▶ ' + esc(tx("pista_video")) + "</button>" : "") +
      '<button type="button" class="btn ' + (video ? "btn-secondary" : "btn-primary") + ' btn-block" data-p="semillas"' + (semillas < PRECIO_PISTA ? " disabled" : "") + ">" +
        seedIcon() + " " + esc(tx("pista_semillas", { n: PRECIO_PISTA })) + "</button>" +
      (semillas < PRECIO_PISTA ? '<p class="hint">' + esc(tx("pista_sin")) + "</p>" : "") + "</div>");
    hoja.tarjeta.addEventListener("click", function (e) {
      var b = e.target.closest("[data-p]");
      if (!b || b.disabled) return;
      if (b.dataset.p === "semillas") {
        var w = getWallet();
        if (w.seeds < PRECIO_PISTA) return;
        w.seeds -= PRECIO_PISTA; saveWallet(w);
        hoja.cerrar(); darPista("semillas");
      } else {
        hoja.cerrar();
        APP.verVideo().then(function (ok) { if (ok) darPista("video"); });
      }
    });
  };
  function darPista(como) {
    var d = leer(), H = d.hoy;
    if (H.fin) return;
    H.pistas = Math.min(MAX_PISTAS, (H.pistas || 0) + 1);
    d.hoy = H; guardar(d);
    ultimoAviso = "";
    render();
    vibrar("bien");
    if (APP.evento) APP.evento("frutigrama_pista", { n: H.pistas, como: como });
    if (window.renderShopButton) renderShopButton();
  }

  window.appFrutigramaCompartir = function () {
    var D = delDia(), H = leer().hoy;
    // Como el Wordle: una fila de cuadraditos por intento (verde en su lugar, amarillo en otro lugar), sin mostrar letras.
    var dalton = APP.daltonismo && APP.daltonismo();
    var EMOJI = dalton ? { v: "🟧", a: "🟦", g: "⬛" } : { v: "🟩", a: "🟨", g: "⬛" };
    var filas = H.intentos.map(function (g) {
      var c = colores(g, D.limpia);
      return c ? c.map(function (x) { return EMOJI[x]; }).join("") : (g === D.limpia ? EMOJI.v : "⬛");
    }).join("\n");
    var texto = "tutti.frutti · " + tx("numero", { n: D.n }) + " · " + (H.gano ? H.intentos.length : "X") + "/" + INTENTOS +
      (H.gano ? " " + "★★★".slice(0, H.estrellas) : "") + (H.pistas ? " 💡" + H.pistas : "") + "\n" +
      catLabel(D.cat) + " · " + D.limpia[0].toUpperCase() + "\n\n" + filas + "\n\n" + (APP.tiendaUrl || "https://tuttipuntofrutti.com/jugar");
    var S = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Share;
    if (S) S.share({ text: texto }).catch(function () {});
    else if (navigator.share) navigator.share({ text: texto }).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(texto).then(function () { seedToast("✓"); });
    if (APP.evento) APP.evento("compartir", { que: "frutigrama" });
  };

  // Para las notificaciones: si el de hoy ya está hecho y qué número tiene dentro de "dias" días.
  APP.frutigrama = {
    hecho: function () { return !!leer().hoy.fin; },
    // Para "Tus amigos hoy": intentos con que la sacaste (1-6), 7 si no la sacaste, 0 si no terminaste.
    resultado: function () { var H = leer().hoy; return H.fin ? (H.gano ? H.intentos.length : 7) : 0; },
    numero: function (dias) { return Math.max(1, diaNumero()) + (dias || 0); },
  };

  window.appAbrirFrutigrama = function () {
    ultimoAviso = "";
    render();
    showScreen("screen-frutigrama");
    window.scrollTo(0, 0);
    if (APP.evento) APP.evento("abrir_frutigrama", {});
  };

  // ---------- Tus amigos hoy ----------
  // Cada uno publica su resultado en hoy/{día}/{uid}.fg (app-ligas.js); acá se leen los de tus amigos.
  var amigos = { lista: null, dia: "", at: 0, cargando: false };
  function amigosHtml() {
    var titulo = "<h3>" + esc(tx("amigos_titulo")) + "</h3>";
    var agregar = '<button type="button" class="btn btn-secondary btn-block fg-amigos-agregar" onclick="openProfile(\'friends\')">' + esc(tx("amigos_agregar")) + "</button>";
    if (!(typeof isGoogleUser === "function" && isGoogleUser())) return titulo + '<p class="hint">' + esc(tx("amigos_sin_cuenta")) + "</p>" + agregar;
    if (!amigos.lista) return titulo + '<p class="hint">' + esc(tx("amigos_cargando")) + "</p>";
    if (!amigos.lista.length) return titulo + '<p class="hint">' + esc(tx("amigos_sin")) + "</p>" + agregar;
    var orden = amigos.lista.slice().sort(function (a, b) { return (a.fg || 99) - (b.fg || 99) || String(a.name).localeCompare(String(b.name)); });
    return titulo + '<ul class="fg-amigos-lista">' + orden.slice(0, 12).map(function (a) {
      var res = !a.fg ? '<span class="fg-am-res nada">' + esc(tx("amigos_todavia")) + "</span>"
        : a.fg >= 7 ? '<span class="fg-am-res perdio">X/' + INTENTOS + "</span>"
        : '<span class="fg-am-res gano">' + a.fg + "/" + INTENTOS + "</span>";
      var fruta = APP.caraJugador("fg-am-cara", a, a.fg && a.fg < 7 ? "happy" : "neutral");
      return '<li><span class="fg-am-fruta">' + fruta + '</span><span class="fg-am-nombre">' + esc(a.name || "?") + "</span>" + res + "</li>";
    }).join("") + "</ul>";
  }
  function pintarAmigos() {
    var el = document.getElementById("fgAmigos");
    if (el) el.innerHTML = amigosHtml();
    tarjeta();
  }
  // Se pide como mucho cada 5 minutos (o al terminar el Frutigrama, para ver el tuyo junto a los demás).
  function cargarAmigos(suave) {
    if (amigos.cargando || !(typeof isGoogleUser === "function" && isGoogleUser()) || typeof loadFriends !== "function") return;
    if (suave && amigos.dia === dayKey() && Date.now() - amigos.at < 5 * 60 * 1000) return;
    if (APP.sinConexion && APP.sinConexion()) return;
    var F = window.FB;
    if (!F || !F.uid) return;
    amigos.cargando = true;
    loadFriends().then(function (lista) {
      return Promise.all(lista.map(function (a) {
        return F.get(F.ref(F.db, "hoy/" + dayKey() + "/" + a.uid)).then(function (snap) {
          var v = snap.val() || {};
          return Object.assign({}, a, { fg: Number(v.fg) || 0 });
        }).catch(function () { return Object.assign({}, a, { fg: 0 }); });
      }));
    }).then(function (lista) {
      amigos = { lista: lista, dia: dayKey(), at: Date.now(), cargando: false };
      pintarAmigos();
    }).catch(function () { amigos.cargando = false; amigos.at = Date.now(); amigos.dia = dayKey(); if (!amigos.lista) amigos.lista = []; pintarAmigos(); });
  }

  // ---------- Botón en la pantalla de modos (debajo del desafío del día) ----------
  function tarjeta() {
    var b = APP.banner("fgBanner", "fg-banner", function () { appAbrirFrutigrama(); }, "dailyBanner");
    if (!b) return;
    var d = leer(), H = d.hoy, hecho = H.fin, D = delDia();
    // Tres fichas como las del juego: la primera letra destapada y las demás por adivinar.
    var fichas = '<span class="fg-t-fichas" aria-hidden="true"><span class="fg-t-ficha ver">' + (hecho ? esc(D.limpia[0].toUpperCase()) : "?") + '</span><span class="fg-t-ficha' + (hecho ? " ver" : "") + '">' + (hecho ? esc(D.limpia[1].toUpperCase()) : "") +
      '</span><span class="fg-t-ficha' + (hecho ? " ver" : "") + '">' + (hecho ? esc(D.limpia[2].toUpperCase()) : "") + "</span></span>";
    var jugaron = amigos.lista ? amigos.lista.filter(function (a) { return a.fg; }).length : 0;
    var estado = hecho ? (H.gano ? '<span class="fg-t-estrellas">' + advStars(H.estrellas) + "</span>" : esc(tx("perdio", { w: D.palabra })))
      : esc(jugaron ? tx(jugaron === 1 ? "amigos_jugo" : "amigos_jugaron", { n: jugaron }) : tx("sub"));
    if (!hecho) cargarAmigos(true);
    b.classList.toggle("done", hecho);
    b.pintar(fichas, tx("titulo"), estado);
  }
  APP.alPintarInicio(tarjeta);
  tarjeta();
  // /jugar?frutigrama abre directo el acertijo (lo usa la página de inicio del sitio).
  if (/[?&]frutigrama\b/.test(location.search)) setTimeout(function () { appAbrirFrutigrama(); }, 0);
})();
