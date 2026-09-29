// Juez con IA para objeciones de TuttiPuntoFrutti.
// Corre en el servidor de Netlify, nunca en el navegador de los jugadores:
// es el único lugar donde puede vivir la clave secreta de la API de Anthropic.

const MAX_DISPUTAS = 30;
const MAX_LARGO_PALABRA = 40;
const MAX_LARGO_CATEGORIA = 40;
const TIMEOUT_ANTHROPIC_MS = 9000;

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
Recibís una letra y una lista de respuestas objetadas, cada una con su categoría.
Para cada respuesta decidí si es válida.

Criterios:
- La letra inicial ya fue verificada antes de llegar a vos: NO la evalúes ni la uses como motivo.
- Nunca invalides una respuesta por mayúsculas, minúsculas, tildes o diéresis: "maria", "MARIA", "María" y "maría" son la misma respuesta.
- Debe pertenecer razonablemente a la categoría.
- Aceptá regionalismos de cualquier país hispanohablante (lunfardo, jerga peruana, mexicanismos, etc.), nombres populares y marcas reales cuando la categoría lo admite.
- Aceptá errores menores de ortografía si la palabra es claramente reconocible.
- No conocer una palabra NO es motivo para rechazarla. Existen miles de marcas, comercios, lugares, equipos, artistas y personas locales que quizás no conozcas: si la respuesta podría razonablemente pertenecer a la categoría, es válida.
- Muchas marcas, lugares y equipos se llaman como personas o como palabras comunes (por ejemplo Isadora, Mimo o Lucía son marcas argentinas): que suene a nombre de persona no invalida una respuesta en Marca, ni al revés.
- Rechazá solo lo que claramente no corresponde (por ejemplo "perro" como Color), las letras sin sentido o lo que no es una palabra real.
- Ante la duda razonable, la respuesta es válida.

Respondé SOLO con JSON, sin texto adicional ni bloques de código, con este formato:
{"veredictos":[{"id":"...","valida":true,"motivo":""}]}
Completá "motivo" con una frase breve EN ESPAÑOL solo cuando "valida" sea false.`,
  en: `You are the judge of a word game (tutti frutti / Scattergories-style). You receive a letter and a list of challenged answers, each with its category. For each answer, decide whether it's valid.

Criteria:
- The first letter has already been checked before reaching you: do NOT evaluate it or use it as a reason.
- Never reject an answer because of uppercase, lowercase or accents: "maria", "MARIA", "María" and "maría" are the same answer.
- It must reasonably belong to the category.
- Accept regional terms, slang, common names and real brands when the category allows it.
- Accept minor spelling mistakes if the word is clearly recognizable.
- Not knowing a word is NOT a reason to reject it. There are thousands of local brands, shops, places, teams, artists and people you may not know: if the answer could reasonably belong to the category, it is valid.
- Many brands, places and teams are named like people or common words: sounding like a person's name doesn't invalidate a Brand answer, or the other way around.
- Only reject what clearly doesn't fit (for example "dog" as a Color), random letters or things that aren't real words.
- When in reasonable doubt, the answer is valid.

Respond ONLY with JSON, no extra text or code fences, in this format:
{"veredictos":[{"id":"...","valida":true,"motivo":""}]}
Fill in "motivo" with a short reason IN ENGLISH only when "valida" is false.`,
  pt: `Você é o juiz de um jogo de palavras (tutti frutti / estilo Adedanha). Você recebe uma letra e uma lista de respostas contestadas, cada uma com sua categoria. Para cada resposta, decida se ela é válida.

Critérios:
- A letra inicial já foi verificada antes de chegar a você: NÃO a avalie nem a use como motivo.
- Nunca invalide uma resposta por maiúsculas, minúsculas ou acentos: "maria", "MARIA", "María" e "maría" são a mesma resposta.
- Deve pertencer razoavelmente à categoria.
- Aceite regionalismos, gírias, nomes populares e marcas reais quando a categoria permitir.
- Aceite pequenos erros de ortografia se a palavra for claramente reconhecível.
- Não conhecer uma palavra NÃO é motivo para rejeitá-la. Existem milhares de marcas, lojas, lugares, times, artistas e pessoas locais que você talvez não conheça: se a resposta puder razoavelmente pertencer à categoria, ela é válida.
- Muitas marcas, lugares e times têm nome de pessoa ou de palavra comum: parecer nome de pessoa não invalida uma resposta em Marca, nem o contrário.
- Rejeite só o que claramente não corresponde (por exemplo "cachorro" como Cor), letras sem sentido ou o que não é uma palavra real.
- Em caso de dúvida razoável, a resposta é válida.

Responda APENAS com JSON, sem texto adicional nem blocos de código, neste formato:
{"veredictos":[{"id":"...","valida":true,"motivo":""}]}
Preencha "motivo" com uma frase breve EM PORTUGUÊS somente quando "valida" for false.`,
};

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

  const contenidoUsuario = JSON.stringify({
    letra,
    disputas: paraElJuez.map(d => ({ id: d.id, categoria: d.categoria, palabra: conMayusculaInicial(d.palabra) })),
  });

  let respuestaAnthropic;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_ANTHROPIC_MS);
    respuestaAnthropic = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1000,
        temperature: 0,
        system: promptSistema,
        messages: [{ role: "user", content: contenidoUsuario }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch (e) {
    return jsonResponse(504, { error: "El juez tardó demasiado en responder" });
  }

  if (!respuestaAnthropic.ok) {
    const detalle = await respuestaAnthropic.text().catch(() => "");
    console.error("Error de Anthropic", respuestaAnthropic.status, detalle.slice(0, 500));
    return jsonResponse(502, { error: "El juez no pudo resolver esta ronda" });
  }

  const data = await respuestaAnthropic.json().catch(() => null);
  const texto = (data && data.content && data.content[0] && data.content[0].text) || "";

  let parsed = null;
  try {
    const limpio = texto.trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/, "")
      .replace(/```\s*$/, "");
    parsed = JSON.parse(limpio);
  } catch (e) {
    parsed = null;
  }

  const idsValidos = new Set(paraElJuez.map(d => d.id));
  const veredictos = [];
  if (parsed && Array.isArray(parsed.veredictos)) {
    parsed.veredictos.forEach(v => {
      if (v && typeof v.id === "string" && idsValidos.has(v.id) && !veredictos.some(x => x.id === v.id)) {
        const esValida = v.valida !== false;
        veredictos.push({
          id: v.id,
          valida: esValida,
          motivo: esValida ? "" : String(v.motivo || "").slice(0, 200),
        });
      }
    });
  }
  // Si el JSON vino mal formado o le faltó algún id, esa palabra cuenta
  // como válida — el juego nunca se traba por una respuesta incompleta.
  idsValidos.forEach(id => {
    if (!veredictos.some(v => v.id === id)) {
      veredictos.push({ id, valida: true, motivo: "" });
    }
  });

  return jsonResponse(200, { veredictos: veredictos.concat(veredictosLetra) });
};
