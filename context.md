# Contexto del proyecto: ¡Basta! / Tutti Frutti online

## Qué es
Página web (un solo archivo `tutti-frutti.html`, standalone, sin build ni dependencias)
que recrea el juego de Tutti Frutti / ¡Basta!, inspirado en la dinámica real de
[bastaonline.net](https://bastaonline.net/new-game.xhtml), pero con una estética propia
("bolillero de quiniela criolla": verde pizarrón, medallón mostaza para la letra sorteada,
tarjetas de categoría estilo ficha de almacén).

Es un proyecto personal de Augusto (sin experiencia previa de programación), armado
iterativamente en el chat de Claude. Pensado para jugarse cómodamente tanto en celular
como en computadora (responsive).

## Estado actual: prototipo funcional, SIN backend real
Todo lo que sigue funciona hoy, en el archivo tal cual está:

- Lobby con 3 modos: **Crear sala** (genera un código), **Unirme a sala** (ingresás un
  código a mano) y **Sala al azar** (matchmaking simulado, con una animación de "buscando
  rival").
- Selección de categorías: desplegable multi-select + categorías propias escritas a mano +
  dos "paquetes" rápidos (Clásico / Cultura argentina).
- Selección de letras: grilla con todo el abecedario para sacar/poner letras que no se
  quieran jugar (por defecto excluye K, Ñ, W, X, Y, Z).
- Configuración de duración por ronda (30/45/60/90s) y cantidad de rondas (3/5/7/10/sin límite).
- Mecánica de ronda: sorteo de letra animado (sin repetir letra hasta agotar el mazo),
  timer circular con tic-tac en los últimos 5 segundos, categorías para completar, botón
  "¡Basta!" que corta la ronda.
- **Puntaje**: sigue las reglas reales de bastaonline.net (0 vacío / 5 repetida / 10 única /
  20 solo vos) — **pero como no hay rivales reales, el resultado por categoría se decide al
  azar** (20% / 35% / resto) en vez de comparar respuestas de verdad. Esto es lo primero
  que cambia cuando haya backend.
- Ranking acumulado por sala, pantalla de resultado final con ganador + confeti.
- Personalización: 5 temas de color (Criollo/Océano/Carnaval/Bosque/Atardecer), mute de
  sonido, todo con transiciones suaves.
- Guardado local (via `localStorage`, claves `tuttifruti_playerName`, `tuttifruti_config`
  con {categories, duration, totalRounds, letterPool}, `tuttifruti_muted`, `tuttifruti_theme`)
  para no tener que reconfigurar cada vez que se abre el archivo.
- Botón de compartir el código de sala por WhatsApp (arma un `wa.me` con el código, pero
  como no hay link web real, el destinatario igual necesita tener el archivo).
- Diseño responsive revisado a fondo (mobile / tablet / desktop), con cuidado de que nada
  se recorte en anchos intermedios de ventana.

## Rivales simulados (importante)
Ahora mismo, en cualquiera de los 3 modos de sala, jugás solo y el juego simula 1-2
rivales (nombres al azar de un pool: Fede, Cami, Momo, Vale, Naza, Luli, Coty, Fran, Nico,
Sol, Ari, Bruno) para mostrar cómo se vería el ranking. **No hay ninguna conexión real
entre dispositivos.** El código de sala no une a nadie todavía.

## Lo que falta: backend real
Esto es lo próximo a construir. Para que la sala funcione de verdad entre varios
celulares/computadoras, hace falta:

1. Un servicio de sincronización en tiempo real (recomendado: Firebase Realtime
   Database o Firestore, por ser lo más simple para alguien sin experiencia de backend —
   es el mismo enfoque que se usó para sincronizar el leaderboard del otro proyecto de
   Augusto, PasaLaPalabra/rosco-argento, vía un bridge a AsyncStorage).
2. Crear sala → genera un documento/nodo con el código, la config (categorías, duración,
   rondas, letras permitidas) y la lista de jugadores.
3. Unirse a sala → un jugador entra a ese nodo con su nombre.
4. Arrancar ronda → el que creó la sala dispara el inicio; todos los clientes reciben la
   misma letra sorteada y arrancan el mismo timer sincronizado.
5. Cualquiera puede tocar "¡Basta!" → eso debe notificar a todos los clientes para cortar
   la ronda al mismo tiempo (no que cada uno decida por su cuenta).
6. Al cortar la ronda, cada cliente sube sus respuestas al servidor; recién ahí se
   calcula el puntaje real por categoría (0/5/10/20) comparando las respuestas de todos
   los jugadores conectados a esa sala — reemplazando el sorteo al azar que hay hoy.
7. El ranking de la sala pasa a ser un dato compartido en el servidor, no un estado local
   de cada celular.

## Archivo
- `tutti-frutti.html`: todo el juego (HTML + CSS + JS vanilla en un solo archivo, sin
  frameworks ni paso de build). Se abre directo en cualquier navegador.
