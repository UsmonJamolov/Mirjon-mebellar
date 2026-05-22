"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  orders,
  formatPrice,
  getStatusLabel,
  getStatusClass,
} from "@/lib/mock-data";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const order = orders.find((o) => o.id === params.id) || orders[0];

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
              <dd>{order.customerPhone || "+998 90 000 00 00"}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <dt className="text-gray-500">Manzil</dt>
              <dd className="text-right max-w-[60%]">
                {order.customerAddress || "—"}
              </dd>
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
            {(order.products || []).map((p) => (
              <li key={p.id} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0">
                <div className="relative h-16 w-16 shrink-0 rounded-[14px] overflow-hidden">
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.material}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Miqdor: {p.quantity} · {formatPrice(p.price)}
                  </p>
                </div>
              </li>
            ))}
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
        <button type="button" className="btn-secondary flex-1">
          Tahrirlash
        </button>
      </div>
      <div className="h-20 lg:hidden" />
    </DashboardLayout>
  );
}
