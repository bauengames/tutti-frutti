/* tutti.frutti · web · palabras de respaldo para Frutibot (igual que app-frutibot-respaldo.js de la app).
   Frutibot pide sus respuestas a la función "rival" (IA). Si no contesta (sin conexión, error, más de 12 s), antes
   no escribía nada en toda la partida: en la práctica el jugador nuevo no veía ni una respuesta rival. Ahora usa estas
   listas: una palabra que empiece con la letra, si hay. Cubre las categorías más comunes (todas las fáciles en los 6
   idiomas y las medianas en español); las demás quedan vacías, como un jugador que no supo.
   index.html (prepareBotAnswers) llama a APP.frutibotRespaldo(letra, categorias, idioma). */
(function () {
  var L = {
    es: {
      "Nombre": "Ana,Andrés,Bruno,Belén,Carla,Camilo,Daniel,Diana,Elena,Emilio,Federico,Florencia,Gabriel,Gisela,Hugo,Helena,Ignacio,Inés,Juan,Julieta,Karina,Kevin,Lucas,Laura,Martín,Mariana,Nicolás,Natalia,Olivia,Oscar,Pablo,Paula,Quique,Raúl,Rocío,Santiago,Sofía,Tomás,Teresa,Ulises,Valentina,Víctor,Walter,Wanda,Ximena,Yanina,Zoe",
      "Animal": "Águila,Abeja,Ballena,Burro,Caballo,Cebra,Delfín,Dromedario,Elefante,Erizo,Foca,Flamenco,Gato,Gorila,Hipopótamo,Halcón,Iguana,Jirafa,Jabalí,Koala,León,Lobo,Mono,Mariposa,Nutria,Ñandú,Oso,Oveja,Perro,Pingüino,Quirquincho,Rana,Ratón,Serpiente,Sapo,Tigre,Tortuga,Urraca,Vaca,Víbora,Yacaré,Zorro",
      "Color": "Amarillo,Azul,Blanco,Bordó,Celeste,Café,Dorado,Esmeralda,Fucsia,Gris,Granate,Índigo,Jade,Lila,Lavanda,Marrón,Magenta,Naranja,Negro,Ocre,Plateado,Púrpura,Rojo,Rosa,Salmón,Sepia,Turquesa,Terracota,Violeta,Verde,Zafiro",
      "Fruta": "Ananá,Arándano,Banana,Cereza,Ciruela,Damasco,Durazno,Frutilla,Frambuesa,Granada,Guayaba,Higo,Kiwi,Limón,Lima,Mango,Manzana,Melón,Naranja,Níspero,Pera,Pomelo,Quinoto,Sandía,Tamarindo,Uva,Zarzamora",
      "Comida": "Arroz,Asado,Budín,Bife,Canelones,Chocolate,Dulce de leche,Empanada,Fideos,Flan,Guiso,Garbanzos,Hamburguesa,Helado,Jamón,Lentejas,Locro,Milanesa,Mermelada,Ñoquis,Omelette,Pizza,Pollo,Queso,Ravioles,Sopa,Sándwich,Tarta,Torta,Vitel toné,Waffles,Yogur,Zapallo",
      "País": "Argentina,Alemania,Brasil,Bolivia,Chile,Canadá,Dinamarca,Ecuador,España,Francia,Finlandia,Grecia,Guatemala,Honduras,Holanda,India,Italia,Japón,Jamaica,Kenia,Líbano,México,Marruecos,Noruega,Nicaragua,Omán,Perú,Paraguay,Qatar,Rusia,Rumania,Suecia,Suiza,Turquía,Túnez,Uruguay,Ucrania,Venezuela,Vietnam,Yemen,Zambia",
      "Ciudad": "Asunción,Atenas,Barcelona,Bogotá,Córdoba,Caracas,Dublín,Doha,Estambul,Florencia,Granada,Guadalajara,Hamburgo,Ibiza,Jerusalén,Kiev,Lima,Londres,Madrid,Montevideo,Nápoles,Oslo,París,Quito,Rosario,Roma,Santiago,Sevilla,Tokio,Toronto,Ushuaia,Valencia,Varsovia,Washington,Zaragoza",
      "Objeto": "Anillo,Almohada,Botella,Bolígrafo,Cuchara,Cama,Dado,Escoba,Espejo,Florero,Guitarra,Goma,Hilo,Imán,Jarra,Lámpara,Llave,Mesa,Mochila,Naipe,Olla,Paraguas,Peine,Reloj,Regla,Silla,Taza,Tijera,Vaso,Vela,Yunque,Zapato",
      "Parte del cuerpo": "Abdomen,Brazo,Boca,Cabeza,Codo,Dedo,Diente,Espalda,Estómago,Frente,Garganta,Hombro,Hígado,Intestino,Labio,Lengua,Mano,Muñeca,Nariz,Nuca,Ojo,Oreja,Pie,Pierna,Rodilla,Riñón,Talón,Tobillo,Uña,Vena",
      "Verdura": "Acelga,Ajo,Berenjena,Brócoli,Cebolla,Choclo,Espinaca,Espárrago,Haba,Lechuga,Morrón,Nabo,Papa,Pepino,Puerro,Rabanito,Remolacha,Tomate,Zanahoria,Zapallito",
      "Deporte": "Atletismo,Básquet,Boxeo,Ciclismo,Esgrima,Fútbol,Golf,Handball,Judo,Karate,Lucha,Natación,Polo,Patinaje,Rugby,Remo,Surf,Tenis,Vóley,Waterpolo,Yoga",
      "Profesión": "Abogado,Arquitecto,Bombero,Carpintero,Cocinero,Dentista,Enfermero,Electricista,Fotógrafo,Granjero,Herrero,Ingeniero,Jardinero,Locutor,Médico,Maestro,Nutricionista,Odontólogo,Panadero,Pintor,Químico,Relojero,Sastre,Taxista,Veterinario,Zapatero",
      "Bebida": "Agua,Café,Cerveza,Chocolatada,Gaseosa,Jugo,Leche,Licuado,Limonada,Mate,Naranjada,Sidra,Soda,Té,Vino,Whisky",
      "Apellido": "Álvarez,Benítez,Castro,Díaz,Fernández,García,Gómez,Herrera,Ibáñez,Juárez,López,Martínez,Núñez,Ortiz,Pérez,Quiroga,Romero,Sánchez,Torres,Uriarte,Vázquez,Zapata",
    },
    en: {
      "Nombre": "Anna,Ben,Chloe,Daniel,Emma,Frank,Grace,Henry,Isla,Jack,Kate,Liam,Mia,Noah,Olivia,Paul,Quinn,Ruby,Sam,Tom,Uma,Victor,William,Yasmin,Zoe",
      "Animal": "Ant,Bear,Cat,Dog,Eagle,Fox,Goat,Horse,Iguana,Jaguar,Koala,Lion,Monkey,Newt,Owl,Penguin,Quail,Rabbit,Snake,Tiger,Urchin,Vulture,Wolf,Yak,Zebra",
      "Color": "Amber,Blue,Crimson,Denim,Emerald,Fuchsia,Green,Hazel,Indigo,Jade,Khaki,Lilac,Magenta,Navy,Orange,Pink,Red,Silver,Teal,Violet,White,Yellow",
      "Fruta": "Apple,Banana,Cherry,Date,Elderberry,Fig,Grape,Guava,Kiwi,Lemon,Lime,Mango,Melon,Nectarine,Orange,Peach,Pear,Quince,Raspberry,Strawberry,Tangerine,Watermelon",
      "Comida": "Apple pie,Bacon,Burger,Cake,Cheese,Donut,Eggs,Fries,Granola,Ham,Ice cream,Jam,Kebab,Lasagna,Muffin,Noodles,Omelette,Pizza,Quiche,Rice,Soup,Taco,Waffle,Yogurt",
      "País": "Argentina,Brazil,Canada,Denmark,Egypt,France,Germany,Hungary,India,Japan,Kenya,Lebanon,Mexico,Norway,Oman,Peru,Qatar,Russia,Spain,Turkey,Uruguay,Vietnam,Wales,Yemen,Zambia",
      "Ciudad": "Amsterdam,Boston,Chicago,Dublin,Edinburgh,Florence,Glasgow,Houston,Istanbul,Jakarta,Kyoto,London,Miami,Nairobi,Oslo,Paris,Quebec,Rome,Sydney,Toronto,Utrecht,Vienna,Warsaw,York,Zurich",
      "Objeto": "Anchor,Book,Chair,Desk,Eraser,Fork,Glass,Hammer,Ink,Jar,Key,Lamp,Mirror,Needle,Oven,Pen,Quilt,Ruler,Spoon,Table,Umbrella,Vase,Watch,Yo-yo,Zipper",
      "Parte del cuerpo": "Arm,Back,Chin,Elbow,Finger,Hand,Heart,Knee,Leg,Lip,Mouth,Neck,Nose,Rib,Shoulder,Thumb,Toe,Wrist",
    },
    pt: {
      "Nombre": "Ana,Bruno,Camila,Daniel,Eduardo,Fernanda,Gabriel,Helena,Isabela,João,Larissa,Lucas,Mariana,Natália,Otávio,Pedro,Rafael,Sofia,Thiago,Vitória,Yasmin",
      "Animal": "Abelha,Baleia,Cavalo,Cachorro,Elefante,Foca,Gato,Girafa,Hipopótamo,Iguana,Jacaré,Leão,Lobo,Macaco,Onça,Pato,Rato,Sapo,Tigre,Urso,Vaca,Zebra",
      "Color": "Amarelo,Azul,Branco,Cinza,Dourado,Laranja,Lilás,Marrom,Preto,Rosa,Roxo,Turquesa,Verde,Vermelho,Violeta",
      "Fruta": "Abacaxi,Banana,Caju,Cereja,Damasco,Figo,Goiaba,Jabuticaba,Kiwi,Laranja,Limão,Manga,Maçã,Melancia,Pera,Pêssego,Romã,Tangerina,Uva",
      "Comida": "Arroz,Brigadeiro,Coxinha,Esfiha,Feijoada,Hambúrguer,Lasanha,Macarrão,Omelete,Pão de queijo,Pizza,Queijo,Risoto,Sopa,Torta,Vatapá",
      "País": "Argentina,Brasil,Chile,Dinamarca,Equador,França,Grécia,Holanda,Itália,Japão,Líbano,México,Noruega,Omã,Peru,Portugal,Rússia,Suécia,Turquia,Uruguai,Venezuela",
      "Ciudad": "Aracaju,Belém,Curitiba,Dublin,Fortaleza,Goiânia,Lisboa,Londres,Manaus,Natal,Olinda,Paris,Porto Alegre,Recife,Roma,Salvador,Toronto,Vitória",
      "Objeto": "Agulha,Bola,Cadeira,Dado,Escova,Faca,Garrafa,Isqueiro,Jarra,Lápis,Mesa,Óculos,Panela,Relógio,Sapato,Tesoura,Vaso,Xícara",
      "Parte del cuerpo": "Braço,Boca,Cabeça,Dedo,Dente,Joelho,Lábio,Mão,Nariz,Olho,Orelha,Ombro,Pé,Perna,Queixo,Testa,Unha",
    },
    de: {
      "Nombre": "Anna,Ben,Clara,David,Emma,Felix,Greta,Hannah,Ida,Jonas,Klara,Lukas,Mia,Noah,Oskar,Paul,Rosa,Sophie,Tim,Ute,Vera,Wilhelm,Zoe",
      "Animal": "Affe,Bär,Dachs,Elefant,Fuchs,Giraffe,Hund,Igel,Jaguar,Katze,Löwe,Maus,Nashorn,Otter,Pferd,Qualle,Rabe,Schaf,Tiger,Uhu,Vogel,Wolf,Zebra",
      "Color": "Apricot,Blau,Braun,Creme,Dunkelblau,Gelb,Grün,Grau,Indigo,Lila,Magenta,Orange,Pink,Rot,Schwarz,Türkis,Violett,Weiß",
      "Fruta": "Apfel,Banane,Birne,Dattel,Erdbeere,Feige,Granatapfel,Himbeere,Kirsche,Kiwi,Limette,Mango,Melone,Orange,Pfirsich,Quitte,Traube,Zitrone",
      "Comida": "Apfelstrudel,Brezel,Currywurst,Döner,Eintopf,Gulasch,Hamburger,Kartoffelsalat,Lasagne,Nudeln,Omelett,Pizza,Quark,Reis,Schnitzel,Suppe,Torte,Wurst",
      "País": "Argentinien,Belgien,Chile,Dänemark,England,Frankreich,Griechenland,Indien,Japan,Kanada,Lettland,Mexiko,Norwegen,Österreich,Peru,Russland,Schweiz,Türkei,Ungarn,Vietnam",
      "Ciudad": "Aachen,Berlin,Dresden,Essen,Frankfurt,Graz,Hamburg,Innsbruck,Jena,Köln,Leipzig,München,Nürnberg,Oslo,Paris,Rom,Stuttgart,Trier,Ulm,Wien,Zürich",
      "Objeto": "Anker,Buch,Dose,Eimer,Flasche,Gabel,Hammer,Kamm,Lampe,Messer,Nadel,Ofen,Pinsel,Regenschirm,Stuhl,Tasse,Uhr,Vase,Wecker,Zange",
      "Parte del cuerpo": "Arm,Bauch,Daumen,Ellbogen,Finger,Hals,Hand,Knie,Lippe,Mund,Nase,Ohr,Rücken,Schulter,Zahn,Zunge",
    },
    fr: {
      "Nombre": "Alice,Bastien,Camille,David,Emma,François,Gabriel,Hugo,Inès,Jules,Léa,Louis,Manon,Nathan,Océane,Paul,Quentin,Raphaël,Sophie,Théo,Victor,Yasmine,Zoé",
      "Animal": "Abeille,Baleine,Chat,Chien,Dauphin,Éléphant,Furet,Girafe,Hibou,Iguane,Jaguar,Kangourou,Lion,Loup,Mouton,Ours,Pingouin,Renard,Serpent,Tigre,Vache,Zèbre",
      "Color": "Argent,Blanc,Bleu,Cyan,Doré,Gris,Indigo,Jaune,Kaki,Lilas,Marron,Noir,Orange,Rose,Rouge,Saumon,Turquoise,Vert,Violet",
      "Fruta": "Abricot,Banane,Cerise,Datte,Figue,Fraise,Framboise,Grenade,Kiwi,Litchi,Mangue,Melon,Orange,Pêche,Poire,Pomme,Raisin,Tomate",
      "Comida": "Baguette,Crêpe,Croissant,Fromage,Gratin,Hamburger,Lasagne,Macaron,Omelette,Pizza,Quiche,Ratatouille,Salade,Soupe,Tarte",
      "País": "Allemagne,Belgique,Canada,Danemark,Espagne,France,Grèce,Hongrie,Inde,Japon,Kenya,Liban,Maroc,Norvège,Oman,Pérou,Russie,Suisse,Tunisie,Uruguay,Vietnam",
      "Ciudad": "Amiens,Bordeaux,Cannes,Dijon,Grenoble,Lille,Lyon,Marseille,Nantes,Nice,Orléans,Paris,Québec,Rennes,Strasbourg,Toulouse,Versailles",
      "Objeto": "Aiguille,Balai,Chaise,Ciseaux,Fourchette,Gomme,Lampe,Livre,Miroir,Montre,Oreiller,Parapluie,Règle,Stylo,Table,Tasse,Vase",
      "Parte del cuerpo": "Bouche,Bras,Cheville,Coude,Dent,Doigt,Épaule,Genou,Jambe,Langue,Lèvre,Main,Nez,Oreille,Pied,Tête,Ventre",
    },
    it: {
      "Nombre": "Alessandro,Beatrice,Chiara,Davide,Elena,Francesco,Giulia,Ilaria,Lorenzo,Marco,Nicola,Olivia,Paolo,Riccardo,Sofia,Tommaso,Valentina,Zeno",
      "Animal": "Ape,Balena,Cane,Cavallo,Delfino,Elefante,Foca,Gatto,Giraffa,Ippopotamo,Leone,Lupo,Mucca,Orso,Pecora,Rana,Scimmia,Tigre,Volpe,Zebra",
      "Color": "Arancione,Azzurro,Bianco,Blu,Celeste,Giallo,Grigio,Indaco,Lilla,Marrone,Nero,Oro,Rosa,Rosso,Turchese,Verde,Viola",
      "Fruta": "Albicocca,Banana,Ciliegia,Dattero,Fico,Fragola,Kiwi,Lampone,Limone,Mango,Mela,Melone,Pera,Pesca,Prugna,Uva",
      "Comida": "Arancino,Bruschetta,Cannoli,Focaccia,Gelato,Lasagne,Minestrone,Pizza,Polenta,Ravioli,Risotto,Spaghetti,Tiramisù,Zuppa",
      "País": "Argentina,Belgio,Cile,Danimarca,Egitto,Francia,Germania,Grecia,India,Giappone,Kenya,Libano,Messico,Norvegia,Olanda,Perù,Russia,Spagna,Turchia,Ungheria,Vietnam",
      "Ciudad": "Ancona,Bologna,Cagliari,Firenze,Genova,Lecce,Milano,Napoli,Oslo,Palermo,Roma,Siena,Torino,Udine,Venezia,Verona",
      "Objeto": "Anello,Bottiglia,Cucchiaio,Forbici,Gomma,Lampada,Libro,Matita,Orologio,Ombrello,Penna,Righello,Sedia,Tazza,Vaso,Zaino",
      "Parte del cuerpo": "Bocca,Braccio,Caviglia,Collo,Dente,Dito,Gamba,Ginocchio,Labbro,Lingua,Mano,Naso,Occhio,Orecchio,Piede,Spalla,Testa",
    },
  };
  var MARCAS = "Adidas,Apple,Bic,Coca-Cola,Dell,Disney,Ferrari,Fiat,Gucci,Google,Honda,IKEA,Jeep,Kodak,Lego,Mercedes,Nike,Nestlé,Oreo,Pepsi,Puma,Rolex,Samsung,Sony,Toyota,Volvo,Xbox,Yamaha,Zara";

  // Inicial comparable: sin tildes, pero la Ñ sigue siendo Ñ.
  function inicial(p) {
    var c = String(p).trim().charAt(0).toUpperCase();
    return c === "Ñ" ? c : c.normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  APP.frutibotRespaldo = function (letra, categorias, idioma) {
    var tabla = L[idioma] || L.es, l = inicial(letra), out = {};
    (categorias || []).forEach(function (cat) {
      var lista = cat === "Marca" ? MARCAS : tabla[cat];
      if (!lista) return;
      var opciones = lista.split(",").filter(function (p) { return inicial(p) === l; });
      if (opciones.length) out[cat] = opciones[Math.floor(Math.random() * opciones.length)];
    });
    return out;
  };
})();
