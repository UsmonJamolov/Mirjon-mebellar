"use client";

import { useEffect, useRef } from "react";

export function FuturisticCursor({ active }: { active: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    if (!active) return;
    const coarse =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches;
    if (coarse) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const magnetic = el.closest("[data-magnetic]");
      const btn = el.closest("a, button, [data-cursor='grow']");
      ringRef.current?.classList.toggle("scale-150", !!btn);
      ringRef.current?.classList.toggle("opacity-60", !!magnetic);
    };

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference md:block"
        aria-hidden
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 transition-all duration-500 md:block"
        style={{ boxShadow: "0 0 24px rgba(255,255,255,0.15)" }}
        aria-hidden
      />
    </>
  );
}
