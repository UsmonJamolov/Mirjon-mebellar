"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { orders, getStatusLabel } from "@/lib/mock-data";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statuses: OrderStatus[] = ["yangi", "jarayonda", "tugallangan", "bekor"];

export default function ChangeOrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const order = orders.find((o) => o.id === params.id) || orders[0];
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [note, setNote] = useState("");

  return (
    <DashboardLayout
      title={`#${order.id} holati`}
      showBack
      onBack={() => router.back()}
      hideMobileNav
    >
      <div className="max-w-2xl mx-auto">
        <div className="card p-6 mb-6">
          <p className="text-sm text-gray-500">Buyurtma</p>
          <p className="font-bold text-lg">#{order.id}</p>
          <p className="text-gray-600 mt-1">{order.customerName}</p>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Holatni tanlang</h2>
          <div className="space-y-3 mb-6">
            {statuses.map((s, i) => (
              <label
                key={s}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-[14px] border-2 cursor-pointer transition",
                  status === s
                    ? "border-[#3b82f6] bg-blue-50/50"
                    : "border-gray-100 hover:border-gray-200"
                )}
              >
                <input
                  type="radio"
                  name="status"
                  checked={status === s}
                  onChange={() => setStatus(s)}
                  className="accent-[#3b82f6]"
                />
                <div className="flex-1">
                  <span className="font-medium">{getStatusLabel(s)}</span>
                  {i < statuses.length - 1 && (
                    <div className="hidden lg:block text-xs text-gray-400 mt-0.5">
                      {i === 0 && "→ Jarayonda → Tugallangan"}
                    </div>
                  )}
                </div>
                <span
                  className={cn(
                    "h-3 w-3 rounded-full",
                    s === "yangi" && "bg-blue-500",
                    s === "jarayonda" && "bg-amber-500",
                    s === "tugallangan" && "bg-green-500",
                    s === "bekor" && "bg-red-500"
                  )}
                />
              </label>
            ))}
          </div>

          <label className="block text-sm font-medium mb-2">Eslatma</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Qo'shimcha izoh yozing..."
            className="input-field resize-none"
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 lg:static flex gap-3 p-4 lg:mt-6 lg:p-0 bg-white lg:bg-transparent border-t lg:border-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary flex-1"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={() => router.push(`/buyurtmalar/${order.id}`)}
            className="btn-primary flex-1"
          >
            Saqlash
          </button>
        </div>
        <div className="h-20 lg:hidden" />
      </div>
    </DashboardLayout>
  );
}
