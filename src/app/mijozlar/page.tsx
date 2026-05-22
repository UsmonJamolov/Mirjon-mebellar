"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { customers } from "@/lib/mock-data";

export default function CustomersPage() {
  return (
    <DashboardLayout title="Mijozlar">
      <PageTitle title="Mijozlar" subtitle="Barcha mijozlar ro'yxati" />

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="search"
            placeholder="Mijoz qidirish..."
            className="input-field pl-10"
          />
        </div>
        <button type="button" className="btn-secondary flex items-center gap-2">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
          <Link key={c.id} href={`/mijozlar/${c.id}`} className="card p-5 hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 rounded-full overflow-hidden shrink-0">
                <Image src={c.avatar} alt={c.name} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{c.name}</p>
                <p className="text-sm text-gray-500">{c.phone}</p>
                <span
                  className={
                    c.status === "faol"
                      ? "status-done mt-2 inline-block"
                      : "status-cancel mt-2 inline-block"
                  }
                >
                  {c.status === "faol" ? "Faol mijoz" : "Nofaol"}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Oxirgi buyurtma: {c.orders[0]?.date || "—"}
            </p>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
