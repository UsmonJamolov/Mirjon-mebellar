"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  formatPrice,
  getStatusLabel,
  getStatusClass,
} from "@/lib/mock-data";
import { adminApi, type OrderDto } from "@/lib/api";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = String(params.id ?? "");
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .getOrder(orderId)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch(() => {
        if (!cancelled) setOrder(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <DashboardLayout title="Buyurtma" showBack onBack={() => router.back()} hideMobileNav>
        <p className="text-center text-gray-500 py-12">Yuklanmoqda...</p>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout title="Buyurtma" showBack onBack={() => router.back()} hideMobileNav>
        <div className="card p-6 text-center">
          <p className="text-gray-600">Buyurtma topilmadi</p>
          <Link href="/buyurtmalar" className="btn-primary inline-block mt-4">
            Buyurtmalarga qaytish
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const items = order.items ?? [];

  return (
    <DashboardLayout
      title={`Buyurtma #${order.id}`}
      showBack
      onBack={() => router.back()}
      hideMobileNav
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Buyurtma ma&apos;lumotlari</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <dt className="text-gray-500">Buyurtma ID</dt>
              <dd className="font-medium">#{order.id}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <dt className="text-gray-500">Sana</dt>
              <dd>{order.date}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <dt className="text-gray-500">Mijoz</dt>
              <dd className="font-medium">{order.customerName}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <dt className="text-gray-500">Telefon</dt>
              <dd>{order.customerPhone || "—"}</dd>
            </div>
            <div className="flex justify-between py-2 items-center">
              <dt className="text-gray-500">Holat</dt>
              <dd>
                <span className={getStatusClass(order.status)}>
                  {getStatusLabel(order.status)}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Mahsulotlar</h2>
          <ul className="space-y-4">
            {items.map((item, idx) => (
              <li
                key={`${item.name}-${idx}`}
                className="flex gap-4 pb-4 border-b border-gray-50 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Miqdor: {item.quantity}
                    {item.price != null ? ` · ${formatPrice(item.price)}` : ""}
                  </p>
                </div>
              </li>
            ))}
            {items.length === 0 && (
              <li className="text-sm text-gray-500">Mahsulotlar ko&apos;rsatilmagan</li>
            )}
          </ul>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="font-semibold">Jami summa</span>
            <span className="text-lg font-bold text-[#3b82f6]">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:static lg:mt-6 flex gap-3 p-4 lg:p-0 bg-white lg:bg-transparent border-t lg:border-0 z-20">
        <Link
          href={`/buyurtmalar/${order.id}/holat`}
          className="btn-primary flex-1 text-center"
        >
          Holatini o&apos;zgartirish
        </Link>
      </div>
      <div className="h-20 lg:hidden" />
    </DashboardLayout>
  );
}
