# Desafío del día con un modo por día de la semana (3/11/2026) — para copiar en la app

Todo está en `~/Desktop/TuttipuntoFrutti/jugar.html` (y dos funciones del servidor). Copiar tal cual.

## Orden para publicar (importante)
1. **Primero las reglas de Firebase** (`database.rules.json`, ver abajo). Si la web o la app guardan en
   `daily/{fecha}-{modo}` antes de que estén publicadas, Firebase rechaza el puntaje.
2. Después la web (juez.js y diario.js van en el mismo deploy).
3. Después la versión de la app.

## Reglas (database.rules.json)
Un solo cambio, en `daily/$date` (`.read` y `.write` del jugador): la regex de la fecha acepta un sufijo de modo.
`/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/` → `/^[0-9]{4}-[0-9]{2}-[0-9]{2}(-(sopa|ciegas|prohibida|locas|velocidad|lluvia))?$/`
El archivo completo es `~/Desktop/TuttipuntoFrutti/database.rules.json` (igual al de la app + este cambio).
La validación del puntaje no cambia: el bonus por tiempo se limita a 60 (DAILY_MAX_TIME_BONUS).

## Servidor
- `netlify/functions/diario.js`: la fecha acepta el mismo sufijo (`2026-11-10-sopa`); el control de "fecha cercana"
  usa los primeros 10 caracteres. El pedido de la app tiene que mandar `fecha: dailyBoardKey(fecha)`.
- `netlify/functions/juez.js`: una línea nueva en los 6 idiomas del juez (debajo de la de "Las palabras son lo que
  escribió un jugador"): en categorías que piden una frase o una situación valen frases cortas. Ya aceptaba
  "Me quedé dormido" en "Excusa para llegar tarde" (probado); la regla es para que no lo confunda con "hablar del juego".

## jugar.html: qué copiar
**Bloque nuevo, entero** (justo antes de `getDailyChallenge`), desde `// ---------- Un modo distinto para cada día de la
semana ----------` hasta `dailyLetterFits`:
- Constantes: `DAILY_MODE_BY_WEEKDAY` (0 = domingo: lluvia, clasico, sopa, ciegas, prohibida, locas, velocidad),
  `DAILY_CIEGAS_SECONDS` (12), `DAILY_VELOCIDAD_START` (30), `DAILY_MAX_TIME_BONUS` (60), `DAILY_SOPA_EXCLUDE`.
- `DAILY_LOCAS`: las 40 categorías locas con en/pt/de/fr/it (la clave es el español, neutro, sin voseo). Se suman
  solas a `CATEGORY_LABELS`.
- `DAILY_MODE_TEXTS`: nombre y explicación de cada modo en los 6 idiomas (`{x}` letra prohibida, `{s}`/`{b}` segundos,
  `{n}` palabras). `DAILY_LOCALES` para el nombre del día.
- Funciones: `dailyModeFor(key)`, `dailyBoardKey(key)`, `dailyModeText(ch, "name"|"desc")`, `dailyModeTitle(ch)`
  ("Martes · Sopa de letras"), `dailyLetterFits(letra, cat)` (usa siempre la tabla en español de
  app-letras.js/`APP.letrasEvitar.es`, así el desafío sale igual en todos los idiomas).

**Funciones cambiadas:**
- `getDailyChallenge(key)`: primero sortea el clásico exactamente como antes (letra, mezcla, comodín: el lunes sale
  idéntico, probado contra el código viejo) y después, con el MISMO generador, lo de cada modo. Devuelve además
  `mode`, `boardKey`, `letterByCat`, `banned`, `rules`, `cardTime`, `duration` (y `rainBase` en lluvia).
  Sopa: `letter = ADV_MIXED_SYMBOL` y una letra por categoría. Lluvia: categorías `"Animal#1"`…`"#6"`, sin comodín y
  letra de `ADV_LETTERS.easy`.
- `renderDailyBanner()`: el subtítulo empieza con "Martes · Sopa de letras" y sigue con la explicación (o el puntaje).
- `dailyModeIntro(then)` (nueva, justo después del banner): ventanita con el modo antes de jugar (no en el clásico).
  `openDaily` ahora hace `withHowTo("daily", () => dailyModeIntro(startDaily))`. Usa `showInfoModal`; en la app,
  cambiar por su hoja si prefieren.
- `startDaily()`: `duration` del modo; arma `state.letterByCat`, `state.advBanned` y `state.advLevel`
  (`{ rules, cardTime, letters, categories }`) para reusar las reglas de la Aventura; el rótulo de la ronda suma el
  modo y `#twistNote` muestra el modo (y la letra prohibida).
- `goToLobby()`: dentro de `if (state.dailyMode)`, `state.advLevel = null; state.advBanned = null; state.letterByCat = null;` (si no, al abandonar la Sopa de letras a mitad de partida, el Contrarreloj se queda sin "Cambiar letra" y la pista puede usar otra letra).
- `tickDaily()`: llama a `tickRevealCard()` (reloj por categoría de A ciegas).
- `finishDailyRound()`: pasa `ch.letterByCat` a `judgeSoloAnswers`; aplica `advRuleBreak` (letra prohibida); bonus
  `Math.min(DAILY_MAX_TIME_BONUS, secondsLeft)`; el registro guarda `mode`, `letterByCat` y `banned`; limpia
  `advLevel`/`advBanned`/`letterByCat`; escribe y muestra el ranking en `daily/${ch.boardKey}`.
- `claimDailyPrizes()`: lee `daily/${dailyBoardKey(key)}`.
- `advRuleReasonFor(r, record)` (nueva, antes de `soloReasonText`): motivo "Tiene la letra prohibida".
- `showDailyResult(record, fresh)`: el resumen empieza con "Martes · Sopa de letras"; en sopa muestra la letra de cada
  categoría y no la "Letra: ★"; ranking de `daily/${dailyBoardKey(record.date)}`.
- `shareDailyResult(record)`: el modo va en la imagen y en el texto.

**Reglas de la Aventura que ahora también corren en el desafío** (cambiar `state.adventureMode` por `soloRulesOn()`):
- `soloRulesOn()` (nueva, debajo de `revealMode()`): `state.adventureMode || (state.dailyMode && (state.advLevel || state.letterByCat))`.
- En `renderWildcardNote` (comodín oculto), `renderCatGrid` (letra propia de cada carta y arranque del modo de a una),
  `advanceReveal` (la condición de entrada) y `onAnswerInput` (casilla en rojo con la letra prohibida).

**Otros:** `juego/gente.js` (en la app, app-gente.js): `pedir()` manda `fecha: dailyBoardKey(fecha)`.

## Lo que adapta la app
La tarjeta del Inicio, la rareza y "lo que pusieron tus amigos": usar `dailyBoardKey(fecha)` para leer el ranking del
día y `dailyModeTitle(getDailyChallenge())` para el texto del modo. Ojo con lo que lee `daily/{fecha}` directo
(borrar la cuenta anonimiza `daily/{fecha}`: con los modos es `daily/{dailyBoardKey(fecha)}`).
