export const DAY = 86_400_000;

export function parseISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
export function diffDays(a: Date, b: Date) {
  return Math.round((a.getTime() - b.getTime()) / DAY);
}

/** Plan de siembra para trasplantar en `target`: apunta al punto medio de la ventana de entrega. */
export function planLot(today: Date, target: Date, readyMin: number, readyMax: number) {
  const earliest = addDays(today, readyMin);
  if (target < earliest) return { ok: false as const, earliest };
  const mid = Math.round((readyMin + readyMax) / 2);
  let sow = addDays(target, -mid);
  if (sow < today) sow = today;
  return { ok: true as const, sow, age: diffDays(target, sow), orderBy: addDays(sow, -1) };
}
