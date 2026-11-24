# Auditoría inicial (Fase 1)

Resumen de lo que se encontró antes de construir y de las decisiones que salieron de ello.

## 1. Proyecto original (Hydronexis-main.zip)

- **Qué era:** una copia estática hecha con HTTrack de una plantilla comercial (`livedemo00.template-help.com/wt_prod-10492`): HTML suelto, Bootstrap, varios `style-*.css` de 350 KB, jQuery, Firebase y un backend en Python para un chatbot.
- **Framework y bundler:** ninguno. No había `package.json`, ni React, ni Vite, ni rutas.
- **Qué se reutilizó:** nada del código. Solo la idea funcional (catálogo y pedidos), que se reconstruyó como tienda sin cuentas.
- **Qué se reconstruyó:** todo, sobre Vite 8, React 19, TypeScript, Tailwind CSS v4 y Motion.

## 2. Datos de información.md y dónde aparecen

| Dato | Sección del sitio |
| --- | --- |
| Empresa estudiantil, Escuela Secundaria Pedro Pablo Sánchez, La Chorrera, Panamá Oeste | Nosotros, Contacto, Footer |
| Lema «Donde crece el futuro» | Hero, parallax, Footer |
| Producto: plantones de maíz, pepino y tomate en celda biodegradable | Home, Productos, Tienda |
| Cámara: Arduino UNO, LED Grow Light, ventilación, 5 sensores, RTC, microSD | Innovación (diagrama), Home |
| Ensayo: maíz y pepino 100 % a 48 h; tomate 37,5 % a 72 h y su explicación | Innovación, Productos, Proyectos |
| Plan de mejora del tomate (4 medidas) | Productos |
| Protocolo por especie (profundidad, temperatura, fotoperiodo, riego) | Productos, Proceso |
| 5 etapas del proceso con duraciones | Proceso, Home (3D) |
| Capacidad: 96 celdas por tanda, 3–4 tandas/mes, 400–500 plantones/mes, merma 10 % | Innovación, Proceso |
| Formatos: unidad, bandeja de 12, bandeja mixta, encargo programado | Productos, Tienda |
| Precios: maíz B/. 0,75, pepino B/. 1,00, tomate B/. 1,25; 10 % desde 24 plantones | Tienda |
| Garantía de reposición (3 días, con etiqueta) | Home, Soluciones, Tienda, FAQ |
| Etiqueta de trazabilidad (especie, lote, fecha, días de vida, manejo) | Home (planificador), Soluciones |
| 5 segmentos de clientes con volúmenes | Soluciones |
| Canales: mesa en el colegio, web, redes; entrega en 10 km; gratis desde 5 bandejas institucionales | Soluciones, Tienda, FAQ |
| Misión, visión 2029, 5 valores, objetivos del primer año | Nosotros |
| Integrantes, docente asesor y 4 áreas de trabajo | Nosotros |
| Antecedentes UTP 2018 y 2021 | Innovación |
| Compostaje y no uso de fitosanitarios restringidos | Proceso |
| Instagram @greenova.4 (visto en el afiche `Img/coso1.jpeg`) | Contacto, Footer, schema |

**No usado a propósito:** el modelo financiero (inversión, punto de equilibrio, ROI) es información interna del plan de negocio. La promoción «3 maíz por B/. 2» tampoco se usa: vale solo el primer mes y no hay fecha de inicio.

**Falta (marcado como pendiente):** correo, teléfono, WhatsApp, razón social, RUC, domicilio fiscal, plazo de conservación de datos, proveedor del formulario, clientes o huertos aliados, fotografías por especie (pepino y tomate) y la composición exacta de la bandeja mixta (se asumió 4 + 4 + 4).

## 3. Cambio de enfoque: lechuga → plantones

El prompt pedía la lechuga como protagonista, pero información.md no menciona la lechuga: GREENOVA vende plantones de **maíz, pepino y tomate** (las hortalizas de hoja aparecen solo como posible ampliación futura). Para no inventar producto, el Hero, el 3D y la sección «De una semilla a una nueva vida» se hicieron sobre **plantones de maíz**. El maíz es la especie de las fotos reales (etiquetas «ZM», *Zea mays*) y la que tiene el 100 % de germinación documentado.

## 4. Colores (colores.png)

| Muestra | HEX | Rol en el sitio |
| --- | --- | --- |
| Verde oliva | `#718404` | Marca: logo, detalles, marcas sólidas, selección de texto |
| Verde oliva oscuro (derivado) | `#4e5b05` | Bloque de color corporativo con texto marfil (7,4:1) |
| Marrón tierra | `#734a08` | **Acento único**: CTA, enlaces, foco (7,1:1 sobre marfil) |
| Negro | `#000000` | No se usa como texto; se sustituye por `ink #1a1c12` |
| Marfil / arena (derivados) | `#f6f3ea` / `#ece6d6` | Fondo principal y alternativo |
| Noche (derivado) | `#0f110b` | Solo el Hero |

El verde oliva puro sobre marfil da 4,2:1 y no cumple AA en texto pequeño. Por eso se usa en marcas y bloques, y el texto verde usa la variante oscura.

## 5. Inventario HYDRONEXIS a eliminar

Nombre y logotipos HYDRONEXIS, `Manual_de_Usuario_HYDRONEXIS.pdf`, «hydrochat», chatbot y `gemini_back_end.py`, Firebase (`firestore.rules`, `.firebaserc`), páginas de carrito/checkout/login/dashboard/marketplace, fotos de personas del equipo anterior, planes «Bloomy/Sprout/Go», fuentes Optima/Helvetica/Monterchi, Bootstrap y estilos, `hts-cache` y enlaces a `livedemo00.template-help.com` y `jmmm11.github.io/Hydronexis`.

**Resultado:** nada de lo anterior está en el proyecto nuevo. La búsqueda global de `hydronexis`, `hydrochat`, `template-help`, `livedemo00` y `jmmm11.github.io` en el código, la configuración, `public/`, la documentación y los nombres de archivo devuelve 0 resultados. El ZIP original se eliminó al terminar.

## 6. Video de referencia

8 s, 3828×2164, 5,7 MB. Muestra madera seca, musgo, una esfera de cristal, **flores y mariposas**: queda descartado por la sección 4.3. Se generó un video propio (`scripts/hero-video.sh`) a partir de cuatro fotos reales del equipo, con aproximación lenta y fundidos: plántulas bajo LED, macro de hojas, bandejas e instalación. Pesa 2,1 MB en escritorio (1600×900) y 0,6 MB en móvil (540×960), y lleva póster.

## 7. Preguntas de negocio pendientes

1. Correo, teléfono y número de WhatsApp públicos.
2. Datos legales: razón social, RUC, domicilio fiscal, aviso de operación, plazo de conservación de datos.
3. Servicio para recibir formularios y pedidos (recomendado: Formspree o un endpoint en Vercel).
4. Dominio definitivo.
5. Autorización escrita del colegio y de las familias para publicar fotos y nombres de estudiantes menores de edad.
6. Fotos individuales de pepino y tomate.
7. Composición real de la bandeja mixta y si los precios siguen vigentes.
8. Huertos o clientes que autoricen aparecer en Proyectos.
