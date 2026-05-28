"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { MotionStagger, MotionStaggerItem } from "@/components/motion/MotionStagger";

const TRUST_AVATARS = [
  "https://i.pravatar.cc/64?img=14",
  "https://i.pravatar.cc/64?img=22",
  "https://i.pravatar.cc/64?img=33",
  "https://i.pravatar.cc/64?img=47",
];

const HERO_IMAGE = "/images/HSI.jpg";

export function ConfiguratorHero({ ready: _ready }: { ready: boolean }) {
  const t = useTranslations("home.hero");
  const reduced = useReducedMotion();
  void _ready;

  return (
    <section className="relative overflow-hidden bg-[#faf8f5] pb-12 pt-8 sm:pb-16 sm:pt-12 lg:pt-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-14">
          <MotionStagger className="relative z-10 flex flex-col justify-center">
            <MotionStaggerItem>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#6b5f52]">
                {t("eyebrow")}
              </p>
            </MotionStaggerItem>
            <MotionStaggerItem>
              <h1 className="mt-4 font-display text-[clamp(2.8rem,6vw,5.2rem)] font-semibold leading-[0.95] text-[#3d3229]">
                {t("titleLine1")}
                <br />
                <span className="text-[#3d3229]/45">{t("titleLine2")}</span>
              </h1>
            </MotionStaggerItem>
            <MotionStaggerItem>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[#6b5f52]">
                {t("description")}
              </p>
            </MotionStaggerItem>
            <MotionStaggerItem>
              <div className="mt-7 flex flex-wrap gap-3">
                <motion.div whileTap={reduced ? undefined : { scale: 0.97 }}>
                  <Link
                    href="/katalog"
                    className="inline-flex items-center gap-2 rounded-[14px] bg-[#f4a261] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(244,162,97,0.32)] transition hover:bg-[#e88b4a]"
                  >
                    {t("viewCollection")}
                  </Link>
                </motion.div>
                <motion.div whileTap={reduced ? undefined : { scale: 0.97 }}>
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 rounded-[14px] border-2 border-[#3d3229]/15 bg-white px-6 py-3 text-sm font-semibold text-[#3d3229] transition hover:bg-[#3d3229]/5"
                  >
                    {t("getAdvice")}
                  </Link>
                </motion.div>
              </div>
            </MotionStaggerItem>
            <MotionStaggerItem>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-2">
                  {TRUST_AVATARS.map((src) => (
                    <span
                      key={src}
                      className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-[#f5ede1] shadow-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </span>
                  ))}
                </div>
                <div className="text-[12px] leading-tight text-[#6b5f52]">
                  <p className="font-semibold text-[#3d3229]">{t("trustCount")}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[#8b7d6f]">
                    <Star size={13} className="fill-[#f4a261] text-[#f4a261]" />
                    <span className="font-semibold text-[#3d3229]">4.9</span>
                    <span>{t("reviews")}</span>
                  </p>
                </div>
              </div>
            </MotionStaggerItem>
          </MotionStagger>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 40, scale: 0.96 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[44px] bg-gradient-to-tr from-[#f4a261]/12 via-[#f3e6d4]/40 to-transparent blur-2xl"
            />

            <motion.div
              whileHover={reduced ? undefined : { y: -6 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[5/4] w-full overflow-hidden rounded-[32px] border border-[#ebe6df] bg-white shadow-[0_40px_100px_rgba(61,50,41,0.18)]"
            >
              <Image
                src={HERO_IMAGE}
                alt={t("imageAlt")}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/40 to-transparent"
              />

              <motion.div
                className="absolute left-5 top-5 flex items-center gap-3 rounded-[16px] border border-white/40 bg-white/85 px-4 py-2.5 shadow-[0_14px_30px_rgba(61,50,41,0.18)] backdrop-blur-md"
                animate={reduced ? undefined : { y: [0, -5, 0] }}
                transition={
                  reduced
                    ? undefined
                    : { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#f4a261]/15 text-[#c97b3f]">
                  <Star size={16} strokeWidth={1.8} className="fill-[#f4a261]" />
                </span>
                <div className="text-[11px] leading-tight">
                  <p className="font-semibold text-[#3d3229]">{t("badgeTitle")}</p>
                  <p className="mt-0.5 text-[#8b7d6f]">{t("badgeSub")}</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-5 right-5 rounded-[18px] border border-white/40 bg-white/90 px-4 py-3 shadow-[0_18px_36px_rgba(61,50,41,0.2)] backdrop-blur-md"
                animate={reduced ? undefined : { y: [0, 6, 0] }}
                transition={
                  reduced
                    ? undefined
                    : { duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
                }
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8b7d6f]">
                  {t("offerLabel")}
                </p>
                <p className="mt-1 text-lg font-bold text-[#3d3229]">{t("offerDiscount")}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
