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

const PROMPT_SISTEMA = `Sos el juez de un juego de tutti frutti en español rioplatense (Argentina).
Recibís una letra y una lista de respuestas objetadas, cada una con su categoría.
Para cada respuesta decidí si es válida.

Criterios:
- Debe empezar con la letra indicada (ignorando tildes y mayúsculas).
- Debe pertenecer razonablemente a la categoría.
- Aceptá regionalismos, lunfardo, nombres populares y marcas reales cuando la categoría lo admite.
- Aceptá errores menores de ortografía si la palabra es claramente reconocible.
- Ante la duda razonable, la respuesta es válida.

Respondé SOLO con JSON, sin texto adicional ni bloques de código, con este formato:
{"veredictos":[{"id":"...","valida":true,"motivo":""}]}
Completá "motivo" con una frase breve solo cuando "valida" sea false.`;

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
  // falsificar), pero filtra pedidos obviamente ajenos al juego.
  const origen = event.headers.origin || event.headers.referer || "";
  if (origen && !origen.includes("tuttipuntofrutti.netlify.app") && !origen.includes("localhost")) {
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

  const { salaId, ronda, letra, disputas } = body;
  if (typeof salaId !== "string" || typeof letra !== "string" || !Array.isArray(disputas)) {
    return jsonResponse(400, { error: "Formato de pedido inválido" });
  }
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
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: "Falta configurar la clave del juez en el servidor" });
  }

  const contenidoUsuario = JSON.stringify({
    letra,
    disputas: disputas.map(d => ({ id: d.id, categoria: d.categoria, palabra: d.palabra })),
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
        system: PROMPT_SISTEMA,
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
    return jsonResponse(502, { error: "El juez no pudo resolver esta ronda", detalle: detalle.slice(0, 200) });
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

  const idsValidos = new Set(disputas.map(d => d.id));
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

  return jsonResponse(200, { veredictos });
};
