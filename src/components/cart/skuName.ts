import type { Sku } from "../../data/catalog";
import type { Dict } from "../../i18n/I18nProvider";

/** Nombre visible de un artículo: «Maíz · Bandeja de 12». */
export function skuName(sku: Sku, d: Dict) {
  const species = sku.kind === "mixed" ? d.shop.mixedName : d.species[sku.species[0]].name;
  return `${species} · ${d.shop.kinds[sku.kind]}`;
}
