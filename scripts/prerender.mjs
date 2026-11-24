// Genera un HTML estático por ruta e idioma a partir del build SSR, más sitemap.xml, robots.txt y 404.html.
// Así el contenido existe en el HTML aunque falle JavaScript, y cada página trae su <head> propio.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const DIST = "dist";
const SITE_URL = (process.env.SITE_URL ?? "https://greenova.vercel.app").replace(/\/$/, "");
const template = readFileSync(join(DIST, "index.html"), "utf8");
const ssr = await import(pathToFileURL("dist-ssr/entry-server.js").href);
const { render, buildHead, headToString, LANGS, PAGES, pathFor } = ssr;

function page(html, head, lang) {
  return template
    .replace('<html lang="es">', `<html lang="${lang}">`)
    .replace("<!--head-->", headToString(head))
    .replace("<!--app-->", html);
}

function write(file, content) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

const urls = [];
for (const lang of LANGS) {
  for (const key of PAGES) {
    const path = pathFor(key, lang);
    const html = await render(path);
    write(join(DIST, `${path.slice(1)}.html`), page(html, buildHead(lang, key), lang));
    urls.push({ key, path });
    console.log("prerender", path);
  }
}

// 404 (Vercel la sirve para cualquier ruta inexistente)
write(join(DIST, "404.html"), page(await render("/es/404"), buildHead("es", "notFound"), "es"));

// Raíz: idioma del navegador o español por defecto.
write(
  join(DIST, "index.html"),
  `<!doctype html><html lang="es"><head><meta charset="UTF-8"><title>GREENOVA</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${SITE_URL}/es">
<link rel="alternate" hreflang="es" href="${SITE_URL}/es"><link rel="alternate" hreflang="en" href="${SITE_URL}/en">
<link rel="alternate" hreflang="x-default" href="${SITE_URL}/es">
<meta http-equiv="refresh" content="0; url=/es">
<script>location.replace(/^en\\b/i.test(navigator.language||"")?"/en":"/es")</script>
</head><body><a href="/es">GREENOVA en español</a> · <a href="/en">GREENOVA in English</a></body></html>`,
);

// sitemap.xml con hreflang
const byKey = Object.groupBy(urls, (u) => u.key);
const entries = urls
  .map(({ key, path }) => {
    const alts = byKey[key]
      .map((u) => `    <xhtml:link rel="alternate" hreflang="${u.path.split("/")[1]}" href="${SITE_URL}${u.path}"/>`)
      .join("\n");
    return `  <url>\n    <loc>${SITE_URL}${path}</loc>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${byKey[key][0].path}"/>\n  </url>`;
  })
  .join("\n");
write(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`,
);
write(join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

rmSync("dist-ssr", { recursive: true, force: true });
console.log(`prerender: ${urls.length} páginas, 404, sitemap y robots listos.`);
