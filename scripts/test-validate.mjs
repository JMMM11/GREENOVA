import assert from "node:assert/strict";
import { validate } from "../src/sections/contact/validate.ts";

const ok = { name: "Ana", email: "ana@correo.com", phone: "", company: "", type: "pedido", message: "Quiero doce plantones de maíz.", privacy: true };
assert.deepEqual(validate(ok), {});
assert.deepEqual(Object.keys(validate({ ...ok, email: "ana@correo" })), ["email"]);
assert.deepEqual(Object.keys(validate({ ...ok, message: "corto" })), ["message"]);
assert.deepEqual(Object.keys(validate({ ...ok, privacy: false, type: "" })), ["type", "privacy"]);
console.log("validate: ok");
