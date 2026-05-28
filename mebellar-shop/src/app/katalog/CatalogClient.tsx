"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, SlidersHorizontal, Package, RefreshCw } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Category, Product } from "@/lib/types";
import { categories as mockCategories, products as mockProducts } from "@/lib/mock-data";
import { sortProducts, type ProductSortOrder } from "@/lib/product-sort";
import { cn } from "@/lib/utils";
import { DynamicText } from "@/hooks/useDynamicTranslate";

async function loadCatalogData(): Promise<{ categories: Category[]; products: Product[] }> {
  const [cRes, pRes] = await Promise.all([
    fetch("/api/categories", { cache: "no-store" }),
    fetch("/api/products", { cache: "no-store" }),
  ]);

  let categories: Category[] = mockCategories;
  let products: Product[] = mockProducts;

  if (cRes.ok) {
    const data = await cRes.json();
    if (Array.isArray(data)) categories = data as Category[];
  }

  if (pRes.ok) {
    const data = await pRes.json();
    if (Array.isArray(data)) products = data as Product[];
  }

  if (!cRes.ok && !pRes.ok) {
    throw new Error("Katalog yuklanmadi");
  }

  return { categories, products };
}

function CatalogContent({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const t = useTranslations("catalog");
  const router = useRouter();
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat");
  const q = searchParams.get("q")?.toLowerCase();
  const sortParam = searchParams.get("sort");
  const sort: ProductSortOrder =
    sortParam === "oldest" ? "oldest" : "latest";

  const filtered = useMemo(() => {
    let list = products;
    if (cat) {
      const catName = categories.find((c) => c.slug === cat)?.name;
      if (catName) list = list.filter((p) => p.category === catName);
    }
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
    return sortProducts(list, sort);
  }, [cat, q, sort, categories, products]);

  const applySort = (nextSort: ProductSortOrder) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextSort === "latest") params.delete("sort");
    else params.set("sort", nextSort);
    const qs = params.toString();
    router.push(qs ? `/katalog?${qs}` : "/katalog");
  };

  const title = cat
    ? categories.find((c) => c.slug === cat)?.name || t("allProducts")
    : t("allProducts");

  const activeCategory = categories.find((c) => c.slug === cat);

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <section className="bg-white border-b border-[#ebe6df]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex items-center gap-2 text-[#f4a261] text-sm font-medium mb-2">
            <Package size={18} />
            <span>{t("badge")}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#3d3229]">
            {cat ? <DynamicText text={title} /> : title}
          </h1>
          <p className="mt-2 text-[#6b5f52] text-sm lg:text-base">
            {t("found", { count: filtered.length })}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-3xl">
            <form
              className="relative flex-1 min-w-0"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = (formData.get("q") as string)?.trim();
                const params = new URLSearchParams(searchParams.toString());
                if (query) params.set("q", query);
                else params.delete("q");
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
                placeholder={t("searchProducts")}
                defaultValue={q || ""}
                className="w-full rounded-[14px] border border-[#e5dfd6] bg-white py-3.5 pl-12 pr-4 text-sm text-[#3d3229] outline-none transition placeholder:text-[#a89a8c] focus:border-[#f4a261] focus:ring-2 focus:ring-[#f4a261]/25 [&::-webkit-search-cancel-button]:appearance-none"
              />
            </form>
            <select
              value={sort}
              onChange={(e) => applySort(e.target.value as ProductSortOrder)}
              aria-label={t("sortLatest")}
              className="w-full sm:w-[200px] shrink-0 rounded-[14px] border border-[#e5dfd6] bg-white py-3.5 px-4 text-sm text-[#3d3229] outline-none transition focus:border-[#f4a261] focus:ring-2 focus:ring-[#f4a261]/25 cursor-pointer"
            >
              <option value="latest">{t("sortLatest")}</option>
              <option value="oldest">{t("sortOldest")}</option>
            </select>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="card p-5 sticky top-24">
              <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-4">
                {t("categories")}
              </h2>
              <nav className="flex flex-col gap-1">
                <Link
                  href="/katalog"
                  className={cn(
                    "rounded-[14px] px-4 py-2.5 text-sm font-medium transition",
                    !cat ? "bg-[#f4a261] text-white" : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  {t("all")}
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
                    <span>
                      <DynamicText text={c.name} />
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        cat === c.slug ? "text-white/70" : "text-gray-400"
                      )}
                    >
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
                {t("category")}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                <Link
                  href="/katalog"
                  className={cn(
                    "catalog-pill",
                    !cat ? "catalog-pill-active" : "catalog-pill-inactive"
                  )}
                >
                  {t("all")}
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
                    <DynamicText text={c.name} />
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
                  <p className="font-semibold">
                    <DynamicText text={activeCategory.name} />
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("productCount", { count: activeCategory.count })}
                  </p>
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
                <p className="font-semibold text-lg">{t("empty")}</p>
                <p className="text-gray-500 text-sm mt-2">{t("tryOther")}</p>
                <Link href="/katalog" className="btn-accent inline-block mt-6">
                  {t("allProducts")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CatalogDataLoader() {
  const tCommon = useTranslations("common");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    loadCatalogData()
      .then((data) => {
        if (cancelled) return;
        setCategories(data.categories);
        setProducts(data.products);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Xato");
        setCategories(mockCategories);
        setProducts(mockProducts);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#faf8f5]">
        <p className="text-gray-500">{tCommon("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 bg-[#faf8f5] px-4 text-center">
        <p className="text-gray-600">{error}</p>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="btn-accent inline-flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Qayta urinish
        </button>
      </div>
    );
  }

  return <CatalogContent categories={categories} products={products} />;
}

export function CatalogClient() {
  const tCommon = useTranslations("common");

  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center bg-[#faf8f5]">
          <p className="text-gray-500">{tCommon("loading")}</p>
        </div>
      }
    >
      <CatalogDataLoader />
    </Suspense>
  );
}
