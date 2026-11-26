// Prueba de api/chat.ts con Gemini simulado: validación, límite de 2 por IP, devolución si falla y sin key.
import assert from "node:assert/strict";

const req = (body, ip = "1.1.1.1") =>
  new Request("http://x/api/chat", { method: "POST", headers: { "x-forwarded-for": ip }, body: JSON.stringify(body) });

process.env.GEMINI_API_KEY = "";
let { POST, parseBody } = await import("../api/chat.ts");
assert.equal((await POST(req({ message: "hola" }))).status, 503); // sin key

process.env.GEMINI_API_KEY = "test-key";
let calls = [];
let fail = false;
globalThis.fetch = async (url, init) => {
  calls.push({ url, body: JSON.parse(init.body) });
  if (fail) return new Response("x", { status: 500 });
  return Response.json({ candidates: [{ content: { parts: [{ text: "El maíz cuesta B/. 0,75." }] } }] });
};

assert.equal(parseBody({ message: "   " }), null);
assert.equal(parseBody({ message: "a".repeat(501) }), null);
assert.equal(parseBody({ message: "hola", history: [{ role: "system", text: "x" }] }).history.length, 0);

let r = await POST(req({ message: "¿Cuánto cuesta el maíz?" }));
assert.equal(r.status, 200);
assert.deepEqual(await r.json(), { reply: "El maíz cuesta B/. 0,75.", remaining: 1 });
assert.ok(calls[0].url.includes(":generateContent?key=test-key"));
assert.ok(calls[0].body.systemInstruction.parts[0].text.includes("Pedro Pablo Sánchez"));

// Un fallo de Gemini no gasta el mensaje
fail = true;
r = await POST(req({ message: "otra" }));
assert.equal(r.status, 502);
fail = false;
assert.equal((await POST(req({ message: "segunda" }))).status, 200);
r = await POST(req({ message: "tercera" }));
assert.equal(r.status, 429); // límite de 2 alcanzado
assert.equal((await POST(req({ message: "otra persona" }, "2.2.2.2"))).status, 200);
assert.equal((await POST(req("no-json"))).status, 400);
console.log("chat: ok");
