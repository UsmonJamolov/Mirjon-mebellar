"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "Konseptsiya",
    text: "Dizaynerlar va mijoz birgalikda eskiz va 3D model yaratadi.",
  },
  {
    num: "02",
    title: "Ishlab chiqarish",
    text: "Aniq o'lcham, premium materiallar va hunarmandchilik.",
  },
  {
    num: "03",
    title: "Yetkazib berish",
    text: "O'rnatish va keyingi qo'llab-quvvatlash — to'liq xizmat.",
  },
];

export function PremiumCraftsmanship() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".craft-block", {
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative bg-[#faf8f5] py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#6b5f52]">
          Hunarmandchilik
        </p>
        <h2 className="mt-2 max-w-2xl text-3xl font-bold text-[#3d3229] sm:text-4xl">
          Har bir detal — hikoya
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((s) => (
            <article key={s.num} className="craft-block card p-8">
              <span className="text-4xl font-bold text-[#f4a261]/40">{s.num}</span>
              <h3 className="mt-4 text-lg font-semibold text-[#3d3229]">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6b5f52]">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
