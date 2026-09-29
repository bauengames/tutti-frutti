/* tutti.frutti · comportamiento de la home (/, /en/, /pt/): nombre y fruta del jugador,
   botón "Jugar ahora" y menú lateral en celulares. El selector de temas vive en site-theme.js.
   Se carga con defer, después de fruits.js. */
try {
  var savedName = localStorage.getItem("tuttifruti_playerName");
  if (savedName) document.getElementById("homePlayerName").value = savedName;
} catch (e) { /* storage unavailable */ }

/* ---------- Fruta del jugador (misma lista y misma clave que jugar.html) ---------- */
var AVATARS = ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🍑", "🍍", "🥝", "🥥"];
// Frutas compradas en la tienda del juego (misma clave que jugar.html).
try {
  var ownedFruits = (JSON.parse(localStorage.getItem("tuttifruti_wallet") || "null") || {}).owned || [];
  ["🍏", "🍐", "🥭", "🫐", "🍅", "🥑", "🍈", "🍎✨"].forEach(function (f) { if (ownedFruits.indexOf(f) !== -1) AVATARS.push(f); });
} catch (e) { /* storage unavailable */ }
var AVATAR_KEY = "tuttifruti_avatar";

function getHomeAvatar() {
  try {
    var saved = localStorage.getItem(AVATAR_KEY);
    return AVATARS.indexOf(saved) !== -1 ? saved : "🍎";
  } catch (e) {
    return AVATARS[0];
  }
}

function setHomeAvatar(avatar) {
  if (AVATARS.indexOf(avatar) === -1) return;
  try { localStorage.setItem(AVATAR_KEY, avatar); } catch (e) { /* storage unavailable */ }
  renderHomeAvatarPicker();
  if (window.applyLogoFruit) applyLogoFruit(avatar);
  if (typeof renderHomeMascots === "function") renderHomeMascots();
}

function renderHomeAvatarPicker() {
  var picker = document.getElementById("homeAvatarPicker");
  if (!picker) return;
  var mine = getHomeAvatar();
  picker.innerHTML = AVATARS.map(function (a) {
    return '<button type="button" class="avatar-option' + (a === mine ? " selected" : "") + '" role="radio" aria-checked="' + (a === mine) + '" aria-label="' + a + '" onclick="setHomeAvatar(\'' + a + '\')">' + fruitSvg(a) + "</button>";
  }).join("");
}
renderHomeAvatarPicker();

function goPlay(event) {
  event.preventDefault();
  var name = document.getElementById("homePlayerName").value.trim();
  try {
    if (name) localStorage.setItem("tuttifruti_playerName", name);
  } catch (e) { /* storage unavailable */ }
  location.href = "/jugar";
  return false;
}

/* ---------- "Mi fruta": la fruta del jugador con sus accesorios ---------- */
function renderHomeMascots() {
  var acc = window.myAccessories ? window.myAccessories() : {};
  var svgHtml = window.mascotSvg ? window.mascotSvg("happy", getHomeAvatar(), acc) : "";
  document.querySelectorAll("[data-home-mascot]").forEach(function (el) { el.innerHTML = svgHtml; });
  // El puntito invita a guardar el progreso mientras no haya una cuenta de Google en este navegador.
  var hasAccount = false;
  try { hasAccount = localStorage.getItem("tuttifruti_has_account") === "1"; } catch (e) { /* storage unavailable */ }
  document.querySelectorAll("[data-home-dot]").forEach(function (el) { el.hidden = hasAccount; });
  document.querySelectorAll("[data-home-login]").forEach(function (el) { el.style.display = hasAccount ? "none" : ""; });
}
renderHomeMascots();

