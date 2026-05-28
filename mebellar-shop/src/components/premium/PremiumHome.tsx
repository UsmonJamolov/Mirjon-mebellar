"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product, Category } from "@/lib/types";
import { PremiumLoader } from "@/components/premium/PremiumLoader";
import { FuturisticCursor } from "@/components/premium/FuturisticCursor";
import { ConfiguratorHero } from "@/components/premium/sections/ConfiguratorHero";
import { PremiumCategories } from "@/components/premium/sections/PremiumCategories";
import { PremiumBenefits } from "@/components/premium/sections/PremiumBenefits";
import { PremiumShowcase } from "@/components/premium/sections/PremiumShowcase";
import { PremiumMaterials } from "@/components/premium/sections/PremiumMaterials";
import { PremiumCTA } from "@/components/premium/sections/PremiumCTA";

gsap.registerPlugin(ScrollTrigger);

interface PremiumHomeProps {
  products: Product[];
  categories: Category[];
  featured: Product[];
}

export function PremiumHome({
  products,
  categories,
  featured,
}: PremiumHomeProps) {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("bright-home");
    return () => {
      document.documentElement.classList.remove("bright-home");
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let rafCallback: ((time: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      rafCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);
    }

    setReady(true);

    return () => {
      if (rafCallback) gsap.ticker.remove(rafCallback);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loading]);

  const showcase = featured.length > 0 ? featured : products.slice(0, 4);

  return (
    <>
      {loading && (
        <PremiumLoader
          onComplete={() => {
            setLoading(false);
          }}
        />
      )}
      <FuturisticCursor active={!loading} />
      <main className={`bright-page ${loading ? "invisible" : ""}`}>
        <ConfiguratorHero ready={ready} />
        <PremiumCategories categories={categories} />
        <PremiumBenefits />
        <PremiumShowcase products={showcase} />
        <PremiumMaterials />
        <PremiumCTA />
      </main>
    </>
  );
}
