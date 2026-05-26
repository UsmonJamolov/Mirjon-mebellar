"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { LiquidShader } from "@/components/premium/LiquidShader";
import { ConfiguratorCanvas } from "@/components/premium/ConfiguratorCanvas";
import type {
  ChairColor,
  ChairConfig,
  ChairMaterial,
} from "@/components/premium/ArmchairModel";

const MATERIALS: ChairMaterial[] = [
  "Leather",
  "Matte fabric",
  "Velvet",
  "Suede",
  "Wood",
];

const COLORS: { label: ChairColor; hex: string }[] = [
  { label: "Black", hex: "#1a1a1a" },
  { label: "Warm brown", hex: "#7a5237" },
  { label: "Cream white", hex: "#f4efe6" },
  { label: "Graphite", hex: "#2a2a2a" },
  { label: "Luxury beige", hex: "#d9c7b2" },
];

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function ConfiguratorHero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  const [zoom, setZoom] = useState(0.32);
  const [config, setConfig] = useState<ChairConfig>(() => ({
    rotation: { x: -0.06, y: 0.45, z: 0 },
    material: "Leather",
    color: "Graphite",
  }));

  const rotDeg = useMemo(() => {
    const r = config.rotation;
    return {
      x: Math.round((r.x * 180) / Math.PI),
      y: Math.round((r.y * 180) / Math.PI),
      z: Math.round((r.z * 180) / Math.PI),
    };
  }, [config.rotation]);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      gsap.from(".cfg-reveal", {
        opacity: 0,
        y: 22,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-visible bg-[#faf8f5] pb-12 pt-6 sm:pb-16 sm:pt-8"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/bg1.png"
          alt=""
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5]/95 via-[#faf8f5]/75 to-[#faf8f5]/55" />
      </div>

      <div className="absolute inset-0 -z-10 opacity-30">
        <LiquidShader />
      </div>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative lg:grid lg:grid-cols-[1fr_300px] lg:gap-10 xl:grid-cols-[1fr_320px]">
          {/* Hero: chair orqada, matn oldinda */}
          <div className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[640px]">
            {/* 3D fon — to'rtburchak chegarasiz, to'liq ko'rinish */}
            <div className="pointer-events-auto absolute inset-0 -right-4 sm:-right-8 lg:-right-16 lg:top-4">
              <ConfiguratorCanvas config={config} zoom={zoom} />
            </div>

            {/* Matn ustidagi yengil gradient (o'qilishi uchun) */}
            <div
              className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#faf8f5]/90 via-[#faf8f5]/55 to-transparent"
              aria-hidden
            />

            <div className="cfg-reveal relative z-10 max-w-xl pt-8 sm:pt-12 lg:pt-16 pointer-events-none">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#6b5f52]">
                Kelajak interyeri
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold leading-[0.95] text-[#3d3229]">
                Mebel
                <br />
                <span className="text-[#3d3229]/45">San&apos;ati</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[#6b5f52]">
                Ultra realistik premium konfigurator — armchair material, rang va
                ko&apos;rinishni jonli 3D&apos;da sozlang. Stulni sichqoncha bilan
                aylantiring.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 pointer-events-auto">
                <Link href="/katalog" className="btn-accent" data-cursor="grow">
                  Kolleksiyani ko&apos;rish
                </Link>
                <Link href="/chat" className="btn-outline" data-cursor="grow">
                  Maslahat olish
                </Link>
              </div>
            </div>
          </div>

          {/* O'ng panel */}
          <aside className="cfg-reveal relative z-20 mt-8 rounded-[24px] border border-[#ebe6df] bg-white/80 p-5 shadow-[0_20px_70px_rgba(61,50,41,0.1)] backdrop-blur-md lg:mt-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b5f52]">
              Ko&apos;rinishni boshqarish
            </p>

            <div className="mt-5 space-y-4">
              {(
                [
                  { k: "x", label: "X" },
                  { k: "y", label: "Y" },
                  { k: "z", label: "Z" },
                ] as const
              ).map(({ k, label }) => (
                <div key={k}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6b5f52]">
                      Aylantirish
                    </span>
                    <span className="text-[11px] font-semibold text-[#3d3229]/70">
                      {k === "x" ? rotDeg.x : k === "y" ? rotDeg.y : rotDeg.z}°
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="w-3 text-[11px] font-semibold text-[#3d3229]/60">
                      {label}
                    </span>
                    <input
                      type="range"
                      min={-180}
                      max={180}
                      value={k === "x" ? rotDeg.x : k === "y" ? rotDeg.y : rotDeg.z}
                      onChange={(e) => {
                        const deg = Number(e.target.value);
                        setConfig((c) => ({
                          ...c,
                          rotation: {
                            ...c.rotation,
                            [k]: (deg * Math.PI) / 180,
                          },
                        }));
                      }}
                      className="w-full accent-[#f4a261]"
                    />
                  </div>
                </div>
              ))}

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6b5f52]">
                    Zoom
                  </span>
                  <span className="text-[11px] font-semibold text-[#3d3229]/70">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(zoom * 100)}
                  onChange={(e) => setZoom(clamp(Number(e.target.value) / 100, 0, 1))}
                  className="mt-2 w-full accent-[#f4a261]"
                />
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6b5f52]">
                  Rang
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setConfig((s) => ({ ...s, color: c.label }))}
                      className={`h-9 w-9 rounded-full border transition ${
                        config.color === c.label
                          ? "border-[#f4a261] ring-2 ring-[#f4a261]/25"
                          : "border-[#e5dfd6]"
                      }`}
                      style={{ background: c.hex }}
                      aria-label={c.label}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6b5f52]">
                  Material
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {MATERIALS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setConfig((s) => ({ ...s, material: m }))}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                        config.material === m
                          ? "bg-[#3d3229] text-white"
                          : "bg-[#f5f0e8] text-[#6b5f52] hover:bg-[#ebe6df]"
                      }`}
                    >
                      {m === "Matte fabric" ? "Mato" : m === "Leather" ? "Charm" : m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
