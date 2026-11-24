// Verifica que es.json y en.json tengan las mismas claves y tipos,
// y que títulos (50-60) y descripciones (120-160) cumplan la longitud SEO.
import { readFileSync } from "node:fs";

const es = JSON.parse(readFileSync("src/i18n/es.json", "utf8"));
const en = JSON.parse(readFileSync("src/i18n/en.json", "utf8"));
const errors = [];

function shape(v) {
  return Array.isArray(v) ? "array" : v === null ? "null" : typeof v;
}
function compare(a, b, path) {
  if (shape(a) !== shape(b)) return errors.push(`${path}: tipo ${shape(a)} vs ${shape(b)}`);
  if (Array.isArray(a)) {
    if (a.length !== b.length) errors.push(`${path}: ${a.length} elementos vs ${b.length}`);
    a.forEach((x, i) => b[i] !== undefined && compare(x, b[i], `${path}[${i}]`));
  } else if (shape(a) === "object") {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(k in a)) errors.push(`${path}.${k}: falta en es`);
      else if (!(k in b)) errors.push(`${path}.${k}: falta en en`);
      else compare(a[k], b[k], `${path}.${k}`);
    }
  }
}
compare(es, en, "root");

for (const [lang, dict] of [["es", es], ["en", en]]) {
  for (const [page, m] of Object.entries(dict.meta)) {
    if (typeof m !== "object" || page === "notFound") continue;
    if (m.title.length < 50 || m.title.length > 60) errors.push(`${lang}.meta.${page}.title: ${m.title.length} caracteres`);
    if (m.description.length < 120 || m.description.length > 160)
      errors.push(`${lang}.meta.${page}.description: ${m.description.length} caracteres`);
  }
  if (/lorem ipsum/i.test(JSON.stringify(dict))) errors.push(`${lang}: contiene lorem ipsum`);
}

if (errors.length) {
  console.error("i18n: " + errors.length + " problema(s)\n" + errors.join("\n"));
  process.exit(1);
}
console.log("i18n: es y en coinciden; metadatos con longitud correcta.");
