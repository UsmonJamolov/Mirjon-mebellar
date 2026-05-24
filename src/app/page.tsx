"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ShoppingCart, Sparkles, Wallet, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { PageTitle } from "@/components/ui/PageTitle";
import { adminApi, formatPrice, type ReportSummary } from "@/lib/api";

function formatMln(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} mln`;
  if (n >= 1_000) return `${Math.round(n / 1000)} ming`;
  return String(n);
}

export default function DashboardPage() {
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [products, setProducts] = useState<
    { id: string; name: string; price: number; image?: string }[]
  >([]);

  useEffect(() => {
    adminApi.getReports().then(setReport).catch(() => setReport(null));
    adminApi
      .getProducts()
      .then((p) => setProducts(p.filter((x) => x.isRecommended).slice(0, 4) || p.slice(0, 4)))
      .catch(() => setProducts([]));
  }, []);

  const income = report?.totalIncome ?? 0;

  return (
    <DashboardLayout>
      <PageTitle title="Bosh sahifa" subtitle="Umumiy statistika va ko'rsatkichlar" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Jami buyurtmalar"
          value={String(report?.totalOrders ?? 0)}
          change="Real ma'lumot"
          icon={<ShoppingCart size={22} />}
        />
        <StatCard
          title="Yangi buyurtmalar"
          value={String(report?.newOrders ?? 0)}
          change="Holati: yangi"
          icon={<Sparkles size={22} />}
        />
        <StatCard
          title="Jami daromad"
          value={formatMln(income)}
          change="Tugallangan buyurtmalar"
          icon={<Wallet size={22} />}
        />
        <StatCard
          title="Faol mijozlar"
          value={String(report?.activeCustomers ?? 0)}
          change="Buyurtma berganlar"
          icon={<Users size={22} />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Daromad grafigi</h2>
          <div className="h-64 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={report?.incomeChartData ?? [{ day: "1", summa: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value: number) => [formatPrice(value), "Daromad"]}
                  labelFormatter={(l) => `Kun: ${l}`}
                />
                <Line type="monotone" dataKey="summa" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Tavsiya etilgan mahsulotlar</h2>
          <ul className="space-y-4">
            {products.map((p) => (
              <li key={p.id}>
                <Link href={`/mahsulotlar/${p.id}`} className="flex gap-3 items-center hover:opacity-80">
                  <div className="relative h-14 w-14 rounded-[12px] overflow-hidden bg-gray-100 shrink-0">
                    {p.image ? (
                      <Image src={p.image} alt="" fill className="object-cover" sizes="56px" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-[#3b82f6]">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              </li>
            ))}
            {products.length === 0 && (
              <p className="text-sm text-gray-500">Mahsulotlar yo&apos;q</p>
            )}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
