"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PremiumCTA() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cta-inner", {
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="cta-inner card overflow-hidden bg-[#3d3229] px-8 py-16 text-center sm:px-16 sm:py-20">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#f5ebe0]/70">
            Boshlash
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-bold text-white sm:text-4xl">
            Uyingiz uchun ideal mebelni birgalikda yaratamiz
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[#f5ebe0]/75">
            Chat orqali maslahat, eskiz yoki tayyor kolleksiyadan tanlash —
            sizning interyeringiz uchun.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/chat" className="btn-accent">
              Chat boshlash
            </Link>
            <Link
              href="/katalog"
              className="rounded-[14px] border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Katalog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
