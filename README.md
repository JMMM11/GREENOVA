# GREENOVA

Sitio web de GREENOVA, empresa estudiantil de la Escuela Secundaria Pedro Pablo Sánchez (La Chorrera, Panamá Oeste) que germina plantones de maíz, pepino y tomate en una cámara automatizada y los entrega listos para trasplante. *Donde crece el futuro.*

Bilingüe (español e inglés), con Hero en video, escena 3D del crecimiento de un plantón, animaciones de texto al hacer scroll, tienda con carrito sin cuentas, planificador de lotes y formulario de contacto.

## 1. Requisitos

- Node.js 20.19 o superior (probado con Node 24) y npm 10 o superior.
- Opcional, solo para regenerar recursos: Python 3 con Pillow (`pip install pillow imageio-ffmpeg brotli fonttools`).

## 2. Instalación

```bash
npm install
cp .env.example .env   # y completa los valores
```

## 3. Desarrollo local

```bash
npm run dev
```

Abre http://localhost:5173/es. En desarrollo la página se renderiza en el cliente; el HTML estático por ruta se genera solo en el build.

## 4. Build de producción

```bash
npm run build     # typecheck + build cliente + build SSR + prerender de las 24 rutas
npm run preview   # sirve dist/ en http://localhost:4173 con URLs limpias, como Vercel
npm test          # i18n, pruebas de fechas/formulario/carrito y enlaces internos (requiere build)
```

La salida queda en `dist/`: un `.html` por ruta e idioma, `404.html`, `sitemap.xml`, `robots.txt` y los recursos.

## 5. Despliegue en Vercel

1. Sube el repositorio a GitHub e impórtalo en Vercel (**Add New → Project**).
2. Vercel detecta Vite; `vercel.json` ya fija `npm run build`, la salida `dist`, URLs limpias y cabeceras de seguridad (CSP, HSTS, X-Frame-Options y otras).
3. En **Settings → Environment Variables** define:
   - `SITE_URL`: dominio final sin barra (por ejemplo `https://greenova.com.pa`). Se usa en canonical, hreflang, Open Graph y sitemap.
   - `VITE_FORM_ENDPOINT`: URL que recibe el formulario y los pedidos (POST JSON). Con Formspree basta crear un formulario y pegar su URL. Si usas otro servicio, añade su dominio a `connect-src` y `form-action` de la CSP en `vercel.json`.
4. Despliega y comprueba que `/es/nosotros`, `/en/about` y `/es/tienda` cargan al recargar la página.
5. Vercel añade `X-Robots-Tag: noindex` a los despliegues de vista previa; solo producción se indexa.

### Asistente con IA (Gemini)

- El chat llama a la función `api/chat.ts` de Vercel. La clave **nunca** llega al navegador.
- En Vercel, añade `GEMINI_API_KEY` (créala en Google AI Studio) y, si quieres, `GEMINI_MODEL` (por defecto `gemini-3.5-flash-lite`). Vuelve a desplegar.
- Límite de **2 preguntas por persona cada 24 h**: en el navegador y en el servidor por IP. El contador del servidor vive en la memoria de cada instancia; para un límite estricto entre instancias, cámbialo por Upstash Redis (Vercel Marketplace).
- El conocimiento del asistente está al final de `api/chat.ts` (resumen de información.md). Edítalo ahí si cambian precios o datos.
- `npm run dev` no ejecuta funciones de Vercel: para probar el chat en local usa `vercel dev`. Sin clave, el chat muestra que aún no está disponible.

Sin `VITE_FORM_ENDPOINT`, el formulario y la tienda validan los datos pero **no envían nada**: muestran que el envío está pendiente y ofrecen copiar el pedido para mandarlo por Instagram. No se simula ningún envío.

## 6. Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/pages` | Una página por ruta (Home, Nosotros, Productos, Tienda, Soluciones, Innovación, Proceso, Proyectos, Contacto, legales, 404) |
| `src/sections` | Secciones por página y compartidas (Hero, planificador, parallax, índice de audiencias…) |
| `src/components/ui` | Imagen responsiva, botones y enlaces, logotipo |
| `src/components/layout` | Navegación, menú móvil, selector de idioma, footer |
| `src/components/motion` | `RevealText`, `StaggeredFade`, `RevealImage`, `RevealList` |
| `src/components/3d` | Plantón de maíz procedural (Three.js + React Three Fiber) |
| `src/components/cart` | Carrito, cantidades y formulario de pedido |
| `src/i18n` | `es.json`, `en.json`, rutas traducidas y proveedor de idioma |
| `src/data` | Especies, catálogo y precios, manifiesto de imágenes |
| `src/lib` | SEO (head y JSON-LD), fechas, carrito, datos de la empresa |
| `src/styles` | Tokens de color, tipografía, radios y animaciones (Tailwind v4) |
| `public` | Imágenes WebP, video, fuentes, iconos, manifest |
| `scripts` | Prerender, comprobaciones, servidor local y generadores de imágenes, iconos y video |
| `docs` | Auditoría inicial |

## 7. Cómo editar

- **Textos:** `src/i18n/es.json` y `src/i18n/en.json`. Ambos deben tener las mismas claves; `npm test` lo comprueba junto con la longitud de títulos (50–60) y descripciones (120–160).
- **Colores, tipografía y radios:** bloque `@theme` en `src/styles/index.css`. El acento único es `--color-earth`.
- **Precios y catálogo:** `src/data/catalog.ts`.
- **Datos de contacto:** `src/lib/site.ts` (correo, teléfono y WhatsApp están en `null` hasta que se confirmen).
- **Fotos nuevas:** colócalas en `Img/`, añádelas al mapa de `scripts/optimize-images.py` y ejecuta `python scripts/optimize-images.py`.
- **Video del Hero:** `FF=ruta/a/ffmpeg bash scripts/hero-video.sh`.

## 8. Créditos y licencias

- **Fotografías:** todas son del equipo GREENOVA (carpeta `Img/`). Las cuatro imágenes de `Img/` con nombre largo son referencias de dirección de arte del brief, de licencia desconocida: **no se usan** en el sitio ni se incluyen en el commit.
- **Video del Hero:** generado a partir de fotos propias (`scripts/hero-video.sh`).
- **Modelo 3D:** procedural, escrito en el propio código (`src/components/3d`), sin archivos de terceros.
- **Fuentes:** Manrope y Geist, ambas bajo SIL Open Font License 1.1, autoalojadas.
- **Iconos:** Phosphor Icons (MIT); Lucide (ISC), solo para los iconos de menú y cierre.
- **Logotipo:** `Img/greenova_logo.svg`, de GREENOVA.

## 9. Pendientes (requieren información o recursos de GREENOVA)

- [x] Teléfono y WhatsApp: +507 6417-7723 (`src/lib/site.ts`). Sin correo público, por decisión de GREENOVA.
- [ ] Servicio de formularios y pedidos (`VITE_FORM_ENDPOINT`). Mientras falte, el formulario y la tienda ofrecen enviar el mensaje o el pedido ya escrito por WhatsApp.
- [ ] Dominio final (`SITE_URL`).
- [ ] **Autorización escrita** del colegio y de las familias para publicar fotos y nombres de estudiantes menores de edad.
- [ ] Video definitivo grabado en la cámara (el actual se compone de fotos fijas).
- [ ] Modelo 3D final si se quiere más realismo (el actual es procedural).
- [ ] Logotipo en versión vectorial con el nombre (ahora el nombre se escribe con Manrope junto al isotipo).

## 10. Google Search Console

1. Crea una propiedad de tipo **Dominio** y verifícala con el registro TXT en el DNS.
2. En **Sitemaps**, envía `https://TU-DOMINIO/sitemap.xml`.
3. En **Inspección de URLs**, solicita la indexación de `/es`, `/es/productos`, `/es/tienda`, `/es/soluciones` y `/es/contacto`, y de sus versiones `/en`.
4. Prueba `/es/contacto` en la [prueba de resultados enriquecidos](https://search.google.com/test/rich-results) (FAQPage) y `/es` (Organization).
5. Revisa **Páginas** y **Experiencia** en las primeras semanas para detectar errores de rastreo.

## 11. Problemas corregidos durante las pruebas

- Titulares que perdían los espacios entre palabras (el espacio quedaba dentro de la máscara `inline-block`).
- Reveals con `clip-path` que nunca se activaban: un elemento recortado no cuenta como visible para el IntersectionObserver.
- `backdrop-filter` eliminado por el minificador CSS (solo dejaba el prefijo `-webkit-`).
- Panel del menú móvil y botón de cierre invisibles en cabecera clara.
- Tipografías serif con la tilde desplazada; se cambió a Manrope.
- Avisos de Three.js en consola: se fijó `three@0.182.0`.
- El titular de las cabeceras (LCP) esperaba a la hidratación; ahora entra con CSS.
