"use client";

import dynamic from "next/dynamic";
import { Suspense, useRef } from "react";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);

const LuxuryChairScene = dynamic(
  () =>
    import("@/components/premium/LuxuryChair").then((m) => m.LuxuryChairScene),
  { ssr: false }
);

export function ChairCanvas({
  mouse,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="absolute inset-0 z-[2]">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <div className="h-12 w-12 animate-pulse rounded-full border border-white/10" />
          </div>
        }
      >
        <Canvas
          shadows
          camera={{ position: [0, 1.2, 3.8], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <LuxuryChairScene mouse={mouse} />
        </Canvas>
      </Suspense>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[70%] -translate-x-1/2 -translate-y-1/3 rounded-full bg-white/[0.06] blur-[100px] premium-glow-orb"
        aria-hidden
      />
    </div>
  );
}
