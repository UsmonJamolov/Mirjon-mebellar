"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Truck, Headphones, Lock } from "lucide-react";
import { MotionStagger, MotionStaggerItem } from "@/components/motion/MotionStagger";

const benefits = [
  {
    id: "quality",
    icon: ShieldCheck,
    title: "Premium sifat",
    desc: "Har bir detali mukammal",
  },
  {
    id: "delivery",
    icon: Truck,
    title: "Bepul yetkazib berish",
    desc: "Buyurtmalaringiz uchun",
  },
  {
    id: "support",
    icon: Headphones,
    title: "24/7 qo'llab-quvvatlash",
    desc: "Biz siz uchun doim mavjudmiz",
  },
  {
    id: "secure",
    icon: Lock,
    title: "Xavfsiz to'lov",
    desc: "100% himoyalangan to'lovlar",
  },
];

export function PremiumBenefits() {
  const reduced = useReducedMotion();

  return (
    <section className="relative bg-[#faf8f5] py-8 sm:py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <MotionStagger className="grid grid-cols-2 gap-3 rounded-[24px] border border-[#ebe6df] bg-white p-4 sm:gap-4 sm:p-5 lg:grid-cols-4 lg:p-6">
          {benefits.map(({ id, icon: Icon, title, desc }) => (
            <MotionStaggerItem key={id}>
              <motion.div
                whileHover={reduced ? undefined : { y: -3 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 rounded-[18px] px-3 py-3 transition-colors hover:bg-[#faf6ef] sm:px-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#f4a261]/12 text-[#c97b3f]">
                  <Icon size={20} strokeWidth={1.6} />
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
    </section>
  );
}
