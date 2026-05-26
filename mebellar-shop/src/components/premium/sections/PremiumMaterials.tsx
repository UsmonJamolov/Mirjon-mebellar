"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const materials = [
  {
    id: "walnut",
    name: "Yong'oq",
    desc: "Tabiiy yog'och teksturasi, issiq chuqurlik",
    color: "#3d2e24",
    highlight: "rgba(180, 140, 100, 0.4)",
  },
  {
    id: "marble",
    name: "Marmar",
    desc: "Sovuq mineral yuzalar, premium yaltiroq",
    color: "#8a8a90",
    highlight: "rgba(220, 220, 230, 0.5)",
  },
  {
    id: "leather",
    name: "Charm",
    desc: "Italiya charm, yumshoq teginish",
    color: "#1a1a1e",
    highlight: "rgba(100, 100, 110, 0.35)",
  },
  {
    id: "brass",
    name: "Mis",
    desc: "Metallik aksentlar, zamonaviy detallar",
    color: "#9a8b6a",
    highlight: "rgba(200, 180, 120, 0.45)",
  },
];

export function PremiumMaterials() {
  const [active, setActive] = useState(materials[0]);
  const ref = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".materials-reveal", {
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!previewRef.current) return;
    gsap.to(previewRef.current, {
      background: `radial-gradient(circle at 30% 30%, ${active.highlight}, transparent 70%), ${active.color}`,
      duration: 0.8,
      ease: "power2.inOut",
    });
  }, [active]);

  return (
    <section
      ref={ref}
      className="relative border-y border-[#ebe6df] bg-white py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-[1400px] gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="materials-reveal text-[11px] uppercase tracking-[0.35em] text-[#6b5f52]">
            Materiallar
          </p>
          <h2 className="materials-reveal mt-2 text-3xl font-bold text-[#3d3229] sm:text-4xl">
            Interaktiv teksturalar
          </h2>
          <p className="materials-reveal mt-6 max-w-md text-sm leading-relaxed text-[#6b5f52]">
            Har bir material — uzoq umr, premium sifat va dizaynerlik
            yondashuv. Sichqoncha bilan tanlang.
          </p>
          <ul className="materials-reveal mt-10 space-y-2">
            {materials.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setActive(m)}
                  className={`w-full rounded-[14px] px-5 py-4 text-left transition-all duration-300 ${
                    active.id === m.id
                      ? "card text-[#3d3229]"
                      : "text-[#6b5f52] hover:bg-[#f5f0e8]"
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    {m.name}
                  </span>
                  {active.id === m.id && (
                    <p className="mt-1 text-xs text-[#8b7d6f]">{m.desc}</p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div
          ref={previewRef}
          className="materials-reveal card relative aspect-square overflow-hidden"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${active.highlight}, transparent 70%), ${active.color}`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-5xl font-bold tracking-[0.15em] text-white/25 sm:text-7xl">
              {active.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
