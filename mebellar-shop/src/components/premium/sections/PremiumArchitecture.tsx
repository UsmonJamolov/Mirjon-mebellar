"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Category } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export function PremiumArchitecture({
  categories,
}: {
  categories: Category[];
}) {
  const ref = useRef<HTMLElement>(null);
  const display = categories.slice(0, 5);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".arch-cell", {
        scrollTrigger: { trigger: ref.current, start: "top 72%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="border-t border-[#ebe6df] bg-[#faf8f5] py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#6b5f52]">
          Kategoriyalar
        </p>
        <h2 className="mt-2 text-3xl font-bold text-[#3d3229] sm:text-4xl">
          Makonlar bo&apos;yicha
        </h2>
        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 md:grid-cols-4 md:auto-rows-[200px] md:gap-4">
          {display.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/katalog?cat=${cat.slug}`}
              className={`arch-cell card group relative overflow-hidden ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3d3229]/80 via-[#3d3229]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/70">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
