"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { LiquidShader } from "@/components/premium/LiquidShader";
import { ChairCanvas } from "@/components/premium/ChairCanvas";

export function PremiumHero({ ready }: { ready: boolean }) {
  const mouse = useRef({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        y: 80,
        opacity: 0,
        duration: 1.4,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.2,
      });
      gsap.from(".hero-fade", {
        opacity: 0,
        y: 24,
        duration: 1.2,
        delay: 0.7,
        ease: "power2.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="premium-hero relative flex min-h-screen flex-col justify-end overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg1.png"
          alt=""
          fill
          priority
          className="object-cover opacity-35 scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/65 via-[#faf8f5]/85 to-[#faf8f5]" />
      </div>

      <div className="absolute inset-0 z-[1] opacity-55">
        <LiquidShader />
      </div>

      <ChairCanvas mouse={mouse} />

      <div className="pointer-events-none absolute inset-0 z-[3]">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-px w-px rounded-full bg-[#3d3229]/25"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animation: `premium-pulse-glow ${4 + (i % 5)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-24 pt-32 sm:px-10 lg:pb-32">
        <div className="grid items-end gap-12 lg:grid-cols-2">
          <div>
            <p className="hero-fade premium-label mb-8">Kelajak interyeri</p>
            <h1 className="font-display premium-title text-[clamp(2.8rem,8vw,6.5rem)] text-[#3d3229]">
              <span className="hero-line block">Mebel</span>
              <span className="hero-line block text-[#3d3229]/45">San&apos;ati</span>
            </h1>
            <p className="hero-fade mt-8 max-w-md text-sm leading-relaxed tracking-wide text-[#6b5f52]">
              Premium mebel kolleksiyasi — sinematik dizayn, zamonaviy
              hunarmandchilik va shaxsiy yondashuv bir joyda.
            </p>
            <div className="hero-fade mt-10 flex flex-wrap gap-4">
              <Link href="/katalog" className="premium-btn premium-btn-solid" data-cursor="grow">
                Kolleksiyani ko&apos;rish
              </Link>
              <Link href="/eskiz" className="premium-btn" data-cursor="grow">
                Eskiz yaratish
              </Link>
            </div>
          </div>
          <div className="hero-fade hidden lg:block">
            <div className="premium-glass ml-auto max-w-xs rounded-2xl p-6">
              <p className="premium-label mb-3">2026 kolleksiya</p>
              <p className="text-sm leading-relaxed text-[#6b5f52]">
                Har bir buyum — interyer uchun yaratilgan haykaltarona.
                Three.js real vaqt 3D tajribasi.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[#6b5f52]">
        <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-[#3d3229]/40 to-transparent" />
      </div>
    </section>
  );
}
