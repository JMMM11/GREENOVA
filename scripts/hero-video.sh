#!/usr/bin/env bash
# Genera el video del Hero a partir de fotos propias (Img/). Requiere ffmpeg en $FF o en PATH.
# Secuencia: plántulas bajo LED -> macro de hojas -> bandejas -> instalación (abre con el plano más fuerte, que es también el póster).
set -euo pipefail
FF="${FF:-ffmpeg}"
IMGS=(Img/cultivo2.jpeg Img/cultivosdetallado.jpeg Img/img1.jpeg Img/dispositivo2.jpeg)
D=108  # 4.5 s a 24 fps por plano

build() { # $1 ancho $2 alto $3 crf $4 salida
  local W=$1 H=$2 CRF=$3 OUT=$4 in=() f="" i=0
  for img in "${IMGS[@]}"; do
    in+=(-i "$img")
    f+="[$i:v]scale=$((W*3)):$((H*3)):force_original_aspect_ratio=increase,crop=$((W*3)):$((H*3)),zoompan=z='1+0.0011*on':d=$D:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${W}x${H}:fps=24,setsar=1,format=yuv420p[v$i];"
    i=$((i+1))
  done
  f+="[v0][v1]xfade=transition=fade:duration=1:offset=3.5[x1];"
  f+="[x1][v2]xfade=transition=fade:duration=1:offset=7[x2];"
  f+="[x2][v3]xfade=transition=fade:duration=1:offset=10.5,fade=t=out:st=13.5:d=1,format=yuv420p[out]"
  "$FF" -y -loglevel error "${in[@]}" -filter_complex "$f" -map "[out]" -an \
    -c:v libx264 -preset slow -crf "$CRF" -profile:v high -movflags +faststart "$OUT"
}

build 1600 900 27 public/video/hero-1600.mp4
build 540 960 30 public/video/hero-540.mp4
"$FF" -y -loglevel error -i public/video/hero-1600.mp4 -frames:v 1 -c:v libwebp -quality 72 public/video/hero-poster-1600.webp
"$FF" -y -loglevel error -i public/video/hero-540.mp4 -frames:v 1 -c:v libwebp -quality 72 public/video/hero-poster-540.webp
ls -la public/video
