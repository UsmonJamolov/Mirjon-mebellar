"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, Plus, Trash2, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { SearchInput } from "@/components/ui/SearchInput";
import { adminApi, formatPrice, type ProductDto } from "@/lib/api";

async function fetchSalesMap(): Promise<Map<string, number>> {
  const res = await fetch("/api/products/sales", { cache: "no-store" });
  if (!res.ok) return new Map();
  const data = (await res.json()) as { sales?: Record<string, number> };
  return new Map(Object.entries(data.sales ?? {}));
}

function getSalesCount(map: Map<string, number>, productId: string): number {
  return map.get(productId) ?? 0;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [salesMap, setSalesMap] = useState<Map<string, number>>(new Map());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, sales] = await Promise.all([
        adminApi.getProducts(),
        fetchSalesMap(),
      ]);
      setProducts(list);
      setSalesMap(sales);
    } catch {
      setError("Mahsulotlar yuklanmadi");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" mahsulotini o'chirishni tasdiqlaysizmi?`)) return;
    try {
      await adminApi.deleteProduct(id);
      load();
    } catch {
      alert("O'chirishda xato");
    }
  };

  const toggleHomepage = async (product: ProductDto) => {
    try {
      await adminApi.updateProduct(product.id, {
        hideFromPopular: !product.hideFromPopular,
      });
      load();
    } catch {
      alert("Yangilanmadi");
    }
  };

  return (
    <DashboardLayout title="Mahsulotlar">
      <PageTitle
        title="Mahsulotlar"
        subtitle="Mashhur mahsulotlar — eng ko'p sotilganlar asosida avtomatik tanlanadi"
        action={
          <Link href="/mahsulotlar/new" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Mahsulot qo&apos;shish
          </Link>
        }
      />

      <div className="flex gap-2 mb-6">
        <SearchInput
          className="flex-1"
          placeholder="Mahsulot qidirish..."
          value={search}
          onChange={setSearch}
        />
        <button type="button" className="btn-secondary flex items-center gap-2">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      {loading ? (
        <p className="text-center text-gray-500 py-12">Yuklanmoqda...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => {
            const sold = getSalesCount(salesMap, p.id);
            const onHomepage = !p.hideFromPopular;
            return (
              <div key={p.id} className="card overflow-hidden group">
                <Link href={`/mahsulotlar/${p.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={p.image || "/images/products/1.jpg"}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                    {sold > 0 && (
                      <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#3b82f6] px-2 py-1 text-[10px] font-semibold text-white">
                        <TrendingUp size={12} />
                        {sold} sotilgan
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-sm line-clamp-2">{p.name}</p>
                    <p className="text-[#3b82f6] font-semibold mt-2 text-sm">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </Link>
                <div className="flex gap-2 border-t border-gray-100 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => toggleHomepage(p)}
                    className={`flex-1 rounded-[10px] px-2 py-1.5 text-[11px] font-medium transition ${
                      onHomepage
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {onHomepage ? "Bosh sahifada" : "Yashirilgan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id, p.name)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-red-500 hover:bg-red-50"
                    aria-label="O'chirish"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
