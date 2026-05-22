"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingCart,
  Sparkles,
  Wallet,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { PageTitle } from "@/components/ui/PageTitle";
import {
  incomeChartData,
  products,
  formatPrice,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PageTitle title="Bosh sahifa" subtitle="Umumiy statistika va ko'rsatkichlar" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Jami buyurtmalar"
          value="128"
          change="+12% o'tgan oyga nisbatan"
          icon={<ShoppingCart size={22} />}
        />
        <StatCard
          title="Yangi buyurtmalar"
          value="24"
          change="+8% o'tgan oyga nisbatan"
          icon={<Sparkles size={22} />}
        />
        <StatCard
          title="Jami daromad"
          value="125 mln"
          change="+15% o'tgan oyga nisbatan"
          icon={<Wallet size={22} />}
        />
        <StatCard
          title="Faol mijozlar"
          value="78"
          change="+5% o'tgan oyga nisbatan"
          icon={<Users size={22} />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Daromad grafigi</h2>
          <div className="h-64 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeChartData}>
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
                <Line
                  type="monotone"
                  dataKey="summa"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Tavsiya etilgan mahsulotlar</h2>
          <ul className="space-y-4">
            {products.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[14px]">
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-[#3b82f6] font-semibold">
                    {formatPrice(p.price)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="card p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Jarayondagi buyurtmalar</p>
            <p className="text-2xl font-bold mt-1">16</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
            16
          </div>
        </div>
        <div className="card p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Tugallangan buyurtmalar</p>
            <p className="text-2xl font-bold mt-1">95</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
            95
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
