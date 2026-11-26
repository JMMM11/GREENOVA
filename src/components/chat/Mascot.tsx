/** Maízter, la mascota de GREENOVA: una mazorca con cara, brácteas verdes y brazos de hoja.
 *  Ilustración propia en SVG; el balanceo y el parpadeo son CSS (se desactivan con movimiento reducido). */
export function Mascot({ size = 72, className = "" }: { size?: number; className?: string }) {
  const rows = [22, 31, 40, 49, 58, 67];
  return (
    <svg viewBox="0 0 80 100" width={size} height={size * 1.25} aria-hidden className={className}>
      {/* brazo izquierdo (hoja) saludando */}
      <path className="mascot-wave" d="M18 62 C6 56 4 44 9 38 C12 46 16 52 22 56 Z" fill="#7f9e24" />
      <path d="M62 62 C72 58 76 50 73 44 C69 51 65 55 58 58 Z" fill="#6c8a1c" />
      {/* zuro */}
      <rect x="20" y="10" width="40" height="70" rx="20" fill="#f2c642" />
      {/* granos */}
      {rows.map((y, r) =>
        [27, 35, 43, 51].map((x, c) => (
          <ellipse key={`${r}-${c}`} cx={x + (r % 2) * 2.5} cy={y} rx="3.4" ry="3" fill={(r + c) % 3 ? "#e8b02a" : "#f7d35a"} />
        )),
      )}
      {/* cara */}
      <g className="mascot-blink">
        <ellipse cx="33" cy="40" rx="5" ry="6" fill="#fff" />
        <ellipse cx="47" cy="40" rx="5" ry="6" fill="#fff" />
        <circle cx="34" cy="41" r="2.8" fill="#1a1c12" />
        <circle cx="48" cy="41" r="2.8" fill="#1a1c12" />
        <circle cx="35" cy="39.8" r="0.9" fill="#fff" />
        <circle cx="49" cy="39.8" r="0.9" fill="#fff" />
      </g>
      <circle cx="27" cy="50" r="3" fill="#e98a4a" opacity="0.45" />
      <circle cx="53" cy="50" r="3" fill="#e98a4a" opacity="0.45" />
      <path d="M34 51 Q40 57 46 51" stroke="#5a3a06" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* brácteas */}
      <path d="M40 98 C22 92 14 76 18 58 C24 70 32 80 40 84 Z" fill="#4e5b05" />
      <path d="M40 98 C58 92 66 76 62 58 C56 70 48 80 40 84 Z" fill="#718404" />
      <path d="M40 98 C34 88 34 78 40 70 C46 78 46 88 40 98 Z" fill="#8fae2c" />
      {/* pelo de barbas */}
      <path d="M36 11 C34 4 38 2 40 6 C42 1 47 3 44 11" stroke="#b8862a" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
