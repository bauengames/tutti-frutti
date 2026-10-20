// Juez con IA para objeciones de TuttiPuntoFrutti.
// Corre en el servidor de Netlify, nunca en el navegador de los jugadores:
// es el único lugar donde puede vivir la clave secreta de la API de Anthropic.
//
// Memoria del juez: lo que ya se decidió se guarda en Firebase (juezMemoria/{idioma}/{categoría}/{palabra})
// y la próxima vez se responde sin preguntarle a la IA (más rápido y más barato).
// - Válidas: se guardan siempre (las aceptó el juez o la apelación).
// - Rechazadas: solo si las confirmó la apelación (el modelo más capaz), para no "aprender" errores del rápido.
// Usa la cuenta de servicio (variable FIREBASE_SERVICE_ACCOUNT, la misma de avisar.js). El nodo no se puede
// leer ni escribir desde los teléfonos (las reglas niegan todo lo que no está listado). Si la variable falta
// o Firebase no contesta a tiempo, el juez funciona igual que antes, sin memoria.

const crypto = require("crypto");
const BASE_DATOS = "https://tuttipuntofrutti-default-rtdb.firebaseio.com";
const TIMEOUT_MEMORIA_MS = 1200;

const MAX_DISPUTAS = 30;
const MAX_LARGO_PALABRA = 40;
const MAX_LARGO_CATEGORIA = 40;
// El juez rápido decide todo; lo que rechaza pasa a una apelación con un modelo más capaz
// (son pocas palabras, así que casi no suma costo). Entre los dos tienen que entrar en el
// límite de 10 s de las funciones de Netlify.
const MODELO_JUEZ = "claude-haiku-4-5";
const MODELO_APELACION = "claude-sonnet-5-5";
const TIMEOUT_JUEZ_MS = 4500;
const PRESUPUESTO_TOTAL_MS = 9000;
const TIMEOUT_MIN_APELACION_MS = 2500;

// Limitador básico en memoria: se resetea cada vez que Netlify arranca una
// instancia nueva de la función, así que NO es una defensa fuerte contra
// abuso sostenido — solo frena ráfagas obvias desde una misma IP. Una
// protección real necesitaría una base de datos compartida (fuera de
// alcance de esta fase).
const llamadasRecientes = new Map();
const VENTANA_RATE_LIMIT_MS = 60 * 1000;
const MAX_LLAMADAS_POR_VENTANA = 10;

function estaBloqueadoPorRateLimit(ip) {
  const ahora = Date.now();
  const llamadas = (llamadasRecientes.get(ip) || []).filter(t => ahora - t < VENTANA_RATE_LIMIT_MS);
  if (llamadas.length >= MAX_LLAMADAS_POR_VENTANA) return true;
  llamadas.push(ahora);
  llamadasRecientes.set(ip, llamadas);
  return false;
}

const PROMPTS_SISTEMA = {
  es: `Sos el juez de un juego de tutti frutti (también llamado Stop, Basta o Bachillerato) que se juega en toda Latinoamérica y España.
Recibís una lista de respuestas objetadas, cada una con su categoría.
Para cada respuesta decidí si es válida.

Criterios:
- La letra inicial ya fue verificada antes de llegar a vos: NO la evalúes ni la uses como motivo.
- Nunca invalides una respuesta por mayúsculas, minúsculas, tildes o diéresis: "maria", "MARIA", "María" y "maría" son la misma respuesta.
- Debe pertenecer razonablemente a la categoría.
- Aceptá regionalismos de cualquier país hispanohablante (lunfardo, jerga peruana, mexicanismos, etc.), nombres populares y marcas reales cuando la categoría lo admite.
- Aceptá errores menores de ortografía si la palabra es claramente reconocible, salvo que el error cambie la primera letra de la palabra bien escrita: "qiwi" (kiwi), "zandía" (sandía), "vestruz" (avestruz), "omero" (Homero) o "sapallo" (zapallo) son inválidas, porque así se hace trampa con la letra de la ronda.
- No conocer una palabra NO es motivo para rechazarla. Existen miles de marcas, comercios, lugares, equipos, artistas y personas locales que quizás no conozcas: si la respuesta podría razonablemente pertenecer a la categoría, es válida.
- Muchas marcas, lugares y equipos se llaman como personas o como palabras comunes (por ejemplo Isadora, Mimo o Lucía son marcas argentinas): que suene a nombre de persona no invalida una respuesta en Marca, ni al revés.
- Las respuestas de varias palabras son válidas ("Salto en alto", "Pez espada", "Milanesa a la napolitana", "Río de Janeiro").
- Interpretá cada categoría en sentido amplio, como lo haría un grupo de amigos jugando. Por ejemplo:
  · Deporte: deportes de equipo e individuales, disciplinas y pruebas (salto en alto, salto con garrocha, jabalina, lanzamiento de bala, 100 metros llanos, maratón, nado mariposa), modalidades y variantes (fútbol 5, vóley playa, esquí acuático) y deportes mentales o de motor (ajedrez, automovilismo).
  · Animal: especies, razas, crías e insectos (caniche, pez espada, renacuajo, hormiga). · Comida: platos, preparaciones, ingredientes, postres y snacks.
  · Profesión: oficios, trabajos y ocupaciones (plomero, influencer, niñera). · Objeto: cualquier cosa material que se pueda tocar.
  · Nombre/Apellido: de cualquier origen, también apodos comunes. · Ciudad/País: también capitales, pueblos y nombres en otros idiomas.
- Sé coherente: si aceptarías una respuesta, aceptá también las del mismo tipo (si "Jabalina" vale como Deporte, también "Salto en alto").
- Rechazá solo lo que claramente no corresponde (por ejemplo "perro" como Color), las letras sin sentido o lo que no es una palabra real.
- Ante la duda razonable, la respuesta es válida.

Respondé SOLO con JSON, sin texto adicional ni bloques de código, con este formato:
{"veredictos":[{"id":"...","valida":true,"motivo":""}]}
Completá "motivo" con una frase breve EN ESPAÑOL solo cuando "valida" sea false.`,
  en: `You are the judge of a word game (tutti frutti / Scattergories-style). You receive a list of challenged answers, each with its category. For each answer, decide whether it's valid.

Criteria:
- The first letter has already been checked before reaching you: do NOT evaluate it or use it as a reason.
- Never reject an answer because of uppercase, lowercase or accents: "maria", "MARIA", "María" and "maría" are the same answer.
- It must reasonably belong to the category.
- Accept regional terms, slang, common names and real brands when the category allows it.
- Accept minor spelling mistakes if the word is clearly recognizable, unless the mistake changes the first letter of the correctly spelled word: "qiwi" (kiwi), "nife" (knife), "rite" (write) or "zukini" (zucchini) are invalid, because that's cheating on the round's letter.
- Not knowing a word is NOT a reason to reject it. There are thousands of local brands, shops, places, teams, artists and people you may not know: if the answer could reasonably belong to the category, it is valid.
- Many brands, places and teams are named like people or common words: sounding like a person's name doesn't invalidate a Brand answer, or the other way around.
- Multi-word answers are valid ("High jump", "Swordfish", "Rio de Janeiro").
- Read each category broadly, the way a group of friends playing would. For example:
  · Sport: team and individual sports, disciplines and events (high jump, pole vault, javelin, shot put, 100 meters, marathon, butterfly stroke), variants (beach volleyball, five-a-side, water skiing) and mind or motor sports (chess, motor racing).
  · Animal: species, breeds, young animals and insects (poodle, swordfish, tadpole, ant). · Food: dishes, preparations, ingredients, desserts and snacks.
  · Job: trades, jobs and occupations (plumber, influencer, babysitter). · Object: any physical thing you can touch.
  · Name/Surname: from any origin, including common nicknames. · City/Country: also capitals, towns and names in other languages.
- Be consistent: if you would accept an answer, accept others of the same kind (if "Javelin" is a Sport, so is "High jump").
- Only reject what clearly doesn't fit (for example "dog" as a Color), random letters or things that aren't real words.
- When in reasonable doubt, the answer is valid.

Respond ONLY with JSON, no extra text or code fences, in this format:
{"veredictos":[{"id":"...","valida":true,"motivo":""}]}
Fill in "motivo" with a short reason IN ENGLISH only when "valida" is false.`,
  pt: `Você é o juiz de um jogo de palavras (tutti frutti / estilo Adedanha). Você recebe uma lista de respostas contestadas, cada uma com sua categoria. Para cada resposta, decida se ela é válida.

Critérios:
- A letra inicial já foi verificada antes de chegar a você: NÃO a avalie nem a use como motivo.
- Nunca invalide uma resposta por maiúsculas, minúsculas ou acentos: "maria", "MARIA", "María" e "maría" são a mesma resposta.
- Deve pertencer razoavelmente à categoria.
- Aceite regionalismos, gírias, nomes populares e marcas reais quando a categoria permitir.
- Aceite pequenos erros de ortografia se a palavra for claramente reconhecível, a não ser que o erro mude a primeira letra da palavra bem escrita: "qiwi" (kiwi), "zapo" (sapo) ou "omem" (homem) são inválidas, porque assim se trapaceia com a letra da rodada.
- Não conhecer uma palavra NÃO é motivo para rejeitá-la. Existem milhares de marcas, lojas, lugares, times, artistas e pessoas locais que você talvez não conheça: se a resposta puder razoavelmente pertencer à categoria, ela é válida.
- Muitas marcas, lugares e times têm nome de pessoa ou de palavra comum: parecer nome de pessoa não invalida uma resposta em Marca, nem o contrário.
- Respostas com várias palavras são válidas ("Salto em altura", "Peixe-espada", "Rio de Janeiro").
- Interprete cada categoria em sentido amplo, como faria um grupo de amigos jogando. Por exemplo:
  · Esporte: esportes coletivos e individuais, modalidades e provas (salto em altura, salto com vara, lançamento de dardo, arremesso de peso, 100 metros rasos, maratona, nado borboleta), variantes (vôlei de praia, futsal, esqui aquático) e esportes mentais ou de motor (xadrez, automobilismo).
  · Animal: espécies, raças, filhotes e insetos (poodle, peixe-espada, girino, formiga). · Comida: pratos, preparações, ingredientes, sobremesas e lanches.
  · Profissão: ofícios, trabalhos e ocupações (encanador, influencer, babá). · Objeto: qualquer coisa material que se possa tocar.
  · Nome/Sobrenome: de qualquer origem, também apelidos comuns. · Cidade/País: também capitais, vilarejos e nomes em outros idiomas.
- Seja coerente: se você aceitaria uma resposta, aceite também as do mesmo tipo (se "Dardo" vale como Esporte, "Salto em altura" também).
- Rejeite só o que claramente não corresponde (por exemplo "cachorro" como Cor), letras sem sentido ou o que não é uma palavra real.
- Em caso de dúvida razoável, a resposta é válida.

Responda APENAS com JSON, sem texto adicional nem blocos de código, neste formato:
{"veredictos":[{"id":"...","valida":true,"motivo":""}]}
Preencha "motivo" com uma frase breve EM PORTUGUÊS somente quando "valida" for false.`,
};

// Segunda opinión: solo para las respuestas que el primer juez rechazó.
const PROMPTS_APELACION = {
  es: `Sos el juez de apelación de un juego de tutti frutti (Stop, Basta). Otro juez rechazó estas respuestas y los jugadores apelaron, porque a veces rechaza palabras que sí corresponden.
Revisá cada una con criterio amplio, como lo haría un grupo de amigos que juega: si la respuesta pertenece razonablemente a la categoría (aunque sea una disciplina, una variante, un caso particular, un regionalismo o algo poco conocido), es válida. Las respuestas de varias palabras valen. La letra inicial ya fue verificada: no la evalúes.
Confirmá el rechazo SOLO si la respuesta claramente no corresponde a la categoría, no es una palabra real, o está mal escrita de forma que cambia su primera letra ("qiwi" por kiwi, "zandía" por sandía).
Respondé SOLO con JSON, sin texto adicional ni bloques de código:
{"veredictos":[{"id":"...","valida":true,"motivo":""}]}
Completá "motivo" con una frase breve EN ESPAÑOL solo cuando "valida" sea false.`,
  en: `You are the appeals judge of a word game (Scattergories-style). Another judge rejected these answers and the players appealed, because it sometimes rejects words that do fit.
Review each one broadly, the way a group of friends playing would: if the answer reasonably belongs to the category (even if it's a discipline, a variant, a specific case, a regional term or something little known), it is valid. Multi-word answers count. The first letter was already checked: don't evaluate it.
Confirm the rejection ONLY if the answer clearly doesn't fit the category, isn't a real word, or is misspelled in a way that changes its first letter ("qiwi" for kiwi, "nife" for knife).
Respond ONLY with JSON, no extra text or code fences:
{"veredictos":[{"id":"...","valida":true,"motivo":""}]}
Fill in "motivo" with a short reason IN ENGLISH only when "valida" is false.`,
  pt: `Você é o juiz de apelação de um jogo de palavras (Adedanha, Stop). Outro juiz rejeitou estas respostas e os jogadores apelaram, porque às vezes ele rejeita palavras que correspondem.
Revise cada uma com critério amplo, como faria um grupo de amigos jogando: se a resposta pertence razoavelmente à categoria (mesmo que seja uma modalidade, uma variante, um caso particular, um regionalismo ou algo pouco conhecido), ela é válida. Respostas com várias palavras valem. A letra inicial já foi verificada: não a avalie.
Confirme a rejeição SOMENTE se a resposta claramente não corresponde à categoria, não é uma palavra real, ou está escrita errado de um jeito que muda a primeira letra ("qiwi" por kiwi, "zapo" por sapo).
Responda APENAS com JSON, sem texto adicional nem blocos de código:
{"veredictos":[{"id":"...","valida":true,"motivo":""}]}
Preencha "motivo" com uma frase breve EM PORTUGUÊS somente quando "valida" for false.`,
};

// Llama al modelo y devuelve los veredictos que vinieron bien formados (id -> veredicto),
// o null si falló, tardó demasiado o la respuesta no se pudo leer.
async function pedirVeredictos(apiKey, modelo, sistema, disputas, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: modelo,
        max_tokens: 1000,
        temperature: 0,
        system: sistema,
        messages: [{ role: "user", content: JSON.stringify({ disputas }) }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const detalle = await res.text().catch(() => "");
      console.error("Error de Anthropic", modelo, res.status, detalle.slice(0, 500));
      return null;
    }
    const data = await res.json().catch(() => null);
    const texto = (data && data.content && data.content[0] && data.content[0].text) || "";
    let parsed = null;
    try {
      parsed = JSON.parse(texto.trim().replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, ""));
    } catch (e) {
      parsed = null;
    }
    if (!parsed || !Array.isArray(parsed.veredictos)) return null;
    const ids = new Set(disputas.map(d => d.id));
    const mapa = new Map();
    parsed.veredictos.forEach(v => {
      if (v && typeof v.id === "string" && ids.has(v.id) && !mapa.has(v.id)) {
        const valida = v.valida !== false;
        mapa.set(v.id, { id: v.id, valida, motivo: valida ? "" : String(v.motivo || "").slice(0, 200) });
      }
    });
    return mapa;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Compara sin tildes ni mayúsculas, pero la Ñ sigue siendo una letra distinta de la N.
function sinTildes(texto) {
  return texto.toLowerCase()
    .replace(/ñ/g, "\u0000")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0000/g, "ñ");
}

function empiezaConLetra(palabra, letra) {
  const p = sinTildes(palabra).replace(/^[^a-zñ0-9]+/, "");
  const l = sinTildes(letra).trim();
  return l.length > 0 && p.startsWith(l);
}

// "maria de los angeles" -> "Maria De Los Angeles": así el juez no confunde un nombre
// escrito en minúscula con una palabra común.
function conMayusculaInicial(palabra) {
  return palabra.trim().toLowerCase().replace(/(^|[\s-])(\S)/g, (m, sep, c) => sep + c.toUpperCase());
}

// ---------- Memoria (Firebase con la cuenta de servicio) ----------
function b64url(x) { return Buffer.from(x).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"); }
let acceso = null, accesoHasta = 0;
async function tokenDeAcceso() {
  if (acceso && Date.now() < accesoHasta) return acceso;
  const cuenta = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
  if (!cuenta.client_email || !cuenta.private_key) throw new Error("sin cuenta de servicio");
  const ahora = Math.floor(Date.now() / 1000);
  const cabecera = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const cuerpo = b64url(JSON.stringify({
    iss: cuenta.client_email, aud: "https://oauth2.googleapis.com/token", iat: ahora, exp: ahora + 3600,
    scope: "https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email",
  }));
  const firma = b64url(crypto.createSign("RSA-SHA256").update(cabecera + "." + cuerpo).sign(cuenta.private_key));
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + cabecera + "." + cuerpo + "." + firma,
  });
  const datos = await r.json();
  if (!datos.access_token) throw new Error("sin acceso");
  acceso = datos.access_token;
  accesoHasta = Date.now() + 50 * 60 * 1000;
  return acceso;
}
// Promesa con tiempo límite: si Firebase tarda, se sigue sin memoria.
function conLimite(promesa, ms) {
  return Promise.race([promesa, new Promise(resolver => setTimeout(() => resolver(null), ms))]);
}
// Clave segura para Firebase: sin tildes, en minúscula, espacios simples y sin . $ # [ ] /
function clave(texto) {
  return sinTildes(String(texto || "")).trim().replace(/\s+/g, " ").replace(/[.$#[\]\/\u0000-\u001f\u007f]/g, "_").slice(0, 60);
}
function rutaMemoria(idioma, categoria, palabra) {
  const c = clave(categoria), p = clave(palabra);
  if (!c || !p) return null;
  return "juezMemoria/" + idioma + "/" + encodeURIComponent(c) + "/" + encodeURIComponent(p);
}
// Devuelve id -> { id, valida, motivo } con lo que ya se sabía.
async function recordar(idioma, disputas) {
  const sabidas = new Map();
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) return sabidas;
  try {
    const token = await conLimite(tokenDeAcceso(), TIMEOUT_MEMORIA_MS);
    if (!token) return sabidas;
    const resultados = await conLimite(Promise.all(disputas.map(async d => {
      const ruta = rutaMemoria(idioma, d.categoria, d.palabra);
      if (!ruta) return null;
      const r = await fetch(`${BASE_DATOS}/${ruta}.json`, { headers: { Authorization: "Bearer " + token } });
      const v = r.ok ? await r.json() : null;
      if (v === 1) return { id: d.id, valida: true, motivo: "" };
      if (v && v.v === 0) return { id: d.id, valida: false, motivo: String(v.m || "").slice(0, 200) };
      return null;
    })), TIMEOUT_MEMORIA_MS);
    (resultados || []).forEach(x => { if (x) sabidas.set(x.id, x); });
  } catch (e) {
    console.error("Memoria del juez (leer)", e && e.message);
  }
  return sabidas;
}
// Guarda lo decidido. Las rechazadas solo si las confirmó la apelación.
async function aprender(idioma, disputas, veredictos, confirmadasPorApelacion) {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) return;
  try {
    const token = await conLimite(tokenDeAcceso(), TIMEOUT_MEMORIA_MS);
    if (!token) return;
    const escrituras = disputas.map(d => {
      const v = veredictos.get(d.id);
      if (!v) return null;
      const ruta = rutaMemoria(idioma, d.categoria, d.palabra);
      if (!ruta) return null;
      let valor = null;
      if (v.valida) valor = 1;
      else if (confirmadasPorApelacion.has(d.id)) valor = { v: 0, m: String(v.motivo || "").slice(0, 120) };
      if (valor === null) return null;
      return fetch(`${BASE_DATOS}/${ruta}.json`, { method: "PUT", headers: { Authorization: "Bearer " + token }, body: JSON.stringify(valor) });
    }).filter(Boolean);
    await conLimite(Promise.all(escrituras), TIMEOUT_MEMORIA_MS);
  } catch (e) {
    console.error("Memoria del juez (guardar)", e && e.message);
  }
}

const MOTIVO_LETRA = {
  es: "No empieza con la letra de la ronda",
  en: "Doesn't start with the round's letter",
  pt: "Não começa com a letra da rodada",
};

const HOSTS_PERMITIDOS = new Set([
  "tuttipuntofrutti.com",
  "www.tuttipuntofrutti.com",
  "tuttipuntofrutti.netlify.app",
  "localhost",
  "127.0.0.1",
]);

function esOrigenPermitido(origen) {
  let host;
  try {
    host = new URL(origen).hostname;
  } catch (e) {
    return false;
  }
  // Los deploy previews de Netlify tienen la forma "algo--tuttipuntofrutti.netlify.app".
  return HOSTS_PERMITIDOS.has(host) || host.endsWith("--tuttipuntofrutti.netlify.app");
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Método no permitido" });
  }

  // Chequeo débil de origen: no es una barrera de seguridad real (se puede
  // falsificar desde fuera de un navegador), pero filtra pedidos obviamente
  // ajenos al juego. Los navegadores siempre mandan Origin en un POST.
  const origen = event.headers.origin || event.headers.referer || "";
  if (!esOrigenPermitido(origen)) {
    return jsonResponse(403, { error: "Origen no permitido" });
  }

  const ip = event.headers["x-nf-client-connection-ip"] || event.headers["client-ip"] || "desconocida";
  if (estaBloqueadoPorRateLimit(ip)) {
    return jsonResponse(429, { error: "Demasiadas consultas, esperá un momento" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return jsonResponse(400, { error: "JSON inválido" });
  }

  const { salaId, ronda, letra, disputas, idioma } = body;
  if (typeof salaId !== "string" || typeof letra !== "string" || !Array.isArray(disputas)) {
    return jsonResponse(400, { error: "Formato de pedido inválido" });
  }
  const promptSistema = PROMPTS_SISTEMA[idioma] || PROMPTS_SISTEMA.es;
  if (disputas.length === 0) {
    return jsonResponse(200, { veredictos: [] });
  }
  if (disputas.length > MAX_DISPUTAS) {
    return jsonResponse(400, { error: "Demasiadas disputas en un solo pedido" });
  }
  for (const d of disputas) {
    if (!d || typeof d.id !== "string" || typeof d.categoria !== "string" || typeof d.palabra !== "string") {
      return jsonResponse(400, { error: "Una disputa tiene formato inválido" });
    }
    if (d.categoria.length > MAX_LARGO_CATEGORIA || d.palabra.length > MAX_LARGO_PALABRA) {
      return jsonResponse(400, { error: "Palabra o categoría demasiado larga" });
    }
    // En los jefes de la Aventura cada categoría tiene su propia letra.
    if (d.letra !== undefined && (typeof d.letra !== "string" || d.letra.length > 2)) {
      return jsonResponse(400, { error: "Una disputa tiene formato inválido" });
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: "Falta configurar la clave del juez en el servidor" });
  }

  const idioma2 = PROMPTS_SISTEMA[idioma] ? idioma : "es";
  const letraDe = d => (typeof d.letra === "string" && d.letra ? d.letra : letra);
  const conLetraMal = disputas.filter(d => !empiezaConLetra(d.palabra, letraDe(d)));
  const paraElJuez = disputas.filter(d => empiezaConLetra(d.palabra, letraDe(d)));
  const veredictosLetra = conLetraMal.map(d => ({ id: d.id, valida: false, motivo: MOTIVO_LETRA[idioma2] }));
  if (paraElJuez.length === 0) {
    return jsonResponse(200, { veredictos: veredictosLetra });
  }

  // La letra ya se verificó acá arriba: al juez solo le llegan categoría y palabra, así no la confunde.
  const inicio = Date.now();
  const todas = paraElJuez.map(d => ({ id: d.id, categoria: d.categoria, palabra: conMayusculaInicial(d.palabra) }));

  // Primero la memoria: lo que ya se decidió antes no se le vuelve a preguntar a la IA.
  const sabidas = await recordar(idioma2, todas);
  const disputasJuez = todas.filter(d => !sabidas.has(d.id));
  if (disputasJuez.length === 0) {
    return jsonResponse(200, { veredictos: todas.map(d => sabidas.get(d.id)).concat(veredictosLetra) });
  }

  const primera = await pedirVeredictos(apiKey, MODELO_JUEZ, promptSistema, disputasJuez, TIMEOUT_JUEZ_MS);
  if (!primera) {
    return jsonResponse(502, { error: "El juez no pudo resolver esta ronda" });
  }

  // Apelación: las rechazadas las revisa un modelo más capaz. Si no llega a tiempo,
  // queda lo que dijo el primer juez.
  const rechazadas = disputasJuez.filter(d => primera.has(d.id) && !primera.get(d.id).valida);
  // Se guarda tiempo para escribir en la memoria al final.
  const restante = PRESUPUESTO_TOTAL_MS - TIMEOUT_MEMORIA_MS - (Date.now() - inicio);
  const confirmadas = new Set();
  if (rechazadas.length > 0 && restante >= TIMEOUT_MIN_APELACION_MS) {
    const apelacion = await pedirVeredictos(apiKey, MODELO_APELACION, PROMPTS_APELACION[idioma2],
      rechazadas.map(d => ({ ...d, motivoDelPrimerJuez: primera.get(d.id).motivo })), restante);
    if (apelacion) {
      apelacion.forEach((v, id) => { primera.set(id, v); if (!v.valida) confirmadas.add(id); });
    }
  }

  await aprender(idioma2, disputasJuez, primera, confirmadas);

  // Si al primer juez le faltó algún id, esa palabra cuenta como válida:
  // el juego nunca se traba por una respuesta incompleta.
  const veredictos = todas.map(d => sabidas.get(d.id) || primera.get(d.id) || { id: d.id, valida: true, motivo: "" });

  return jsonResponse(200, { veredictos: veredictos.concat(veredictosLetra) });
};
