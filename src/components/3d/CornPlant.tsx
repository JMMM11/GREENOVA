import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CanvasTexture, DoubleSide, type Group, type Mesh } from "three";
import { grow, makeLeaf, makeSoil, makeStalk } from "./geometry";
import { Ear } from "./Ear";
import { PITCH, SOIL_TOP, Tray } from "./Tray";

/** Hojas (repartidas con el ángulo áureo): longitud y altura como plantón (sL, sY) y como planta adulta (fL, fY), y forma. */
const LEAVES = [
  { sL: 3.0, sY: 0.15, s0: 1.4, s1: 1.4, fL: 5.6, fY: 0.07, bend: 0.62, twist: 0.7 },
  { sL: 2.6, sY: 0.35, s0: 1.8, s1: 1.6, fL: 6.4, fY: 0.19, bend: 0.66, twist: -0.6 },
  { sL: 2.0, sY: 0.6, s0: 2.6, s1: 1.2, fL: 6.8, fY: 0.32, bend: 0.64, twist: 0.8 },
  { sL: 1.2, sY: 0.85, s0: 3.2, s1: 0.8, fL: 6.4, fY: 0.46, bend: 0.6, twist: -0.7 },
  { sL: 0, sY: 0.9, s0: 9, s1: 1, fL: 5.6, fY: 0.61, bend: 0.52, twist: 0.5 },
  { sL: 0, sY: 0.9, s0: 9, s1: 1, fL: 4.4, fY: 0.75, bend: 0.42, twist: -0.4 },
  { sL: 0, sY: 0.95, s0: 9, s1: 1, fL: 3.0, fY: 0.9, bend: 0.28, twist: 0.3 },
];
const EARS = [
  { t: 0.4, az: Math.PI / 2 + 0.35, seed: 3 },
  { t: 0.55, az: -Math.PI / 2 + 0.2, seed: 7 },
];
const NODES = [0.07, 0.19, 0.32, 0.46, 0.61, 0.75, 0.9];
const GROUND = 0.62; // cima del montículo
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Props = { stage: number; reduced: boolean; tilt: { current: { x: number; y: number } }; labelText: string[] };

/** Maíz en 6 etapas (0..5), en su celda de la bandeja hasta el trasplante: siembra, germinación, crecimiento, aclimatación, plantón listo y planta adulta en el huerto. */
export function CornPlant({ stage, reduced, tilt, labelText }: Props) {
  const root = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const cell = useRef<Group>(null);
  const mound = useRef<Group>(null);
  const base = useRef<Group>(null);
  const stalk = useRef<Mesh>(null);
  const sprout = useRef<Mesh>(null);
  const seed = useRef<Mesh>(null);
  const label = useRef<Group>(null);
  const leafRefs = useRef<(Group | null)[]>([]);
  const earRefs = useRef<(Group | null)[]>([]);
  const g = useRef(reduced ? stage : 0); // al entrar, la planta crece desde la semilla
  const { camera, invalidate } = useThree();

  // Al volver atrás más de una etapa (p. ej. el bucle automático de la planta adulta a la siembra), se reinicia sin "decrecer".
  const prevStage = useRef(stage);
  useEffect(() => {
    if (stage < prevStage.current - 1) g.current = stage;
    prevStage.current = stage;
    invalidate(); // con frameloop "demand" (movimiento reducido)
  }, [stage, invalidate]);

  const soil = useMemo(() => makeSoil(), []);
  const stalkGeo = useMemo(() => makeStalk(NODES), []);
  const leaves = useMemo(() => LEAVES.map((l, i) => makeLeaf({ bend: l.bend, droop: 0.55, twist: l.twist, light: i * 0.03 })), []);
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
    x.font = "500 24px system-ui, sans-serif";
    labelText.slice(1).forEach((line, i) => x.fillText(line, 18, 96 + i * 34));
    return new CanvasTexture(c);
  }, [labelText]);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    g.current = reduced ? stage : g.current + (stage - g.current) * (1 - Math.exp(-d * 1.4));
    const v = g.current;
    const t = state.clock.elapsedTime;
    const kF = grow(v, 4.15, 0.85); // de plantón a planta adulta

    // Cámara: se aleja para encuadrar la planta adulta completa
    camera.position.set(0, lerp(5.5, 9, kF), lerp(14, 30, kF));
    camera.lookAt(0, lerp(1.9, 5.6, kF), 0);

    if (spin.current && !reduced) spin.current.rotation.y += d * ((Math.PI * 2) / 45); // una vuelta cada 45 s
    if (root.current) {
      root.current.rotation.x += (tilt.current.y * 0.1 - root.current.rotation.x) * 0.06;
      root.current.rotation.z += (-tilt.current.x * 0.08 - root.current.rotation.z) * 0.06;
    }

    // Trasplante: la bandeja se retira y aparece el montículo del huerto
    if (cell.current) {
      cell.current.scale.setScalar(Math.max(0.001, 1 - kF));
      cell.current.visible = kF < 0.98;
    }
    if (mound.current) mound.current.scale.setScalar(Math.max(0.001, kF));
    if (base.current) base.current.position.y = lerp(SOIL_TOP, GROUND, kF);
    if (seed.current) seed.current.visible = v < 1.2;
    if (sprout.current) sprout.current.scale.set(1, Math.max(0.001, grow(v, 0.5, 0.8) * (1 - grow(v, 1.6, 0.8))), 1);

    const H = lerp(0.3 + 1.4 * grow(v, 1.4, 2.6), 9.5, kF);
    const R = lerp(0.09, 0.26, kF);
    if (stalk.current) {
      stalk.current.visible = v > 1.3;
      stalk.current.scale.set(R, H, R);
    }
    leafRefs.current.forEach((leaf, i) => {
      if (!leaf) return;
      const l = LEAVES[i];
      const L = Math.max(0.001, lerp(l.sL * grow(v, l.s0, l.s1), l.fL * 1.15, kF));
      leaf.scale.set(L * 0.9, L, 0.14 * L + 0.05);
      leaf.position.set(R * 0.7, lerp(l.sY, l.fY, kF) * H, 0);
      // sale del tallo inclinada hacia fuera (más en la planta adulta) y oscila levemente
      leaf.rotation.z = -0.38 * kF + (reduced ? 0 : Math.sin(t * 0.8 + i * 1.7) * 0.03 * Math.min(1, L / 3));
    });
    earRefs.current.forEach((ear, i) => {
      if (!ear) return;
      ear.scale.setScalar(Math.max(0.001, grow(v, 4.5, 0.5)));
      ear.position.set(R * 0.9, EARS[i].t * H, 0);
    });
    if (label.current) label.current.scale.setScalar(Math.max(0.001, grow(v, 3.5, 0.5) * (1 - kF)));
    if (!reduced && Math.abs(stage - v) > 0.001) invalidate();
  });

  return (
    <group ref={root}>
      <group ref={spin}>
        <group ref={mound}>
          <mesh geometry={soil} receiveShadow castShadow>
            <meshStandardMaterial vertexColors roughness={1} />
          </mesh>
        </group>

        {/* Bandeja de celdas biodegradable con la semilla y la etiqueta de trazabilidad */}
        <group ref={cell}>
          <Tray />
          <mesh ref={seed} position={[0.1, SOIL_TOP + 0.04, 0.05]} scale={[0.2, 0.12, 0.25]} rotation-y={0.6} castShadow>
            <sphereGeometry args={[1, 20, 14]} />
            <meshStandardMaterial color="#d9b44a" roughness={0.55} />
          </mesh>
          <group ref={label} position={[PITCH, SOIL_TOP - 0.1, 0]} rotation-y={-0.5}>
            <mesh position={[0, 0.55, -0.04]}>
              <cylinderGeometry args={[0.03, 0.03, 1.1, 6]} />
              <meshStandardMaterial color="#b89466" roughness={1} />
            </mesh>
            {/* impresa por ambas caras para que no se lea en espejo al girar */}
            {[0, Math.PI].map((r) => (
              <mesh key={r} position-y={1.45} rotation-y={r}>
                <planeGeometry args={[1.2, 0.75]} />
                <meshStandardMaterial map={labelTex} roughness={0.9} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Planta: tallo, hojas y mazorcas */}
        <group ref={base}>
          <mesh ref={sprout} castShadow>
            <cylinderGeometry args={[0.025, 0.07, 1.2, 8]} />
            <meshStandardMaterial color="#c9d38a" roughness={0.6} />
          </mesh>
          <mesh ref={stalk} geometry={stalkGeo} castShadow receiveShadow>
            <meshStandardMaterial vertexColors roughness={0.55} />
          </mesh>
          {leaves.map((geo, i) => (
            <group key={i} rotation-y={i * 2.4 + 0.2}>
              <group ref={(el) => void (leafRefs.current[i] = el)}>
                <mesh geometry={geo} castShadow receiveShadow>
                  <meshStandardMaterial vertexColors roughness={0.45} side={DoubleSide} />
                </mesh>
              </group>
            </group>
          ))}
          {EARS.map((e, i) => (
            <group key={i} rotation-y={e.az}>
              <group ref={(el) => void (earRefs.current[i] = el)}>
                <group rotation-z={-0.5}>
                  <Ear seed={e.seed} />
                </group>
              </group>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
