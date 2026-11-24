import assert from "node:assert/strict";
import { priceCart, SKU } from "../src/data/catalog.ts";

assert.equal(SKU["bandeja-mixta"].price, 12);
assert.equal(SKU["tomate-bandeja"].price, 15);
// 3 maíz sueltos: sin descuento
let p = priceCart([{ id: "maiz-unidad", qty: 3 }]);
assert.deepEqual([p.subtotal, p.discount, p.total, p.seedlings, p.readyDays], [2.25, 0, 2.25, 3, 10]);
// 2 bandejas de pepino = 24 plantones: 10 %
p = priceCart([{ id: "pepino-bandeja", qty: 2 }]);
assert.deepEqual([p.subtotal, p.discount, p.total, p.trays], [24, 2.4, 21.6, 2]);
// La especie más lenta manda en la fecha de retiro; líneas inválidas se ignoran
p = priceCart([{ id: "maiz-unidad", qty: 1 }, { id: "tomate-unidad", qty: 1 }, { id: "nope", qty: 9 }, { id: "pepino-unidad", qty: 0 }]);
assert.deepEqual([p.subtotal, p.readyDays, p.seedlings], [2, 25, 2]);
assert.equal(priceCart([]).readyDays, 0);
console.log("cart: ok");
