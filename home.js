/* tutti.frutti · comportamiento de la home (/, /en/, /pt/): nombre y fruta del jugador,
   botón "Jugar ahora" y menú lateral en celulares. El selector de temas vive en site-theme.js.
   Se carga con defer, después de fruits.js. */
try {
  var savedName = localStorage.getItem("tuttifruti_playerName");
  if (savedName) document.getElementById("homePlayerName").value = savedName;
} catch (e) { /* storage unavailable */ }

/* ---------- Fruta del jugador (misma lista y misma clave que jugar.html) ---------- */
var AVATARS = ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🍑", "🍍", "🥝", "🥥"];
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
