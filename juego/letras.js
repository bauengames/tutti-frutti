/* tutti.frutti · web (igual que en la app) · combinaciones de letra y categoría que (casi) no tienen palabras.
   Pasaba que en la Aventura o en "Al azar" salía, por ejemplo, la Q con Color: casi no hay colores con Q y
   la ronda se perdía por culpa del sorteo. Cuando las categorías las elige el juego (Aventura, Al azar,
   Frutibot, Contrarreloj, Copa, Pasar el celu, duelos nuevos), la letra se sortea entre las que tienen
   palabras para todas las categorías de la ronda. Si ninguna sirve, se sortea como siempre.
   No se toca: las salas online con categorías elegidas por la gente (ni "Letras difíciles", que es a
   propósito) ni el desafío del día (la letra es la misma para todos, también en la web).
   La lista salió de lo que se sabe del juego y se revisó con la memoria del juez (unas 3.000 palabras
   válidas de partidas reales, octubre de 2026). Las categorías van con su nombre en español (la clave
   del juego), en cualquier idioma. Solo hacen falta las letras que el juego sortea (no K, Ñ, W ni X).
   Se carga antes que los demás módulos de la app (el juego lo usa recién al sortear). */
(function () {
  var EVITAR = {
    es: {
      "Color": "QY", "Fruta": "EIVY", "Verdura": "IQU", "Parte del cuerpo": "JZ", "Bebida": "Y",
      "Deporte": "IQ", "Instrumento musical": "IJNY", "Personaje histórico": "Y", "Equipo de fútbol": "Y",
      "Comida argentina": "IUY", "Palabra en lunfardo": "IU",
      // Mundos temáticos de la Aventura
      "Utensilio de cocina": "IN", "Algo de la heladera": "I", "Especia o condimento": "I", "Golosina": "I",
      "Medio de transporte": "I", "Algo para la valija": "I", "Idioma": "O", "Mueble": "IN", "Herramienta": "I",
      "Electrodoméstico": "IO", "Insecto": "DFINQUY", "Animal marino": "IQUY", "Ave": "NY", "Árbol": "IUYZ",
      "Accidente geográfico": "JNUYZ", "Superhéroe": "QUYZ", "Dibujo animado": "QU", "Videojuego": "QUYZ",
      "Libro": "QUYZ", "Serie": "QUY", "Juguete": "QU", "Juego": "UY", "Disfraz": "QY", "Baile": "INOQUY",
      // Mundo de Navidad (app-navidad.js)
      "Algo del arbolito": "IO", "Comida navideña": "IO",
    },
    en: {
      "Color": "QZ", "Fruta": "IUV", "Verdura": "IJQUV", "Parte del cuerpo": "QUYZ", "Bebida": "QUYZ",
      "Deporte": "QZ", "Instrumento musical": "IJNQY", "Personaje histórico": "QUY",
    },
    pt: {
      "Color": "QUYZ", "Fruta": "EIQVYZ", "Verdura": "IUYZ", "Parte del cuerpo": "YZ", "Bebida": "IYZ",
      "Deporte": "IQYZ", "Instrumento musical": "IJNQY", "Personaje histórico": "Y",
    },
  };

  // Lluvia de ideas: "Animal#2" es la categoría Animal.
  function base(cat) { return String(cat || "").replace(/#\d+$/, ""); }

  // ¿Hay palabras con esta letra para esta categoría (o para todas las de la lista)?
  window.letraPosible = function (letra, cats) {
    var tabla = EVITAR[state.lang] || EVITAR.es;
    var lista = Array.isArray(cats) ? cats : [cats];
    var L = String(letra || "").toUpperCase();
    return lista.every(function (c) { var malas = tabla[base(c)]; return !malas || malas.indexOf(L) < 0; });
  };
  // Las letras de la lista que sirven para todas las categorías. Si ninguna sirve, las que sirvan de "todas"
  // (por ejemplo, todas las del juego aunque ya hayan salido hace poco); y si tampoco, la lista entera.
  window.letrasPosibles = function (letras, cats, todas) {
    function sirven(l) { return (l || []).filter(function (x) { return letraPosible(x, cats); }); }
    var ok = sirven(letras);
    if (!ok.length && todas) ok = sirven(todas);
    return ok.length ? ok : (letras || []).slice();
  };
  APP.letrasEvitar = EVITAR;
})();
