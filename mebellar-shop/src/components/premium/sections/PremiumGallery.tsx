"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  "/images/products/1.jpg",
  "/images/products/2.jpg",
  "/images/products/3.jpg",
  "/images/products/4.jpg",
  "/images/products/5.jpg",
  "/images/products/6.jpg",
];

export function PremiumGallery() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gallery-item", {
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
        scale: 0.96,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#6b5f52]">Galereya</p>
        <h2 className="mt-2 text-3xl font-bold text-[#3d3229] sm:text-4xl">
          Premium vizual
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {galleryImages.map((src, i) => (
            <div
              key={src}
              className={`gallery-item card relative overflow-hidden ${
                i === 0
                  ? "col-span-2 row-span-2 aspect-square md:aspect-auto md:min-h-[420px]"
                  : "aspect-square"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover transition duration-700 hover:scale-105"
                sizes={i === 0 ? "66vw" : "33vw"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
