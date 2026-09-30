// Respuestas del rival automático (Frutibot) para "Al azar" cuando no aparece nadie.
// Corre en el servidor de Netlify por el mismo motivo que el juez: la clave de la API
// de Anthropic nunca puede estar en el navegador.

const MAX_CATEGORIAS = 12;
const MAX_LARGO_CATEGORIA = 40;
const MAX_LARGO_PALABRA = 40;
const TIMEOUT_ANTHROPIC_MS = 9000;

// Limitador básico en memoria, igual que el del juez: solo frena ráfagas obvias.
const llamadasRecientes = new Map();
const VENTANA_RATE_LIMIT_MS = 60 * 1000;
const MAX_LLAMADAS_POR_VENTANA = 12;

function estaBloqueadoPorRateLimit(ip) {
  const ahora = Date.now();
  const llamadas = (llamadasRecientes.get(ip) || []).filter(t => ahora - t < VENTANA_RATE_LIMIT_MS);
  if (llamadas.length >= MAX_LLAMADAS_POR_VENTANA) return true;
  llamadas.push(ahora);
  llamadasRecientes.set(ip, llamadas);
  return false;
}

const PROMPTS_SISTEMA = {
  es: `Sos un jugador de tutti frutti (también llamado Stop o Basta) de nivel intermedio.
Recibís una letra y una lista de categorías. Para cada categoría escribí UNA respuesta real que empiece con esa letra, como la escribiría una persona común en una partida: palabras conocidas, no rebuscadas.
Si en una categoría no se te ocurre nada razonable, dejala vacía ("").
Respondé SOLO con JSON, sin texto adicional ni bloques de código, con este formato:
{"respuestas":{"Categoría":"respuesta"}}`,
  en: `You are an average player of a word game like Scattergories.
You receive a letter and a list of categories. For each category write ONE real answer that starts with that letter, like a regular person would during a game: well-known words, nothing obscure.
If nothing reasonable comes to mind for a category, leave it empty ("").
Respond ONLY with JSON, no extra text or code fences, in this format:
{"respuestas":{"Category":"answer"}}`,
  pt: `Você é um jogador mediano de um jogo de palavras como Adedanha (Stop).
Você recebe uma letra e uma lista de categorias. Para cada categoria escreva UMA resposta real que comece com essa letra, como uma pessoa comum escreveria numa partida: palavras conhecidas, nada rebuscado.
Se nada razoável vier à mente numa categoria, deixe vazio ("").
Responda APENAS com JSON, sem texto adicional nem blocos de código, neste formato:
{"respuestas":{"Categoria":"resposta"}}`,
};

// Compara sin tildes ni mayúsculas, pero la Ñ sigue siendo una letra distinta de la N.
function sinTildes(texto) {
  return texto.toLowerCase()
    .replace(/ñ/g, "\u0000")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\u0000/g, "ñ");
}

function empiezaConLetra(palabra, letra) {
  const p = sinTildes(palabra).replace(/^[^a-zñ0-9]+/, "");
  const l = sinTildes(letra).trim();
  return l.length > 0 && p.startsWith(l);
}

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
  const { letra, categorias, idioma } = body;
  if (typeof letra !== "string" || letra.length < 1 || letra.length > 2 || !Array.isArray(categorias)) {
    return jsonResponse(400, { error: "Formato de pedido inválido" });
  }
  if (categorias.length === 0 || categorias.length > MAX_CATEGORIAS) {
    return jsonResponse(400, { error: "Cantidad de categorías inválida" });
  }
  if (categorias.some(c => typeof c !== "string" || !c.trim() || c.length > MAX_LARGO_CATEGORIA)) {
    return jsonResponse(400, { error: "Una categoría tiene formato inválido" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: "Falta configurar la clave en el servidor" });
  }

  const promptSistema = PROMPTS_SISTEMA[idioma] || PROMPTS_SISTEMA.es;
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
        max_tokens: 600,
        temperature: 1,
        system: promptSistema,
        messages: [{ role: "user", content: JSON.stringify({ letra: letra.toUpperCase(), categorias }) }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch (e) {
    return jsonResponse(504, { error: "Tardó demasiado en responder" });
  }
  if (!respuestaAnthropic.ok) {
    const detalle = await respuestaAnthropic.text().catch(() => "");
    console.error("Error de Anthropic", respuestaAnthropic.status, detalle.slice(0, 500));
    return jsonResponse(502, { error: "No se pudieron armar las respuestas" });
  }

  const data = await respuestaAnthropic.json().catch(() => null);
  const texto = (data && data.content && data.content[0] && data.content[0].text) || "";
  let parsed = null;
  try {
    parsed = JSON.parse(texto.trim().replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, ""));
  } catch (e) {
    parsed = null;
  }

  // Solo se devuelven respuestas de las categorías pedidas que empiecen con la letra.
  const respuestas = {};
  const crudas = (parsed && parsed.respuestas && typeof parsed.respuestas === "object") ? parsed.respuestas : {};
  categorias.forEach(cat => {
    const v = typeof crudas[cat] === "string" ? crudas[cat].trim().replace(/[.#$\[\]\/]/g, "").slice(0, MAX_LARGO_PALABRA) : "";
    if (v && empiezaConLetra(v, letra)) respuestas[cat] = v;
  });
  return jsonResponse(200, { respuestas });
};
