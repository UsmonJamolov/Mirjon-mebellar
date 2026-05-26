"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import type { ChairConfig } from "@/components/premium/ArmchairModel";
import { ArmchairModel } from "@/components/premium/ArmchairModel";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);

export function ConfiguratorCanvas({
  config,
  zoom,
}: {
  config: ChairConfig;
  zoom: number;
}) {
  const cam = useMemo(() => {
    // Zoom 0..1 -> masofa 5.2..3.6 (to'liq stul ko'rinsin)
    const dist = 5.2 - zoom * 1.6;
    return { position: [0.15, 0.95, dist] as [number, number, number], fov: 42 };
  }, [zoom]);

  return (
    <div
      className="absolute inset-0 h-full w-full touch-none"
      style={{ touchAction: "none" }}
    >
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <div className="h-12 w-12 animate-pulse rounded-full border border-[#3d3229]/20" />
          </div>
        }
      >
        <Canvas
          shadows
          camera={{ position: cam.position, fov: cam.fov }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
          style={{ background: "transparent", width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight
            position={[5, 8, 4]}
            intensity={1.15}
            castShadow
            color="#fff7ee"
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-4, 4, -2]} intensity={0.55} color="#ffd9bf" />
          <spotLight
            position={[2, 6, 3]}
            intensity={0.45}
            angle={0.45}
            penumbra={1}
            color="#ffffff"
          />

          <group position={[0.35, -0.05, 0]} scale={0.92}>
            <ArmchairModel config={config} />
          </group>

          <ContactShadows
            position={[0.35, -0.35, 0]}
            opacity={0.28}
            blur={2.8}
            scale={12}
            far={10}
            color="#3d3229"
          />

          <Environment preset="apartment" />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.07}
            rotateSpeed={0.55}
            target={[0.35, 0.45, 0]}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.85}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
