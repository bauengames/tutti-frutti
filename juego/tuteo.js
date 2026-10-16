/* tutti.frutti · web (igual que en la app) · español con "tú" para quien no juega en el Río de la Plata.
   El juego está escrito en argentino ("Jugá", "Tocá", "tenés"). Quien está en otro país de habla hispana
   lo ve con "tú" ("Juega", "Toca", "tienes") y con sus palabras: en México "celular", "lentes", "fresa";
   en España además "móvil", "gafas", "melocotón" y el botón dice "¡Stop!" en vez de "¡Basta!".
   - Modos: "vos" (Argentina, Uruguay, Paraguay), "mx" (tú, resto de Latinoamérica y EE. UU.), "es" (España).
   - Automático según la zona horaria; se puede elegir a mano en el menú de idioma (arriba a la derecha).
   - Se aplica a los textos (I18N.es, HOWTO_TEXTS.es y los TEXTOS de cada módulo vía APP.tu), nunca a lo que
     escriben los jugadores. Los originales se guardan para poder volver a "vos".
   Se carga antes que los demás archivos de juego/ (después de app-web.js). */
(function () {
  var KEY = "tuttifruti_app_habla";
  var L = "A-Za-zÁÉÍÓÚÜÑáéíóúüñ";

  // ---------- Diccionario (en minúscula; las mayúsculas se respetan solas) ----------
  // Frases primero: "para vos" → "para ti" antes de "vos" → "tú".
  var FRASES = [
    ["para vos", "para ti"], ["por vos", "por ti"], ["con vos", "contigo"], ["a vos", "a ti"], ["de vos", "de ti"],
    ["dale que sale", "vamos, que sale"], ["mirá vos", "fíjate"],
  ];
  var VERBOS = {
    vos: "tú", sos: "eres", dale: "vamos",
    tenés: "tienes", podés: "puedes", querés: "quieres", sabés: "sabes", hacés: "haces", ponés: "pones",
    jugás: "juegas", ganás: "ganas", perdés: "pierdes", volvés: "vuelves", seguís: "sigues", elegís: "eliges",
    escribís: "escribes", abrís: "abres", cerrás: "cierras", acordás: "acuerdas", acabás: "acabas", adivinás: "adivinas",
    apoyás: "apoyas", arrancás: "arrancas", avanzás: "avanzas", bloqueás: "bloqueas", desbloqueás: "desbloqueas",
    cambiás: "cambias", cobrás: "cobras", completás: "completas", comprás: "compras", cortás: "cortas", creás: "creas",
    doblás: "doblas", duplicás: "duplicas", entrás: "entras", fallás: "fallas", llamás: "llamas", llegás: "llegas",
    mandás: "mandas", necesitás: "necesitas", pasás: "pasas", quedás: "quedas", recuperás: "recuperas",
    reintentás: "reintentas", salteás: "saltas", sorteás: "sorteas", sumás: "sumas", superás: "superas",
    olés: "hueles", escuchás: "escuchas", dormís: "duermes", caminás: "caminas", sentís: "sientes", secás: "secas",
    pagás: "pagas", sentás: "sientas",
    terminás: "terminas", tocás: "tocas", trabás: "trabas", empezás: "empiezas", pensás: "piensas", usás: "usas",
    abrí: "abre", adiviná: "adivina", anotá: "anota", armá: "arma", cambiá: "cambia", compartí: "comparte",
    completá: "completa", confirmá: "confirma", conseguí: "consigue", copiá: "copia", creá: "crea", cumplí: "cumple",
    desafiá: "desafía", elegí: "elige", empezá: "empieza", entrá: "entra", escribí: "escribe", esperá: "espera",
    ganá: "gana", guardá: "guarda", ingresá: "ingresa", iniciá: "inicia", invitá: "invita", jugá: "juega",
    juntá: "junta", llegá: "llega", mandá: "manda", mirá: "mira", objetá: "objeta", pasá: "pasa", pedí: "pide",
    pensá: "piensa", permití: "permite", poné: "pon", probá: "prueba", recargá: "recarga", retá: "reta",
    revisá: "revisa", sacá: "saca", seguí: "sigue", sumá: "suma", terminá: "termina", tocá: "toca", volvé: "vuelve",
    votá: "vota", agregá: "agrega", buscá: "busca", activá: "activa", usá: "usa", hacé: "haz", tené: "ten", decí: "di",
    vení: "ven", salí: "sal", contá: "cuenta", mostrá: "muestra", avisá: "avisa", abrilo: "ábrelo",
    acordate: "acuérdate", agregalos: "agrégalos", agregame: "agrégame", bajala: "bájala", cobrala: "cóbrala",
    completala: "complétala", corregila: "corrígela", ganale: "gánale", jugala: "juégala", jugalo: "juégalo",
    mandale: "mándale", mandales: "mándales", mandalo: "mándalo", pasale: "pásale", pedile: "pídele",
    animate: "anímate", avisame: "avísame", cambialas: "cámbialas", dejame: "déjame", llevate: "llévate",
    objetala: "objétala", fijate: "fíjate", sumate: "súmate", probalo: "pruébalo", compartilo: "compártelo",
  };
  // Palabras de cada lugar (también para "mx" y "es").
  var LATAM = {
    "pasar el celu": "pasar el cel", celu: "celular", ananá: "piña", frutilla: "fresa", frutillas: "fresas", palta: "aguacate", banana: "plátano",
    galera: "sombrero de copa", "gorrito de cumple": "gorrito de fiesta", heladera: "refrigerador", campera: "chamarra",
    pileta: "alberca", anteojos: "lentes", pomelo: "toronja", carozo: "hueso",
  };
  var ESPANA = {
    celu: "móvil", celular: "móvil", compu: "ordenador", computadora: "ordenador", ananá: "piña", frutilla: "fresa",
    frutillas: "fresas", palta: "aguacate", banana: "plátano", durazno: "melocotón", galera: "sombrero de copa",
    "gorrito de cumple": "gorrito de fiesta", heladera: "nevera", campera: "chaqueta", pileta: "piscina",
    anteojos: "gafas", jugo: "zumo", papa: "patata", papas: "patatas", auto: "coche", autos: "coches", carozo: "hueso", "acá": "aquí", video: "vídeo", videos: "vídeos",
    basta: "stop",
  };

  function armar(dic) {
    var claves = Object.keys(dic).sort(function (a, b) { return b.length - a.length; });
    var alt = claves.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|");
    return { dic: dic, re: new RegExp("(^|[^" + L + "])(" + alt + ")(?=[^" + L + "]|$)", "gi") };
  }
  function aplicar(str, R) {
    return str.replace(R.re, function (m, antes, palabra) {
      var bajo = palabra.toLowerCase();
      var nuevo = R.dic[bajo];
      if (nuevo == null) return m;
      if (palabra === palabra.toUpperCase() && palabra !== bajo) nuevo = nuevo.toUpperCase();
      else if (palabra[0] !== bajo[0]) nuevo = nuevo.charAt(0).toUpperCase() + nuevo.slice(1);
      return antes + nuevo;
    });
  }
  var frasesDic = {};
  FRASES.forEach(function (f) { frasesDic[f[0]] = f[1]; });
  var R_FRASES = armar(frasesDic), R_VERBOS = armar(VERBOS), R_LATAM = armar(LATAM), R_ESPANA = armar(ESPANA);

  // ---------- Modo ----------
  function automatico() {
    var zona = "";
    try { zona = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { zona = ""; }
    if (/^America\/(Argentina|Buenos_Aires|Cordoba|Mendoza|Montevideo|Asuncion)/.test(zona)) return "vos";
    if (/^(Europe\/Madrid|Atlantic\/Canary|Africa\/Ceuta)$/.test(zona)) return "es";
    if (!zona) return "vos";
    return "mx";
  }
  function elegido() { try { var v = localStorage.getItem(KEY); return v === "vos" || v === "mx" || v === "es" ? v : ""; } catch (e) { return ""; } }
  var modo = elegido() || automatico();

  function convertir(str) {
    if (typeof str !== "string" || !str || modo === "vos") return str;
    str = aplicar(str, R_FRASES);
    str = aplicar(str, R_VERBOS);
    str = aplicar(str, modo === "es" ? R_ESPANA : R_LATAM);
    return str;
  }
  // Para los módulos: tx() pasa por acá antes de poner los datos ({n}, nombres...).
  APP.tu = function (str) {
    if (typeof state === "undefined" || state.lang !== "es" || modo === "vos") return str;
    if (Array.isArray(str)) return str.map(convertir);
    return convertir(str);
  };
  APP.habla = function () { return modo; };
  // Hemisferio del teléfono (por la zona horaria): las temporadas "Primavera" y "Verano" del pase siguen el
  // calendario del sur. En el norte (México, España, EE. UU.) se llaman "Flores" y "Tropical".
  APP.hemisferioSur = function () {
    var zona = "";
    try { zona = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { zona = ""; }
    if (!zona) return true;
    return /^(America\/(Argentina|Buenos_Aires|Cordoba|Mendoza|Catamarca|Jujuy|Montevideo|Asuncion|Santiago|Punta_Arenas|Sao_Paulo|Bahia|Recife|Fortaleza|Maceio|Belem|Cuiaba|Campo_Grande|Porto_Velho|Rio_Branco|Araguaina|Santarem|Noronha|Manaus|La_Paz|Lima)|Australia\/|Pacific\/(Auckland|Chatham|Fiji|Tongatapu|Easter|Tahiti)|Africa\/(Johannesburg|Maputo|Harare|Windhoek|Lusaka|Gaborone|Maseru|Mbabane|Luanda)|Indian\/(Mauritius|Reunion|Antananarivo)|Antarctica\/)/.test(zona);
  };

  // ---------- Textos globales del juego (se guardan los originales) ----------
  // Si otro módulo cambia un texto después, ese pasa a ser el nuevo original.
  var originales = {}, puestos = {};
  function soloTexto(v) { return typeof v === "string" || (Array.isArray(v) && v.every(soloTexto)); }
  function copia(v) { return Array.isArray(v) ? v.map(copia) : v; }
  function profundo(v) { return Array.isArray(v) ? v.map(profundo) : convertir(v); }
  function convertirObjeto(obj, id) {
    if (!obj) return;
    var orig = originales[id] || (originales[id] = {});
    var puesto = puestos[id] || (puestos[id] = {});
    Object.keys(obj).forEach(function (k) {
      var v = obj[k];
      if (!soloTexto(v)) return;
      if (!(k in orig) || v !== puesto[k]) orig[k] = copia(v);
      obj[k] = puesto[k] = profundo(orig[k]);
    });
  }
  function convertirTodo() {
    convertirObjeto(I18N.es, "i18n");
    if (typeof HOWTO_TEXTS !== "undefined") convertirObjeto(HOWTO_TEXTS.es, "howto");
  }
  convertirTodo();
  // Los módulos que se cargan después suman textos a I18N.es: al terminar de cargar se convierten también.
  document.addEventListener("DOMContentLoaded", function () {
    convertirTodo();
    if (modo !== "vos" && state.lang === "es" && typeof setLanguage === "function") setLanguage("es");
  });

  // Contrarreloj y pack Random: fuera del Río de la Plata no salen "Comida argentina" ni "Palabra en lunfardo";
  // en su lugar va una categoría de allá (o una clásica que no esté ya en la lista).
  var SOLO_ARGENTINA = ["Comida argentina", "Palabra en lunfardo"];
  var EN_SU_LUGAR = { mx: ["Comida mexicana", "Mexicanismo", "Fruta", "Bebida", "Marca"], es: ["Fruta", "Bebida", "Marca", "Verdura", "Deporte"] };
  var sortearAntes = window.pickRandomCategorySet;
  if (typeof sortearAntes === "function") window.pickRandomCategorySet = function () {
    var lista = sortearAntes.apply(this, arguments);
    if (modo === "vos" || typeof state === "undefined" || state.lang !== "es" || !Array.isArray(lista)) return lista;
    var otras = (EN_SU_LUGAR[modo] || EN_SU_LUGAR.mx).filter(function (c) { return lista.indexOf(c) < 0; });
    return lista.map(function (c) { return SOLO_ARGENTINA.indexOf(c) >= 0 && otras.length ? otras.shift() : c; });
  };

  // Elegir a mano (menú de idioma).
  APP.elegirHabla = function (m) {
    modo = m === "vos" || m === "mx" || m === "es" ? m : automatico();
    try { localStorage.setItem(KEY, modo); } catch (e) { /* sin almacenamiento */ }
    convertirTodo();
    if (typeof setLanguage === "function") setLanguage(state.lang);
  };

  // En el menú de idioma, debajo de "Español": cómo te habla el juego.
  var OPCIONES = [["vos", "Rioplatense (vos)"], ["mx", "Latinoamérica (tú)"], ["es", "España (tú)"]];
  function menuHabla() {
    var menu = document.getElementById("langMenu");
    if (!menu) return;
    var caja = document.getElementById("hablaOpciones");
    if (!caja) {
      caja = document.createElement("div");
      caja.id = "hablaOpciones";
      caja.className = "habla-opciones";
      menu.appendChild(caja);
      caja.addEventListener("click", function (e) {
        var b = e.target.closest("[data-habla]");
        if (!b) return;
        e.stopPropagation();
        APP.elegirHabla(b.dataset.habla);
      });
    }
    caja.style.display = state.lang === "es" ? "" : "none";
    caja.innerHTML = '<p class="habla-titulo">Cómo te hablamos</p>' + OPCIONES.map(function (o) {
      return '<button type="button" class="theme-option habla-option' + (o[0] === modo ? " selected" : "") + '" data-habla="' + o[0] + '">' + o[1] + "</button>";
    }).join("");
  }
  var idiomaAntes = window.setLanguage;
  if (typeof idiomaAntes === "function") window.setLanguage = function () { var r = idiomaAntes.apply(this, arguments); menuHabla(); return r; };
  menuHabla();
})();
