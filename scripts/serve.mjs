// Servidor estático local que imita Vercel (cleanUrls + 404.html). Uso: node scripts/serve.mjs [puerto]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = "dist";
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".mp4": "video/mp4", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain" };
const exists = (p) => stat(p).then((s) => s.isFile(), () => false);

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^[/\\]+/, "");
  if (path.includes("..")) return res.writeHead(400).end();
  const candidates = [join(ROOT, path), join(ROOT, `${path}.html`), join(ROOT, path, "index.html")];
  for (const file of candidates) {
    if (await exists(file)) {
      const body = await readFile(file);
      const range = req.headers.range;
      if (range && extname(file) === ".mp4") {
        const [s, e] = range.replace("bytes=", "").split("-").map(Number);
        const end = e || body.length - 1;
        res.writeHead(206, { "Content-Type": "video/mp4", "Content-Range": `bytes ${s}-${end}/${body.length}`, "Accept-Ranges": "bytes", "Content-Length": end - s + 1 });
        return res.end(body.subarray(s, end + 1));
      }
      res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
      return res.end(body);
    }
  }
  res.writeHead(404, { "Content-Type": TYPES[".html"] }).end(await readFile(join(ROOT, "404.html")));
}).listen(Number(process.argv[2] ?? 4173), () => console.log("http://localhost:" + (process.argv[2] ?? 4173)));
