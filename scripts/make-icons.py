"""Genera favicon.ico, apple-touch-icon.png, icon-32.png y og-image.jpg (1200x630) en public/."""
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

NIGHT = (15, 17, 11)
icon = Image.open("Img/icon.png").convert("RGBA")  # isotipo sobre negro

def square(size, pad):
    bg = Image.new("RGB", (size, size), NIGHT)
    s = int(size * (1 - 2 * pad))
    im = icon.copy(); im.thumbnail((s, s), Image.LANCZOS)
    bg.paste(im, ((size - im.width) // 2, (size - im.height) // 2), im)
    return bg

square(180, 0.12).save("public/apple-touch-icon.png")
square(32, 0.04).save("public/icon-32.png")
square(192, 0.12).save("public/icon-192.png")
square(512, 0.12).save("public/icon-512.png")
square(64, 0.04).save("public/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

og = Image.open("Img/cultivo2.jpeg").convert("RGB")
w, h = 1200, 630
scale = max(w / og.width, h / og.height)
og = og.resize((int(og.width * scale), int(og.height * scale)), Image.LANCZOS)
og = og.crop(((og.width - w) // 2, (og.height - h) // 2, (og.width - w) // 2 + w, (og.height - h) // 2 + h))
og = ImageEnhance.Brightness(og).enhance(0.55)
shade = Image.new("L", (w, h))
ImageDraw.Draw(shade).rectangle((0, 0, w, h), fill=0)
for x in range(w):  # oscurece el lado izquierdo para el texto
    ImageDraw.Draw(shade).line((x, 0, x, h), fill=int(200 * max(0, 1 - x / (w * 0.75))))
og = Image.composite(Image.new("RGB", (w, h), NIGHT), og, shade)
d = ImageDraw.Draw(og)
serif = ImageFont.truetype("public/fonts/manrope-latin-wght-normal.woff2", 92)
serif.set_variation_by_axes([700])
sans = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 34)
mark = icon.copy(); mark.thumbnail((110, 110))
og.paste(mark, (72, 150), mark)
d.text((72, 290), "GREENOVA", font=serif, fill=(246, 243, 234))
d.text((76, 405), "Donde crece el futuro · Where the future grows", font=sans, fill=(223, 227, 189))
d.text((76, 455), "Plantones de maíz, pepino y tomate · La Chorrera, Panamá", font=sans, fill=(246, 243, 234))
og.save("public/og-image.jpg", quality=84)
print("ok")
