"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { SearchInput } from "@/components/ui/SearchInput";
import { adminApi, type CustomerDto } from "@/lib/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setCustomers(await adminApi.getCustomers(search.trim() || undefined));
    } catch {
      setCustomers([]);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleDelete = async (c: CustomerDto) => {
    const ok = window.confirm(
      `"${c.name}" mijozini va uning ${c.orders.length} ta buyurtmasini o'chirasizmi?`
    );
    if (!ok) return;

    setDeletingId(c.id);
    try {
      await adminApi.deleteCustomer(c.id);
      await load();
    } catch {
      alert("O'chirib bo'lmadi");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout title="Mijozlar">
      <PageTitle title="Mijozlar" subtitle="Buyurtmalardan — oxirgi buyurtma bilan" />

      <div className="flex gap-2 mb-6">
        <SearchInput
          className="flex-1"
          placeholder="Mijoz qidirish..."
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
          <div key={c.id} className="card p-5 hover:shadow-lg transition relative group">
            <button
              type="button"
              onClick={() => handleDelete(c)}
              disabled={deletingId === c.id}
              className="absolute top-3 right-3 rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
              title="Mijozni o'chirish"
              aria-label="Mijozni o'chirish"
            >
              <Trash2 size={16} />
            </button>

            <Link href={`/mijozlar/${encodeURIComponent(c.id)}`} className="block">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden shrink-0 bg-gray-100">
                  <Image src={c.avatar} alt={c.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 pr-8">
                  <p className="font-semibold truncate">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.phone}</p>
                  <span className="status-done mt-2 inline-block">Faol mijoz</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Oxirgi buyurtma: {c.lastOrderDate || c.orders[0]?.date || "—"}
              </p>
              <p className="text-xs text-gray-500 mt-1">{c.orders.length} ta buyurtma</p>
            </Link>
          </div>
        ))}
      </div>
      {customers.length === 0 && (
        <p className="text-center text-gray-500 py-12">Mijozlar topilmadi</p>
      )}
    </DashboardLayout>
  );
}
