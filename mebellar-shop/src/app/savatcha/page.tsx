"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/mock-data";
import { DynamicText } from "@/hooks/useDynamicTranslate";

function CartPageContent() {
  const t = useTranslations("cart");
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag
          size={64}
          className="mx-auto text-gray-300 dark:text-[#5c4f42] mb-4"
        />
        <h1 className="text-xl font-bold text-[#3d3229] dark:text-[#f5f0e8]">
          {t("emptyTitle")}
        </h1>
        <p className="text-gray-500 dark:text-[#b5a898] mt-2 text-sm">
          {t("emptyDesc")}
        </p>
        <Link href="/katalog" className="btn-accent inline-block mt-6">
          {t("goCatalog")}
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl font-bold mb-8 text-[#3d3229] dark:text-[#f5f0e8]">
        {t("title")}
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="card p-4 flex gap-4 transition-colors hover:border-[#f4a261]/30 dark:hover:border-[#f4a261]/40"
            >
              <div className="relative h-24 w-24 shrink-0 rounded-[14px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2 text-[#3d3229] dark:text-[#f5f0e8]">
                      <DynamicText text={item.name} />
                    </h3>
                    <p className="text-[#f4a261] font-bold mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <p className="font-bold text-sm text-[#3d3229] dark:text-[#f5f0e8] whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/15"
                      aria-label={t("remove")}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center">
                  <div className="inline-flex items-center rounded-[14px] border border-gray-200 dark:border-[#3d3229] bg-white dark:bg-[#231b16]">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="p-2 rounded-l-[14px] transition hover:bg-gray-50 dark:hover:bg-[#3d3229]/60 text-[#3d3229] dark:text-[#f5f0e8]"
                      aria-label={t("decrease")}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-[#3d3229] dark:text-[#f5f0e8]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="p-2 rounded-r-[14px] transition hover:bg-gray-50 dark:hover:bg-[#3d3229]/60 text-[#3d3229] dark:text-[#f5f0e8]"
                      aria-label={t("increase")}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-semibold text-lg mb-4 text-[#3d3229] dark:text-[#f5f0e8]">
            {t("summary")}
          </h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-[#b5a898]">
            <div className="flex justify-between">
              <span>{t("productsCount", { count: items.length })}</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("delivery")}</span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                {t("free")}
              </span>
            </div>
          </div>
          <div className="border-t border-[#ebe6df] dark:border-[#3d3229] mt-4 pt-4 flex justify-between items-center">
            <span className="font-semibold text-[#3d3229] dark:text-[#f5f0e8]">
              {t("total")}
            </span>
            <span className="text-xl font-bold text-[#f4a261]">
              {formatPrice(total)}
            </span>
          </div>
          <Link href="/checkout" className="btn-accent block text-center w-full mt-6">
            {t("checkout")}
          </Link>
          <Link
            href="/katalog"
            className="block text-center text-sm text-gray-500 dark:text-[#b5a898] mt-3 hover:text-[#f4a261] dark:hover:text-[#f4a261]"
          >
            {t("continueShopping")}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CartPage() {
  return (
    <RequireAuth>
      <CartPageContent />
    </RequireAuth>
  );
}
