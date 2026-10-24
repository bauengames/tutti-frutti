/* tutti.frutti · web (igual que en la app) · Frutigrama: el acertijo de cada día (estilo Wordle, pero con categorías).
   Una palabra secreta por día, la misma para todos (en cada idioma, su traducción). Se ve la categoría,
   la primera letra y el largo; hay 6 intentos. Las pistas solo si se piden ("Ver pista", con un video o
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
    ["Fruta", "Mandarina", "Tangerine", "Tangerina", "Parecida a la naranja, más chica y fácil de pelar", "Like an orange, but smaller and easy to peel", "Parecida com a laranja, menor e fácil de descascar"],
    ["Animal", "Jirafa", "Giraffe", "Girafa", "El animal con el cuello más largo", "The animal with the longest neck", "O animal com o pescoço mais comprido"],
    ["País", "Japón", "Japan", "Japão", "El país del sol naciente", "The land of the rising sun", "O país do sol nascente"],
    ["Color", "Violeta", "Violet", "Violeta", "Mezcla de rojo y azul", "A mix of red and blue", "Mistura de vermelho e azul"],
    ["Profesión", "Bombero", "Firefighter", "Bombeiro", "Apaga incendios", "Puts out fires", "Apaga incêndios"],
    ["Deporte", "Natación", "Swimming", "Natação", "Se practica en una pileta", "You do it in a pool", "Se pratica numa piscina"],
    ["Instrumento musical", "Guitarra", "Guitar", "Violão", "Tiene seis cuerdas", "It has six strings", "Tem seis cordas"],
    ["Verdura", "Zanahoria", "Carrot", "Cenoura", "Naranja, larga y les encanta a los conejos", "Orange, long and loved by rabbits", "Laranja, comprida e os coelhos adoram"],
    ["Parte del cuerpo", "Rodilla", "Knee", "Joelho", "Está en el medio de la pierna y se dobla", "It's in the middle of your leg and it bends", "Fica no meio da perna e dobra"],
    ["Bebida", "Limonada", "Lemonade", "Limonada", "Agua, limón y azúcar", "Water, lemon and sugar", "Água, limão e açúcar"],
    ["Ciudad", "Roma", "Rome", "Roma", "La capital de Italia", "The capital of Italy", "A capital da Itália"],
    ["Fruta", "Frutilla", "Strawberry", "Morango", "Roja, con semillitas por fuera", "Red, with tiny seeds on the outside", "Vermelho, com sementinhas por fora"],
    ["Animal", "Pingüino", "Penguin", "Pinguim", "Ave que no vuela y vive en el frío", "A bird that can't fly and lives in the cold", "Ave que não voa e vive no frio"],
    ["País", "Brasil", "Brazil", "Brasil", "El país más grande de Sudamérica", "The biggest country in South America", "O maior país da América do Sul"],
    ["Color", "Amarillo", "Yellow", "Amarelo", "El color del sol y del limón", "The color of the sun and lemons", "A cor do sol e do limão"],
    ["Objeto", "Tijera", "Scissors", "Tesoura", "Sirve para cortar papel", "Used to cut paper", "Serve para cortar papel"],
    ["Profesión", "Dentista", "Dentist", "Dentista", "Te cuida los dientes", "Takes care of your teeth", "Cuida dos seus dentes"],
    ["Instrumento musical", "Batería", "Drums", "Bateria", "Se toca con palillos", "You play it with sticks", "Se toca com baquetas"],
    ["Verdura", "Lechuga", "Lettuce", "Alface", "Hojas verdes de la ensalada", "The green leaves in a salad", "Folhas verdes da salada"],
    ["Parte del cuerpo", "Codo", "Elbow", "Cotovelo", "Con él doblás el brazo", "It lets you bend your arm", "Com ele você dobra o braço"],
    ["Ciudad", "París", "Paris", "Paris", "La ciudad de la Torre Eiffel", "The city of the Eiffel Tower", "A cidade da Torre Eiffel"],
    ["Fruta", "Sandía", "Watermelon", "Melancia", "Verde por fuera, roja por dentro", "Green outside, red inside", "Verde por fora, vermelha por dentro"],
    ["Animal", "Elefante", "Elephant", "Elefante", "Tiene trompa y orejas enormes", "It has a trunk and huge ears", "Tem tromba e orelhas enormes"],
    ["País", "Egipto", "Egypt", "Egito", "El país de las pirámides", "The country of the pyramids", "O país das pirâmides"],
    ["Color", "Marrón", "Brown", "Marrom", "El color del chocolate", "The color of chocolate", "A cor do chocolate"],
    ["Comida", "Pizza", "Pizza", "Pizza", "Masa redonda con salsa y queso", "Round dough with sauce and cheese", "Massa redonda com molho e queijo"],
    ["Objeto", "Reloj", "Clock", "Relógio", "Te dice la hora", "It tells you the time", "Diz a hora"],
    ["Profesión", "Cocinero", "Chef", "Cozinheiro", "Trabaja en la cocina de un restaurante", "Works in a restaurant kitchen", "Trabalha na cozinha de um restaurante"],
    ["Deporte", "Tenis", "Tennis", "Tênis", "Raqueta y pelotita amarilla", "Racket and a little yellow ball", "Raquete e bolinha amarela"],
    ["Instrumento musical", "Piano", "Piano", "Piano", "Teclas blancas y negras", "Black and white keys", "Teclas brancas e pretas"],
    ["Parte del cuerpo", "Ombligo", "Bellybutton", "Umbigo", "Está en el medio de la panza", "It's in the middle of your belly", "Fica no meio da barriga"],
    ["Bebida", "Jugo", "Juice", "Suco", "Se hace exprimiendo frutas", "Made by squeezing fruit", "Feito espremendo frutas"],
    ["Ciudad", "Madrid", "Madrid", "Madri", "La capital de España", "The capital of Spain", "A capital da Espanha"],
    ["Fruta", "Banana", "Banana", "Banana", "Amarilla y curva", "Yellow and curved", "Amarela e curva"],
    ["Animal", "Tortuga", "Turtle", "Tartaruga", "Lleva su casa en la espalda", "It carries its home on its back", "Carrega a casa nas costas"],
    ["País", "México", "Mexico", "México", "El país de los tacos y los mariachis", "The country of tacos and mariachis", "O país dos tacos e dos mariachis"],
    ["Color", "Rosa", "Pink", "Rosa", "Mezcla de rojo y blanco", "A mix of red and white", "Mistura de vermelho e branco"],
    ["Comida", "Hamburguesa", "Hamburger", "Hambúrguer", "Pan, carne y queso", "Bun, meat and cheese", "Pão, carne e queijo"],
    ["Objeto", "Escoba", "Broom", "Vassoura", "Sirve para barrer", "Used for sweeping", "Serve para varrer"],
    ["Profesión", "Piloto", "Pilot", "Piloto", "Maneja aviones", "Flies planes", "Pilota aviões"],
    ["Instrumento musical", "Flauta", "Flute", "Flauta", "Se toca soplando", "You play it by blowing", "Se toca soprando"],
    ["Verdura", "Cebolla", "Onion", "Cebola", "Te hace llorar cuando la cortás", "It makes you cry when you cut it", "Faz você chorar quando corta"],
    ["Parte del cuerpo", "Ceja", "Eyebrow", "Sobrancelha", "Los pelitos arriba de los ojos", "The little hairs above your eyes", "Os pelinhos acima dos olhos"],
    ["Bebida", "Leche", "Milk", "Leite", "Blanca, la da la vaca", "White, it comes from cows", "Branco, vem da vaca"],
    ["Ciudad", "Londres", "London", "Londres", "La capital de Inglaterra", "The capital of England", "A capital da Inglaterra"],
    ["Fruta", "Durazno", "Peach", "Pêssego", "Piel aterciopelada y un carozo grande", "Fuzzy skin and a big pit", "Casca aveludada e um caroço grande"],
    ["Animal", "Delfín", "Dolphin", "Golfinho", "Mamífero del mar, muy inteligente", "A very smart sea mammal", "Mamífero do mar, muito inteligente"],
    ["País", "Canadá", "Canada", "Canadá", "Tiene una hoja de arce en la bandera", "It has a maple leaf on its flag", "Tem uma folha de bordo na bandeira"],
    ["Color", "Dorado", "Golden", "Dourado", "El color del oro", "The color of gold", "A cor do ouro"],
    ["Objeto", "Mochila", "Backpack", "Mochila", "Se lleva en la espalda a la escuela", "You carry it on your back to school", "Se leva nas costas para a escola"],
    ["Profesión", "Cartero", "Mailman", "Carteiro", "Reparte las cartas", "Delivers the mail", "Entrega as cartas"],
    ["Deporte", "Boxeo", "Boxing", "Boxe", "Se pelea con guantes en un ring", "Fighting with gloves in a ring", "Luta com luvas num ringue"],
    ["Instrumento musical", "Violín", "Violin", "Violino", "Se toca con un arco", "You play it with a bow", "Se toca com um arco"],
    ["Verdura", "Papa", "Potato", "Batata", "Con ella se hace el puré", "Used to make mashed potatoes", "Com ela se faz purê"],
    ["Parte del cuerpo", "Hombro", "Shoulder", "Ombro", "Une el brazo con el cuerpo", "Joins your arm to your body", "Liga o braço ao corpo"],
    ["Bebida", "Mate", "Mate", "Chimarrão", "Infusión que se toma con bombilla", "A herbal drink sipped through a metal straw", "Infusão que se toma com bomba"],
    ["Ciudad", "Tokio", "Tokyo", "Tóquio", "La capital de Japón", "The capital of Japan", "A capital do Japão"],
    ["Fruta", "Cereza", "Cherry", "Cereja", "Chiquita, roja y viene de a dos", "Small, red and comes in pairs", "Pequena, vermelha e vem de duas em duas"],
    ["Animal", "Canguro", "Kangaroo", "Canguru", "Salta y lleva a la cría en una bolsa", "It hops and carries its baby in a pouch", "Pula e leva o filhote numa bolsa"],
    ["País", "Italia", "Italy", "Itália", "Tiene forma de bota", "It's shaped like a boot", "Tem forma de bota"],
    ["Color", "Naranja", "Orange", "Laranja", "Mezcla de rojo y amarillo", "A mix of red and yellow", "Mistura de vermelho e amarelo"],
    ["Comida", "Asado", "Barbecue", "Churrasco", "Carne a la parrilla", "Meat cooked on the grill", "Carne na grelha"],
    ["Profesión", "Maestra", "Teacher", "Professora", "Enseña en la escuela", "Teaches at school", "Ensina na escola"],
    ["Deporte", "Ciclismo", "Cycling", "Ciclismo", "Se practica en bicicleta", "You do it on a bike", "Se pratica de bicicleta"],
    ["Instrumento musical", "Trompeta", "Trumpet", "Trompete", "De metal, se sopla y tiene pistones", "Made of metal, you blow it and it has valves", "De metal, se sopra e tem pistões"],
    ["Verdura", "Brócoli", "Broccoli", "Brócolis", "Parece un arbolito verde", "Looks like a little green tree", "Parece uma arvorezinha verde"],
    ["Parte del cuerpo", "Tobillo", "Ankle", "Tornozelo", "Une el pie con la pierna", "Joins your foot to your leg", "Liga o pé à perna"],
    ["Bebida", "Batido", "Smoothie", "Vitamina", "Fruta licuada, a veces con leche", "Blended fruit, sometimes with milk", "Fruta batida, às vezes com leite"],
    ["Ciudad", "Lima", "Lima", "Lima", "La capital de Perú", "The capital of Peru", "A capital do Peru"],
    ["Fruta", "Ananá", "Pineapple", "Abacaxi", "Tiene corona y es muy dulce", "It has a crown and is very sweet", "Tem coroa e é muito doce"],
    ["Animal", "Murciélago", "Bat", "Morcego", "Vuela de noche y duerme colgado", "Flies at night and sleeps upside down", "Voa à noite e dorme de cabeça para baixo"],
    ["País", "Alemania", "Germany", "Alemanha", "Su capital es Berlín", "Its capital is Berlin", "A capital é Berlim"],
    ["Color", "Gris", "Gray", "Cinza", "Mezcla de blanco y negro", "A mix of black and white", "Mistura de branco e preto"],
    ["Comida", "Ensalada", "Salad", "Salada", "Lechuga, tomate y algo más", "Lettuce, tomato and something else", "Alface, tomate e mais alguma coisa"],
    ["Objeto", "Almohada", "Pillow", "Travesseiro", "Ahí apoyás la cabeza para dormir", "You rest your head on it to sleep", "Onde você apoia a cabeça para dormir"],
    ["Deporte", "Vóley", "Volleyball", "Vôlei", "Se pasa la pelota por arriba de una red", "You hit the ball over a net", "Passa-se a bola por cima de uma rede"],
    ["Instrumento musical", "Arpa", "Harp", "Harpa", "Muchas cuerdas en un marco grande", "Lots of strings on a big frame", "Muitas cordas numa moldura grande"],
    ["Verdura", "Pepino", "Cucumber", "Pepino", "Verde, largo y fresco", "Green, long and fresh", "Verde, comprido e fresco"],
    ["Ciudad", "Moscú", "Moscow", "Moscou", "La capital de Rusia", "The capital of Russia", "A capital da Rússia"],
    ["Fruta", "Kiwi", "Kiwi", "Kiwi", "Marrón y peludo por fuera, verde por dentro", "Brown and fuzzy outside, green inside", "Marrom e peludo por fora, verde por dentro"],
    ["Animal", "Pulpo", "Octopus", "Polvo", "Tiene ocho brazos", "It has eight arms", "Tem oito braços"],
    ["País", "Australia", "Australia", "Austrália", "El país de los canguros", "The land of kangaroos", "O país dos cangurus"],
    ["Insecto", "Mariposa", "Butterfly", "Borboleta", "Antes de volar fue oruga", "It was a caterpillar before it could fly", "Antes de voar foi lagarta"],
    ["Ave", "Loro", "Parrot", "Papagaio", "Puede imitar palabras", "It can copy words", "Consegue imitar palavras"],
    ["Mueble", "Sillón", "Sofa", "Sofá", "Ahí se sientan varios a ver la tele", "Several people sit on it to watch TV", "Onde várias pessoas sentam para ver TV"],
    ["Herramienta", "Martillo", "Hammer", "Martelo", "Sirve para clavar clavos", "Used to drive in nails", "Serve para pregar pregos"],
    ["Medio de transporte", "Avión", "Airplane", "Avião", "Vuela lleno de pasajeros", "It flies full of passengers", "Voa cheio de passageiros"],
    ["Prenda de ropa", "Bufanda", "Scarf", "Cachecol", "Te abriga el cuello", "Keeps your neck warm", "Esquenta o pescoço"],
    ["Electrodoméstico", "Heladera", "Fridge", "Geladeira", "Mantiene fría la comida", "Keeps food cold", "Mantém a comida gelada"],
    ["Postre", "Flan", "Custard", "Pudim", "Con caramelo, tiembla en el plato", "Wobbly, often with caramel on top", "Com calda de caramelo, treme no prato"],
    ["Fruta", "Manzana", "Apple", "Maçã", "Roja o verde, y la mordió Blancanieves", "Red or green, Snow White took a bite", "Vermelha ou verde, a Branca de Neve mordeu"],
    ["Animal", "Cocodrilo", "Crocodile", "Crocodilo", "Reptil enorme con muchos dientes", "A huge reptile with lots of teeth", "Réptil enorme com muitos dentes"],
    ["Objeto", "Paraguas", "Umbrella", "Sombrinha", "Te protege de la lluvia", "Keeps you dry in the rain", "Protege da chuva"],
    ["Insecto", "Hormiga", "Ant", "Formiga", "Chiquita, trabajadora y vive en un hormiguero", "Tiny, hard-working and lives in a colony", "Pequena, trabalhadora e vive num formigueiro"],
    ["Medio de transporte", "Bicicleta", "Bicycle", "Bicicleta", "Dos ruedas y pedales", "Two wheels and pedals", "Duas rodas e pedais"],
    ["Herramienta", "Serrucho", "Saw", "Serrote", "Sirve para cortar madera", "Used to cut wood", "Serve para cortar madeira"],
    ["Prenda de ropa", "Campera", "Jacket", "Jaqueta", "Abrigo con cierre o botones", "A coat with a zipper or buttons", "Agasalho com zíper ou botões"],
    ["Ave", "Colibrí", "Hummingbird", "Colibri", "El pájaro más chiquito, aletea rapidísimo", "The tiniest bird, it flaps super fast", "O menor pássaro, bate as asas rapidíssimo"],
    // ---- Palabras nuevas (14/10/2026): van después de las 98 primeras, así no cambia ningún día ya jugado. ----
    ["Fruta", "Pera", "Pear", "Pera", "Verde o amarilla, con forma de gota", "Green or yellow, shaped like a drop", "Verde ou amarela, com formato de gota"],
    ["Fruta", "Uva", "Grape", "Uva", "Viene en racimos y con ella se hace vino", "Comes in bunches and is used to make wine", "Vem em cachos e com ela se faz vinho"],
    ["Fruta", "Limón", "Lemon", "Limão", "Amarillo y muy ácido", "Yellow and very sour", "Azedo e muito usado em sucos"],
    ["Fruta", "Mango", "Mango", "Manga", "Tropical, con un carozo grande y plano", "Tropical, with a big flat pit", "Tropical, com um caroço grande e achatado"],
    ["Fruta", "Coco", "Coconut", "Coco", "Peludo por fuera, con agua por dentro", "Hairy outside, with water inside", "Peludo por fora, com água por dentro"],
    ["Fruta", "Ciruela", "Plum", "Ameixa", "Violeta, chica, y seca se vuelve pasa", "Purple and small; dried, it becomes a prune", "Roxa e pequena; seca, vira passa"],
    ["Fruta", "Melón", "Melon", "Melão", "Grande, redondo y de pulpa dulce", "Big, round and sweet inside", "Grande, redondo e de polpa doce"],
    ["Fruta", "Higo", "Fig", "Figo", "Fruta morada llena de semillitas por dentro", "Purple fruit full of tiny seeds inside", "Fruta roxa cheia de sementinhas por dentro"],
    ["Fruta", "Frambuesa", "Raspberry", "Framboesa", "Roja, chiquita y hueca por dentro", "Small, red and hollow inside", "Vermelha, pequena e oca por dentro"],
    ["Fruta", "Granada", "Pomegranate", "Romã", "Por dentro tiene cientos de granitos rojos", "Inside it has hundreds of red seeds", "Por dentro tem centenas de grãozinhos vermelhos"],
    ["Fruta", "Arándano", "Blueberry", "Mirtilo", "Bolita azul oscura, muy chiquita", "A tiny dark blue berry", "Bolinha azul-escura, bem pequena"],
    ["Fruta", "Papaya", "Papaya", "Mamão", "Tropical, naranja por dentro con semillas negras", "Tropical, orange inside with black seeds", "Tropical, laranja por dentro com sementes pretas"],
    ["Fruta", "Guayaba", "Guava", "Goiaba", "Tropical, rosada por dentro, ideal para dulces", "Tropical, pink inside, great for jams", "Tropical, rosada por dentro, ótima para doces"],
    ["Fruta", "Mora", "Blackberry", "Amora", "Negra, crece en arbustos con espinas", "Black, grows on thorny bushes", "Preta, cresce em arbustos com espinhos"],
    ["Fruta", "Dátil", "Date", "Tâmara", "Fruta de la palmera, muy dulce", "The very sweet fruit of a palm tree", "Fruta da palmeira, muito doce"],
    ["Fruta", "Membrillo", "Quince", "Marmelo", "Con ella se hace un dulce para comer con queso", "Used to make a paste eaten with cheese", "Com ela se faz um doce para comer com queijo"],
    ["Animal", "León", "Lion", "Leão", "El rey de la selva", "The king of the jungle", "O rei da selva"],
    ["Animal", "Tigre", "Tiger", "Tigre", "Felino naranja con rayas negras", "Orange cat with black stripes", "Felino laranja com listras pretas"],
    ["Animal", "Cebra", "Zebra", "Zebra", "Caballo con rayas blancas y negras", "A horse with black and white stripes", "Cavalo com listras brancas e pretas"],
    ["Animal", "Caballo", "Horse", "Cavalo", "Se lo monta y relincha", "You ride it and it neighs", "Você monta nele e ele relincha"],
    ["Animal", "Conejo", "Rabbit", "Coelho", "Orejas largas y le encanta la zanahoria", "Long ears and loves carrots", "Orelhas compridas e adora cenoura"],
    ["Animal", "Ballena", "Whale", "Baleia", "El animal más grande del mar", "The biggest animal in the sea", "O maior animal do mar"],
    ["Animal", "Tiburón", "Shark", "Tubarão", "Pez con muchos dientes y una aleta en la espalda", "A fish with lots of teeth and a fin on its back", "Peixe com muitos dentes e uma barbatana nas costas"],
    ["Animal", "Oso", "Bear", "Urso", "Grande, peludo y le gusta la miel", "Big, furry and loves honey", "Grande, peludo e gosta de mel"],
    ["Animal", "Lobo", "Wolf", "Lobo", "Le aúlla a la luna", "Howls at the moon", "Uiva para a lua"],
    ["Animal", "Zorro", "Fox", "Raposa", "Astuto, de cola esponjosa", "Clever, with a fluffy tail", "Esperta, de rabo felpudo"],
    ["Animal", "Mono", "Monkey", "Macaco", "Salta de árbol en árbol y come bananas", "Swings from tree to tree and eats bananas", "Pula de árvore em árvore e come banana"],
    ["Animal", "Camello", "Camel", "Camelo", "Vive en el desierto y tiene jorobas", "Lives in the desert and has humps", "Vive no deserto e tem corcovas"],
    ["Animal", "Ardilla", "Squirrel", "Esquilo", "Junta nueces y vive en los árboles", "Collects nuts and lives in trees", "Junta nozes e vive nas árvores"],
    ["Animal", "Gallina", "Hen", "Galinha", "Pone huevos y cacarea", "Lays eggs and clucks", "Bota ovos e cacareja"],
    ["Animal", "Vaca", "Cow", "Vaca", "Nos da la leche", "Gives us milk", "Nos dá o leite"],
    ["Animal", "Cerdo", "Pig", "Porco", "Rosado, con cola enrulada", "Pink, with a curly tail", "Rosado, com rabo enrolado"],
    ["Animal", "Oveja", "Sheep", "Ovelha", "De su lana se hacen abrigos", "Its wool is used to make sweaters", "Da sua lã se fazem agasalhos"],
    ["Animal", "Burro", "Donkey", "Burro", "Parecido al caballo, de orejas largas", "Like a horse, with long ears", "Parecido com o cavalo, de orelhas compridas"],
    ["Animal", "Rana", "Frog", "Sapo", "Verde, salta y croa", "Green, jumps and croaks", "Verde, pula e coaxa"],
    ["Animal", "Serpiente", "Snake", "Cobra", "No tiene patas y se arrastra", "Has no legs and slithers", "Não tem patas e se arrasta"],
    ["Animal", "Hipopótamo", "Hippo", "Hipopótamo", "Enorme, vive en los ríos de África", "Huge, lives in African rivers", "Enorme, vive nos rios da África"],
    ["Animal", "Rinoceronte", "Rhino", "Rinoceronte", "Tiene un cuerno en la nariz", "Has a horn on its nose", "Tem um chifre no nariz"],
    ["Animal", "Koala", "Koala", "Coala", "Abraza árboles en Australia", "Hugs trees in Australia", "Abraça árvores na Austrália"],
    ["Animal", "Panda", "Panda", "Panda", "Oso blanco y negro que come bambú", "Black and white bear that eats bamboo", "Urso branco e preto que come bambu"],
    ["Animal", "Foca", "Seal", "Foca", "Vive en el hielo y aplaude con las aletas", "Lives on the ice and claps with its flippers", "Vive no gelo e bate palmas com as nadadeiras"],
    ["Animal", "Medusa", "Jellyfish", "Medusa", "Transparente, flota en el mar y pica", "Transparent, floats in the sea and stings", "Transparente, flutua no mar e queima"],
    ["Animal", "Caracol", "Snail", "Caracol", "Lento, lleva su casa en la espalda", "Slow, carries its shell on its back", "Lento, leva a casinha nas costas"],
    ["Animal", "Ratón", "Mouse", "Rato", "Chiquito, le encanta el queso", "Tiny and loves cheese", "Pequenino, adora queijo"],
    ["Animal", "Gato", "Cat", "Gato", "Maúlla y ronronea", "Meows and purrs", "Mia e ronrona"],
    ["Animal", "Perro", "Dog", "Cachorro", "El mejor amigo del hombre", "Man's best friend", "O melhor amigo do homem"],
    ["Animal", "Pato", "Duck", "Pato", "Nada en la laguna y hace cuac", "Swims in the pond and quacks", "Nada na lagoa e faz quá-quá"],
    ["Animal", "Mapache", "Raccoon", "Guaxinim", "Tiene antifaz y revuelve la basura", "Wears a mask and digs through trash", "Tem máscara e revira o lixo"],
    ["Ave", "Águila", "Eagle", "Águia", "Ave de presa que vuela muy alto", "A bird of prey that flies very high", "Ave de rapina que voa bem alto"],
    ["Ave", "Búho", "Owl", "Coruja", "Sale de noche y gira la cabeza", "Comes out at night and turns its head around", "Sai à noite e gira a cabeça"],
    ["Ave", "Paloma", "Pigeon", "Pombo", "Está en todas las plazas", "Found in every city square", "Está em todas as praças"],
    ["Ave", "Gaviota", "Seagull", "Gaivota", "Vuela sobre el mar y la playa", "Flies over the sea and the beach", "Voa sobre o mar e a praia"],
    ["Ave", "Flamenco", "Flamingo", "Flamingo", "Rosado y se para en una pata", "Pink and stands on one leg", "Rosado e fica numa perna só"],
    ["Ave", "Avestruz", "Ostrich", "Avestruz", "El ave más grande, no vuela pero corre", "The biggest bird; it can't fly but it runs", "A maior ave; não voa, mas corre"],
    ["Ave", "Cisne", "Swan", "Cisne", "Blanco y elegante, nada en los lagos", "White and elegant, swims in lakes", "Branco e elegante, nada nos lagos"],
    ["Ave", "Tucán", "Toucan", "Tucano", "Tiene un pico enorme y colorido", "Has a huge colorful beak", "Tem um bico enorme e colorido"],
    ["Ave", "Cuervo", "Crow", "Corvo", "Negro, muy inteligente", "Black and very smart", "Preto e muito inteligente"],
    ["Ave", "Halcón", "Falcon", "Falcão", "El ave más rápida en picada", "The fastest bird when diving", "A ave mais rápida no mergulho"],
    ["Ave", "Gorrión", "Sparrow", "Pardal", "Pajarito marrón de la ciudad", "A little brown city bird", "Passarinho marrom da cidade"],
    ["Ave", "Cigüeña", "Stork", "Cegonha", "Dicen que trae a los bebés", "They say it brings the babies", "Dizem que traz os bebês"],
    ["Ave", "Pelícano", "Pelican", "Pelicano", "Guarda los peces en una bolsa del pico", "Keeps fish in a pouch in its beak", "Guarda os peixes numa bolsa do bico"],
    ["Ave", "Canario", "Canary", "Canário", "Amarillo y canta muy lindo", "Yellow and sings beautifully", "Amarelo e canta muito bonito"],
    ["Ave", "Golondrina", "Swallow", "Andorinha", "Viaja lejos cuando llega el frío", "Flies far away when the cold comes", "Viaja para longe quando chega o frio"],
    ["Insecto", "Abeja", "Bee", "Abelha", "Hace miel y zumba", "Makes honey and buzzes", "Faz mel e zumbe"],
    ["Insecto", "Mosca", "Fly", "Mosca", "Molesta zumbando alrededor de la comida", "Buzzes annoyingly around food", "Incomoda zumbindo em volta da comida"],
    ["Insecto", "Mosquito", "Mosquito", "Mosquito", "Pica de noche y deja ronchas", "Bites at night and leaves itchy bumps", "Pica à noite e deixa coceira"],
    ["Insecto", "Grillo", "Cricket", "Grilo", "Canta de noche frotando las patas", "Chirps at night by rubbing its legs", "Canta à noite esfregando as patas"],
    ["Insecto", "Libélula", "Dragonfly", "Libélula", "Cuatro alas transparentes, vuela sobre el agua", "Four clear wings, flies over water", "Quatro asas transparentes, voa sobre a água"],
    ["Insecto", "Escarabajo", "Beetle", "Besouro", "Tiene un caparazón duro y brillante", "Has a hard, shiny shell", "Tem uma carapaça dura e brilhante"],
    ["Insecto", "Cucaracha", "Cockroach", "Barata", "Corre rápido y a casi todos les da asco", "Runs fast and grosses out almost everyone", "Corre rápido e quase todo mundo tem nojo"],
    ["Insecto", "Avispa", "Wasp", "Vespa", "Parecida a la abeja, pero pica más", "Like a bee, but stings more", "Parecida com a abelha, mas pica mais"],
    ["Insecto", "Saltamontes", "Grasshopper", "Gafanhoto", "Verde y da saltos enormes", "Green and makes huge jumps", "Verde e dá saltos enormes"],
    ["Insecto", "Luciérnaga", "Firefly", "Pirilampo", "Brilla de noche", "Glows at night", "Brilha à noite"],
    ["País", "Francia", "France", "França", "El país de la Torre Eiffel", "The country of the Eiffel Tower", "O país da Torre Eiffel"],
    ["País", "España", "Spain", "Espanha", "El país del flamenco y la paella", "The country of flamenco and paella", "O país do flamenco e da paella"],
    ["País", "Chile", "Chile", "Chile", "Largo y angosto, junto a la cordillera", "Long and narrow, along the Andes", "Comprido e estreito, junto à cordilheira"],
    ["País", "Perú", "Peru", "Peru", "El país de Machu Picchu", "The country of Machu Picchu", "O país de Machu Picchu"],
    ["País", "Uruguay", "Uruguay", "Uruguai", "Su capital es Montevideo", "Its capital is Montevideo", "Sua capital é Montevidéu"],
    ["País", "Colombia", "Colombia", "Colômbia", "Famoso por su café", "Famous for its coffee", "Famoso pelo seu café"],
    ["País", "Argentina", "Argentina", "Argentina", "El país del tango y del mate", "The land of tango and mate", "O país do tango e do chimarrão"],
    ["País", "China", "China", "China", "El país de la Gran Muralla", "The country of the Great Wall", "O país da Grande Muralha"],
    ["País", "India", "India", "Índia", "El país del Taj Mahal", "The country of the Taj Mahal", "O país do Taj Mahal"],
    ["País", "Rusia", "Russia", "Rússia", "El país más grande del mundo", "The largest country in the world", "O maior país do mundo"],
    ["País", "Grecia", "Greece", "Grécia", "Allí nacieron los Juegos Olímpicos", "Where the Olympic Games were born", "Onde nasceram os Jogos Olímpicos"],
    ["País", "Portugal", "Portugal", "Portugal", "Su capital es Lisboa", "Its capital is Lisbon", "Sua capital é Lisboa"],
    ["País", "Noruega", "Norway", "Noruega", "Tierra de fiordos y vikingos", "Land of fjords and Vikings", "Terra de fiordes e vikings"],
    ["País", "Suecia", "Sweden", "Suécia", "Su capital es Estocolmo", "Its capital is Stockholm", "Sua capital é Estocolmo"],
    ["País", "Marruecos", "Morocco", "Marrocos", "País africano frente a España", "An African country across from Spain", "País africano em frente à Espanha"],
    ["País", "Turquía", "Turkey", "Turquia", "Está entre Europa y Asia", "Lies between Europe and Asia", "Fica entre a Europa e a Ásia"],
    ["País", "Cuba", "Cuba", "Cuba", "Isla del Caribe, su capital es La Habana", "Caribbean island; its capital is Havana", "Ilha do Caribe; a capital é Havana"],
    ["País", "Venezuela", "Venezuela", "Venezuela", "Ahí está el Salto Ángel", "Home of Angel Falls", "Lá fica o Salto Ángel"],
    ["País", "Ecuador", "Ecuador", "Equador", "Lo cruza la línea que divide el mundo en dos", "Crossed by the line that splits the world in two", "Cruzado pela linha que divide o mundo em dois"],
    ["País", "Paraguay", "Paraguay", "Paraguai", "Su capital es Asunción", "Its capital is Asunción", "Sua capital é Assunção"],
    ["País", "Bolivia", "Bolivia", "Bolívia", "Tiene el salar más grande del mundo", "Has the largest salt flat in the world", "Tem o maior deserto de sal do mundo"],
    ["País", "Irlanda", "Ireland", "Irlanda", "La isla verde del trébol", "The green island of the shamrock", "A ilha verde do trevo"],
    ["País", "Suiza", "Switzerland", "Suíça", "Famosa por sus relojes y chocolates", "Famous for its watches and chocolate", "Famosa pelos relógios e chocolates"],
    ["País", "Kenia", "Kenya", "Quênia", "País africano de safaris", "An African country of safaris", "País africano dos safáris"],
    ["País", "Corea", "Korea", "Coreia", "País asiático del kimchi", "The Asian country of kimchi", "País asiático do kimchi"],
    ["País", "Vietnam", "Vietnam", "Vietnã", "País asiático famoso por su sopa pho", "An Asian country famous for pho", "País asiático famoso pela sopa pho"],
    ["Ciudad", "Barcelona", "Barcelona", "Barcelona", "Ciudad de la Sagrada Familia", "City of the Sagrada Família", "Cidade da Sagrada Família"],
    ["Ciudad", "Berlín", "Berlin", "Berlim", "La capital de Alemania", "The capital of Germany", "A capital da Alemanha"],
    ["Ciudad", "Lisboa", "Lisbon", "Lisboa", "La capital de Portugal", "The capital of Portugal", "A capital de Portugal"],
    ["Ciudad", "Atenas", "Athens", "Atenas", "La capital de Grecia", "The capital of Greece", "A capital da Grécia"],
    ["Ciudad", "Venecia", "Venice", "Veneza", "Ciudad con canales en vez de calles", "A city with canals instead of streets", "Cidade com canais em vez de ruas"],
    ["Ciudad", "Dubái", "Dubai", "Dubai", "Tiene el edificio más alto del mundo", "Has the tallest building in the world", "Tem o prédio mais alto do mundo"],
    ["Ciudad", "Sídney", "Sydney", "Sydney", "Ciudad australiana de la famosa ópera", "Australian city with the famous opera house", "Cidade australiana da famosa ópera"],
    ["Ciudad", "Bogotá", "Bogota", "Bogotá", "La capital de Colombia", "The capital of Colombia", "A capital da Colômbia"],
    ["Ciudad", "Santiago", "Santiago", "Santiago", "La capital de Chile", "The capital of Chile", "A capital do Chile"],
    ["Ciudad", "Montevideo", "Montevideo", "Montevidéu", "La capital de Uruguay", "The capital of Uruguay", "A capital do Uruguai"],
    ["Ciudad", "Caracas", "Caracas", "Caracas", "La capital de Venezuela", "The capital of Venezuela", "A capital da Venezuela"],
    ["Ciudad", "Quito", "Quito", "Quito", "La capital de Ecuador", "The capital of Ecuador", "A capital do Equador"],
    ["Ciudad", "Cancún", "Cancun", "Cancún", "Playas del Caribe mexicano", "Beaches of the Mexican Caribbean", "Praias do Caribe mexicano"],
    ["Ciudad", "Toronto", "Toronto", "Toronto", "La ciudad más grande de Canadá", "The biggest city in Canada", "A maior cidade do Canadá"],
    ["Ciudad", "Chicago", "Chicago", "Chicago", "Ciudad de Estados Unidos junto a un gran lago", "A US city on a great lake", "Cidade dos Estados Unidos junto a um grande lago"],
    ["Ciudad", "Miami", "Miami", "Miami", "Ciudad de playas en Florida", "A beach city in Florida", "Cidade de praias na Flórida"],
    ["Ciudad", "Pekín", "Beijing", "Pequim", "La capital de China", "The capital of China", "A capital da China"],
    ["Ciudad", "Viena", "Vienna", "Viena", "La capital de Austria", "The capital of Austria", "A capital da Áustria"],
    ["Ciudad", "Praga", "Prague", "Praga", "La capital de la República Checa", "The capital of the Czech Republic", "A capital da República Tcheca"],
    ["Ciudad", "Ámsterdam", "Amsterdam", "Amsterdã", "Ciudad de canales y bicicletas", "A city of canals and bicycles", "Cidade de canais e bicicletas"],
    ["Ciudad", "Florencia", "Florence", "Florença", "Ciudad italiana del Renacimiento", "The Italian city of the Renaissance", "Cidade italiana do Renascimento"],
    ["Ciudad", "Sevilla", "Seville", "Sevilha", "Ciudad española del flamenco", "The Spanish city of flamenco", "Cidade espanhola do flamenco"],
    ["Color", "Rojo", "Red", "Vermelho", "El color de la frutilla y del fuego", "The color of strawberries and fire", "A cor do morango e do fogo"],
    ["Color", "Azul", "Blue", "Azul", "El color del cielo y del mar", "The color of the sky and the sea", "A cor do céu e do mar"],
    ["Color", "Verde", "Green", "Verde", "El color de las hojas de los árboles", "The color of grass", "A cor da grama"],
    ["Color", "Negro", "Black", "Preto", "El color de la noche", "The color of the night", "A cor da noite"],
    ["Color", "Blanco", "White", "Branco", "El color de la nieve", "The color of snow", "A cor da neve"],
    ["Color", "Plateado", "Silver", "Prateado", "El color de la plata", "The color of silver", "A cor da prata"],
    ["Color", "Turquesa", "Turquoise", "Turquesa", "Entre azul y verde, como el mar del Caribe", "Between blue and green, like the Caribbean", "Entre azul e verde, como o mar do Caribe"],
    ["Color", "Lila", "Lilac", "Lilás", "Violeta clarito", "A light purple", "Roxo clarinho"],
    ["Color", "Beige", "Beige", "Bege", "Color arena, muy claro", "A very light sand color", "Cor de areia, bem clara"],
    ["Color", "Fucsia", "Fuchsia", "Fúcsia", "Rosa muy fuerte", "A very bright pink", "Rosa bem forte"],
    ["Color", "Morado", "Purple", "Roxo", "El color de la berenjena", "The color of an eggplant", "A cor da berinjela"],
    ["Color", "Coral", "Coral", "Coral", "Entre rosa y naranja", "Between pink and orange", "Entre rosa e laranja"],
    ["Color", "Ocre", "Ochre", "Ocre", "Amarillo tierra", "An earthy yellow", "Amarelo terroso"],
    ["Profesión", "Médico", "Doctor", "Médico", "Te cura cuando estás enfermo", "Treats you when you're sick", "Cuida de você quando está doente"],
    ["Profesión", "Enfermera", "Nurse", "Enfermeira", "Cuida a los pacientes en el hospital", "Takes care of patients in the hospital", "Cuida dos pacientes no hospital"],
    ["Profesión", "Abogado", "Lawyer", "Advogado", "Te defiende en un juicio", "Defends you in court", "Defende você num julgamento"],
    ["Profesión", "Carpintero", "Carpenter", "Carpinteiro", "Hace muebles de madera", "Makes wooden furniture", "Faz móveis de madeira"],
    ["Profesión", "Panadero", "Baker", "Padeiro", "Hornea el pan de cada día", "Bakes the daily bread", "Assa o pão de cada dia"],
    ["Profesión", "Pintor", "Painter", "Pintor", "Trabaja con pinceles y colores", "Works with brushes and colors", "Trabalha com pincéis e cores"],
    ["Profesión", "Veterinario", "Vet", "Veterinário", "El médico de los animales", "The doctor for animals", "O médico dos animais"],
    ["Profesión", "Arquitecto", "Architect", "Arquiteto", "Diseña casas y edificios", "Designs houses and buildings", "Projeta casas e prédios"],
    ["Profesión", "Astronauta", "Astronaut", "Astronauta", "Viaja al espacio", "Travels to space", "Viaja para o espaço"],
    ["Profesión", "Granjero", "Farmer", "Fazendeiro", "Trabaja en el campo con animales", "Works on a farm with animals", "Trabalha no campo com animais"],
    ["Profesión", "Peluquero", "Hairdresser", "Cabeleireiro", "Te corta el pelo", "Cuts your hair", "Corta o seu cabelo"],
    ["Profesión", "Mecánico", "Mechanic", "Mecânico", "Arregla autos", "Fixes cars", "Conserta carros"],
    ["Profesión", "Fotógrafo", "Photographer", "Fotógrafo", "Saca fotos", "Takes pictures", "Tira fotos"],
    ["Profesión", "Periodista", "Journalist", "Jornalista", "Escribe las noticias", "Writes the news", "Escreve as notícias"],
    ["Profesión", "Cantante", "Singer", "Cantor", "Vive de su voz", "Makes a living with their voice", "Vive da própria voz"],
    ["Profesión", "Actor", "Actor", "Ator", "Trabaja en películas y obras de teatro", "Works in movies and plays", "Trabalha em filmes e peças de teatro"],
    ["Profesión", "Electricista", "Electrician", "Eletricista", "Arregla los cables y los enchufes", "Fixes wires and outlets", "Conserta fios e tomadas"],
    ["Profesión", "Jardinero", "Gardener", "Jardineiro", "Cuida las plantas y el césped", "Takes care of plants and the lawn", "Cuida das plantas e da grama"],
    ["Profesión", "Carnicero", "Butcher", "Açougueiro", "Vende y corta la carne", "Sells and cuts meat", "Vende e corta a carne"],
    ["Profesión", "Científico", "Scientist", "Cientista", "Hace experimentos en un laboratorio", "Does experiments in a lab", "Faz experimentos num laboratório"],
    ["Deporte", "Fútbol", "Soccer", "Futebol", "Once contra once y una pelota", "Eleven against eleven and one ball", "Onze contra onze e uma bola"],
    ["Deporte", "Golf", "Golf", "Golfe", "Hoyos, palos y una pelotita blanca", "Holes, clubs and a little white ball", "Buracos, tacos e uma bolinha branca"],
    ["Deporte", "Rugby", "Rugby", "Rúgbi", "Pelota ovalada y muchos tackles", "An oval ball and lots of tackles", "Bola oval e muitos tackles"],
    ["Deporte", "Hockey", "Hockey", "Hóquei", "Se juega con palo y una bola o un disco", "Played with a stick and a ball or puck", "Se joga com taco e bola ou disco"],
    ["Deporte", "Esquí", "Skiing", "Esqui", "Deslizarse por la nieve", "Sliding down the snow", "Deslizar pela neve"],
    ["Deporte", "Surf", "Surfing", "Surfe", "Se practica sobre las olas", "Done on the waves", "Se pratica sobre as ondas"],
    ["Deporte", "Karate", "Karate", "Caratê", "Arte marcial japonesa con cinturones", "A Japanese martial art with belts", "Arte marcial japonesa com faixas"],
    ["Deporte", "Judo", "Judo", "Judô", "Arte marcial de agarres y caídas", "A martial art of grips and throws", "Arte marcial de agarrões e quedas"],
    ["Deporte", "Remo", "Rowing", "Remo", "Se practica en un bote", "Done in a boat", "Se pratica num barco"],
    ["Deporte", "Atletismo", "Athletics", "Atletismo", "Carreras, saltos y lanzamientos", "Running, jumping and throwing", "Corridas, saltos e arremessos"],
    ["Deporte", "Esgrima", "Fencing", "Esgrima", "Duelo con espadas", "Dueling with swords", "Duelo com espadas"],
    ["Deporte", "Ajedrez", "Chess", "Xadrez", "Reyes, reinas y caballos en un tablero", "Kings, queens and knights on a board", "Reis, rainhas e cavalos num tabuleiro"],
    ["Deporte", "Polo", "Polo", "Polo", "Se juega a caballo con tacos", "Played on horseback with mallets", "Se joga a cavalo com tacos"],
    ["Deporte", "Béisbol", "Baseball", "Beisebol", "Bate, guante y carreras", "A bat, a glove and runs", "Taco, luva e corridas"],
    ["Deporte", "Patinaje", "Skating", "Patinação", "Deslizarse con patines", "Gliding on skates", "Deslizar de patins"],
    ["Deporte", "Gimnasia", "Gymnastics", "Ginástica", "Saltos y piruetas en colchonetas", "Flips and spins on mats", "Saltos e piruetas em colchonetes"],
    ["Deporte", "Escalada", "Climbing", "Escalada", "Subir paredes de roca", "Going up rock walls", "Subir paredes de pedra"],
    ["Deporte", "Handball", "Handball", "Handebol", "Se juega con las manos y un arco", "Played with your hands and a goal", "Se joga com as mãos e um gol"],
    ["Deporte", "Maratón", "Marathon", "Maratona", "Una carrera de 42 kilómetros", "A 42-kilometer race", "Uma corrida de 42 quilômetros"],
    ["Instrumento musical", "Saxofón", "Saxophone", "Saxofone", "De metal, se sopla y suena en el jazz", "Brass, you blow it, it sounds in jazz", "De metal, se sopra e soa no jazz"],
    ["Instrumento musical", "Tambor", "Drum", "Tambor", "Se toca con las manos o con palillos", "Played with your hands or sticks", "Se toca com as mãos ou com baquetas"],
    ["Instrumento musical", "Acordeón", "Accordion", "Acordeão", "Se estira y se aprieta, con teclas", "You stretch and squeeze it, and it has keys", "Se estica e se aperta, com teclas"],
    ["Instrumento musical", "Ukelele", "Ukulele", "Ukulele", "Guitarrita de cuatro cuerdas", "A small four-string guitar", "Violãozinho de quatro cordas"],
    ["Instrumento musical", "Clarinete", "Clarinet", "Clarinete", "De madera, negro, se sopla", "Wooden, black, you blow it", "De madeira, preto, se sopra"],
    ["Instrumento musical", "Violonchelo", "Cello", "Violoncelo", "Como un violín grande que se toca sentado", "Like a big violin played sitting down", "Como um violino grande tocado sentado"],
    ["Instrumento musical", "Bajo", "Bass", "Baixo", "Guitarra de sonido grave", "A guitar with a deep sound", "Guitarra de som grave"],
    ["Instrumento musical", "Órgano", "Organ", "Órgão", "Está en las iglesias, con tubos enormes", "Found in churches, with huge pipes", "Fica nas igrejas, com tubos enormes"],
    ["Instrumento musical", "Banjo", "Banjo", "Banjo", "Cuerdas sobre un parche redondo", "Strings over a round drumhead", "Cordas sobre uma pele redonda"],
    ["Instrumento musical", "Armónica", "Harmonica", "Gaita", "Chiquita, se sopla moviéndola por la boca", "Small, you blow it moving it along your lips", "Pequena, se sopra deslizando pela boca"],
    ["Instrumento musical", "Xilófono", "Xylophone", "Xilofone", "Barritas de colores que se golpean", "Colored bars you hit", "Barrinhas coloridas que se batem"],
    ["Instrumento musical", "Maracas", "Maracas", "Maracas", "Se sacuden y suenan", "You shake them and they rattle", "Se sacodem e fazem barulho"],
    ["Instrumento musical", "Trombón", "Trombone", "Trombone", "De metal, con una vara que se estira", "Brass, with a slide you push and pull", "De metal, com uma vara que se estica"],
    ["Instrumento musical", "Bandoneón", "Bandoneon", "Bandoneon", "El fuelle del tango", "The bellows of tango", "O fole do tango"],
    ["Verdura", "Tomate", "Tomato", "Tomate", "Rojo, va en la ensalada y en la salsa", "Red, goes in salads and sauces", "Vermelho, vai na salada e no molho"],
    ["Verdura", "Ajo", "Garlic", "Alho", "Tiene dientes y mucho olor", "Has cloves and a strong smell", "Tem dentes e cheiro forte"],
    ["Verdura", "Espinaca", "Spinach", "Espinafre", "Hojas verdes que le daban fuerza a Popeye", "Green leaves that made Popeye strong", "Folhas verdes que davam força ao Popeye"],
    ["Verdura", "Calabaza", "Pumpkin", "Abóbora", "Naranja y grande, se usa en Halloween", "Orange and big, used at Halloween", "Laranja e grande, usada no Halloween"],
    ["Verdura", "Berenjena", "Eggplant", "Berinjela", "Violeta oscura y brillante", "Dark purple and shiny", "Roxa escura e brilhante"],
    ["Verdura", "Apio", "Celery", "Aipo", "Tallos verdes y crujientes", "Crunchy green stalks", "Talos verdes e crocantes"],
    ["Verdura", "Rábano", "Radish", "Rabanete", "Chiquito, rojo y picante", "Small, red and peppery", "Pequeno, vermelho e picante"],
    ["Verdura", "Espárrago", "Asparagus", "Aspargo", "Tallo verde y finito", "A thin green stalk", "Talo verde e fininho"],
    ["Verdura", "Acelga", "Chard", "Acelga", "Hojas grandes con tallo blanco", "Big leaves with a white stem", "Folhas grandes com talo branco"],
    ["Parte del cuerpo", "Nariz", "Nose", "Nariz", "Con ella olés", "You smell with it", "Com ele você sente cheiros"],
    ["Parte del cuerpo", "Oreja", "Ear", "Orelha", "Con ella escuchás", "You hear with it", "Com ela você escuta"],
    ["Parte del cuerpo", "Boca", "Mouth", "Boca", "Por acá entra la comida", "Food goes in here", "Por aqui entra a comida"],
    ["Parte del cuerpo", "Mano", "Hand", "Mão", "Tiene cinco dedos", "Has five fingers", "Tem cinco dedos"],
    ["Parte del cuerpo", "Dedo", "Finger", "Dedo", "Tenés diez en las manos", "You have ten on your hands", "Você tem dez nas mãos"],
    ["Parte del cuerpo", "Cabeza", "Head", "Cabeça", "Arriba de todo, donde está el pelo", "At the very top, where your hair is", "Lá no alto, onde fica o cabelo"],
    ["Parte del cuerpo", "Espalda", "Back", "Costas", "Detrás, desde el cuello hasta la cintura", "Behind you, from your neck to your waist", "Atrás, do pescoço até a cintura"],
    ["Parte del cuerpo", "Cuello", "Neck", "Pescoço", "Une la cabeza con el cuerpo", "Joins your head to your body", "Liga a cabeça ao corpo"],
    ["Parte del cuerpo", "Pierna", "Leg", "Perna", "Con ellas caminás", "You walk with them", "Com elas você anda"],
    ["Parte del cuerpo", "Lengua", "Tongue", "Língua", "Con ella sentís los sabores", "You taste flavors with it", "Com ela você sente os sabores"],
    ["Parte del cuerpo", "Diente", "Tooth", "Dente", "Se cepilla después de comer", "You brush it after eating", "Se escova depois de comer"],
    ["Parte del cuerpo", "Muñeca", "Wrist", "Pulso", "Une la mano con el brazo", "Joins your hand to your arm", "Liga a mão ao braço"],
    ["Parte del cuerpo", "Pestaña", "Eyelash", "Cílio", "Pelito en el borde del ojo", "A little hair on the edge of your eye", "Pelinho na borda do olho"],
    ["Parte del cuerpo", "Corazón", "Heart", "Coração", "Late todo el día", "Beats all day long", "Bate o dia todo"],
    ["Parte del cuerpo", "Talón", "Heel", "Calcanhar", "La parte de atrás del pie", "The back of your foot", "A parte de trás do pé"],
    ["Parte del cuerpo", "Mejilla", "Cheek", "Bochecha", "Se pone colorada cuando te da vergüenza", "Turns red when you're embarrassed", "Fica vermelha quando você tem vergonha"],
    ["Parte del cuerpo", "Uña", "Nail", "Unha", "Crece en la punta de los dedos", "Grows at the tip of your fingers", "Cresce na ponta dos dedos"],
    ["Parte del cuerpo", "Frente", "Forehead", "Testa", "Arriba de las cejas", "Above your eyebrows", "Acima das sobrancelhas"],
    ["Bebida", "Agua", "Water", "Água", "No tiene color ni sabor", "Has no color or taste", "Não tem cor nem sabor"],
    ["Bebida", "Café", "Coffee", "Café", "Te despierta a la mañana", "Wakes you up in the morning", "Acorda você de manhã"],
    ["Bebida", "Cacao", "Cocoa", "Cacau", "Chocolate caliente para el invierno", "Hot chocolate for winter", "Chocolate quente para o inverno"],
    ["Bebida", "Sidra", "Cider", "Sidra", "Se hace con manzanas y burbujea", "Made from apples and bubbly", "Feita de maçã e borbulhante"],
    ["Comida", "Pasta", "Pasta", "Massa", "Italiana, se hierve y va con salsa", "Italian, boiled and served with sauce", "Italiana, se cozinha e vai com molho"],
    ["Comida", "Sopa", "Soup", "Sopa", "Se toma con cuchara, bien caliente", "Eaten hot with a spoon", "Se toma de colher, bem quente"],
    ["Comida", "Arroz", "Rice", "Arroz", "Granitos blancos, base de muchos platos", "Little white grains in lots of dishes", "Grãozinhos brancos, base de muitos pratos"],
    ["Comida", "Huevo", "Egg", "Ovo", "Lo pone la gallina", "The hen lays it", "A galinha bota"],
    ["Comida", "Queso", "Cheese", "Queijo", "Se hace con leche y a los ratones les encanta", "Made from milk and mice love it", "É feito de leite e os ratos adoram"],
    ["Comida", "Pan", "Bread", "Pão", "Sale del horno de la panadería", "Comes out of the bakery's oven", "Sai do forno da padaria"],
    ["Comida", "Taco", "Taco", "Taco", "Tortilla mexicana doblada con relleno", "A folded Mexican tortilla with filling", "Tortilha mexicana dobrada e recheada"],
    ["Comida", "Sushi", "Sushi", "Sushi", "Arroz y pescado crudo, de Japón", "Rice and raw fish, from Japan", "Arroz e peixe cru, do Japão"],
    ["Comida", "Empanada", "Empanada", "Empanada", "Masa rellena y cerrada, al horno o frita", "Stuffed pastry folded with a crimped edge", "Massa recheada, fechada com dobrinhas"],
    ["Comida", "Lasaña", "Lasagna", "Lasanha", "Capas de pasta, carne y salsa", "Layers of pasta, meat and sauce", "Camadas de massa, carne e molho"],
    ["Comida", "Paella", "Paella", "Paella", "Arroz con mariscos de Valencia", "Rice with seafood from Valencia", "Arroz com frutos do mar de Valência"],
    ["Comida", "Pollo", "Chicken", "Frango", "Se come al horno o frito", "Roasted in the oven with potatoes", "Se come assado no forno"],
    ["Comida", "Pescado", "Fish", "Peixe", "Viene del mar o del río", "Comes from the sea or the river", "Vem do mar ou do rio"],
    ["Comida", "Salchicha", "Sausage", "Salsicha", "Va adentro del pan del hot dog", "Goes inside a hot dog", "Vai dentro do cachorro-quente"],
    ["Comida", "Croqueta", "Croquette", "Croquete", "Bocadito empanado y frito", "A breaded, fried bite", "Bolinho empanado e frito"],
    ["Comida", "Nachos", "Nachos", "Nachos", "Triangulitos de maíz con queso", "Corn chips with cheese", "Triângulos de milho com queijo"],
    ["Comida", "Hummus", "Hummus", "Homus", "Pasta de garbanzos", "A chickpea dip", "Pasta de grão-de-bico"],
    ["Postre", "Gelatina", "Jelly", "Gelatina", "Tiembla y es de colores", "Wobbly and colorful", "Treme e é colorida"],
    ["Postre", "Brownie", "Brownie", "Brownie", "Cuadradito de chocolate húmedo", "A moist chocolate square", "Quadradinho de chocolate úmido"],
    ["Postre", "Alfajor", "Alfajor", "Alfajor", "Dos tapitas con dulce de leche", "Two cookies with dulce de leche", "Duas bolachas com doce de leite"],
    ["Postre", "Churro", "Churro", "Churro", "Masa frita con azúcar", "Fried dough with sugar", "Massa frita com açúcar"],
    ["Postre", "Budín", "Pudding", "Bolo", "Esponjoso, se hace en molde alargado", "Spongy, baked in a long pan", "Fofinho, feito em forma comprida"],
    ["Postre", "Tiramisú", "Tiramisu", "Tiramisu", "Postre italiano con café", "An Italian dessert with coffee", "Sobremesa italiana com café"],
    ["Postre", "Mousse", "Mousse", "Mousse", "Espumoso, suele ser de chocolate", "Airy, often chocolate", "Aerado, costuma ser de chocolate"],
    ["Postre", "Merengue", "Meringue", "Merengue", "Clara de huevo batida con azúcar", "Egg whites whipped with sugar", "Clara batida com açúcar"],
    ["Postre", "Waffle", "Waffle", "Waffle", "Masa con cuadraditos, con miel o frutas", "Batter with little squares, with honey or fruit", "Massa quadriculada, com mel ou frutas"],
    ["Objeto", "Llave", "Key", "Chave", "Abre la puerta", "Opens the door", "Abre a porta"],
    ["Objeto", "Lápiz", "Pencil", "Lápis", "Escribe y se borra con goma", "Writes and can be erased", "Escreve e se apaga com borracha"],
    ["Objeto", "Espejo", "Mirror", "Espelho", "Te muestra tu reflejo", "Shows your reflection", "Mostra o seu reflexo"],
    ["Objeto", "Vela", "Candle", "Vela", "Se prende para el cumpleaños", "You light it on a birthday", "Se acende no aniversário"],
    ["Objeto", "Cuchara", "Spoon", "Colher", "Para tomar la sopa", "For eating soup", "Para tomar a sopa"],
    ["Objeto", "Tenedor", "Fork", "Garfo", "Tiene dientes para pinchar la comida", "Has prongs to stab your food", "Tem dentes para espetar a comida"],
    ["Objeto", "Cuchillo", "Knife", "Faca", "Sirve para cortar", "Used for cutting", "Serve para cortar"],
    ["Objeto", "Plato", "Plate", "Prato", "Ahí se sirve la comida", "Food is served on it", "Nele se serve a comida"],
    ["Objeto", "Botella", "Bottle", "Garrafa", "Guarda bebidas y tiene tapa", "Holds drinks and has a cap", "Guarda bebidas e tem tampa"],
    ["Objeto", "Libro", "Book", "Livro", "Tiene páginas para leer", "Has pages to read", "Tem páginas para ler"],
    ["Objeto", "Pelota", "Ball", "Bola", "Redonda, rebota", "Round and it bounces", "Redonda, quica"],
    ["Objeto", "Sombrero", "Hat", "Chapéu", "Se pone en la cabeza para el sol", "You wear it on your head in the sun", "Se põe na cabeça por causa do sol"],
    ["Objeto", "Lámpara", "Lamp", "Luminária", "Da luz al lado de la cama", "Gives light on the nightstand", "Dá luz no criado-mudo"],
    ["Objeto", "Peine", "Comb", "Pente", "Para desenredar el pelo", "For untangling your hair", "Para desembaraçar o cabelo"],
    ["Objeto", "Toalla", "Towel", "Toalha", "Te secás con ella al salir de la ducha", "You dry off with it after a shower", "Você se seca com ela depois do banho"],
    ["Objeto", "Tetera", "Teapot", "Bule", "Para servir el té", "For pouring tea", "Para servir o chá"],
    ["Objeto", "Globo", "Balloon", "Balão", "Se infla en los cumpleaños", "Blown up at birthday parties", "Se enche nos aniversários"],
    ["Objeto", "Regla", "Ruler", "Régua", "Sirve para medir y trazar líneas rectas", "Used to measure and draw straight lines", "Serve para medir e traçar linhas retas"],
    ["Objeto", "Moneda", "Coin", "Moeda", "Dinero redondo de metal", "Round metal money", "Dinheiro redondo de metal"],
    ["Objeto", "Anillo", "Ring", "Anel", "Se lleva en el dedo", "Worn on your finger", "Se usa no dedo"],
    ["Objeto", "Collar", "Necklace", "Colar", "Se lleva en el cuello", "Worn around your neck", "Se usa no pescoço"],
    ["Objeto", "Sobre", "Envelope", "Envelope", "Ahí va la carta", "The letter goes inside it", "Nele vai a carta"],
    ["Objeto", "Cámara", "Camera", "Câmera", "Saca fotos", "Takes pictures", "Tira fotos"],
    ["Objeto", "Teléfono", "Phone", "Telefone", "Sirve para llamar", "Used to make calls", "Serve para ligar"],
    ["Objeto", "Vaso", "Glass", "Copo", "Para tomar agua", "For drinking water", "Para beber água"],
    ["Objeto", "Taza", "Cup", "Xícara", "Para el café con leche", "For coffee with milk", "Para o café com leite"],
    ["Objeto", "Jabón", "Soap", "Sabão", "Hace espuma y te lava las manos", "Makes foam and cleans your hands", "Faz espuma e lava as mãos"],
    ["Objeto", "Cepillo", "Brush", "Escova", "Para los dientes o para el pelo", "For your teeth or your hair", "Para os dentes ou para o cabelo"],
    ["Objeto", "Brújula", "Compass", "Bússola", "Siempre apunta al norte", "Always points north", "Sempre aponta para o norte"],
    ["Mueble", "Mesa", "Table", "Mesa", "Ahí se come o se trabaja", "Where you eat or work", "Onde se come ou se trabalha"],
    ["Mueble", "Silla", "Chair", "Cadeira", "Tiene cuatro patas y te sentás", "Has four legs and you sit on it", "Tem quatro pés e você senta"],
    ["Mueble", "Cama", "Bed", "Cama", "Ahí dormís", "Where you sleep", "Onde você dorme"],
    ["Mueble", "Armario", "Wardrobe", "Armário", "Ahí se guarda la ropa", "Where you keep your clothes", "Onde se guarda a roupa"],
    ["Mueble", "Estante", "Shelf", "Estante", "Para poner los libros", "For putting books on", "Para pôr os livros"],
    ["Mueble", "Escritorio", "Desk", "Escrivaninha", "Mesa para estudiar o trabajar", "A table for studying or working", "Mesa para estudar ou trabalhar"],
    ["Mueble", "Cómoda", "Dresser", "Cômoda", "Mueble con cajones", "Furniture with drawers", "Móvel com gavetas"],
    ["Mueble", "Banco", "Bench", "Banco", "Asiento largo de la plaza", "A long seat in the park", "Assento comprido da praça"],
    ["Mueble", "Cuna", "Crib", "Berço", "Cama del bebé", "A baby's bed", "Cama do bebê"],
    ["Mueble", "Hamaca", "Hammock", "Rede", "Se cuelga entre dos árboles", "Hangs between two trees", "Se pendura entre duas árvores"],
    ["Mueble", "Taburete", "Stool", "Banqueta", "Asiento alto sin respaldo", "A tall seat without a back", "Assento alto sem encosto"],
    ["Herramienta", "Pinza", "Pliers", "Alicate", "Agarra y corta alambres", "Grips and cuts wires", "Segura e corta arames"],
    ["Herramienta", "Taladro", "Drill", "Furadeira", "Hace agujeros en la pared", "Makes holes in the wall", "Faz furos na parede"],
    ["Herramienta", "Rastrillo", "Rake", "Ancinho", "Junta las hojas del jardín", "Gathers leaves in the yard", "Junta as folhas do jardim"],
    ["Herramienta", "Hacha", "Axe", "Machado", "Para cortar leña", "For chopping wood", "Para cortar lenha"],
    ["Herramienta", "Lija", "Sandpaper", "Lixa", "Papel áspero para alisar la madera", "Rough paper for smoothing wood", "Papel áspero para alisar a madeira"],
    ["Herramienta", "Tornillo", "Screw", "Parafuso", "Se enrosca con destornillador", "You turn it in with a screwdriver", "Se aperta com chave de fenda"],
    ["Herramienta", "Nivel", "Level", "Nível", "Tiene una burbujita para ver si está derecho", "Has a little bubble to check it's straight", "Tem uma bolhinha para ver se está reto"],
    ["Herramienta", "Cincel", "Chisel", "Cinzel", "Para tallar piedra o madera", "For carving stone or wood", "Para esculpir pedra ou madeira"],
    ["Medio de transporte", "Tren", "Train", "Trem", "Va por las vías", "Runs on tracks", "Anda nos trilhos"],
    ["Medio de transporte", "Barco", "Ship", "Navio", "Navega por el mar", "Sails on the sea", "Navega pelo mar"],
    ["Medio de transporte", "Moto", "Motorcycle", "Moto", "Dos ruedas y motor", "Two wheels and an engine", "Duas rodas e motor"],
    ["Medio de transporte", "Helicóptero", "Helicopter", "Helicóptero", "Vuela con hélices arriba", "Flies with blades on top", "Voa com hélices em cima"],
    ["Medio de transporte", "Taxi", "Taxi", "Táxi", "Auto que te lleva y le pagás", "A car that takes you and you pay", "Carro que leva você e você paga"],
    ["Medio de transporte", "Camión", "Truck", "Caminhão", "Grande, lleva cargas pesadas", "Big, carries heavy loads", "Grande, leva cargas pesadas"],
    ["Medio de transporte", "Velero", "Sailboat", "Veleiro", "Barco que anda con el viento", "A boat moved by the wind", "Barco que anda com o vento"],
    ["Medio de transporte", "Submarino", "Submarine", "Submarino", "Viaja debajo del agua", "Travels underwater", "Viaja debaixo d'água"],
    ["Medio de transporte", "Tranvía", "Tram", "Bonde", "Va por vías en medio de la calle", "Runs on tracks along the street", "Anda em trilhos no meio da rua"],
    ["Medio de transporte", "Cohete", "Rocket", "Foguete", "Despega hacia el espacio", "Blasts off into space", "Decola rumo ao espaço"],
    ["Medio de transporte", "Canoa", "Canoe", "Canoa", "Bote angosto que se rema", "A narrow boat you paddle", "Barco estreito que se rema"],
    ["Medio de transporte", "Metro", "Subway", "Metrô", "Tren que va bajo tierra", "A train that runs underground", "Trem que anda debaixo da terra"],
    ["Medio de transporte", "Ambulancia", "Ambulance", "Ambulância", "Lleva enfermos al hospital con sirena", "Takes sick people to the hospital with a siren", "Leva doentes ao hospital com sirene"],
    ["Medio de transporte", "Tractor", "Tractor", "Trator", "Trabaja en el campo", "Works on the farm", "Trabalha no campo"],
    ["Medio de transporte", "Yate", "Yacht", "Iate", "Barco de lujo", "A luxury boat", "Barco de luxo"],
    ["Prenda de ropa", "Camisa", "Shirt", "Camisa", "Tiene botones y cuello", "Has buttons and a collar", "Tem botões e gola"],
    ["Prenda de ropa", "Pantalón", "Pants", "Calça", "Te cubre las piernas", "Covers your legs", "Cobre as pernas"],
    ["Prenda de ropa", "Vestido", "Dress", "Vestido", "Prenda de una sola pieza", "A one-piece outfit", "Peça de roupa inteira"],
    ["Prenda de ropa", "Guantes", "Gloves", "Luvas", "Abrigan las manos", "Keep your hands warm", "Esquentam as mãos"],
    ["Prenda de ropa", "Zapato", "Shoe", "Sapato", "Se pone en el pie", "You wear it on your foot", "Se calça no pé"],
    ["Prenda de ropa", "Bota", "Boot", "Bota", "Calzado alto para la lluvia o el frío", "A tall shoe for rain or cold", "Calçado alto para chuva ou frio"],
    ["Prenda de ropa", "Corbata", "Tie", "Gravata", "Se anuda al cuello con traje", "Knotted around your neck with a suit", "Se amarra no pescoço com terno"],
    ["Prenda de ropa", "Pijama", "Pajamas", "Pijama", "Ropa para dormir", "Clothes for sleeping", "Roupa de dormir"],
    ["Prenda de ropa", "Chaleco", "Vest", "Colete", "Abrigo sin mangas", "A sleeveless top layer", "Agasalho sem mangas"],
    ["Prenda de ropa", "Cinturón", "Belt", "Cinto", "Sostiene el pantalón", "Holds up your pants", "Segura a calça"],
    ["Prenda de ropa", "Sandalia", "Sandal", "Sandália", "Calzado abierto para el verano", "Open shoes for summer", "Calçado aberto para o verão"],
    ["Prenda de ropa", "Abrigo", "Coat", "Casaco", "Te protege del frío", "Protects you from the cold", "Protege você do frio"],
    ["Prenda de ropa", "Bikini", "Bikini", "Biquíni", "Traje de baño de dos piezas", "A two-piece swimsuit", "Roupa de banho de duas peças"],
    ["Electrodoméstico", "Microondas", "Microwave", "Microondas", "Calienta la comida en un minuto", "Heats food in a minute", "Esquenta a comida em um minuto"],
    ["Electrodoméstico", "Licuadora", "Blender", "Liquidificador", "Hace batidos y salsas", "Makes smoothies and shakes", "Faz vitaminas e batidas"],
    ["Electrodoméstico", "Tostadora", "Toaster", "Torradeira", "Dora el pan", "Browns your bread", "Doura o pão"],
    ["Electrodoméstico", "Horno", "Oven", "Forno", "Ahí se hornean el pollo y los postres", "Where you bake cakes and roast chicken", "Nele se fazem bolos e frango"],
    ["Electrodoméstico", "Plancha", "Iron", "Ferro", "Saca las arrugas de la ropa", "Takes the wrinkles out of clothes", "Tira os amassados da roupa"],
    ["Electrodoméstico", "Ventilador", "Fan", "Ventilador", "Gira y te refresca en verano", "Spins and cools you in summer", "Gira e refresca no verão"],
    ["Electrodoméstico", "Aspiradora", "Vacuum", "Aspirador", "Chupa el polvo del piso", "Sucks up dust from the floor", "Suga o pó do chão"],
    ["Electrodoméstico", "Batidora", "Mixer", "Batedeira", "Bate la masa y la crema", "Beats cake batter", "Bate a massa dos bolos"],
    ["Electrodoméstico", "Televisor", "Television", "Televisão", "Ahí ves tus series", "Where you watch your shows", "Onde você vê suas séries"],
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
      gano: "¡La adivinaste!", perdio: "Era «{w}»", semillas: "+{n} semillas", racha: "Racha: {n} días", racha_1: "Racha: 1 día", compartir: "Compartir resultado",
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
      gano: "You got it!", perdio: "It was “{w}”", semillas: "+{n} seeds", racha: "Streak: {n} days", racha_1: "Streak: 1 day", compartir: "Share result",
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
      gano: "Você acertou!", perdio: "Era «{w}»", semillas: "+{n} sementes", racha: "Sequência: {n} dias", racha_1: "Sequência: 1 dia", compartir: "Compartilhar resultado",
      vuelve: "Novo Frutigrama em {t}", jugar: "Jogar", hecho_tarjeta: "Feito · {s}", tarjeta_sub: "Adivinhe a palavra", amigos_titulo: "Seus amigos hoje", amigos_cargando: "Procurando seus amigos…", amigos_todavia: "ainda não", amigos_sin: "Adicione amigos e comparem como foram a cada dia.", amigos_sin_cuenta: "Entre e adicione amigos para comparar o Frutigrama.", amigos_agregar: "Adicionar amigos", amigos_jugaron: "{n} amigos já jogaram", amigos_jugo: "1 amigo já jogou",
      inicio: "Modos", como: "Você tem 6 tentativas. Verde: letra no lugar certo. Amarelo: está na palavra, em outro lugar. Travou? Peça uma dica.", como_dalton: "Você tem 6 tentativas. Laranja: letra no lugar certo. Azul: está na palavra, em outro lugar. Travou? Peça uma dica.",
    },
  };
  function tx(clave, vars) {
    var str = (TEXTOS[state.lang] || TEXTOS.es)[clave] || TEXTOS.es[clave] || clave;
    if (APP.tu) str = APP.tu(str);
    Object.keys(vars || {}).forEach(function (k) { str = str.split("{" + k + "}").join(String(vars[k])); });
    return str;
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
  function delDia() {
    var n = Math.max(1, diaNumero());
    var p = PALABRAS[ORDEN[(n - 1) % ORDEN.length]], i = IDX[state.lang] || 1;
    var palabra = p[i], pista = p[i + 3], otra = REGION[palabra] && REGION[palabra][habla()];
    if (state.lang === "es" && otra) { palabra = otra[0]; pista = otra[1]; }
    if (APP.tu) pista = APP.tu(pista);
    var limpia = limpiar(palabra);
    // Letras extra que se destapan con las pistas 4 y 5 (siempre las mismas para ese día).
    var rnd = seededRandom(hashString("fg-" + n)), medio = [];
    for (var k = 1; k < limpia.length - 1; k++) medio.push(k);
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
    var reveladas = [0];
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
  function letraVisible(D, H, i) {
    var p = pistas(D, H.pistas || 0);
    // Arriba solo se ve la primera letra y las que se pidieron con pistas (los aciertos se ven en los colores de cada intento).
    return H.fin || p.reveladas.indexOf(i) >= 0;
  }
  function errores(H) { return H.intentos.filter(function (g) { return g !== H._limpia; }).length; }
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
    // Lo que se sabe: la primera letra, las pedidas con pistas (y todo, al terminar).
    var patron = "";
    for (var i = 0; i < L; i++) {
      var ver = H.fin || P.reveladas.indexOf(i) >= 0;
      patron += '<span class="fg-p' + (ver ? " ver" : "") + '">' + (ver ? esc(D.limpia[i].toUpperCase()) : "") + "</span>";
    }
    if (!H.fin) html += '<div class="fg-patron-fila"><div class="fg-patron">' + patron + "</div>" +
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
      : g[0] !== D.limpia[0] ? tx("empieza_mal", { l: D.limpia[0].toUpperCase() })
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
    if (nuevo) nuevo.focus();
  };

  // Ver pista: con un video (si hay uno cargado) o pagando semillas. Nunca se da sola.
  window.appFrutigramaPista = function () {
    var d = leer(), H = d.hoy, n = H.pistas || 0;
    if (H.fin || n >= MAX_PISTAS) return;
    var que = n === 0 ? tx("pista_que_def") : n === 1 ? tx("pista_que_ultima") : tx("pista_que_letra");
    var video = APP.hayVideo && APP.hayVideo();
    var semillas = getWallet().seeds;
    var hoja = APP.abrirHoja(
      '<span class="confirm-art">' + iconSvg("sun") + "</span><h2>" + esc(tx("pista_titulo")) + "</h2><p>" + esc(que) + "</p>" +
      '<div class="fg-pista-opciones">' +
      (video ? '<button type="button" class="btn btn-primary btn-block ap-video-btn" data-p="video">▶ ' + esc(tx("pista_video")) + "</button>" : "") +
      '<button type="button" class="btn ' + (video ? "btn-secondary" : "btn-primary") + ' btn-block" data-p="semillas"' + (semillas < PRECIO_PISTA ? " disabled" : "") + ">" +
        seedIcon() + " " + esc(tx("pista_semillas", { n: PRECIO_PISTA })) + "</button>" +
      (semillas < PRECIO_PISTA && !video ? '<p class="hint">' + esc(tx("pista_sin")) + "</p>" : "") + "</div>");
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
      var fruta = typeof friendMascot === "function" ? friendMascot(a, a.fg && a.fg < 7 ? "happy" : "neutral") : "";
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
    var fichas = '<span class="fg-t-fichas"><span class="fg-t-ficha ver">' + esc(D.limpia[0].toUpperCase()) + '</span><span class="fg-t-ficha' + (hecho ? " ver" : "") + '">' + (hecho ? esc(D.limpia[1].toUpperCase()) : "") +
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
