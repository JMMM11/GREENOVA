import { BufferAttribute, BufferGeometry, Color, CylinderGeometry, LatheGeometry, Matrix4, Quaternion, Vector2, Vector3 } from "three";

/** Curva suave 0..1 para el crecimiento de cada parte. */
export function grow(g: number, start: number, span: number) {
  const x = Math.min(1, Math.max(0, (g - start) / span));
  return x * x * (3 - 2 * x);
}

const lerpColor = (a: string, b: string, t: number) => new Color(a).lerp(new Color(b), Math.min(1, Math.max(0, t)));

/**
 * Hoja de maíz de longitud 1 con grosor real: superficie superior e inferior y bordes cerrados.
 * Base estrecha, máximo ancho hacia el 30 %, punta aguda; se arquea (`bend`), cae al final y se tuerce (`twist`).
 * Nervio central más claro y nervaduras paralelas sutiles con colores de vértice.
 */
export function makeLeaf({ bend = 0.55, width = 0.5, twist = 0.6, droop = 0.45, thick = 0.006, segs = 40, across = 8, light = 0 } = {}) {
  const top: Vector3[] = [];
  const bot: Vector3[] = [];
  const colors: number[] = [];
  const up = new Vector3(0, 0, 1);
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const shape = t < 0.3 ? 0.6 + 0.4 * (t / 0.3) : 1 - Math.pow((t - 0.3) / 0.7, 1.6);
    const w = width * Math.max(0, shape);
    const c = new Vector3(bend * t * t, t - droop * bend * t * t * t, 0);
    const T = new Vector3(2 * bend * t, 1 - 3 * droop * bend * t * t, 0).normalize();
    const W = up.clone().applyAxisAngle(T, twist * t).normalize();
    const N = new Vector3().crossVectors(T, W).normalize();
    const th = thick * (1 - 0.7 * t);
    for (let j = 0; j <= across; j++) {
      const u = j / across - 0.5;
      const keel = -Math.abs(u) * w * 0.35; // nervio central elevado, bordes caídos
      const p = c.clone().addScaledVector(W, u * w).addScaledVector(N, keel);
      top.push(p.clone().addScaledVector(N, th));
      bot.push(p.clone().addScaledVector(N, -th));
      const edge = Math.abs(u) * 2;
      const vein = 0.5 + 0.5 * Math.cos(u * across * Math.PI); // nervaduras paralelas
      const col = lerpColor("#c9d47e", lerpColor("#3f5a0c", "#7f9e24", 0.35 + 0.5 * t + light).getStyle(), Math.min(1, edge * 2.2));
      col.offsetHSL(0, 0, (vein - 0.5) * 0.035 - edge * 0.04);
      colors.push(col.r, col.g, col.b);
    }
  }
  const row = across + 1;
  const n = top.length;
  const pos = new Float32Array(n * 2 * 3);
  [...top, ...bot].forEach((p, k) => pos.set([p.x, p.y, p.z], k * 3));
  const col = new Float32Array([...colors, ...colors.map((c) => Math.min(1, c * 1.12))]);
  const idx: number[] = [];
  for (let i = 0; i < segs; i++)
    for (let j = 0; j < across; j++) {
      const a = i * row + j;
      idx.push(a, a + row, a + 1, a + 1, a + row, a + row + 1); // cara superior
      idx.push(n + a, n + a + 1, n + a + row, n + a + 1, n + a + row + 1, n + a + row); // cara inferior
    }
  for (let i = 0; i < segs; i++)
    for (const j of [0, across]) {
      const a = i * row + j;
      idx.push(a, n + a, a + row, a + row, n + a, n + a + row); // bordes
    }
  for (let j = 0; j < across; j++) idx.push(j, j + 1, n + j, j + 1, n + j + 1, n + j); // base
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("color", new BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Tallo de altura 1 y radio 1: ahusado, con nudos marcados y vetas verticales. Se escala en (R, H, R). */
export function makeStalk(nodes: number[]) {
  const g = new CylinderGeometry(1, 1, 1, 18, 64, false).translate(0, 0.5, 0);
  const p = g.attributes.position as BufferAttribute;
  const colors: number[] = [];
  const v = new Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const t = v.y;
    const bump = nodes.reduce((s, n) => s + Math.exp(-(((t - n) / 0.012) ** 2)), 0);
    const r = (1 - 0.45 * t) * (1 + 0.14 * bump);
    p.setXYZ(i, v.x * r, v.y, v.z * r);
    const stripe = 0.5 + 0.5 * Math.sin(Math.atan2(v.z, v.x) * 9);
    const c = lerpColor("#5d7d14", "#86a52c", 0.3 + 0.4 * t + stripe * 0.15).lerp(new Color("#b8c46a"), bump * 0.6);
    colors.push(c.r, c.g, c.b);
  }
  g.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3));
  g.computeVertexNormals();
  return g;
}

/** Montículo de tierra con borde irregular y superficie ondulada. */
export function makeSoil(R = 2.9, rings = 16, sectors = 72) {
  const pos: number[] = [0, 0.62, 0];
  const colors: number[] = [];
  const center = new Color("#6e4a2a");
  colors.push(center.r, center.g, center.b);
  for (let r = 1; r <= rings; r++) {
    const k = r / rings;
    for (let s = 0; s < sectors; s++) {
      const a = (s / sectors) * Math.PI * 2;
      const rim = R * (1 + 0.09 * Math.sin(3 * a + 1) + 0.05 * Math.sin(7 * a + 2) + 0.03 * Math.sin(13 * a));
      const rr = rim * k;
      const h = 0.62 * Math.pow(1 - k * k, 1.1) + 0.035 * Math.sin(a * 11 + r) * Math.sin(k * 9) - (k > 0.97 ? 0.02 : 0);
      pos.push(Math.cos(a) * rr, h, Math.sin(a) * rr);
      const c = lerpColor("#6e4a2a", "#b48d5c", k * 0.9 + 0.08 * Math.sin(a * 17 + r * 3));
      colors.push(c.r, c.g, c.b);
    }
  }
  const idx: number[] = [];
  for (let s = 0; s < sectors; s++) idx.push(0, 1 + ((s + 1) % sectors), 1 + s);
  for (let r = 1; r < rings; r++)
    for (let s = 0; s < sectors; s++) {
      const a = 1 + (r - 1) * sectors + s;
      const b = 1 + (r - 1) * sectors + ((s + 1) % sectors);
      idx.push(a, b, a + sectors, b, b + sectors, a + sectors);
    }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Radio del zuro (eje de la mazorca) a lo largo de su longitud 0..1: ahusado y con punta redondeada. */
export const cobRadius = (t: number) => (0.78 + 0.22 * Math.sin(Math.PI * Math.min(1, t * 1.25))) * (1 - 0.5 * t * t) * Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, t - 0.86) / 0.14, 2)));

export function makeCob(len: number, rad: number) {
  const pts = Array.from({ length: 24 }, (_, i) => new Vector2(Math.max(0.001, rad * cobRadius(i / 23)), (i / 23) * len));
  return new LatheGeometry(pts, 20);
}

/** Granos de una mazorca: una matriz y un color por grano, en hileras algo irregulares. */
export function makeKernels(len: number, rad: number, rows = 14, cols = 22, seed = 1) {
  const rnd = (() => {
    let s = seed * 9301 + 49297;
    return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  })();
  const mats: Matrix4[] = [];
  const cols3: Color[] = [];
  const golds = ["#e8b02a", "#f2c642", "#f7d35a", "#dc9d1e"];
  for (let c = 0; c < cols; c++) {
    const t = 0.05 + (c + 0.5) / cols * 0.86;
    const r = rad * cobRadius(t);
    for (let k = 0; k < rows; k++) {
      const a = ((k + (c % 2) * 0.5) / rows) * Math.PI * 2 + (rnd() - 0.5) * 0.05;
      const normal = new Vector3(Math.cos(a), 0, Math.sin(a));
      const tangent = new Vector3(-Math.sin(a), 0, Math.cos(a));
      const q = new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(tangent, new Vector3(0, 1, 0), normal));
      const j = 0.92 + rnd() * 0.16;
      const sx = ((Math.PI * r) / rows) * 1.02 * j;
      const sy = (len / cols) * 0.6 * j;
      const sz = rad * 0.1 * j;
      const pos = normal.clone().multiplyScalar(r + sz * 0.1).add(new Vector3(0, t * len, 0));
      mats.push(new Matrix4().compose(pos, q, new Vector3(sx, sy, sz)));
      cols3.push(new Color(golds[Math.floor(rnd() * golds.length)]).offsetHSL(0, 0, (rnd() - 0.5) * 0.05));
    }
  }
  return { mats, colors: cols3 };
}
