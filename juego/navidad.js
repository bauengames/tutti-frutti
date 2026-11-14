/* tutti.frutti · web · Navidad (igual que app-navidad.js de la app; mientras dura isXmasSeason: del 1/12 al 6/1).
   - Tienda: sección "Navidad" arriba de todo, con el Gorro de Papá Noel (ya existía) y tres accesorios nuevos de
     edición limitada: Astas de reno, Luces de Navidad y Bastón de caramelo (los dibujos están en fruits.js,
     el mismo archivo de la app),
     más el fondo "Noche de Navidad". Lo que compraste se queda para siempre; fuera de la temporada no se vende.
   - Aventura: el mundo de temporada "Navidad" (está en ADV_WORLDS, en jugar.html; se abre el 1/12 y queda
     para siempre, como el de Carnaval). Acá van su nombre, su ícono y los nombres de sus categorías.
   Se carga después de los demás archivos de juego/. */
(function () {
  var TEXTOS = {
    es: { titulo: "Navidad", sub: "Edición limitada: hasta el 6 de enero.", acc_renos: "Astas de reno", acc_luces: "Luces de Navidad", acc_baston: "Bastón de caramelo",
      bg_navidad: "Noche de Navidad", adv_wname_navidad: "Navidad", adv_wdesc_navidad: "Mundo de temporada" },
    en: { titulo: "Christmas", sub: "Limited edition: until January 6.", acc_renos: "Reindeer antlers", acc_luces: "Christmas lights", acc_baston: "Candy cane",
      bg_navidad: "Christmas night", adv_wname_navidad: "Christmas", adv_wdesc_navidad: "Seasonal world" },
    pt: { titulo: "Natal", sub: "Edição limitada: até 6 de janeiro.", acc_renos: "Chifres de rena", acc_luces: "Luzes de Natal", acc_baston: "Bengala de doce",
      bg_navidad: "Noite de Natal", adv_wname_navidad: "Natal", adv_wdesc_navidad: "Mundo de temporada" }, de: {titulo: "Weihnachten", sub: "Limitierte Ausgabe: bis 6. Januar.", acc_renos: "Rentiergeweih", acc_luces: "Lichterkette", acc_baston: "Zuckerstange", bg_navidad: "Weihnachtsnacht", adv_wname_navidad: "Weihnachten", adv_wdesc_navidad: "Saisonwelt"}, fr: {titulo: "Noël", sub: "Édition limitée : jusqu'au 6 janvier.", acc_renos: "Bois de renne", acc_luces: "Guirlande lumineuse", acc_baston: "Sucre d'orge", bg_navidad: "Nuit de Noël", adv_wname_navidad: "Noël", adv_wdesc_navidad: "Monde de saison"}, it: {titulo: "Natale", sub: "Edizione limitata: fino al 6 gennaio.", acc_renos: "Corna di renna", acc_luces: "Luci di Natale", acc_baston: "Bastoncino di zucchero", bg_navidad: "Notte di Natale", adv_wname_navidad: "Natale", adv_wdesc_navidad: "Mondo stagionale"},
  };
  function tx(k) { var s = (TEXTOS[state.lang] || TEXTOS.es)[k] || TEXTOS.es[k]; return APP.tu ? APP.tu(s) : s; }
  ["es", "en", "pt", "de", "fr", "it"].forEach(function (lang) {
    if (!I18N[lang]) return;
    Object.keys(TEXTOS[lang]).forEach(function (k) { if (k !== "titulo" && k !== "sub") I18N[lang][k] = TEXTOS[lang][k]; });
  });

  // ---------- Aventura: categorías y el ícono del mundo ----------
  var CATS = {
    "Algo de Navidad": ["Something Christmassy", "Algo de Natal", "Etwas Weihnachtliches", "Quelque chose de Noël", "Qualcosa di Natale"], "Comida navideña": ["Christmas food", "Comida de Natal", "Weihnachtsessen", "Repas de Noël", "Cibo di Natale"],
    "Algo para regalar": ["Something to give as a gift", "Algo para dar de presente", "Etwas zum Verschenken", "Quelque chose à offrir", "Qualcosa da regalare"], "Algo del arbolito": ["Something on the Christmas tree", "Algo da árvore de Natal", "Etwas vom Weihnachtsbaum", "Quelque chose du sapin", "Qualcosa dell'albero di Natale"],
    "Algo de las vacaciones": ["Something from the holidays", "Algo das férias", "Etwas aus den Ferien", "Quelque chose des vacances", "Qualcosa delle vacanze"],
  };
  Object.keys(CATS).forEach(function (k) { if (!CATEGORY_LABELS[k]) CATEGORY_LABELS[k] = { es: k, en: CATS[k][0], pt: CATS[k][1], de: CATS[k][2], fr: CATS[k][3], it: CATS[k][4] }; });
  // Una bola del arbolito, roja con brillo dorado.
  var BOLA = '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
    '<path d="M50 6 C44 6 42 10 42 14" stroke="#C9A227" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<rect x="40" y="13" width="20" height="11" rx="3" fill="#E8C14A"/><rect x="40" y="16" width="20" height="2.5" fill="#C9A227"/>' +
    '<circle cx="50" cy="60" r="34" fill="#E23A4E"/>' +
    '<path d="M18 52 C30 60 70 60 82 52" stroke="#FFD23F" stroke-width="5" fill="none"/><path d="M17 66 C30 74 70 74 83 66" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>' +
    '<g fill="#FFD23F"><circle cx="30" cy="56" r="2.4"/><circle cx="50" cy="59" r="2.4"/><circle cx="70" cy="56" r="2.4"/></g>' +
    '<ellipse cx="36" cy="42" rx="7" ry="11" transform="rotate(35 36 42)" fill="#fff" opacity=".3"/></svg>';
  var frutaAntes = window.fruitSvg;
  window.fruitSvg = function (clave) { return clave === "navidad" ? BOLA : frutaAntes.apply(this, arguments); };

  // ---------- Tienda ----------
  // Precios altos a propósito, como en Halloween: son exclusivos y solo están unas semanas.
  var ACCS = [{ id: "renos", slot: "hat", price: 480, season: "xmas" }, { id: "luces", slot: "neck", price: 450, season: "xmas" },
    { id: "baston", slot: "hand", price: 420, season: "xmas" }];
  ACCS.forEach(function (a) { if (!ACCESSORY_ITEMS.some(function (x) { return x.id === a.id; })) ACCESSORY_ITEMS.push(a); });
  ACCESSORY_ITEMS.forEach(function (a) { if (a.id === "santa") a.price = 380; });

  BG_ART.navidad = '<rect width="100" height="100" fill="#14244A"/><rect width="100" height="40" fill="#0F1C3D"/>' +
    '<g fill="#FFF3E2"><circle cx="10" cy="10" r="1.1"/><circle cx="26" cy="22" r="1.4"/><circle cx="40" cy="8" r="1"/><circle cx="58" cy="18" r="1.3"/><circle cx="76" cy="9" r="1.1"/><circle cx="90" cy="24" r="1.4"/>' +
    '<circle cx="16" cy="36" r="1.2"/><circle cx="48" cy="34" r="1"/><circle cx="68" cy="38" r="1.2"/><circle cx="86" cy="44" r="1"/><circle cx="8" cy="54" r="1.1"/><circle cx="34" cy="50" r="1.3"/></g>' +
    '<path d="M0 80 C18 74 34 77 50 80 C66 83 84 75 100 79 L100 100 L0 100 Z" fill="#EAF2FF"/>' +
    '<path d="M70 30 L56 54 L62 54 L50 70 L58 70 L44 84 L96 84 L82 70 L90 70 L78 54 L84 54 Z" fill="#1F8A4C"/>' +
    '<rect x="66.5" y="84" width="7" height="7" fill="#7A4A26"/>' +
    '<path d="M70 22 L72 27.5 L77.5 27.5 L73 31 L74.8 36.5 L70 33 L65.2 36.5 L67 31 L62.5 27.5 L68 27.5 Z" fill="#FFD23F"/>' +
    '<g><circle cx="64" cy="50" r="2.2" fill="#E23A4E"/><circle cx="76" cy="58" r="2.2" fill="#FFD23F"/><circle cx="60" cy="66" r="2.2" fill="#35C8F2"/><circle cx="80" cy="74" r="2.2" fill="#E23A4E"/><circle cx="66" cy="78" r="2.2" fill="#FFD23F"/></g>' +
    '<rect x="14" y="78" width="16" height="12" rx="1.5" fill="#E23A4E"/><rect x="21" y="78" width="2.5" height="12" fill="#FFD23F"/><rect x="14" y="82.5" width="16" height="2.5" fill="#FFD23F"/>' +
    '<rect x="32" y="82" width="11" height="9" rx="1.5" fill="#35C8F2"/><rect x="36.5" y="82" width="2" height="9" fill="#fff"/>';
  if (!PROFILE_BGS.some(function (b) { return b.id === "navidad"; })) PROFILE_BGS.push({ id: "navidad", price: 450, season: "xmas" });

  // Sección "Navidad" arriba de todo en la tienda (igual que la de Halloween).
  function armar() {
    var tienda = document.getElementById("screen-shop");
    if (!tienda) return;
    var vieja = document.getElementById("shopNavidad");
    var w = getWallet();
    if (!isXmasSeason()) {
      if (vieja) vieja.remove();
      if (!w.owned.includes("bg:navidad")) document.querySelectorAll('#shopBackgrounds [onclick*="\'navidad\'"]').forEach(function (b) { var it = b.closest(".shop-item"); if (it) it.remove(); });
      return;
    }
    var ids = ["santa"].concat(ACCS.map(function (a) { return a.id; }));
    var items = [];
    ids.forEach(function (id) {
      var b = document.querySelector('#shopAccessories [onclick*="\'' + id + '\'"]');
      if (b && b.closest(".shop-item")) items.push(b.closest(".shop-item"));
    });
    var bg = document.querySelector('#shopBackgrounds [onclick*="\'navidad\'"]');
    if (bg && bg.closest(".shop-item")) items.push(bg.closest(".shop-item"));
    if (!items.length) return;
    var viejos = vieja ? [].slice.call(vieja.querySelectorAll(".hw-grilla > .shop-item")) : [];
    viejos.forEach(function (v) {
      var boton = v.querySelector("[onclick]"), m = boton && boton.getAttribute("onclick").match(/'([a-z]+)'\)/), id = m && m[1];
      if (id && !items.some(function (it) { return it.querySelector('[onclick*="\'' + id + '\'"]'); })) items.push(v);
    });
    var caja = vieja;
    if (!caja) {
      caja = document.createElement("section");
      caja.id = "shopNavidad";
      caja.className = "hw-seccion nv-seccion";
      var primero = tienda.querySelector(".section-title");
      if (!primero) return;
      primero.parentNode.insertBefore(caja, primero);
    }
    caja.innerHTML = '<div class="hw-cabeza"><span class="hw-icono" aria-hidden="true">' + BOLA + "</span><div><h2>" + escapeHtml(tx("titulo")) + "</h2><small>" + escapeHtml(tx("sub")) + "</small></div></div>" +
      '<div class="shop-grid hw-grilla"></div>';
    var orden = ids.concat(["navidad"]);
    function pos(it) { var b = it.querySelector("[onclick]"); var m = b && b.getAttribute("onclick").match(/'([a-z]+)'\)/); return m ? orden.indexOf(m[1]) : 99; }
    items.sort(function (a, b) { return pos(a) - pos(b); });
    var grilla = caja.querySelector(".hw-grilla");
    items.forEach(function (it) { grilla.appendChild(it); });
  }
  ["renderShop", "renderShopAccessories"].forEach(function (nombre) {
    var antes = window[nombre];
    if (typeof antes !== "function") return;
    window[nombre] = function () { var r = antes.apply(this, arguments); try { armar(); } catch (e) { console.error(e); } return r; };
  });
})();
