"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MotionReveal } from "@/components/motion/MotionReveal";
import { MotionStagger, MotionStaggerItem } from "@/components/motion/MotionStagger";
import type { Category } from "@/lib/types";

const HOMEPAGE_CATEGORIES = [
  { slug: "otrish", count: 128, image: "/images/products/5.jpg" },
  {
    slug: "stollar",
    count: 96,
    image:
      "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=600&q=80",
  },
  { slug: "yotoqxonalar", count: 64, image: "/images/products/8.jpg" },
  {
    slug: "divanlar",
    count: 72,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
  },
  { slug: "yoritgichlar", count: 48, image: "/images/products/6.jpg" },
  { slug: "dekor", count: 85, image: "/images/products/7.jpg" },
] as const;

interface PremiumCategoriesProps {
  categories?: Category[];
}

export function PremiumCategories({ categories: _categories }: PremiumCategoriesProps) {
  const t = useTranslations("home.categories");
  const reduced = useReducedMotion();
  const list = HOMEPAGE_CATEGORIES;
  void _categories;

  return (
    <section className="relative bg-[#faf8f5] pt-4 pb-8 sm:pt-6 sm:pb-10">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <MotionReveal direction="up" distance={20}>
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#6b5f52]">
                {t("eyebrow")}
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-bold text-[#3d3229] sm:text-[26px]">
                {t("title")}
              </h2>
            </div>
            <Link
              href="/katalog"
              className="hidden text-[10px] font-semibold uppercase tracking-[0.25em] text-[#3d3229]/80 transition hover:text-[#c97b3f] sm:inline-flex"
            >
              {t("viewAll")}
            </Link>
          </div>
        </MotionReveal>

        <MotionStagger
          className="grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3"
          amount={0.2}
        >
          {list.map((cat, index) => (
            <MotionStaggerItem key={cat.slug}>
              <motion.div
                whileHover={reduced ? undefined : { y: -4 }}
                whileTap={reduced ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/katalog?cat=${cat.slug}`}
                  className={`group flex h-full flex-col items-center rounded-[18px] border bg-white p-2.5 text-center transition-shadow duration-300 hover:shadow-[0_18px_42px_rgba(61,50,41,0.1)] sm:p-3 ${
                    index === 0
                      ? "border-[#f4a261]/70 shadow-[0_14px_36px_rgba(244,162,97,0.2)]"
                      : "border-[#ebe6df]"
                  }`}
                >
                  <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-[14px] bg-gradient-to-br from-[#f5ede1] via-[#faf6ef] to-[#f3e6d4]">
                    <Image
                      src={cat.image}
                      alt={t(cat.slug)}
                      fill
                      sizes="(max-width: 640px) 33vw, 16vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
                  </div>
                  <p className="mt-2 truncate text-[12.5px] font-semibold text-[#3d3229]">
                    {t(cat.slug)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#8b7d6f]">
                    {t("productCount", { count: cat.count })}
                  </p>
                </Link>
              </motion.div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
