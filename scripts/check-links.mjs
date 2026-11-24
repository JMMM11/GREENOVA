// Comprueba que todos los enlaces internos de dist/ (rutas, anclas y recursos) existan.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const pages = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html")) pages.push(p);
  }
})(DIST);

const route = (file) => "/" + file.slice(DIST.length + 1).replaceAll("\\", "/").replace(/(index)?\.html$/, "").replace(/\/$/, "");
const ids = new Map(pages.map((p) => [route(p), new Set([...readFileSync(p, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));
const exists = (path) => ids.has(path.replace(/\/$/, "") || "/") || existsSync(join(DIST, path));

const errors = [];
let checked = 0;
for (const p of pages) {
  const html = readFileSync(p, "utf8");
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(url) || url.startsWith("#")) continue;
    const [path, hash] = url.split("#");
    const clean = path.split("?")[0];
    checked++;
    if (!exists(clean)) errors.push(`${route(p)} → ${url} (no existe)`);
    else if (hash && ids.has(clean) && !ids.get(clean).has(hash)) errors.push(`${route(p)} → ${url} (ancla no encontrada)`);
  }
}
if (errors.length) {
  console.error(`links: ${errors.length} roto(s)\n` + [...new Set(errors)].join("\n"));
  process.exit(1);
}
console.log(`links: ${checked} enlaces internos revisados en ${pages.length} páginas, ninguno roto.`);
