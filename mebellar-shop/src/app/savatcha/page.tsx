"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/mock-data";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-xl font-bold">Savatcha bo&apos;sh</h1>
        <p className="text-gray-500 mt-2 text-sm">Mahsulot qo&apos;shing va buyurtma bering</p>
        <Link href="/katalog" className="btn-accent inline-block mt-6">
          Katalogga o&apos;tish
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl font-bold mb-8">Savatcha</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="card p-4 flex gap-4">
              <div className="relative h-24 w-24 shrink-0 rounded-[14px] overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                <p className="text-[#f4a261] font-bold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center rounded-[14px] border border-gray-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-[14px]"
                    aria-label="O'chirish"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="font-bold text-sm hidden sm:block">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-semibold text-lg mb-4">Buyurtma xulosasi</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Mahsulotlar ({items.length})</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Yetkazish</span>
              <span className="text-green-600 font-medium">Bepul</span>
            </div>
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between items-center">
            <span className="font-semibold">Jami</span>
            <span className="text-xl font-bold text-[#f4a261]">{formatPrice(total)}</span>
          </div>
          <Link href="/checkout" className="btn-accent block text-center w-full mt-6">
            Buyurtma berish
          </Link>
          <Link
            href="/katalog"
            className="block text-center text-sm text-gray-500 mt-3 hover:text-[#f4a261]"
          >
            Xaridni davom ettirish
          </Link>
        </div>
      </div>
    </main>
  );
}
