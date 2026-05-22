"use client";

import { useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CatalogClientProps {
  categories: Category[];
  products: Product[];
}

function CatalogContent({ categories, products }: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat");
  const q = searchParams.get("q")?.toLowerCase();

  const filtered = useMemo(() => {
    let list = products;
    if (cat) {
      const catName = categories.find((c) => c.slug === cat)?.name;
      if (catName) list = list.filter((p) => p.category === catName);
    }
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
    return list;
  }, [cat, q, categories, products]);

  const title = cat
    ? categories.find((c) => c.slug === cat)?.name || "Katalog"
    : "Barcha mahsulotlar";

  const activeCategory = categories.find((c) => c.slug === cat);

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <section className="bg-white border-b border-[#ebe6df]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex items-center gap-2 text-[#f4a261] text-sm font-medium mb-2">
            <Package size={18} />
            <span>Mebellar katalogi</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#3d3229]">{title}</h1>
          <p className="mt-2 text-[#6b5f52] text-sm lg:text-base">
            {filtered.length} ta mahsulot topildi
          </p>

          <form
            className="mt-6 relative max-w-xl"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = (formData.get("q") as string)?.trim();
              const params = new URLSearchParams();
              if (cat) params.set("cat", cat);
              if (query) params.set("q", query);
              const qs = params.toString();
              router.push(qs ? `/katalog?${qs}` : "/katalog");
            }}
          >
            <Search
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
              size={20}
              aria-hidden
            />
            <input
              type="search"
              name="q"
              placeholder="Mahsulot qidirish..."
              defaultValue={q || ""}
              className="w-full rounded-[14px] border border-[#e5dfd6] bg-white py-3.5 pl-12 pr-4 text-sm text-[#3d3229] outline-none transition placeholder:text-[#a89a8c] focus:border-[#f4a261] focus:ring-2 focus:ring-[#f4a261]/25 [&::-webkit-search-cancel-button]:appearance-none"
            />
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="card p-5 sticky top-24">
              <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-4">
                Kategoriyalar
              </h2>
              <nav className="flex flex-col gap-1">
                <Link
                  href="/katalog"
                  className={cn(
                    "rounded-[14px] px-4 py-2.5 text-sm font-medium transition",
                    !cat ? "bg-[#f4a261] text-white" : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  Barchasi
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/katalog?cat=${c.slug}`}
                    className={cn(
                      "rounded-[14px] px-4 py-2.5 text-sm font-medium transition flex justify-between",
                      cat === c.slug
                        ? "bg-[#f4a261] text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    )}
                  >
                    <span>{c.name}</span>
                    <span className={cn("text-xs", cat === c.slug ? "text-white/70" : "text-gray-400")}>
                      {c.count}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="lg:hidden mb-6">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-600">
                <SlidersHorizontal size={18} />
                Kategoriya
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                <Link
                  href="/katalog"
                  className={cn("catalog-pill", !cat ? "catalog-pill-active" : "catalog-pill-inactive")}
                >
                  Barchasi
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/katalog?cat=${c.slug}`}
                    className={cn(
                      "catalog-pill",
                      cat === c.slug ? "catalog-pill-active" : "catalog-pill-inactive"
                    )}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {activeCategory && (
              <div className="card p-4 mb-6 flex items-center gap-4 bg-[#f4a261]/10 border-[#f4a261]/30">
                <div className="h-12 w-12 rounded-[14px] bg-[#f4a261]/20 flex items-center justify-center text-[#f4a261] font-bold text-lg">
                  {activeCategory.name[0]}
                </div>
                <div>
                  <p className="font-semibold">{activeCategory.name}</p>
                  <p className="text-sm text-gray-500">{activeCategory.count} ta mahsulot</p>
                </div>
              </div>
            )}

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="font-semibold text-lg">Mahsulot topilmadi</p>
                <p className="text-gray-500 text-sm mt-2">Boshqa kategoriyani tanlang</p>
                <Link href="/katalog" className="btn-accent inline-block mt-6">
                  Barcha mahsulotlar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatalogClient(props: CatalogClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Yuklanmoqda...</p>
        </div>
      }
    >
      <CatalogContent {...props} />
    </Suspense>
  );
}
