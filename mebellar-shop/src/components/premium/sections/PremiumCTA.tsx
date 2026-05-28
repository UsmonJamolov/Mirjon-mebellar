"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MotionReveal } from "@/components/motion/MotionReveal";

export function PremiumCTA() {
  const t = useTranslations("home.cta");
  const reduced = useReducedMotion();

  return (
    <section className="relative bg-[#faf8f5] py-12 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <MotionReveal direction="up" distance={26} duration={0.75}>
          <motion.div
            whileHover={reduced ? undefined : { scale: 1.006 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#2c241d] via-[#3d3229] to-[#5b4a3a] shadow-[0_40px_100px_rgba(61,50,41,0.35)]"
          >
            <div className="absolute inset-0">
              <Image
                src="/images/products/1.jpg"
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2c241d] via-[#3d3229]/85 to-transparent" />
            </div>

            {!reduced ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#f4a261]/25 blur-[120px]"
                animate={{ x: [0, 40, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : null}

            <div className="relative grid gap-6 px-6 py-10 sm:grid-cols-[1.4fr_1fr] sm:items-center sm:px-12 sm:py-14 lg:px-16 lg:py-16">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">
                  {t("eyebrow")}
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  {t("title")}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
                  {t("description")}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <motion.div whileTap={reduced ? undefined : { scale: 0.97 }}>
                    <Link
                      href="/katalog"
                      className="inline-flex items-center gap-2 rounded-[14px] bg-[#f4a261] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(244,162,97,0.4)] transition hover:bg-[#e88b4a]"
                    >
                      {t("viewCollection")}
                    </Link>
                  </motion.div>
                  <motion.div whileTap={reduced ? undefined : { scale: 0.97 }}>
                    <Link
                      href="/chat"
                      className="inline-flex items-center gap-2 rounded-[14px] border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      {t("startChat")}
                    </Link>
                  </motion.div>
                </div>
              </div>

              <div className="hidden sm:block">
                <motion.div
                  animate={reduced ? undefined : { y: [0, -8, 0] }}
                  transition={
                    reduced
                      ? undefined
                      : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
                  }
                  className="relative ml-auto aspect-[5/4] w-full max-w-[360px] overflow-hidden rounded-[22px] border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                >
                  <Image
                    src="/images/products/2.jpg"
                    alt={t("imageAlt")}
                    fill
                    sizes="(max-width: 1024px) 50vw, 360px"
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </MotionReveal>
      </div>
    </section>
  );
}
