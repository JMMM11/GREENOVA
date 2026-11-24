import { DoubleSide } from "three";

export const COLS = 3;
export const ROWS = 4;
export const PITCH = 1.25; // distancia entre centros de celda
export const TRAY_TOP = 1.1; // altura del borde superior
export const SOIL_TOP = 0.98; // superficie del sustrato
/** Celda donde crece el maíz (centrada en el origen de la planta). */
export const PLANT_CELL = { c: 1, r: 2 };

const FIBRE = "#b9ab92";
const cellX = (c: number) => (c - PLANT_CELL.c) * PITCH;
const cellZ = (r: number) => (r - PLANT_CELL.r) * PITCH;

/**
 * Bandeja de fibra biodegradable de 12 celdas (3 × 4), como las del semillero de GREENOVA:
 * celdas troncopiramidales abiertas, unidas por una red superior, con sustrato en cada una.
 */
export function Tray() {
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => ({ c: i % COLS, r: Math.floor(i / COLS) }));
  const minX = cellX(0) - PITCH / 2;
  const maxX = cellX(COLS - 1) + PITCH / 2;
  const minZ = cellZ(0) - PITCH / 2;
  const maxZ = cellZ(ROWS - 1) + PITCH / 2;
  const w = maxX - minX;
  const d = maxZ - minZ;

  return (
    <group>
      {cells.map(({ c, r }) => (
        <group key={`${c}-${r}`} position={[cellX(c), 0, cellZ(r)]}>
          {/* paredes de la celda */}
          <mesh rotation-y={Math.PI / 4} position-y={TRAY_TOP / 2} castShadow receiveShadow>
            <cylinderGeometry args={[0.8, 0.6, TRAY_TOP, 4, 1, true]} />
            <meshStandardMaterial color={FIBRE} roughness={1} side={DoubleSide} />
          </mesh>
          {/* fondo */}
          <mesh rotation-y={Math.PI / 4} position-y={0.02}>
            <cylinderGeometry args={[0.6, 0.6, 0.04, 4]} />
            <meshStandardMaterial color={FIBRE} roughness={1} />
          </mesh>
          {/* sustrato */}
          <mesh rotation-y={Math.PI / 4} position-y={SOIL_TOP - 0.04} receiveShadow>
            <cylinderGeometry args={[0.76, 0.74, 0.08, 4]} />
            <meshStandardMaterial color="#3a2b1c" roughness={1} />
          </mesh>
        </group>
      ))}
      {/* red superior que une las celdas: barras entre filas y columnas y marco exterior */}
      {Array.from({ length: COLS + 1 }, (_, i) => (
        <mesh key={`v${i}`} position={[minX + i * PITCH, TRAY_TOP, (minZ + maxZ) / 2]} castShadow receiveShadow>
          <boxGeometry args={[i === 0 || i === COLS ? 0.16 : 0.1, 0.05, d + 0.16]} />
          <meshStandardMaterial color={FIBRE} roughness={1} />
        </mesh>
      ))}
      {Array.from({ length: ROWS + 1 }, (_, i) => (
        <mesh key={`h${i}`} position={[(minX + maxX) / 2, TRAY_TOP, minZ + i * PITCH]} castShadow receiveShadow>
          <boxGeometry args={[w + 0.16, 0.05, i === 0 || i === ROWS ? 0.16 : 0.1]} />
          <meshStandardMaterial color={FIBRE} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
