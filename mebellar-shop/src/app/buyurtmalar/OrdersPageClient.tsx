"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { UserOrder } from "@/lib/order-persistence";

const statusStyle: Record<string, string> = {
  yangi: "bg-[#f4a261]/20 text-[#c97b3f] dark:bg-[#f4a261]/15 dark:text-[#f4a261]",
  jarayonda: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  tugallangan: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  bekor: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300",
};

export function OrdersPageClient({
  userOrders,
  hasPhone,
}: {
  userOrders: UserOrder[];
  hasPhone: boolean;
}) {
  const t = useTranslations("orders");
  const tNav = useTranslations("nav");

  const sourceLabel: Record<string, string> = {
    shop: t("sourceShop"),
    chat: t("sourceChat"),
    manual: t("sourceAdmin"),
  };

  const statusLabel: Record<string, string> = {
    yangi: t("statusNew"),
    jarayonda: t("statusProgress"),
    tugallangan: t("statusDone"),
    bekor: t("statusCancelled"),
  };

  if (!hasPhone) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <h1 className="text-2xl font-bold mb-2 text-[#3d3229] dark:text-[#f5f0e8]">
          {t("title")}
        </h1>
        <div className="card p-6 text-center">
          <p className="text-gray-500 dark:text-[#b5a898] text-sm">{t("noPhone")}</p>
          <Link href="/profil" className="btn-accent inline-block mt-4 text-sm px-5 py-2.5">
            {t("goProfile")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="text-2xl font-bold mb-2 text-[#3d3229] dark:text-[#f5f0e8]">
        {t("title")}
      </h1>
      <p className="text-gray-500 dark:text-[#b5a898] text-sm mb-8">{t("subtitle")}</p>

      {userOrders.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-gray-500 dark:text-[#b5a898] text-sm">{t("empty")}</p>
          <Link href="/katalog" className="btn-accent inline-block mt-4 text-sm px-5 py-2.5">
            {tNav("catalog")}
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {userOrders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/buyurtmalar/${order.id}`}
                className="card block p-5 transition hover:border-[#f4a261]/40 dark:hover:border-[#f4a261]/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-[#b5a898]">
                      {t("orderNumber")} #{order.id}
                    </p>
                    <p className="font-semibold text-[#3d3229] dark:text-[#f5f0e8] mt-1">
                      {formatPrice(order.total)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#b5a898] mt-1">
                      {order.date}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full",
                        statusStyle[order.status] ?? statusStyle.yangi
                      )}
                    >
                      {statusLabel[order.status] ?? order.status}
                    </span>
                    {order.source && (
                      <span className="text-[10px] uppercase tracking-wide text-[#8b7d6f] dark:text-[#b5a898]">
                        {sourceLabel[order.source] ?? order.source}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
