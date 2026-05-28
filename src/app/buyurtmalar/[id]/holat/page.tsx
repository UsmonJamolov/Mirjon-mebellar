"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getStatusLabel } from "@/lib/mock-data";
import { adminApi, type OrderDto } from "@/lib/api";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statuses: OrderStatus[] = ["yangi", "jarayonda", "tugallangan", "bekor"];

export default function ChangeOrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = String(params.id ?? "");

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<OrderStatus>("yangi");
  const [note, setNote] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    adminApi
      .getOrder(orderId)
      .then((data) => {
        if (cancelled) return;
        setOrder(data);
        setStatus(data.status as OrderStatus);
      })
      .catch(() => {
        if (cancelled) return;
        setOrder(null);
        setError("Buyurtma topilmadi");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handleSave = async () => {
    if (!order || saving) return;
    setSaving(true);
    setError("");

    try {
      await adminApi.patchOrder(order.id, { status });
      window.location.assign("/buyurtmalar");
    } catch {
      setError("Holat saqlanmadi. Qayta urinib ko'ring.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Holat" showBack onBack={() => router.back()} hideMobileNav>
        <p className="text-center text-gray-500 py-12">Yuklanmoqda...</p>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout title="Holat" showBack onBack={() => router.back()} hideMobileNav>
        <div className="card p-6 text-center max-w-2xl mx-auto">
          <p className="text-gray-600">{error || "Buyurtma topilmadi"}</p>
          <button
            type="button"
            onClick={() => router.push("/buyurtmalar")}
            className="btn-primary mt-4"
          >
            Buyurtmalarga qaytish
          </button>
        </div>
      </DashboardLayout>
    );
  }

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

          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="fixed bottom-0 left-0 right-0 lg:static flex gap-3 p-4 lg:mt-6 lg:p-0 bg-white lg:bg-transparent border-t lg:border-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary flex-1"
            disabled={saving}
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary flex-1 disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
        <div className="h-20 lg:hidden" />
      </div>
    </DashboardLayout>
  );
}
