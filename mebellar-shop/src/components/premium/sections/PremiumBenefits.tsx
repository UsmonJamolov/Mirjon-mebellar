"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShieldCheck, Truck, Headphones, Lock } from "lucide-react";
import { MotionStagger, MotionStaggerItem } from "@/components/motion/MotionStagger";

const benefitIds = ["quality", "delivery", "support", "secure"] as const;
const benefitIcons = {
  quality: ShieldCheck,
  delivery: Truck,
  support: Headphones,
  secure: Lock,
};

export function PremiumBenefits() {
  const t = useTranslations("home.benefits");
  const reduced = useReducedMotion();

  return (
    <section className="relative bg-[#faf8f5] py-8 sm:py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <MotionStagger className="grid grid-cols-2 gap-3 rounded-[24px] border border-[#ebe6df] bg-white p-4 sm:gap-4 sm:p-5 lg:grid-cols-4 lg:p-6">
          {benefitIds.map((id) => {
            const Icon = benefitIcons[id];
            return (
              <MotionStaggerItem key={id}>
                <motion.div
                  whileHover={reduced ? undefined : { y: -3 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 rounded-[18px] px-3 py-3 transition-colors hover:bg-[#faf6ef] dark:hover:bg-[#3d3229]/55 sm:px-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#f4a261]/12 text-[#c97b3f]">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#3d3229]">
                      {t(`${id}Title`)}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-[#8b7d6f]">
                      {t(`${id}Desc`)}
                    </p>
                  </div>
                </motion.div>
              </MotionStaggerItem>
            );
          })}
        </MotionStagger>
      </div>
    </section>
  );
}
