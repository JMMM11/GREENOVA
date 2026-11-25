import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PCFShadowMap } from "three";
import { CornPlant } from "./CornPlant";

type Props = { stage: number; label: string; labelText: string[] };

/** Lienzo 3D aislado. Solo renderiza mientras está en pantalla y limita el pixel ratio a 1,5. */
export default function SeedlingCanvas({ stage, label, labelText }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [reduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  // Inclinación hacia el puntero, solo con puntero fino y sin movimiento reducido.
  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = wrap.current!.getBoundingClientRect();
    tilt.current = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 };
  };

  return (
    <div
      ref={wrap}
      role="img"
      aria-label={label}
      className="h-full w-full"
      onPointerMove={onMove}
      onPointerLeave={() => (tilt.current = { x: 0, y: 0 })}
    >
      <Canvas
        frameloop={!visible ? "never" : reduced ? "demand" : "always"}
        dpr={[1, 1.5]}
        shadows={{ type: PCFShadowMap }}
        camera={{ position: [0, 5, 13.5], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <hemisphereLight args={["#f6f3ea", "#4e5b05", 1.1]} />
        <directionalLight
          position={[5, 9, 6]}
          intensity={2.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-9}
          shadow-camera-right={9}
          shadow-camera-top={14}
          shadow-camera-bottom={-6}
          shadow-camera-far={40}
          shadow-radius={6}
        />
        <directionalLight position={[-6, 3, -4]} intensity={0.6} color="#e2d5bc" />
        {/* Luz de contorno: separa las hojas del fondo */}
        <directionalLight position={[-2, 7, -9]} intensity={1.3} color="#f4f7ea" />
        <CornPlant stage={stage} reduced={reduced} tilt={tilt} labelText={labelText} />
        <mesh rotation-x={-Math.PI / 2} position-y={-0.01} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial opacity={0.16} />
        </mesh>
      </Canvas>
    </div>
  );
}
