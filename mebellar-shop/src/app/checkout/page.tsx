"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const paymentMethods = [
  { id: "payme", label: "Payme", color: "bg-[#00CCCC]" },
  { id: "click", label: "Click", color: "bg-[#5c4f42]" },
  { id: "uzum", label: "Uzum Pay", color: "bg-[#7C3AED]" },
];

function CheckoutPageContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, total, clearCart } = useCart();
  const [payment, setPayment] = useState("payme");
  const [form, setForm] = useState({
    name: session?.user?.name ?? "",
    phone: session?.user?.phone ?? "",
    address: "",
  });
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || session.user?.name || "",
        phone: prev.phone || session.user?.phone || "",
      }));
    }
  }, [session]);

  if (items.length === 0 && !done) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 dark:text-[#b5a898]">Savatcha bo&apos;sh</p>
        <Link href="/katalog" className="btn-accent inline-block mt-4">
          Katalogga qaytish
        </Link>
      </main>
    );
  }

  if (done) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="card p-8">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <h1 className="text-xl font-bold mt-4 text-[#3d3229] dark:text-[#f5f0e8]">
            Buyurtma qabul qilindi!
          </h1>
          {orderId && (
            <p className="text-sm font-medium text-[#f4a261] mt-2">
              Buyurtma raqami: #{orderId}
            </p>
          )}
          <p className="text-gray-500 dark:text-[#b5a898] text-sm mt-2">
            Sotuvchi buyurtmangizni ko&apos;rib, tez orada siz bilan bog&apos;lanadi.
          </p>
          <Link href="/buyurtmalar" className="btn-accent inline-block mt-6">
            Buyurtmalarim
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerPhone: form.phone,
          customerAddress: form.address,
          paymentMethod: payment,
          total,
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            productId: item.productId,
            price: item.price,
          })),
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        order?: { id: string };
      };

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Buyurtma yaratilmadi");
        setSubmitting(false);
        return;
      }

      setOrderId(data.order?.id ?? "");
      clearCart();
      setDone(true);
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl font-bold mb-8 text-[#3d3229] dark:text-[#f5f0e8]">
        To&apos;lov
      </h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-[#3d3229] dark:text-[#f5f0e8]">
              Yetkazish ma&apos;lumotlari
            </h2>
            <div>
              <label className="text-sm font-medium mb-1 block text-[#3d3229] dark:text-[#f5f0e8]">
                Ism
              </label>
              <input
                required
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ismingiz"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-[#3d3229] dark:text-[#f5f0e8]">
                Telefon
              </label>
              <input
                required
                type="tel"
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+998 90 000 00 00"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-[#3d3229] dark:text-[#f5f0e8]">
                Manzil
              </label>
              <textarea
                required
                rows={3}
                className="input-field resize-none"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="To'liq manzil"
              />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold mb-4 text-[#3d3229] dark:text-[#f5f0e8]">
              To&apos;lov usuli
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPayment(m.id)}
                  className={cn(
                    "rounded-[14px] p-4 text-center text-sm font-semibold text-white transition ring-2 ring-offset-2 dark:ring-offset-[#2a221c]",
                    m.color,
                    payment === m.id
                      ? "ring-[#f4a261]"
                      : "ring-transparent opacity-80 hover:opacity-100"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-[#8a7d70] mt-3">
              Haqiqiy to&apos;lov integratsiyasi production bosqichida ulanadi.
            </p>
          </div>
        </div>

        <div className="card p-6 h-fit">
          <h2 className="font-semibold mb-4 text-[#3d3229] dark:text-[#f5f0e8]">
            Buyurtma
          </h2>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3 text-sm">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                  <Image src={item.image} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="line-clamp-1 font-medium text-[#3d3229] dark:text-[#f5f0e8]">
                    {item.name}
                  </p>
                  <p className="text-gray-500 dark:text-[#b5a898]">
                    ×{item.quantity}
                  </p>
                </div>
                <p className="font-medium shrink-0 text-[#3d3229] dark:text-[#f5f0e8]">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="border-t border-[#ebe6df] dark:border-[#3d3229] mt-4 pt-4 flex justify-between text-lg font-bold">
            <span className="text-[#3d3229] dark:text-[#f5f0e8]">Jami</span>
            <span className="text-[#f4a261]">{formatPrice(total)}</span>
          </div>

          {error && (
            <p className="mt-4 rounded-[12px] bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-accent w-full mt-6 disabled:opacity-70"
          >
            {submitting ? "Yuborilmoqda..." : "To'lov qilish"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full text-center text-sm text-gray-500 dark:text-[#b5a898] mt-3 hover:text-[#f4a261]"
          >
            Orqaga
          </button>
        </div>
      </form>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutPageContent />
    </RequireAuth>
  );
}
