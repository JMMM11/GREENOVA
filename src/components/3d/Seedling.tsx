import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CanvasTexture, DoubleSide, type Group, type Mesh } from "three";
import { grow, makeLeaf } from "./leafGeometry";

/** Hojas: altura de inserción en el tallo, giro, longitud final, inicio y duración en la escala de etapas (0..4). */
const LEAVES = [
  { y: 0.25, rot: 0.2, len: 6.2, bend: 0.55, start: 1.4, span: 2.4 },
  { y: 0.55, rot: Math.PI + 0.15, len: 5.4, bend: 0.6, start: 2.0, span: 2.0 },
  { y: 0.95, rot: 0.5, len: 4.2, bend: 0.45, start: 2.7, span: 1.3 },
  { y: 1.3, rot: Math.PI + 0.6, len: 2.4, bend: 0.3, start: 3.3, span: 0.7 },
];

type Props = { stage: number; reduced: boolean; tilt: { current: { x: number; y: number } }; labelText: string[] };

/** Plantón de maíz en su celda biodegradable. `stage` 0..4 = siembra, germinación, crecimiento, aclimatación, listo. */
export function Seedling({ stage, reduced, tilt, labelText }: Props) {
  const root = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const leafRefs = useRef<(Group | null)[]>([]);
  const stem = useRef<Mesh>(null);
  const sprout = useRef<Mesh>(null);
  const seed = useRef<Mesh>(null);
  const label = useRef<Group>(null);
  const g = useRef(reduced ? stage : 0); // al entrar, las capas aparecen desde la semilla
  const { invalidate } = useThree();

  useEffect(() => invalidate(), [stage, invalidate]); // con frameloop "demand" (movimiento reducido)

  const leaves = useMemo(() => LEAVES.map((l) => makeLeaf(l.bend)), []);
  const labelTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 160;
    const x = c.getContext("2d")!;
    x.fillStyle = "#f6f3ea";
    x.fillRect(0, 0, 256, 160);
    x.fillStyle = "#1a1c12";
    x.font = "700 32px Manrope, system-ui, sans-serif";
    x.fillText(labelText[0], 18, 52);
    x.font = "500 26px system-ui, sans-serif";
    labelText.slice(1).forEach((line, i) => x.fillText(line, 18, 96 + i * 36));
    return new CanvasTexture(c);
  }, [labelText]);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    g.current = reduced ? stage : g.current + (stage - g.current) * (1 - Math.exp(-d * 1.6));
    const v = g.current;
    const t = state.clock.elapsedTime;

    if (spin.current && !reduced) spin.current.rotation.y += d * ((Math.PI * 2) / 45); // una vuelta cada 45 s
    if (root.current) {
      root.current.rotation.x += (tilt.current.y * 0.12 - root.current.rotation.x) * 0.06;
      root.current.rotation.z += (-tilt.current.x * 0.1 - root.current.rotation.z) * 0.06;
    }
    const s0 = grow(v, 0.5, 0.8); // coleóptilo
    const stemH = 0.3 + 1.6 * grow(v, 1.4, 2.6);
    if (seed.current) seed.current.visible = v < 1.2;
    if (sprout.current) {
      sprout.current.scale.set(1, Math.max(0.001, s0 * (1 - grow(v, 1.6, 0.8))), 1);
    }
    if (stem.current) stem.current.scale.set(1, v > 1.3 ? stemH : 0.001, 1);
    leafRefs.current.forEach((leaf, i) => {
      if (!leaf) return;
      const k = grow(v, LEAVES[i].start, LEAVES[i].span);
      const L = Math.max(0.001, LEAVES[i].len * k);
      leaf.scale.set(L * 0.9, L, 0.6 + 0.4 * k);
      leaf.position.y = LEAVES[i].y * stemH;
      leaf.rotation.z = reduced ? 0 : Math.sin(t * 0.8 + i * 1.7) * 0.035 * k; // oscilación leve
    });
    if (label.current) label.current.scale.setScalar(Math.max(0.001, grow(v, 3.5, 0.5)));
    if (!reduced && Math.abs(stage - v) > 0.001) invalidate();
  });

  return (
    <group ref={root} position={[0, -2.2, 0]}>
      <group ref={spin}>
        {/* Celda de fibra biodegradable y sustrato */}
        <mesh rotation-y={Math.PI / 4} position-y={1.1} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.1, 2.2, 4, 1, true]} />
          <meshStandardMaterial color="#9c7d55" roughness={1} side={DoubleSide} />
        </mesh>
        <mesh rotation-y={Math.PI / 4} position-y={2.02} receiveShadow>
          <cylinderGeometry args={[1.42, 1.42, 0.06, 4]} />
          <meshStandardMaterial color="#3a2b1c" roughness={1} />
        </mesh>
        <mesh ref={seed} position={[0.15, 2.08, 0.1]} scale={[0.34, 0.2, 0.42]} rotation-y={0.6} castShadow>
          <sphereGeometry args={[1, 20, 14]} />
          <meshStandardMaterial color="#d9b44a" roughness={0.55} />
        </mesh>
        <mesh ref={sprout} position-y={2.05} castShadow>
          <cylinderGeometry args={[0.025, 0.07, 1.2, 8]} />
          <meshStandardMaterial color="#c9d38a" roughness={0.6} />
        </mesh>
        <group position-y={2.05}>
          <mesh ref={stem} castShadow>
            <cylinderGeometry args={[0.07, 0.12, 1, 10]} />
            <meshStandardMaterial color="#8e9a3a" roughness={0.6} />
          </mesh>
          {leaves.map((geo, i) => (
            <group key={i} rotation-y={LEAVES[i].rot}>
              <group ref={(el) => void (leafRefs.current[i] = el)}>
                <mesh geometry={geo} castShadow receiveShadow>
                  <meshStandardMaterial vertexColors roughness={0.5} side={DoubleSide} />
                </mesh>
              </group>
            </group>
          ))}
        </group>
        {/* Etiqueta de trazabilidad clavada en la celda */}
        <group ref={label} position={[1.0, 2.0, 0.5]} rotation-y={-0.5}>
          <mesh position={[0, 0.55, -0.04]}>
            <cylinderGeometry args={[0.03, 0.03, 1.1, 6]} />
            <meshStandardMaterial color="#b89466" roughness={1} />
          </mesh>
          <mesh position-y={1.45}>
            <planeGeometry args={[1.2, 0.75]} />
            <meshStandardMaterial map={labelTex} roughness={0.9} side={DoubleSide} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
