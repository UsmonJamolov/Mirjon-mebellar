"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

export function PremiumLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const obj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(".premium-loader", {
          opacity: 0,
          duration: 0.7,
          ease: "power3.inOut",
          onComplete,
        });
      },
    });

    tl.to(obj, {
      val: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(obj.val)),
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      className="premium-loader fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#faf8f5]"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f4a261] text-xl font-bold text-white">
        M
      </div>
      <p className="text-sm font-semibold text-[#3d3229]">Mebellar</p>
      <div className="mt-10 h-1 w-48 overflow-hidden rounded-full bg-[#ebe6df]">
        <div
          className="h-full rounded-full bg-[#f4a261] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-[10px] tracking-[0.3em] text-[#6b5f52]">
        {progress}%
      </p>
    </div>
  );
}
