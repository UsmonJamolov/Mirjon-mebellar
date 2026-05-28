"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ContactShadows, Environment } from "@react-three/drei";
import { LuxuryChair, type ChairMaterials } from "@/components/premium/LuxuryChair";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);

interface LuxuryChairCanvasProps {
  materials: ChairMaterials;
  rotation?: { x: number; y: number; z: number };
  zoom?: number;
}

export function LuxuryChairCanvas({
  materials,
  rotation,
  zoom = 0.45,
}: LuxuryChairCanvasProps) {
  // zoom 0..1 -> camera distance 4.6..2.8
  const camDistance = 4.6 - Math.max(0, Math.min(1, zoom)) * 1.8;

  return (
    <div className="absolute inset-0 h-full w-full touch-none" style={{ touchAction: "none" }}>
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <div className="h-10 w-10 animate-pulse rounded-full border border-[#3d3229]/20" />
          </div>
        }
      >
        <Canvas
          shadows
          camera={{ position: [0.4, 0.6, camDistance], fov: 36 }}
          gl={{ antialias: true, alpha: true, toneMappingExposure: 1.05 }}
          dpr={[1, 2]}
          style={{ background: "transparent", width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.45} />
          <directionalLight
            position={[4, 7, 4]}
            intensity={1.1}
            castShadow
            color="#fff7ee"
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-4, 4, -2]} intensity={0.5} color="#ffd9bf" />
          <spotLight position={[0, 8, 2]} intensity={0.45} angle={0.5} penumbra={1} color="#ffffff" />

          <LuxuryChair materials={materials} rotation={rotation} />

          <ContactShadows
            position={[0, -0.92, 0]}
            opacity={0.42}
            blur={2.6}
            scale={6}
            far={4}
            color="#3d3229"
          />

          <Environment preset="apartment" />
        </Canvas>
      </Suspense>
    </div>
  );
}
