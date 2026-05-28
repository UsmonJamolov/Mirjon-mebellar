"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { MotionReveal } from "@/components/motion/MotionReveal";
import { MotionStagger, MotionStaggerItem } from "@/components/motion/MotionStagger";

export function PremiumShowcase({ products }: { products: Product[] }) {
  const t = useTranslations("home.showcase");

  return (
    <section className="relative bg-[#faf8f5] py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <MotionReveal direction="up" distance={20}>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#6b5f52]">
                {t("eyebrow")}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#3d3229] sm:text-3xl">
                {t("title")}
              </h2>
            </div>
          </MotionReveal>
          <MotionReveal direction="up" distance={14} delay={0.05}>
            <Link
              href="/katalog"
              className="text-[11px] uppercase tracking-[0.2em] text-[#3d3229] transition hover:text-[#f4a261]"
            >
              {t("viewAll")}
            </Link>
          </MotionReveal>
        </div>

        <MotionStagger className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {products.map((p) => (
            <MotionStaggerItem key={p.id}>
              <ProductCard product={p} />
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
