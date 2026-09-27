#!/bin/bash
# tutti.frutti · genera las imágenes para compartir (og/*.png) y las planillas PDF (descargas/*.pdf)
# con Google Chrome en modo headless. Correr desde la raíz del proyecto: bash scripts/build-assets.sh
set -e
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT="$(pwd)"
enc() { python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$1"; }

og() { # archivo titular subtítulo
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1200,630 --virtual-time-budget=8000 \
    --screenshot="$ROOT/og/$1" "file://$ROOT/scripts/assets/og.html?t=$(enc "$2")&s=$(enc "$3")" 2>/dev/null
}
mkdir -p og descargas
og og-es.png   "Tutti frutti online con amigos" "Armá una sala, invitá a tu grupo y jueguen gratis."
og og-en.png   "Play Stop online with friends" "Create a room, invite your friends and play for free."
og og-pt.png   "Jogue Stop (Adedonha) online" "Crie uma sala, chame os amigos e jogue grátis."
og og-sala.png "Te invitaron a una partida" "Entrá con el link y jugá al tutti frutti con tu grupo."

pdf() { # archivo variante idioma
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
    --print-to-pdf="$ROOT/descargas/$1" "file://$ROOT/scripts/assets/planilla.html?v=$2&lang=$3" 2>/dev/null
}
pdf planilla-tutti-frutti-clasica.pdf clasica es
pdf planilla-tutti-frutti-chicos.pdf chicos es
pdf planilla-tutti-frutti-en-blanco.pdf blanco es
pdf stop-game-sheet-classic.pdf clasica en
pdf stop-game-sheet-kids.pdf chicos en
pdf stop-game-sheet-blank.pdf blanco en
pdf folha-stop-classica.pdf clasica pt
pdf folha-stop-criancas.pdf chicos pt
pdf folha-stop-em-branco.pdf blanco pt
echo "Listo: og/*.png y descargas/*.pdf"
