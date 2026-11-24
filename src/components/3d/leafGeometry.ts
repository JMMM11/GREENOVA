import { BufferAttribute, BufferGeometry, Color } from "three";

const BASE = new Color("#4e5b05");
const MID = new Color("#718404");
const RIB = new Color("#c9d38a");

/**
 * Hoja de maíz de longitud 1: estrecha en la base, más ancha hacia el 40 %, punta aguda.
 * Se arquea hacia fuera (`bend`) y cae al final; la nervadura central forma una quilla en V
 * y se pinta más clara con colores de vértice.
 */
export function makeLeaf(bend: number, width = 0.32, segs = 28, across = 4): BufferGeometry {
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const c = new Color();
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const w = width * Math.pow(Math.sin(Math.PI * Math.min(1, 0.12 + t * 0.95)), 0.7) * (1 - 0.25 * t);
    const x = bend * t * t; // arco hacia fuera
    const y = t * (1 - 0.45 * bend * t * t); // caída de la punta
    for (let j = 0; j <= across; j++) {
      const u = j / across - 0.5; // -0.5 .. 0.5 a lo ancho
      const keel = Math.abs(u) * w * 0.35; // quilla de la nervadura
      pos.push(x + keel * 0.6, y, u * w * 2);
      const edge = Math.abs(u) * 2;
      c.copy(RIB).lerp(t < 0.2 ? BASE : MID, Math.min(1, edge * 1.4 + 0.15)).lerp(BASE, t * 0.15);
      col.push(c.r, c.g, c.b);
    }
  }
  const row = across + 1;
  for (let i = 0; i < segs; i++)
    for (let j = 0; j < across; j++) {
      const a = i * row + j;
      idx.push(a, a + row, a + 1, a + 1, a + row, a + row + 1);
    }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute("color", new BufferAttribute(new Float32Array(col), 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Curva suave 0..1 para el crecimiento de cada parte. */
export function grow(g: number, start: number, span: number) {
  const x = Math.min(1, Math.max(0, (g - start) / span));
  return x * x * (3 - 2 * x);
}
