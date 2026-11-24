// Prueba mínima de planLot (se ejecuta con: node --experimental-strip-types scripts/test-dates.mjs)
import assert from "node:assert/strict";
import { planLot, addDays, diffDays } from "../src/lib/dates.ts";

const today = new Date(2026, 10, 24);
// Maíz 10-14 días: trasplante en 30 días -> siembra a 12 días del objetivo
let p = planLot(today, addDays(today, 30), 10, 14);
assert.equal(p.ok, true);
assert.equal(p.age, 12);
assert.equal(diffDays(p.sow, today), 18);
// Demasiado pronto
p = planLot(today, addDays(today, 5), 10, 14);
assert.equal(p.ok, false);
assert.equal(diffDays(p.earliest, today), 10);
// Justo en el mínimo: siembra hoy, edad = mínimo
p = planLot(today, addDays(today, 10), 10, 14);
assert.equal(p.ok, true);
assert.equal(p.age, 10);
assert.equal(diffDays(p.sow, today), 0);
console.log("dates: ok");
