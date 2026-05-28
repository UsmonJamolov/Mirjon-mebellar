"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Leaf, Clock, Sparkles, Brush } from "lucide-react";
import { MotionReveal } from "@/components/motion/MotionReveal";
import { MotionStagger, MotionStaggerItem } from "@/components/motion/MotionStagger";

const materials = [
  {
    id: "walnut",
    name: "Yong'oq",
    desc: "Tabiiy yog'och teksturasi, issiq chuqurlik",
    base: "#5a3a23",
    accent: "rgba(220, 168, 110, 0.42)",
    swatch: "linear-gradient(135deg, #7a4a26 0%, #4a2c18 100%)",
  },
  {
    id: "marble",
    name: "Marmar",
    desc: "Tabiiy tosh, sovuq va bardoshli",
    base: "#dad6cf",
    accent: "rgba(255, 255, 255, 0.65)",
    swatch: "linear-gradient(135deg, #f3eee6 0%, #c8c4bd 100%)",
  },
  {
    id: "leather",
    name: "Charm",
    desc: "Yumshoq, nafis va chiroyli",
    base: "#1f1d1a",
    accent: "rgba(120, 110, 100, 0.4)",
    swatch: "linear-gradient(135deg, #2c2823 0%, #0f0d0b 100%)",
  },
  {
    id: "brass",
    name: "Mis",
    desc: "Metallik parlatish va zamonaviy uslub",
    base: "#a07a44",
    accent: "rgba(255, 220, 160, 0.45)",
    swatch: "linear-gradient(135deg, #c69559 0%, #7d5a30 100%)",
  },
];

const benefits = [
  { icon: Leaf, title: "Ekologik toza", desc: "Tabiiy va xavfsiz materiallar" },
  { icon: Clock, title: "Uzoq muddatli", desc: "10+ yil xizmat muddati" },
  { icon: Sparkles, title: "Estetik dizayn", desc: "Har bir detalda go'zallik" },
  { icon: Brush, title: "Oson tozalash", desc: "Maxsus himoyalangan qoplam" },
];

export function PremiumMaterials() {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState(materials[0].id);
  const active = materials.find((m) => m.id === activeId) ?? materials[0];

  return (
    <section className="relative bg-[#faf8f5] py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <MotionReveal direction="up" distance={22}>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#6b5f52]">
            Interaktiv teksturalar
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-[#3d3229] sm:text-4xl">
            Materialni his eting
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6b5f52]">
            Har bir material — uzoq umr, premium sifat va dizaynerlik
            yondashuvi. Sichqoncha bilan tanlang.
          </p>
        </MotionReveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.4fr_1fr] lg:items-stretch">
          {/* Left: material list */}
          <MotionStagger className="space-y-2" amount={0.2}>
            {materials.map((m) => {
              const isActive = m.id === active.id;
              return (
                <MotionStaggerItem key={m.id}>
                  <motion.button
                    type="button"
                    onClick={() => setActiveId(m.id)}
                    whileHover={reduced ? undefined : { x: 4 }}
                    whileTap={reduced ? undefined : { scale: 0.99 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex w-full items-center gap-4 rounded-[18px] border bg-white px-4 py-3 text-left transition-shadow ${
                      isActive
                        ? "border-[#f4a261]/60 shadow-[0_18px_40px_rgba(244,162,97,0.18)]"
                        : "border-[#ebe6df] hover:shadow-[0_10px_28px_rgba(61,50,41,0.08)]"
                    }`}
                  >
                    <span
                      className="h-12 w-12 shrink-0 rounded-[14px]"
                      style={{ backgroundImage: m.swatch }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#3d3229]">
                        {m.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-[#8b7d6f]">
                        {m.desc}
                      </span>
                    </span>
                  </motion.button>
                </MotionStaggerItem>
              );
            })}
          </MotionStagger>

          {/* Center: live texture preview */}
          <MotionReveal
            direction="up"
            distance={26}
            className="relative overflow-hidden rounded-[24px] border border-[#ebe6df] bg-[#3d3229] shadow-[0_30px_80px_rgba(61,50,41,0.22)]"
          >
            <div className="relative aspect-[4/3] w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 30% 25%, ${active.accent}, transparent 65%), ${active.base}`,
                  }}
                />
              </AnimatePresence>

              {!reduced ? (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(circle at 25% 30%, rgba(255,255,255,0.18), transparent 55%)",
                      "radial-gradient(circle at 70% 60%, rgba(255,255,255,0.16), transparent 55%)",
                      "radial-gradient(circle at 25% 30%, rgba(255,255,255,0.18), transparent 55%)",
                    ],
                  }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                />
              ) : null}

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-white/55">
                    Material
                  </p>
                  <p className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
                    {active.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  {materials.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      aria-label={m.name}
                      onClick={() => setActiveId(m.id)}
                      className={`h-9 w-9 rounded-full border-2 transition ${
                        m.id === active.id
                          ? "border-white"
                          : "border-white/30 hover:border-white/70"
                      }`}
                      style={{ backgroundImage: m.swatch }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </MotionReveal>

          {/* Right: benefits */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#6b5f52]">
              Nima uchun premium?
            </p>
            <MotionStagger className="mt-4 space-y-3" amount={0.2}>
              {benefits.map(({ icon: Icon, title, desc }) => (
                <MotionStaggerItem key={title}>
                  <motion.div
                    whileHover={reduced ? undefined : { y: -2 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-3 rounded-[16px] border border-[#ebe6df] bg-white px-4 py-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#f4a261]/12 text-[#c97b3f]">
                      <Icon size={16} strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#3d3229]">{title}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-[#8b7d6f]">
                        {desc}
                      </p>
                    </div>
                  </motion.div>
                </MotionStaggerItem>
              ))}
            </MotionStagger>
          </div>
        </div>
      </div>
    </section>
  );
}
