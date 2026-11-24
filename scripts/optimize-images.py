"""Convierte las fotos de Img/ a WebP en varios anchos para public/images.
Uso: python scripts/optimize-images.py"""
from pathlib import Path
from PIL import Image, ImageOps

SRC = Path("Img")
OUT = Path("public/images")
OUT.mkdir(parents=True, exist_ok=True)

# nombre final -> archivo original (solo fotos propias de GREENOVA)
MAP = {
    "camara-laboratorio": "dispositivo.jpeg",
    "camara-doble": "dispositivo2.jpeg",
    "camara-bandejas": "img1.jpeg",
    "camara-prototipo": "Picture1.png",
    "camara-v2": "Picture15.jpg",
    "led-maiz-1": "cultivo.jpeg",
    "led-maiz-2": "cultivo2.jpeg",
    "led-maiz-3": "cultivo3.jpeg",
    "led-maiz-4": "cultivo4.jpeg",
    "led-detalle": "cultivosdetallado.jpeg",
    "brotes-celda-1": "Picture2.png",
    "brotes-celda-2": "Picture3.png",
    "plantones-camara": "Picture4.jpg",
    "plantones-led": "Picture5.jpg",
    "aclimatacion-1": "Picture6.jpg",
    "aclimatacion-2": "Picture7.jpg",
    "construccion-1": "Picture8.jpg",
    "construccion-2": "Picture9.jpg",
    "construccion-3": "Picture10.jpg",
    "construccion-4": "Picture11.jpg",
    "huerto-1": "Picture12.jpg",
    "huerto-2": "Picture13.png",
    "equipo-1": "nosotros.jpeg",
    "equipo-2": "nosotros2.jpeg",
    "equipo-huerto": "nosotros3.jpeg",
    "equipo-siembra": "nosotros4.jpeg",
}
WIDTHS = [480, 960, 1600]
manifest = {}

for name, src in MAP.items():
    im = ImageOps.exif_transpose(Image.open(SRC / src)).convert("RGB")
    done = []
    for w in WIDTHS:
        if w > im.width and w != WIDTHS[0]:
            continue
        done.append(min(w, im.width))
        r = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(OUT / f"{name}-{min(w, im.width)}.webp", "WEBP", quality=74, method=6)
    manifest[name] = {"w": im.width, "h": im.height, "widths": done}
    print(name, im.size)

import json
Path("src/data/images.json").write_text(json.dumps(manifest, indent=1))
