"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import {
  orders,
  formatPrice,
  getStatusLabel,
  getStatusClass,
} from "@/lib/mock-data";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const tabs: { key: OrderStatus | "barchasi"; label: string }[] = [
  { key: "barchasi", label: "Barchasi" },
  { key: "yangi", label: "Yangi" },
  { key: "jarayonda", label: "Jarayonda" },
  { key: "tugallangan", label: "Tugallangan" },
  { key: "bekor", label: "Bekor qilingan" },
];

export default function OrdersPage() {
  const [tab, setTab] = useState<OrderStatus | "barchasi">("barchasi");
  const filtered =
    tab === "barchasi" ? orders : orders.filter((o) => o.status === tab);

  return (
    <DashboardLayout title="Buyurtmalar">
      <PageTitle
        title="Buyurtmalar"
        action={
          <button type="button" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Yangi buyurtma
          </button>
        }
      />

      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-[14px] px-4 py-2 text-sm font-medium whitespace-nowrap transition",
              tab === t.key
                ? "bg-[#3b82f6] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="search"
          placeholder="Buyurtma qidirish..."
          className="input-field flex-1 lg:hidden"
        />
        <button type="button" className="btn-secondary flex items-center gap-2 shrink-0">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Desktop table */}
      <div className="card hidden lg:block overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-gray-500">
              <th className="px-6 py-4 font-medium">Buyurtma ID</th>
              <th className="px-6 py-4 font-medium">Mijoz</th>
              <th className="px-6 py-4 font-medium">Sana</th>
              <th className="px-6 py-4 font-medium">Summa</th>
              <th className="px-6 py-4 font-medium">Holat</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr
                key={o.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/buyurtmalar/${o.id}`}
                    className="font-medium text-[#3b82f6] hover:underline"
                  >
                    #{o.id}
                  </Link>
                </td>
                <td className="px-6 py-4">{o.customerName}</td>
                <td className="px-6 py-4 text-gray-500">{o.date}</td>
                <td className="px-6 py-4 font-medium">{formatPrice(o.total)}</td>
                <td className="px-6 py-4">
                  <span className={getStatusClass(o.status)}>
                    {getStatusLabel(o.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-500">
          <span>1–{filtered.length} dan {filtered.length}</span>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary py-1.5 px-3 text-xs">
              Oldingi
            </button>
            <button type="button" className="btn-primary py-1.5 px-3 text-xs">
              Keyingi
            </button>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((o) => (
          <Link key={o.id} href={`/buyurtmalar/${o.id}`} className="card block p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-[#3b82f6]">#{o.id}</span>
              <span className={getStatusClass(o.status)}>
                {getStatusLabel(o.status)}
              </span>
            </div>
            <p className="font-medium">{o.customerName}</p>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>{o.date}</span>
              <span className="font-semibold text-[#1e1e2f]">{formatPrice(o.total)}</span>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
