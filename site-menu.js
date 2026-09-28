/* tutti.frutti · menú lateral (hamburguesa), el mismo en la home y en todas las páginas de contenido. */
function openSideMenu() {
  var menu = document.getElementById("sideMenu");
  if (!menu) return;
  menu.classList.add("open");
  document.getElementById("sideMenuOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeSideMenu() {
  var menu = document.getElementById("sideMenu");
  if (!menu) return;
  menu.classList.remove("open");
  document.getElementById("sideMenuOverlay").classList.remove("open");
  document.body.style.overflow = "";
}
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeSideMenu();
});
