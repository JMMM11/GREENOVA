import type { ImageName } from "../components/ui/Img";

export const SPECIES = ["maiz", "pepino", "tomate"] as const;
export type SpeciesKey = (typeof SPECIES)[number];

/** Foto de referencia por especie. Pepino y tomate usan fotos de brotes del ensayo
 *  (pendiente: fotografía específica de cada especie). */
export const SPECIES_IMG: Record<SpeciesKey, ImageName> = {
  maiz: "led-maiz-3",
  pepino: "brotes-celda-1",
  tomate: "brotes-celda-2",
};

/** Rotación de campos de color para las fichas. */
export const TILE_FIELDS = ["bg-sprout", "bg-clay", "bg-sand"] as const;
