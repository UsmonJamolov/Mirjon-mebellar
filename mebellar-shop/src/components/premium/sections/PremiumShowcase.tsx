"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

gsap.registerPlugin(ScrollTrigger);

export function PremiumShowcase({ products }: { products: Product[] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".showcase-card", {
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative bg-[#faf8f5] py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#6b5f52]">
              Kolleksiya
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#3d3229] sm:text-3xl">
              Tanlangan mebellar
            </h2>
          </div>
          <Link
            href="/katalog"
            className="text-[11px] uppercase tracking-[0.2em] text-[#3d3229] transition hover:text-[#f4a261]"
          >
            Barcha mahsulotlar →
          </Link>
        </div>

        <div className="showcase-card grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
