"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { StatCard } from "@/components/ui/StatCard";
import { adminApi, formatPrice, type ReportSummary } from "@/lib/api";

function formatMln(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} mln so'm`;
  return formatPrice(n);
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReportSummary | null>(null);

  useEffect(() => {
    adminApi.getReports().then(setReport).catch(() => setReport(null));
  }, []);

  const sales = report?.salesByCategory ?? [];

  return (
    <DashboardLayout title="Hisobotlar">
      <PageTitle title="Hisobotlar" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Jami daromad" value={formatMln(report?.totalIncome ?? 0)} change="Real" />
        <StatCard title="Buyurtmalar" value={String(report?.totalOrders ?? 0)} change="Real" />
        <StatCard title="Yangi mijozlar" value={String(report?.activeCustomers ?? 0)} change="Buyurtmalar" />
        <StatCard
          title="O'rtacha chek"
          value={formatMln(report?.avgCheck ?? 0)}
          change="Tugallangan"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Daromad grafigi</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={report?.incomeChartData ?? [{ day: "1", summa: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} />
                <Tooltip formatter={(v: number) => formatPrice(v)} />
                <Line type="monotone" dataKey="summa" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Mahsulotlar bo&apos;yicha</h2>
          <div className="h-64">
            {sales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sales} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {sales.map((entry, i) => (
                      <Cell key={entry.name} fill={entry.color || `#3b82f6`} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 pt-20">Ma&apos;lumot yo&apos;q</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
