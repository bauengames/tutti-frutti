/* tutti.frutti · web · el juez sin conexión (igual que app-juez-offline.js de la app; el diccionario está en /diccionarios).
   El juez es una IA en el servidor (función "juez"). Si no contesta (sin conexión, caída, demora), antes valía todo lo que
   empezara con la letra: "Mzxq" pasaba como animal. Ahora, en las categorías de cosas comunes (Animal, Color, Comida…),
   la palabra tiene que existir en el idioma: se busca en un diccionario guardado en la app (www/diccionarios/<idioma>.txt,
   uno por idioma, de FrequencyWords — palabras de subtítulos, CC BY-SA 4.0 — más /usr/share/dict en inglés).
   No se puede saber si es de la categoría ("Mesa" como animal pasa) y los nombres propios (Nombre, Ciudad, Marca, Película…)
   no se revisan: no están en los diccionarios.
   Para los huecos del diccionario ("quirquincho" no está), también valen las palabras que el juez ya aprobó con conexión
   en este teléfono (se guardan) y las de la lista de respaldo de Frutibot.
   Formato del diccionario: palabras sin tildes y en minúscula, ordenadas; cada renglón = un carácter con cuántas letras
   comparte con la anterior (0-9, a-z = 10-35) + el resto. Se carga solo la primera vez que hace falta.
   En la web solo están los diccionarios de español, inglés y portugués. */
(function () {
  var TX = {
    es: "No está en el diccionario (sin conexión)", en: "Not in the dictionary (offline)", pt: "Não está no dicionário (sem conexão)",
    de: "Nicht im Wörterbuch (offline)", fr: "Pas dans le dictionnaire (hors ligne)", it: "Non è nel dizionario (offline)",
  };
  // Categorías de cosas comunes (las demás son nombres propios o inventadas por el jugador: no se revisan).
  var REVISAR = ["Animal", "Color", "Fruta", "Comida", "Objeto", "Parte del cuerpo", "Verdura", "Deporte", "Profesión", "Bebida",
    "Instrumento musical", "Utensilio de cocina", "Ingrediente", "Postre", "Algo de la heladera", "Especia o condimento", "Golosina",
    "Medio de transporte", "Algo para la valija", "Mueble", "Algo del baño", "Herramienta", "Electrodoméstico", "Prenda de ropa",
    "Planta o flor", "Juego", "Disfraz", "Baile", "Algo de un cumpleaños", "Juguete", "Insecto", "Animal marino", "Ave", "Árbol",
    "Accidente geográfico", "Algo que brilla", "Algo de carnaval", "Algo de Navidad", "Comida navideña", "Algo para regalar",
    "Algo del arbolito", "Algo de las vacaciones", "Idioma"];
  var APRENDIDAS_KEY = "tuttifruti_app_juez_aprendidas", MAX_APRENDIDAS = 3000;

  function norm(w) {
    return String(w).toLowerCase().replace(/ß/g, "ss").replace(/æ/g, "ae").replace(/œ/g, "oe")
      .normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
  }
  function idioma() { var l = state.lang || "es"; return ["es", "en", "pt"].indexOf(l) >= 0 ? l : "es"; }

  // ---------- Diccionario del idioma ----------
  var cargados = {};
  function cargar(lang) {
    if (cargados[lang]) return cargados[lang];
    cargados[lang] = fetch("/diccionarios/" + lang + ".txt").then(function (r) {
      if (!r.ok) throw new Error("sin diccionario");
      return r.text();
    }).then(function (texto) {
      var set = new Set(), ant = "";
      texto.split("\n").forEach(function (linea) {
        if (!linea) return;
        var k = parseInt(linea.charAt(0), 36);
        ant = ant.slice(0, k) + linea.slice(1);
        set.add(ant);
      });
      return set;
    }).catch(function (e) { cargados[lang] = null; throw e; });
    return cargados[lang];
  }

  // ---------- Palabras que el juez ya aprobó con conexión ----------
  function aprendidas() {
    try { return JSON.parse(localStorage.getItem(APRENDIDAS_KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function aprender(lang, palabras) {
    if (!palabras.length) return;
    var d = aprendidas(), lista = Array.isArray(d[lang]) ? d[lang] : [];
    palabras.forEach(function (p) { var n = norm(p); if (n && lista.indexOf(n) < 0) lista.push(n); });
    d[lang] = lista.slice(-MAX_APRENDIDAS);
    try { localStorage.setItem(APRENDIDAS_KEY, JSON.stringify(d)); } catch (e) { /* sin almacenamiento */ }
  }

  // ¿Existe? La palabra entera, o alguna de las de 3+ letras si son varias ("Dulce de leche"), probando también sin la
  // s / es final (plurales).
  function existe(dicc, extra, palabra) {
    var entera = norm(palabra);
    if (extra.has(entera) || dicc.has(entera)) return true;
    var partes = String(palabra).split(/[\s\-–]+/).map(norm).filter(function (p) { return p.length >= 3; });
    return partes.some(function (p) {
      var variantes = [p, p.replace(/s$/, ""), p.replace(/es$/, "")];
      return variantes.some(function (v) { return v && (dicc.has(v) || extra.has(v)); });
    });
  }
  function respaldoDe(lang, cat) {
    if (!APP.frutibotRespaldo) return [];
    var out = [];
    "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("").forEach(function (l) { var w = APP.frutibotRespaldo(l, [cat], lang)[cat]; if (w) out.push(w); });
    return out;
  }

  // Veredictos sin conexión: { id: { id, valida, motivo } } solo para las disputas de categorías que se pueden revisar.
  function juzgarSinConexion(disputas) {
    var lang = idioma();
    return cargar(lang).then(function (dicc) {
      var extra = new Set((aprendidas()[lang] || []));
      var verdicts = {};
      disputas.forEach(function (d) {
        var cat = String(d.categoria).replace(/#\d+$/, "");
        // Las categorías sin diccionario valen, pero sin verificar: en una sala no hay multa para quien objetó
        // ni dice que el juez la aprobó (computeAndApplyScores).
        if (REVISAR.indexOf(cat) < 0) { verdicts[d.id] = { id: d.id, valida: true, sinVerificar: true }; return; }
        respaldoDe(lang, cat).forEach(function (w) { extra.add(norm(w)); });
        verdicts[d.id] = existe(dicc, extra, d.palabra) ? { id: d.id, valida: true } : { id: d.id, valida: false, motivo: TX[lang] };
      });
      return verdicts;
    });
  }
  APP.juezOffline = { juzgar: juzgarSinConexion, cargar: cargar, existe: function (palabra) { return cargar(idioma()).then(function (dc) { return existe(dc, new Set(aprendidas()[idioma()] || []), palabra); }); } };

  var juezAntes = window.callJudge;
  if (typeof juezAntes === "function") window.callJudge = function (sala, ronda, letra, disputas) {
    return Promise.resolve(juezAntes.apply(this, arguments)).then(function (res) {
      res = res || { verdicts: {}, failed: true };
      if (!res.failed) {
        // Con conexión: lo que aprobó el juez queda guardado para cuando no haya.
        aprender(idioma(), (disputas || []).filter(function (d) { var v = res.verdicts && res.verdicts[d.id]; return v && v.valida !== false; }).map(function (d) { return d.palabra; }));
        return res;
      }
      return juzgarSinConexion(disputas || []).then(function (verdicts) {
        if (APP.evento) APP.evento("juez_sin_conexion", { palabras: (disputas || []).length });
        return { verdicts: verdicts, failed: false, sinConexion: true };
      }).catch(function () { return res; }); // sin diccionario: como antes, vale todo
    });
  };
})();
