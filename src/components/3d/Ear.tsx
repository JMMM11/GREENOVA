import { useLayoutEffect, useMemo, useRef } from "react";
import { DoubleSide, type InstancedMesh } from "three";
import { makeCob, makeKernels, makeLeaf } from "./geometry";

const LEN = 2.4;
const RAD = 0.34;
const HUSKS = [0, 1.25, 2.5, 3.8, 5.0];

/** Mazorca: zuro, granos con geometría individual (instanciados) y brácteas verdes que envuelven la base. */
export function Ear({ seed }: { seed: number }) {
  const kernels = useRef<InstancedMesh>(null);
  const cob = useMemo(() => makeCob(LEN, RAD * 0.92), []);
  const { mats, colors } = useMemo(() => makeKernels(LEN, RAD, 16, 28, seed), [seed]);
  const husk = useMemo(() => makeLeaf({ bend: 0.32, width: 0.36, twist: 0.35, droop: 0.15, thick: 0.01, segs: 24, across: 6, light: 0.3 }), []);

  useLayoutEffect(() => {
    const k = kernels.current!;
    mats.forEach((m, i) => {
      k.setMatrixAt(i, m);
      k.setColorAt(i, colors[i]);
    });
    k.instanceMatrix.needsUpdate = true;
    if (k.instanceColor) k.instanceColor.needsUpdate = true;
  }, [mats, colors]);

  return (
    <group>
      {/* pedúnculo que une la mazorca al tallo */}
      <mesh position-y={-0.25} castShadow>
        <cylinderGeometry args={[0.09, 0.12, 0.5, 10]} />
        <meshStandardMaterial color="#7d9a2a" roughness={0.6} />
      </mesh>
      <mesh geometry={cob} castShadow>
        <meshStandardMaterial color="#d9a52c" roughness={0.6} />
      </mesh>
      <instancedMesh ref={kernels} args={[undefined, undefined, mats.length]} castShadow>
        <sphereGeometry args={[1, 10, 8]} />
        <meshPhysicalMaterial roughness={0.38} clearcoat={0.35} clearcoatRoughness={0.5} />
      </instancedMesh>
      {HUSKS.map((a, i) => (
        <group key={i} rotation-y={a}>
          <mesh geometry={husk} position={[RAD * 0.85, -0.15, 0]} scale={[LEN * 0.6, LEN * (0.55 + (i % 2) * 0.15), 1]} castShadow>
            <meshStandardMaterial vertexColors roughness={0.5} side={DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
