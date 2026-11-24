import type { ImageName } from "../components/ui/Img";
import type { SpeciesKey } from "./species";

/** Precio por plantón (información.md, «Estrategias de mercadeo»). */
export const UNIT_PRICE: Record<SpeciesKey, number> = { maiz: 0.75, pepino: 1.0, tomate: 1.25 };
/** Descuento del 10 % desde 24 plantones. */
export const DISCOUNT_FROM = 24;
export const DISCOUNT_RATE = 0.1;
/** Días mínimos hasta que el plantón está listo, por especie. */
export const READY_MIN: Record<SpeciesKey, number> = { maiz: 10, pepino: 12, tomate: 25 };

export type Sku = { id: string; kind: "unit" | "tray" | "mixed"; species: SpeciesKey[]; cells: number; price: number; img: ImageName };

const unit = (s: SpeciesKey, img: ImageName): Sku => ({ id: `${s}-unidad`, kind: "unit", species: [s], cells: 1, price: UNIT_PRICE[s], img });
const tray = (s: SpeciesKey, img: ImageName): Sku => ({ id: `${s}-bandeja`, kind: "tray", species: [s], cells: 12, price: UNIT_PRICE[s] * 12, img });

/** Bandeja mixta: 12 celdas, cuatro de cada especie (composición pendiente de confirmar por GREENOVA). */
const MIXED: Sku = {
  id: "bandeja-mixta",
  kind: "mixed",
  species: ["maiz", "pepino", "tomate"],
  cells: 12,
  price: 4 * (UNIT_PRICE.maiz + UNIT_PRICE.pepino + UNIT_PRICE.tomate),
  img: "aclimatacion-2",
};

export const CATALOG: Sku[] = [
  unit("maiz", "led-maiz-3"),
  unit("pepino", "brotes-celda-1"),
  unit("tomate", "brotes-celda-2"),
  tray("maiz", "led-maiz-4"),
  tray("pepino", "plantones-camara"),
  tray("tomate", "plantones-led"),
  MIXED,
];
export const SKU = Object.fromEntries(CATALOG.map((s) => [s.id, s])) as Record<string, Sku>;

export type CartLine = { id: string; qty: number };

/** Totales del pedido. El descuento se aplica por número de plantones, no de líneas. */
export function priceCart(lines: CartLine[]) {
  const valid = lines.filter((l) => SKU[l.id] && l.qty > 0);
  const subtotal = round(valid.reduce((s, l) => s + SKU[l.id].price * l.qty, 0));
  const seedlings = valid.reduce((s, l) => s + SKU[l.id].cells * l.qty, 0);
  const trays = valid.reduce((s, l) => s + (SKU[l.id].kind === "unit" ? 0 : l.qty), 0);
  const discount = seedlings >= DISCOUNT_FROM ? round(subtotal * DISCOUNT_RATE) : 0;
  const readyDays = Math.max(0, ...valid.flatMap((l) => SKU[l.id].species.map((s) => READY_MIN[s])));
  return { subtotal, discount, total: round(subtotal - discount), seedlings, trays, readyDays };
}

const round = (n: number) => Math.round(n * 100) / 100;
