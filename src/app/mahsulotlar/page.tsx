"use client";

import Image from "next/image";
import Link from "next/link";
import { Filter, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { SearchInput } from "@/components/ui/SearchInput";
import { products, formatPrice } from "@/lib/mock-data";

export default function ProductsPage() {
  return (
    <DashboardLayout title="Mahsulotlar">
      <PageTitle
        title="Mahsulotlar"
        subtitle="Mahsulotlar katalogi"
        action={
          <Link href="/mahsulotlar/new" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Mahsulot qo&apos;shish
          </Link>
        }
      />

      <div className="flex gap-2 mb-6">
        <SearchInput className="flex-1" placeholder="Mahsulot qidirish..." />
        <button type="button" className="btn-secondary flex items-center gap-2">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/mahsulotlar/${p.id}`}
            className="card overflow-hidden hover:shadow-lg transition group"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-4">
              <p className="font-medium text-sm line-clamp-2">{p.name}</p>
              <p className="text-[#3b82f6] font-semibold mt-2 text-sm">
                {formatPrice(p.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
