#!/usr/bin/env node
/* tutti.frutti · generador de las páginas de contenido.

   Netlify publica la carpeta tal cual, sin paso de build: este script se corre a mano
   (node scripts/build-site.cjs) y escribe los .html finales en la raíz del proyecto.
   Después de editar textos (scripts/strings.cjs) o plantillas (scripts/templates/),
   volver a correrlo antes del deploy.

   Genera:
   - home, reglas, privacidad, términos y contacto en español (raíz), inglés (/en/) y portugués (/pt/);
   - las guías (categorías, planillas, videollamada, aula, quiénes somos) en los tres idiomas;
   - 404.html y sitemap.xml.
   jugar.html (el juego) NO se genera: se mantiene a mano. */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TPL = path.join(__dirname, "templates");
const STRINGS = require("./strings.cjs");

const SITE = "https://tuttipuntofrutti.com";
const TODAY = "2026-09-28";
const YEAR = "2026";
const THEME_COLOR = "#14101F";
const LANGS = ["es", "en", "pt"];
const OG_LOCALE = { es: "es_AR", en: "en_US", pt: "pt_BR" };
const LANG_NAMES = { es: "Español", en: "English", pt: "Português" };
const FONTS_CSS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Instrument+Sans:wght@400;500;600;700&family=Martian+Mono:wght@400;700&display=swap";

// Páginas con versión en los tres idiomas. La clave es el nombre de la plantilla.
const I18N_PAGES = {
  home: { es: "/", en: "/en/", pt: "/pt/" },
  reglas: { es: "/reglas", en: "/en/rules", pt: "/pt/regras" },
  privacidad: { es: "/privacidad", en: "/en/privacy", pt: "/pt/privacidade" },
  terminos: { es: "/terminos", en: "/en/terms", pt: "/pt/termos" },
  contacto: { es: "/contacto", en: "/en/contact", pt: "/pt/contato" },
};

// Fechas de "Última actualización" de las páginas legales.
const UPDATED = { privacidad: [2026, 9, 27], terminos: [2026, 9, 22] };

// Guías de contenido. Plantillas en scripts/templates/guias/<idioma>/<key>.html.
// Una guía puede existir solo en algunos idiomas: se generan los que tengan URL en "urls".
const GUIDES = [
  {
    key: "desafio",
    urls: { es: "/desafio-del-dia", en: "/en/daily-challenge", pt: "/pt/desafio-do-dia" },
    es: {
      nav: "Desafío del día",
      title: "Desafío del día: tutti frutti diario | tutti.frutti",
      description: "Todos los días, la misma letra y las mismas categorías para todos: 60 segundos y un solo intento. Juega el desafío del día y compará tu puntaje.",
      ogTitle: "Desafío del día de tutti frutti",
    },
    en: {
      nav: "Daily challenge",
      title: "Daily Stop challenge: one letter a day | tutti.frutti",
      description: "Every day, the same letter and categories for everyone: 60 seconds and one try. Play the daily Stop game challenge and compare your score.",
      ogTitle: "The daily Stop game challenge",
    },
    pt: {
      nav: "Desafio do dia",
      title: "Desafio do dia: Stop diário | tutti.frutti",
      description: "Todo dia, a mesma letra e as mesmas categorias para todos: 60 segundos e uma única tentativa. Jogue o desafio do dia e compare sua pontuação.",
      ogTitle: "Desafio do dia do Stop",
    },
  },
  {
    key: "categorias",
    urls: { es: "/categorias-tutti-frutti", en: "/en/stop-game-categories", pt: "/pt/categorias-de-stop" },
    es: {
      nav: "Categorías para tutti frutti",
      title: "Categorías de Stop y tutti frutti: 100 ideas | tutti.frutti",
      description: "Más de 100 categorías para Stop o tutti frutti: clásicas, fáciles para niños, difíciles, para adultos y temáticas de Argentina, Perú y México.",
      ogTitle: "Categorías para tutti frutti: ideas fáciles, difíciles y temáticas",
    },
    en: {
      nav: "Stop game categories",
      title: "Stop game categories: 90+ ideas | tutti.frutti",
      description: "More than 90 categories for the Stop game: classic, easy for kids, hard, for adults, and themed lists for movies, music, sports and the USA.",
      ogTitle: "Stop game categories: easy, hard and themed ideas",
    },
    pt: {
      nav: "Categorias de Stop",
      title: "Categorias de Stop (Adedonha): 90 ideias | tutti.frutti",
      description: "Mais de 90 categorias para Stop (Adedonha): clássicas, fáceis para crianças, difíceis, para adultos e temáticas de cinema, música, futebol e Brasil.",
      ogTitle: "Categorias de Stop: ideias fáceis, difíceis e temáticas",
    },
  },
  {
    key: "imprimir",
    urls: { es: "/tutti-frutti-para-imprimir", en: "/en/printable-stop-game-sheets", pt: "/pt/stop-para-imprimir" },
    es: {
      nav: "Planillas para imprimir",
      title: "Planilla de tutti frutti para imprimir (PDF) | tutti.frutti",
      description: "Descarga gratis tres planillas de tutti frutti en PDF tamaño A4: la clásica, una para niños y una en blanco para armar tus propias categorías.",
      ogTitle: "Planilla de tutti frutti para imprimir",
    },
    en: {
      nav: "Printable sheets",
      title: "Printable Stop game sheets (free PDF) | tutti.frutti",
      description: "Download three free printable Stop game sheets as A4 PDFs: a classic one, one for kids and a blank one to write your own categories.",
      ogTitle: "Printable Stop game sheets",
    },
    pt: {
      nav: "Folhas para imprimir",
      title: "Folha de Stop (Adedonha) para imprimir | tutti.frutti",
      description: "Baixe grátis três folhas de Stop em PDF tamanho A4: a clássica, uma para crianças e uma em branco para criar suas próprias categorias.",
      ogTitle: "Folha de Stop para imprimir",
    },
  },
  {
    key: "videollamada",
    urls: { es: "/tutti-frutti-por-videollamada", en: "/en/play-stop-on-video-call", pt: "/pt/stop-por-videochamada" },
    es: {
      nav: "Jugar por videollamada",
      title: "Cómo jugar al tutti frutti por videollamada | tutti.frutti",
      description: "Paso a paso para jugar al tutti frutti a distancia: arma una sala privada, comparte el link por WhatsApp y juguen por Zoom, Meet o Discord.",
      ogTitle: "Cómo jugar al tutti frutti por videollamada",
    },
    en: {
      nav: "Play on a video call",
      title: "How to play Stop on a video call | tutti.frutti",
      description: "Step-by-step guide to playing Stop with friends far away: create a private room, share the link and play over Zoom, Meet, Discord or WhatsApp.",
      ogTitle: "How to play Stop on a video call",
    },
    pt: {
      nav: "Jogar por videochamada",
      title: "Como jogar Stop por videochamada | tutti.frutti",
      description: "Passo a passo para jogar Stop com amigos a distância: crie uma sala privada, compartilhe o link e joguem pelo Zoom, Meet, Discord ou WhatsApp.",
      ogTitle: "Como jogar Stop por videochamada",
    },
  },
  {
    key: "aula",
    urls: { es: "/tutti-frutti-en-el-aula", en: "/en/stop-game-in-the-classroom", pt: "/pt/stop-na-sala-de-aula" },
    es: {
      nav: "Tutti frutti en el aula",
      title: "Tutti frutti en el aula: guía para docentes | tutti.frutti",
      description: "Ideas para usar el tutti frutti con alumnos: categorías por materia, variantes según la edad y cómo armar una sala online para toda la clase.",
      ogTitle: "Tutti frutti en el aula: cómo usarlo con alumnos",
    },
    en: {
      nav: "Stop in the classroom",
      title: "Stop game in the classroom: teacher guide | tutti.frutti",
      description: "Ideas for using the Stop game with students: categories by subject, variations by age and how to set up an online room for the whole class.",
      ogTitle: "The Stop game in the classroom: how to use it with students",
    },
    pt: {
      nav: "Stop na sala de aula",
      title: "Stop na sala de aula: guia para professores | tutti.frutti",
      description: "Ideias para usar o Stop com alunos: categorias por disciplina, variações por idade e como criar uma sala online para a turma toda.",
      ogTitle: "Stop na sala de aula: como usar com os alunos",
    },
  },
  // Páginas para quienes buscan el juego con el nombre que tiene en su país. Solo en español.
  {
    key: "stop",
    urls: { es: "/stop-online" },
    es: {
      nav: "Stop online",
      title: "Stop online gratis para jugar con amigos | tutti.frutti",
      description: "Juega Stop online gratis desde el celular o la computadora: crea una sala, comparte el link por WhatsApp y el juego sortea la letra y suma los puntos.",
      ogTitle: "Stop online gratis: juega con amigos desde el celular",
    },
  },
  {
    key: "basta",
    urls: { es: "/basta-online" },
    es: {
      nav: "Basta online",
      title: "Basta online gratis para jugar con amigos | tutti.frutti",
      description: "Juega Basta online gratis, sin descargar nada: arma una sala, invita a tus amigos y usa categorías clásicas o de México. Un juez con IA resuelve dudas.",
      ogTitle: "Basta online gratis: el juego de palabras para jugar con amigos",
    },
  },
  {
    key: "quienes",
    urls: { es: "/quienes-somos", en: "/en/about-us", pt: "/pt/quem-somos" },
    es: {
      nav: "Quiénes somos",
      title: "Quiénes somos | tutti.frutti",
      description: "tutti.frutti es un proyecto de Bauen Games, un equipo nacido en Argentina que quiere conectar a las personas a través de jugar con amigos.",
      ogTitle: "Quiénes somos",
    },
    en: {
      nav: "About us",
      title: "About us | tutti.frutti",
      description: "tutti.frutti is made by Bauen Games, a team born in Argentina that wants to bring people together by playing with friends.",
      ogTitle: "About us",
    },
    pt: {
      nav: "Quem somos",
      title: "Quem somos | tutti.frutti",
      description: "O tutti.frutti é da Bauen Games, uma equipe nascida na Argentina que quer conectar as pessoas através de jogar com os amigos.",
      ogTitle: "Quem somos",
    },
  },
];
const GUIDE = Object.fromEntries(GUIDES.map((g) => [g.key, g]));

/* ---------------------------------------------------------------- utilidades */

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function t(lang, key) {
  const v = STRINGS[lang][key];
  if (v == null) throw new Error(`Falta el texto "${key}" en ${lang}`);
  return v;
}

function fileFor(url) {
  if (url.endsWith("/")) return path.join(ROOT, url, "index.html");
  return path.join(ROOT, url + ".html");
}

function write(url, html) {
  const file = fileFor(url);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

function abs(url) {
  return SITE + url;
}

function readTpl(name) {
  return fs.readFileSync(path.join(TPL, name), "utf8");
}

function formatDate(lang, [y, m, d]) {
  const locale = { es: "es-AR", en: "en-US", pt: "pt-BR" }[lang];
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

// Reemplaza el contenido de los elementos marcados con data-i18n / data-i18n-html
// (y los placeholders) por el texto del idioma pedido, y saca las marcas.
function translate(html, lang) {
  html = html.replace(/<(\w+)([^>]*?)\sdata-i18n(-html)?="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g,
    (m, tag, before, isHtml, key, after) => `<${tag}${before}${after}>${isHtml ? t(lang, key) : esc(t(lang, key))}</${tag}>`);
  html = html.replace(/<input([^>]*?)\sdata-i18n-placeholder="([^"]+)"([^>]*)>/g, (m, before, key, after) => {
    const attrs = (before + after).replace(/\splaceholder="[^"]*"/, "");
    return `<input${attrs} placeholder="${esc(t(lang, key))}">`.replace(/\s\/?>$/, " />");
  });
  return html;
}

// Los textos traducidos todavía enlazan a los archivos viejos (reglas.html, etc.):
// se pasan a la URL limpia del idioma que corresponde.
function fixLinks(html, lang) {
  const map = {
    "index.html": I18N_PAGES.home[lang],
    "reglas.html": I18N_PAGES.reglas[lang],
    "privacidad.html": I18N_PAGES.privacidad[lang],
    "terminos.html": I18N_PAGES.terminos[lang],
    "contacto.html": I18N_PAGES.contacto[lang],
    "jugar.html": "/jugar",
  };
  return html.replace(/href="([a-z]+\.html)"/g, (m, file) => (map[file] ? `href="${map[file]}"` : m));
}

/* ---------------------------------------------------------------- piezas comunes */

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='6 2 88 92'%3E%3Cpath d='M50 36 C41 27 26 28 19 42 C12 56 15 71 25 80 C34 88 44 90 50 90 C56 90 66 88 75 80 C85 71 88 56 81 42 C74 28 59 27 50 36 Z' fill='%23FF5E5B'/%3E%3Cpath d='M51 35 C57 19 73 9 85 7 C84 22 71 34 51 35 Z' fill='%23B6EF3C'/%3E%3Cpath d='M48 35 C43 22 32 14 22 12 C23 26 33 34 48 35 Z' fill='%238FD32E'/%3E%3C/svg%3E";
const APPLE_PATHS = '<path d="M50 36 C41 27 26 28 19 42 C12 56 15 71 25 80 C34 88 44 90 50 90 C56 90 66 88 75 80 C85 71 88 56 81 42 C74 28 59 27 50 36 Z" fill="#FF5E5B"/><path d="M51 35 C57 19 73 9 85 7 C84 22 71 34 51 35 Z" fill="#B6EF3C"/><path d="M48 35 C43 22 32 14 22 12 C23 26 33 34 48 35 Z" fill="#8FD32E"/>';
const GLOBE_ICON = '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.61,87.61,0,0,1-3.33,24H174.16a157.44,157.44,0,0,0,0-48h38.51A87.61,87.61,0,0,1,216,128ZM102,168H154a115.11,115.11,0,0,1-26,45A115.27,115.27,0,0,1,102,168Zm-3.9-16a140.84,140.84,0,0,1,0-48h59.8a140.84,140.84,0,0,1,0,48ZM40,128a87.61,87.61,0,0,1,3.33-24H81.84a157.44,157.44,0,0,0,0,48H43.33A87.61,87.61,0,0,1,40,128ZM154,88H102a115.11,115.11,0,0,1,26-45A115.27,115.27,0,0,1,154,88Zm52.36,0H170.7a135.28,135.28,0,0,0-22.3-45.6A88.29,88.29,0,0,1,206.37,88ZM107.6,42.4A135.28,135.28,0,0,0,85.3,88H49.63A88.29,88.29,0,0,1,107.6,42.4ZM49.63,168H85.3a135.28,135.28,0,0,0,22.3,45.6A88.29,88.29,0,0,1,49.63,168Zm98.77,45.6a135.28,135.28,0,0,0,22.3-45.6h35.67A88.29,88.29,0,0,1,148.4,213.6Z"/></svg>';
const PALETTE_ICON = '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M203.57,51A107.9,107.9,0,0,0,20,128c0,44.72,27.6,82.25,72,97.94A36,36,0,0,0,140,192a12,12,0,0,1,12-12h46.21a35.79,35.79,0,0,0,35.1-28A108.6,108.6,0,0,0,236,127.09,107.23,107.23,0,0,0,203.57,51Zm6.34,95.67a11.91,11.91,0,0,1-11.7,9.3H152a36,36,0,0,0-36,36,12,12,0,0,1-16,11.3c-16.65-5.88-30.65-15.76-40.48-28.56A76,76,0,0,1,44,128a84,84,0,0,1,83.13-84H128a84.35,84.35,0,0,1,84,83.29A84.72,84.72,0,0,1,209.91,146.71ZM144,76a16,16,0,1,1-16-16A16,16,0,0,1,144,76Zm-44,24A16,16,0,1,1,84,84,16,16,0,0,1,100,100Zm0,56a16,16,0,1,1-16-16A16,16,0,0,1,100,156Zm88-56a16,16,0,1,1-16-16A16,16,0,0,1,188,100Z"/></svg>';
const MENU_ICON = '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/></svg>';

// Aplica el tema elegido en el juego antes de pintar, para que no haya salto de color.
const THEME_BOOT = `<script>
(function () {
  var PRESETS = {
    "pomelo__crema": { theme: "pomelo", bg: "crema" },
    "cielo__violeta": { theme: "cielo", bg: "violeta" },
    "uva__violeta": { theme: "uva", bg: "violeta" },
    "lima__petroleo": { theme: "lima", bg: "petroleo" },
    "mandarina__lavanda": { theme: "mandarina", bg: "lavanda" },
  };
  var LIGHT_BACKGROUNDS = ["crema", "lavanda"];
  var preset;
  try { preset = PRESETS[localStorage.getItem("tuttifruti_preset")]; } catch (e) { preset = null; }
  preset = preset || PRESETS.pomelo__crema;
  document.documentElement.setAttribute("data-theme", preset.theme);
  document.documentElement.setAttribute("data-bg", preset.bg);
  if (LIGHT_BACKGROUNDS.indexOf(preset.bg) !== -1) document.documentElement.setAttribute("data-light", "");
})();
</script>`;

function jsonLd(obj) {
  return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2).replace(/</g, "\\u003c")}\n</script>`;
}

// page: { lang, url, title, description, ogTitle, alternates, noindex, css, jsonld, extraHead, ogImage }
function head(page) {
  const { lang } = page;
  const lines = [
    "<!DOCTYPE html>",
    `<html lang="${lang}">`,
    "<head>",
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
  ];
  if (page.noindex) lines.push(`<meta name="robots" content="${page.noindex}" />`);
  lines.push(`<meta name="theme-color" content="${THEME_COLOR}" />`);
  if (page.extraHead) lines.push(page.extraHead);
  lines.push(`<link rel="icon" type="image/svg+xml" href="${FAVICON}" />`);
  if (page.url) lines.push(`<link rel="canonical" href="${abs(page.url)}" />`);
  if (page.alternates) {
    for (const l of LANGS) lines.push(`<link rel="alternate" hreflang="${l}" href="${abs(page.alternates[l])}" />`);
    lines.push(`<link rel="alternate" hreflang="x-default" href="${abs(page.alternates.es)}" />`);
  }
  lines.push(
    '<link rel="manifest" href="/manifest.webmanifest" />',
    '<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png?v=2" />',
  );

  // Open Graph y Twitter
  const ogImage = page.ogImage || `${SITE}/og/og-${lang}.png`;
  const ogTitle = page.ogTitle || page.title.replace(/ \| tutti\.frutti$/, "");
  if (page.url) {
    lines.push(
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="tutti.frutti" />`,
      `<meta property="og:title" content="${esc(ogTitle)}" />`,
      `<meta property="og:description" content="${esc(page.description)}" />`,
      `<meta property="og:url" content="${abs(page.url)}" />`,
      `<meta property="og:locale" content="${OG_LOCALE[lang]}" />`,
    );
    if (page.alternates) {
      for (const l of LANGS) if (l !== lang) lines.push(`<meta property="og:locale:alternate" content="${OG_LOCALE[l]}" />`);
    }
    lines.push(
      `<meta property="og:image" content="${ogImage}" />`,
      `<meta property="og:image:type" content="image/png" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="${esc(t(lang, "og_image_alt"))}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${esc(ogTitle)}" />`,
      `<meta name="twitter:description" content="${esc(page.description)}" />`,
      `<meta name="twitter:image" content="${ogImage}" />`,
      `<meta name="twitter:image:alt" content="${esc(t(lang, "og_image_alt"))}" />`,
    );
  }

  lines.push(
    '<link rel="preconnect" href="https://fonts.googleapis.com" />',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
    `<link rel="stylesheet" href="${FONTS_CSS}" />`,
  );
  if (page.css) lines.push(`<style>\n${page.css}</style>`);
  else lines.push('<link rel="stylesheet" href="/site.css" />');
  lines.push(
    THEME_BOOT,
    '<script src="/site-i18n.js" defer></script>',
    '<script src="/site-theme.js" defer></script>',
    '<script src="/site-menu.js" defer></script>',
    '<script src="/fruits.js" defer></script>',
  );
  if (page.scripts) for (const s of page.scripts) lines.push(`<script src="${s}" defer></script>`);
  // analytics.js fija el consentimiento por defecto (Consent Mode) y cookie-consent.js aplica la
  // elección guardada o muestra el banner fuera de Europa. El código de AdSense va escrito directo
  // en el <head>, como lo pide Google, para que su revisión lo encuentre en todas las páginas.
  // (Una vez aprobada la cuenta se puede volver a la carga demorada con /ads-loader.js.)
  lines.push(
    '<meta name="google-adsense-account" content="ca-pub-9897296561814312" />',
    '<script src="/analytics.js" defer></script>',
    '<script src="/cookie-consent.js" defer></script>',
    '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9897296561814312" crossorigin="anonymous"></script>',
  );
  if (page.jsonld) for (const block of [].concat(page.jsonld)) lines.push(jsonLd(block));
  lines.push("</head>");
  return lines.join("\n");
}

function langMenu(page) {
  const alternates = page.alternates || { es: page.url || "/", en: I18N_PAGES.home.en, pt: I18N_PAGES.home.pt };
  const items = LANGS.map((l) => {
    const current = l === page.lang;
    return `          <a class="site-lang-option${current ? " selected" : ""}" href="${alternates[l]}" hreflang="${l}" lang="${l}"${current ? ' aria-current="true"' : ""} onclick="rememberSiteLanguage('${l}')">${LANG_NAMES[l]}</a>`;
  });
  return `      <div class="lang-picker" id="langPicker">
        <button type="button" class="lang-icon-btn" onclick="toggleSiteLangMenu()" aria-label="${esc(t(page.lang, "lang_menu_aria"))}" aria-haspopup="true">
          ${GLOBE_ICON}
        </button>
        <div class="lang-menu" id="langMenu">
${items.join("\n")}
        </div>
      </div>`;
}

function themeMenu(lang) {
  return `      <div class="theme-picker" id="themePicker">
        <button type="button" class="theme-icon-btn" onclick="toggleThemeMenu()" aria-label="${esc(t(lang, "theme_menu_aria"))}">${PALETTE_ICON}</button>
        <div class="theme-menu" id="themeMenu">
          <p class="theme-menu-label">${esc(t(lang, "theme_menu_label"))}</p>
          <div class="preset-grid" id="presetGrid"></div>
        </div>
      </div>`;
}

function menuButton(lang) {
  return `<button type="button" class="menu-btn" onclick="openSideMenu()" aria-label="${esc(t(lang, "open_menu_aria"))}" aria-controls="sideMenu">
    ${MENU_ICON}
  </button>`;
}

// Menú lateral: en celular es la forma de moverse entre páginas, igual en todas.
function sideMenu(lang, currentUrl) {
  const link = (url, text) => `<a href="${url}"${url === currentUrl ? ' aria-current="page"' : ""}>${esc(text)}</a>`;
  const main = ["home", "reglas", "privacidad", "terminos", "contacto"].map((k) => link(I18N_PAGES[k][lang], t(lang, "nav_" + k)));
  const guides = GUIDES.filter((g) => g.urls[lang] && !g.hidden).map((g) => link(g.urls[lang], g[lang].nav));
  return `<div class="side-menu-overlay" id="sideMenuOverlay" onclick="closeSideMenu()"></div>
<div class="side-menu" id="sideMenu">
  <div class="side-menu-top">
    <span class="side-menu-brand">tutti.frutti</span>
    <button type="button" class="side-menu-close" onclick="closeSideMenu()" aria-label="${esc(t(lang, "close_menu_aria"))}">&times;</button>
  </div>
  <a class="side-menu-play" href="/jugar">${esc(t(lang, "play_now_btn"))}</a>
  <nav>
    ${main.join("\n    ")}
    <p class="side-menu-subtitle">${esc(t(lang, "nav_more_heading"))}</p>
    ${guides.join("\n    ")}
  </nav>
</div>`;
}

function siteHeader(page) {
  const { lang } = page;
  return `<header class="site-header">
  <div class="wrap">
    ${menuButton(lang)}
    <a class="brand" href="${I18N_PAGES.home[lang]}">
      <svg class="simbolo" viewBox="10 4 80 88" aria-hidden="true">${APPLE_PATHS}</svg>
      tutti<span class="punto"><svg viewBox="10 4 80 88" aria-hidden="true">${APPLE_PATHS}</svg></span>frutti
    </a>
    <div class="header-actions">
${langMenu(page)}
${themeMenu(lang)}
      <a class="btn-play" href="/jugar">${esc(t(lang, "play_now_btn"))}</a>
    </div>
  </div>
</header>`;
}

// Footer: una fila con lo principal y, abajo, los links legales en chico con el copyright.
// Videollamada y Aula no van acá: se enlazan desde las otras guías y están en el sitemap.
const FOOTER_SHORT = {
  categorias: { es: "Categorías", en: "Categories", pt: "Categorias" },
  imprimir: { es: "Planillas para imprimir", en: "Printable sheets", pt: "Folhas para imprimir" },
};

function footerLink(url, text, currentUrl) {
  return `<a href="${url}"${url === currentUrl ? ' aria-current="page"' : ""}>${esc(text)}</a>`;
}

function siteFooter(page) {
  const { lang, url } = page;
  const main = [
    footerLink(I18N_PAGES.reglas[lang], t(lang, "nav_reglas"), url),
    footerLink(GUIDE.desafio.urls[lang], GUIDE.desafio[lang].nav, url),
    footerLink(GUIDE.categorias.urls[lang], FOOTER_SHORT.categorias[lang], url),
    footerLink(GUIDE.imprimir.urls[lang], FOOTER_SHORT.imprimir[lang], url),
    footerLink(I18N_PAGES.contacto[lang], t(lang, "nav_contacto"), url),
  ];
  const legal = [
    footerLink(I18N_PAGES.privacidad[lang], t(lang, "nav_privacidad"), url),
    footerLink(I18N_PAGES.terminos[lang], t(lang, "nav_terminos"), url),
    GUIDE.quienes.hidden ? "" : footerLink(GUIDE.quienes.urls[lang], GUIDE.quienes[lang].nav, url),
  ].filter(Boolean);
  return `<footer class="site-footer">
  <div class="wrap">
    <nav class="footer-main">
      ${main.join("\n      ")}
    </nav>
    <div class="footer-bottom">
      <nav class="footer-legal">
        ${legal.join("\n        ")}
      </nav>
      <span class="copy">© ${YEAR} tutti.frutti</span>
    </div>
  </div>
</footer>`;
}

const BG_BLOBS = `<div class="bg-blobs" aria-hidden="true">
  <span class="bg-blob bg-blob-1"></span>
  <span class="bg-blob bg-blob-2"></span>
  <span class="bg-blob bg-blob-3"></span>
</div>`;

function contentPage(page, mainHtml) {
  return `${head(page)}
<body>

${BG_BLOBS}

${siteHeader(page)}

${sideMenu(page.lang, page.url)}

${mainHtml.trim()}

${siteFooter(page)}
</body>
</html>
`;
}

/* ---------------------------------------------------------------- datos estructurados */

function homeJsonLd(lang) {
  const url = abs(I18N_PAGES.home[lang]);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        name: "tutti.frutti",
        alternateName: "tuttipuntofrutti",
        url,
        inLanguage: lang,
        publisher: { "@id": `${SITE}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "tutti.frutti",
        url: SITE,
        logo: {
          "@type": "ImageObject",
          url: `${SITE}/icons/icon-512.png`,
          width: 512,
          height: 512,
        },
        email: "bauengames@gmail.com",
        parentOrganization: { "@type": "Organization", name: "Bauen Games", email: "bauengames@gmail.com" },
      },
      {
        "@type": "WebApplication",
        "@id": `${url}#webapp`,
        name: "tutti.frutti",
        url,
        description: t(lang, "webapp_description"),
        applicationCategory: "GameApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        inLanguage: ["es", "en", "pt"],
        isAccessibleForFree: true,
        image: `${SITE}/og/og-${lang}.png`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": `${SITE}/#organization` },
      },
    ],
  };
}

function faqJsonLd(lang) {
  const plain = (s) => s.replace(/<[^>]+>/g, "");
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: [1, 2, 3, 4, 5].map((n) => ({
      "@type": "Question",
      name: plain(t(lang, `reglas_faq_q${n}`)),
      acceptedAnswer: { "@type": "Answer", text: plain(t(lang, `reglas_faq_a${n}`)) },
    })),
  };
}

function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(url) })),
  };
}

/* ---------------------------------------------------------------- páginas en 3 idiomas */

function buildHome(lang) {
  const url = I18N_PAGES.home[lang];
  const page = {
    lang, url,
    title: t(lang, "home_title"),
    description: t(lang, "home_description"),
    ogTitle: t(lang, "home_h1"),
    alternates: I18N_PAGES.home,
    css: readTpl("home.css"),
    scripts: ["/home.js"],
    jsonld: homeJsonLd(lang),
    extraHead: [
      lang === "es" ? '<meta name="google-site-verification" content="11IeCqdOInhFBmkUuvxaYK9JlKZoHk9tQVQZTIyQ_-w" />' : "",
      '<meta name="apple-mobile-web-app-capable" content="yes" />',
      '<meta name="mobile-web-app-capable" content="yes" />',
      '<meta name="apple-mobile-web-app-title" content="tutti.frutti" />',
      '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />',
    ].filter(Boolean).join("\n"),
  };
  const main = fixLinks(translate(readTpl("home.html"), lang), lang)
    .replace("{{DESAFIO_URL}}", GUIDE.desafio.urls[lang])
    .replace("{{NOMBRES}}", lang === "es" ? readTpl("home-nombres.html").trim() : "");


  const html = `${head(page)}
<body>

${BG_BLOBS}

<header class="top-bar">
  ${menuButton(lang)}
  <div class="header-actions">
${langMenu(page)}
${themeMenu(lang)}
  </div>
</header>

${sideMenu(lang, url)}

${main.trim()}

${siteFooter(page)}

<script src="/pwa.js" defer></script>
</body>
</html>
`;
  write(url, html);
  return page;
}

function buildI18nPage(key, lang) {
  const url = I18N_PAGES[key][lang];
  const page = {
    lang, url,
    title: t(lang, `${key}_title`),
    description: t(lang, `${key}_description`),
    ogTitle: t(lang, `${key}_h1`),
    alternates: I18N_PAGES[key],
  };
  if (key === "reglas") page.jsonld = faqJsonLd(lang);
  let main = readTpl(`${key}.html`);
  if (UPDATED[key]) {
    const [y, m, d] = UPDATED[key];
    main = main.replace("{{FECHA_ISO}}", `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`)
      .replace("{{FECHA}}", formatDate(lang, UPDATED[key]));
  }
  main = fixLinks(translate(main, lang), lang);
  write(url, contentPage(page, main));
  return page;
}

/* ---------------------------------------------------------------- guías */

function ctaBox(lang, text) {
  return `<div class="cta-box">
      <p>${text}</p>
      <a class="btn-play btn-lg" href="/jugar">${esc(t(lang, "play_now_btn"))}</a>
    </div>`;
}

function buildGuide(g, lang) {
  const meta = g[lang];
  const url = g.urls[lang];
  const page = {
    lang, url,
    title: meta.title,
    description: meta.description,
    ogTitle: meta.ogTitle,
    alternates: LANGS.every((l) => g.urls[l]) ? g.urls : null,
    noindex: g.hidden ? "noindex, follow" : undefined,
    jsonld: breadcrumbJsonLd([[t(lang, "nav_home"), I18N_PAGES.home[lang]], [meta.ogTitle, url]]),
  };
  let main = readTpl(`guias/${lang}/${g.key}.html`);
  main = main.replace(/\{\{CTA:([^}]+)\}\}/g, (m, text) => ctaBox(lang, text));
  write(url, contentPage(page, main));
  return page;
}

/* ---------------------------------------------------------------- 404 */

function build404() {
  const page = {
    lang: "es",
    url: null,
    title: t("es", "notfound_title"),
    description: t("es", "notfound_description"),
    noindex: "noindex",
  };
  const other = (l) => `<p lang="${l}">${esc(t(l, "notfound_h1"))}. <a href="${I18N_PAGES.home[l]}">${esc(t(l, "notfound_home"))}</a></p>`;
  const main = `<main>
  <div class="wrap">
    <h1>${esc(t("es", "notfound_h1"))}</h1>
    <p class="lead">${esc(t("es", "notfound_p"))}</p>
    <p><a class="btn-play btn-lg" href="/jugar">Jugar ahora</a> &nbsp; <a href="/">${esc(t("es", "notfound_home"))}</a></p>
    <section>
      ${other("en")}
      ${other("pt")}
    </section>
  </div>
</main>`;
  fs.writeFileSync(path.join(ROOT, "404.html"), contentPage(page, main));
}

/* ---------------------------------------------------------------- sitemap */

function buildSitemap(entries) {
  const urls = entries.map((e) => {
    const alts = e.alternates
      ? "\n" + LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(e.alternates[l])}" />`).join("\n") +
        `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(e.alternates.es)}" />`
      : "";
    return `  <url>\n    <loc>${abs(e.url)}</loc>\n    <lastmod>${TODAY}</lastmod>${alts}\n  </url>`;
  });
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`);
}

/* ---------------------------------------------------------------- main */

const built = [];
for (const lang of LANGS) {
  built.push(buildHome(lang));
  for (const key of ["reglas", "privacidad", "terminos", "contacto"]) built.push(buildI18nPage(key, lang));
}
for (const lang of LANGS) {
  for (const g of GUIDES) if (g.urls[lang]) built.push(buildGuide(g, lang));
}
build404();
buildSitemap(built.filter((p) => p.url && !p.noindex));

// Controles básicos para no publicar algo roto.
let problems = 0;
for (const p of built) {
  if (p.title.length > 60) { console.warn(`Title largo (${p.title.length}): ${p.url}`); problems++; }
  if (p.description.length > 155) { console.warn(`Description larga (${p.description.length}): ${p.url}`); problems++; }
}
console.log(`Listo: ${built.length} páginas + 404 + sitemap.xml${problems ? ` (${problems} avisos)` : ""}`);
