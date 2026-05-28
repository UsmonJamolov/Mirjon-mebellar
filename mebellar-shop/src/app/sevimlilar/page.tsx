"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";

function FavoritesPageContent() {
  const { likedIds, hydrated } = useCart();
  const liked = hydrated ? products.filter((p) => likedIds.includes(p.id)) : [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl font-bold mb-8">Sevimlilar</h1>

      {!hydrated ? (
        <p className="text-center text-gray-400 py-16">Yuklanmoqda...</p>
      ) : liked.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Hali sevimli mahsulot yo&apos;q</p>
          <Link href="/katalog" className="btn-accent inline-block mt-4">
            Katalogga o&apos;tish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {liked.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function FavoritesPage() {
  return (
    <RequireAuth>
      <FavoritesPageContent />
    </RequireAuth>
  );
}
