import { HomeArchiveList } from "@/components/home/HomeArchiveList";
import { HomeCategoryRail } from "@/components/home/HomeCategoryRail";
import { HomeEditorialHero } from "@/components/home/HomeEditorialHero";
import { HomeStudioStrip } from "@/components/home/HomeStudioStrip";
import { ProductCard } from "@/components/product/ProductCard";
import { categories, products } from "@/lib/mock-data";
import Link from "next/link";

export default function HomePage() {
  const archive = products.slice(0, 6);
  const featured = products.filter((p) => p.isRecommended || p.isPopular).slice(0, 4);

  return (
    <main className="bg-[#faf8f5]">
      <HomeEditorialHero />
      <HomeStudioStrip />
      <HomeArchiveList products={archive} />
      <HomeCategoryRail categories={categories} />

      <section className="border-t border-[#3d3229]/10 py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-[11px] uppercase tracking-[0.35em] text-[#6b5f52]">
              Tanlangan
            </h2>
            <Link
              href="/katalog"
              className="text-[11px] uppercase tracking-[0.2em] text-[#3d3229] hover:text-[#f4a261] transition"
            >
              Katalog →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
