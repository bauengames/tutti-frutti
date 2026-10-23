// Notificaciones de tutti.frutti (app de iPhone): un jugador le pide al servidor que le avise algo a otro.
// Va en netlify/functions/avisar.js del sitio. No usa librerías: verifica la credencial de Firebase del que
// pide, lee la base con la cuenta de servicio y manda la notificación por Firebase Cloud Messaging.
// Necesita la variable de entorno FIREBASE_SERVICE_ACCOUNT (el JSON completo de la cuenta de servicio).
//
// Tipos (cada uno se verifica en la base antes de mandar):
//   duelo         → el que pide creó el duelo, el destino es su amigo y el duelo está en su bandeja.
//   duelo_ganado  → el destino creó el duelo y el que pide lo jugó con más puntos.
//   liga          → los dos están en el mismo grupo de la liga de esta semana y el que pide tiene más XP.
//   amigo         → el que pide y el destino ya son amigos (los dos lados de la lista).
//   solicitud     → el que pide le mandó una solicitud de amistad al destino (friendRequests/{destino}/{quien}).
//   record        → son amigos y el mejor Contrarreloj del que pide es mayor que el del destino.
//   turno         → duelo por turnos (partidas/{id}): los dos son jugadores del duelo y ahora le toca al destino.
//   prueba        → un aviso a uno mismo, para probar que las notificaciones llegan (solo a tu propio teléfono).
// Límite: cada destino recibe como mucho un aviso de cada tipo cada cierto tiempo (avisos/{uid}/{tipo}).

const crypto = require("crypto");

const PROYECTO = "tuttipuntofrutti";
const BASE = "https://tuttipuntofrutti-default-rtdb.firebaseio.com";
const ESPERA_MS = { duelo: 2 * 60 * 1000, duelo_ganado: 2 * 60 * 1000, liga: 6 * 60 * 60 * 1000, amigo: 24 * 60 * 60 * 1000, solicitud: 24 * 60 * 60 * 1000, record: 6 * 60 * 60 * 1000, prueba: 60 * 1000, turno: 60 * 1000 };

const TEXTOS = {
  es: {
    amigo: ["¡Tenés un amigo nuevo!", "{n} te agregó como amigo. ¿Le mandás un duelo?"],
    solicitud: ["¡Te quieren de amigo!", "{n} te mandó una solicitud de amistad."],
    record: ["¡Te superaron en Contrarreloj!", "{n} superó tu mejor puntaje. ¿Lo recuperás?"],
    prueba: ["¡Funciona!", "Las notificaciones de tutti.frutti te llegan bien."],
    duelo: ["¡Te desafiaron!", "{n} te mandó un duelo. ¿Te animás?"],
    duelo_ganado: ["¡Te ganaron el duelo!", "{n} hizo más puntos que vos. ¿Revancha?"],
    liga: ["¡Te pasaron en la liga!", "{n} te pasó en la liga de esta semana. Jugá y recuperá tu lugar."],
    turno: ["¡Te toca!", "{n} jugó su turno en el duelo. ¡Te toca!"],
  },
  en: {
    amigo: ["You have a new friend!", "{n} added you as a friend. Send them a duel?"],
    solicitud: ["New friend request!", "{n} sent you a friend request."],
    record: ["Your record was beaten!", "{n} beat your best Time Attack score. Win it back?"],
    prueba: ["It works!", "tutti.frutti notifications are reaching you."],
    duelo: ["You've been challenged!", "{n} sent you a duel. Up for it?"],
    duelo_ganado: ["You lost the duel!", "{n} scored more than you. Rematch?"],
    liga: ["You were overtaken!", "{n} passed you in this week's league. Play and take your spot back."],
    turno: ["Your turn!", "{n} played their turn in your duel. Your move!"],
  },
  pt: {
    amigo: ["Você tem um amigo novo!", "{n} te adicionou como amigo. Que tal mandar um duelo?"],
    solicitud: ["Pedido de amizade!", "{n} te mandou um pedido de amizade."],
    record: ["Te superaram no Contrarrelógio!", "{n} superou sua melhor pontuação. Vai recuperar?"],
    prueba: ["Funciona!", "As notificações do tutti.frutti estão chegando."],
    duelo: ["Você foi desafiado!", "{n} te mandou um duelo. Topa?"],
    duelo_ganado: ["Você perdeu o duelo!", "{n} fez mais pontos que você. Revanche?"],
    liga: ["Te passaram na liga!", "{n} te passou na liga desta semana. Jogue e recupere seu lugar."],
    turno: ["Sua vez!", "{n} jogou o turno no duelo. Sua vez!"],
  },
};

// ---------- Utilidades ----------
const b64url = (buf) => Buffer.from(buf).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
const desdeB64url = (s) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
const responder = (status, cuerpo) => ({ statusCode: status, headers: { "Content-Type": "application/json" }, body: JSON.stringify(cuerpo) });
const limpiarNombre = (s) => String(s || "").replace(/[\u0000-\u001f]/g, "").slice(0, 30) || "Alguien";

// Mismo cálculo de semana que el juego (lunes a las 3 de la mañana, hora de Argentina).
function semanaActual() {
  const shifted = new Date(Date.now() - 3 * 3600 * 1000);
  const date = new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

// ---------- Credencial del jugador (Firebase ID token) ----------
let certificados = null, certificadosHasta = 0;
async function verificarJugador(idToken) {
  const partes = String(idToken || "").split(".");
  if (partes.length !== 3) throw new Error("credencial inválida");
  const cabecera = JSON.parse(desdeB64url(partes[0]).toString());
  const datos = JSON.parse(desdeB64url(partes[1]).toString());
  if (Date.now() > certificadosHasta) {
    const r = await fetch("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com");
    certificados = await r.json();
    certificadosHasta = Date.now() + 60 * 60 * 1000;
  }
  const cert = certificados[cabecera.kid];
  if (!cert || cabecera.alg !== "RS256") throw new Error("credencial inválida");
  const ok = crypto.createVerify("RSA-SHA256").update(partes[0] + "." + partes[1]).verify(cert, desdeB64url(partes[2]));
  const ahora = Math.floor(Date.now() / 1000);
  if (!ok || datos.aud !== PROYECTO || datos.iss !== "https://securetoken.google.com/" + PROYECTO || !datos.sub || datos.exp < ahora) {
    throw new Error("credencial inválida");
  }
  return datos.sub;
}

// ---------- Acceso de administrador (cuenta de servicio) ----------
let acceso = null, accesoHasta = 0;
async function tokenDeAcceso() {
  if (acceso && Date.now() < accesoHasta) return acceso;
  const cuenta = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
  const ahora = Math.floor(Date.now() / 1000);
  const cabecera = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const cuerpo = b64url(JSON.stringify({
    iss: cuenta.client_email, aud: "https://oauth2.googleapis.com/token", iat: ahora, exp: ahora + 3600,
    scope: "https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/firebase.messaging",
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
async function leer(ruta) {
  const r = await fetch(`${BASE}/${ruta}.json`, { headers: { Authorization: "Bearer " + (await tokenDeAcceso()) } });
  return r.ok ? r.json() : null;
}
async function escribir(ruta, valor) {
  await fetch(`${BASE}/${ruta}.json`, { method: valor === null ? "DELETE" : "PUT", headers: { Authorization: "Bearer " + (await tokenDeAcceso()) }, body: valor === null ? undefined : JSON.stringify(valor) });
}

const seguro = (s) => /^[A-Za-z0-9_-]{1,64}$/.test(String(s || ""));

// ---------- Función ----------
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return responder(405, { error: "método" });
  let pedido;
  try { pedido = JSON.parse(event.body || "{}"); } catch (e) { return responder(400, { error: "pedido" }); }
  const { tipo, destino } = pedido;
  if (!TEXTOS.es[tipo] || !seguro(destino)) return responder(400, { error: "pedido" });

  let quien;
  try { quien = await verificarJugador(pedido.idToken); } catch (e) { return responder(401, { error: "credencial" }); }
  // A uno mismo solo se puede mandar la prueba (y la prueba, solo a uno mismo).
  if ((quien === destino) !== (tipo === "prueba")) return responder(400, { error: "pedido" });

  try {
    // ¿Es cierto lo que dice? (y de paso, el nombre del que pide, sacado de la base, no del pedido)
    let nombre = null, link = "tuttifrutti://jugar";
    if (tipo === "duelo" || tipo === "duelo_ganado") {
      if (!/^[A-Za-z0-9]{10}$/.test(String(pedido.duelo || ""))) return responder(400, { error: "pedido" });
      const duelo = await leer(`duels/${pedido.duelo}`);
      if (!duelo || !duelo.creator) return responder(403, { error: "no corresponde" });
      if (tipo === "duelo") {
        const amigos = await leer(`friends/${destino}/${quien}`);
        const enBandeja = await leer(`duelInbox/${destino}/${pedido.duelo}`);
        if (duelo.creator.uid !== quien || !amigos || !enBandeja) return responder(403, { error: "no corresponde" });
        nombre = duelo.creator.name;
      } else {
        const mio = duelo.rivals && duelo.rivals[quien];
        if (duelo.creator.uid !== destino || !mio || (mio.score || 0) <= (duelo.creator.score || 0)) return responder(403, { error: "no corresponde" });
        nombre = mio.name;
      }
      link = "tuttifrutti://jugar?duelo=" + pedido.duelo;
    } else if (tipo === "amigo" || tipo === "record") {
      const ida = await leer(`friends/${quien}/${destino}`), vuelta = await leer(`friends/${destino}/${quien}`);
      if (!ida || !vuelta) return responder(403, { error: "no corresponde" });
      const yo = await leer(`profiles/${quien}`);
      if (!yo) return responder(403, { error: "no corresponde" });
      if (tipo === "record") {
        const otro = await leer(`profiles/${destino}/stats/best`);
        if (!((yo.stats && yo.stats.best || 0) > (otro || 0))) return responder(403, { error: "no corresponde" });
      }
      nombre = yo.name;
      link = "tuttifrutti://jugar?amigos";
    } else if (tipo === "solicitud") {
      const pedidoAmistad = await leer(`friendRequests/${destino}/${quien}`);
      if (!pedidoAmistad) return responder(403, { error: "no corresponde" });
      nombre = pedidoAmistad.name;
      link = "tuttifrutti://jugar?amigos";
    } else if (tipo === "turno") {
      if (!/^[A-Za-z0-9]{10}$/.test(String(pedido.partida || ""))) return responder(400, { error: "pedido" });
      const p = await leer(`partidas/${pedido.partida}`);
      const jugadores = p ? [p.a, p.b] : [];
      if (!p || p.fin || !jugadores.includes(quien) || !jugadores.includes(destino)) return responder(403, { error: "no corresponde" });
      nombre = (p.p && p.p[quien] && p.p[quien].n) || null;
      link = "tuttifrutti://jugar?partida=" + pedido.partida;
    } else if (tipo === "liga") {
      const semana = semanaActual();
      if (pedido.semana !== semana || !/^[0-4]$/.test(String(pedido.div)) || !/^[0-9]{1,5}$/.test(String(pedido.grupo))) return responder(400, { error: "pedido" });
      const ruta = `ligas/${semana}/${pedido.div}/${pedido.grupo}`;
      const yo = await leer(`${ruta}/${quien}`), otro = await leer(`${ruta}/${destino}`);
      if (!yo || !otro || (yo.xp || 0) <= (otro.xp || 0)) return responder(403, { error: "no corresponde" });
      nombre = yo.name;
      link = "tuttifrutti://jugar?liga";
    }

    // Límite: un aviso de cada tipo cada tanto, por destino.
    // "amigo", "solicitud" y "turno" se limitan por cada par (un aviso por día de la misma persona); el resto, por destino.
    const limite = tipo === "amigo" || tipo === "solicitud" || tipo === "turno" ? `avisos/${destino}/${tipo}_${quien}` : `avisos/${destino}/${tipo}`;
    const ultimo = await leer(limite);
    if (ultimo && Date.now() - ultimo < ESPERA_MS[tipo]) return responder(200, { ok: true, salteado: true });
    await escribir(limite, Date.now());

    const datos = await leer(`tokens/${destino}`);
    if (!datos || !datos.t) return responder(200, { ok: true, sinTelefono: true });
    const t = TEXTOS[datos.lang] || TEXTOS.es;
    const [titulo, cuerpo] = t[tipo];
    const r = await fetch(`https://fcm.googleapis.com/v1/projects/${PROYECTO}/messages:send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + (await tokenDeAcceso()) },
      body: JSON.stringify({ message: {
        token: datos.t,
        notification: { title: titulo, body: cuerpo.replace("{n}", limpiarNombre(nombre)) },
        data: { link },
        apns: { payload: { aps: { sound: "default" } } },
      } }),
    });
    if (r.status === 404 || r.status === 400) {
      const err = await r.json().catch(() => ({}));
      if (JSON.stringify(err).includes("UNREGISTERED")) await escribir(`tokens/${destino}`, null);
    }
    if (tipo === "prueba" && !r.ok) return responder(200, { ok: false, fcm: r.status, detalle: (await r.text().catch(() => "")).slice(0, 300) });
    return responder(200, { ok: r.ok });
  } catch (e) {
    console.error("avisar", e && e.message);
    return responder(500, { error: "servidor", detalle: tipo === "prueba" ? String(e && e.message).slice(0, 200) : undefined });
  }
};
