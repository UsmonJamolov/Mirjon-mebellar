"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Filter, Plus, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { adminApi, formatPrice, type OrderDto } from "@/lib/api";
import type { OrderStatus } from "@/lib/types";
import { getStatusLabel, getStatusClass } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tabs: { key: OrderStatus | "barchasi"; label: string }[] = [
  { key: "barchasi", label: "Barchasi" },
  { key: "yangi", label: "Yangi" },
  { key: "jarayonda", label: "Jarayonda" },
  { key: "tugallangan", label: "Tugallangan" },
  { key: "bekor", label: "Bekor qilingan" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [tab, setTab] = useState<OrderStatus | "barchasi">("barchasi");
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    total: 0,
    status: "yangi" as OrderStatus,
  });

  const load = useCallback(async () => {
    try {
      const data = await adminApi.getOrders({
        status: tab === "barchasi" ? undefined : tab,
        q: search.trim() || undefined,
      });
      setOrders(data);
    } catch {
      setOrders([]);
    }
  }, [tab, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createOrder({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        total: form.total,
        status: form.status,
        items: [{ name: "Buyurtma", quantity: 1, price: form.total }],
      });
      setShowNew(false);
      setForm({ customerName: "", customerPhone: "", total: 0, status: "yangi" });
      load();
    } catch {
      alert("Buyurtma yaratilmadi");
    }
  };

  return (
    <DashboardLayout title="Buyurtmalar">
      <PageTitle
        title="Buyurtmalar"
        action={
          <button
            type="button"
            onClick={() => setShowNew(true)}
            className="btn-primary flex items-center gap-2"
          >
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
              tab === t.key ? "bg-[#3b82f6] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
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
          className="input-field flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <button
          type="button"
          onClick={() => setShowFilter((v) => !v)}
          className={cn("btn-secondary flex items-center gap-2 shrink-0", showFilter && "ring-2 ring-[#3b82f6]")}
        >
          <Filter size={18} />
          Filter
        </button>
      </div>

      {showFilter && (
        <div className="card p-4 mb-4 text-sm text-gray-600">
          Holat bo&apos;yicha filtr yuqoridagi tugmalar orqali. Qidiruv: ID yoki mijoz nomi.
        </div>
      )}

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
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <Link href={`/buyurtmalar/${o.id}`} className="text-[#3b82f6] font-medium">
                    #{o.id}
                  </Link>
                </td>
                <td className="px-6 py-4">{o.customerName}</td>
                <td className="px-6 py-4 text-gray-500">{o.date}</td>
                <td className="px-6 py-4 font-medium">{formatPrice(o.total)}</td>
                <td className="px-6 py-4">
                  <span className={getStatusClass(o.status as OrderStatus)}>
                    {getStatusLabel(o.status as OrderStatus)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-gray-500">Buyurtmalar yo&apos;q</p>
        )}
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleCreate} className="card p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Yangi buyurtma</h3>
              <button type="button" onClick={() => setShowNew(false)}>
                <X size={20} />
              </button>
            </div>
            <input
              className="input-field"
              placeholder="Mijoz ismi"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              required
            />
            <input
              className="input-field"
              placeholder="Telefon"
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Summa"
              value={form.total || ""}
              onChange={(e) => setForm({ ...form, total: Number(e.target.value) })}
              required
            />
            <select
              className="input-field"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as OrderStatus })}
            >
              <option value="yangi">Yangi</option>
              <option value="jarayonda">Jarayonda</option>
              <option value="tugallangan">Tugallangan</option>
              <option value="bekor">Bekor</option>
            </select>
            <button type="submit" className="btn-primary w-full">
              Saqlash
            </button>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
