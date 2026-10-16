// Números del desafío del día para la app: cuántos jugaron y a qué porcentaje le ganaste.
// Va en netlify/functions/diario.js del sitio. Lee daily/{fecha} con la cuenta de servicio (las reglas no
// dejan que un teléfono lea más que el top 10) y devuelve solo números, nunca nombres.
// Necesita la variable de entorno FIREBASE_SERVICE_ACCOUNT (la misma de avisar.js y juez.js).
//
// Pedido (POST): { fecha: "2026-10-16", puntos: 120 }   (puntos es opcional)
// Respuesta:     { jugaron: 1240, mejorQue: 70 }        (mejorQue solo si mandaste puntos)
// Cada fecha se lee como mucho una vez cada 3 minutos (queda en memoria mientras la función sigue viva).

const crypto = require("crypto");

const BASE = "https://tuttipuntofrutti-default-rtdb.firebaseio.com";
const CACHE_MS = 3 * 60 * 1000;

const b64url = (buf) => Buffer.from(buf).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
const responder = (status, cuerpo) => ({ statusCode: status, headers: { "Content-Type": "application/json" }, body: JSON.stringify(cuerpo) });

// ---------- Acceso de administrador (cuenta de servicio) ----------
let acceso = null, accesoHasta = 0;
async function tokenDeAcceso() {
  if (acceso && Date.now() < accesoHasta) return acceso;
  const cuenta = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
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

// Puntajes del día (ordenados), con memoria de unos minutos.
const memoria = {};
async function puntajes(fecha) {
  const m = memoria[fecha];
  if (m && Date.now() - m.at < CACHE_MS) return m.lista;
  const r = await fetch(`${BASE}/daily/${fecha}.json`, { headers: { Authorization: "Bearer " + (await tokenDeAcceso()) } });
  const datos = r.ok ? await r.json() : null;
  const lista = Object.values(datos || {}).map((x) => Number(x && x.score) || 0).sort((a, b) => a - b);
  memoria[fecha] = { at: Date.now(), lista };
  return lista;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return responder(405, { error: "método" });
  let pedido;
  try { pedido = JSON.parse(event.body || "{}"); } catch (e) { return responder(400, { error: "pedido" }); }
  const fecha = String(pedido.fecha || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return responder(400, { error: "fecha" });
  try {
    const lista = await puntajes(fecha);
    const salida = { jugaron: lista.length };
    if (pedido.puntos != null && lista.length > 1) {
      const p = Number(pedido.puntos) || 0;
      // Cuántos hicieron menos que vos, sin contarte a vos mismo.
      let menos = 0;
      while (menos < lista.length && lista[menos] < p) menos++;
      salida.mejorQue = Math.min(100, Math.round((100 * menos) / (lista.length - 1)));
    }
    return responder(200, salida);
  } catch (e) {
    return responder(500, { error: "servidor" });
  }
};
