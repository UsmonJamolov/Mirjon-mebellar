"use client";

import { useState } from "react";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { cn } from "@/lib/utils";

const tabs = [
  "Umumiy",
  "Profil",
  "To'lov usullari",
  "Bildirishnomalar",
  "Xavfsizlik",
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Umumiy");
  const [form, setForm] = useState({
    storeName: "Mebellar",
    phone: "+998 71 200 00 00",
    email: "info@mebellar.uz",
    address: "Toshkent sh., Chilonzor tumani",
    currency: "UZS (so'm)",
    timezone: "Asia/Tashkent (UTC+5)",
  });

  return (
    <DashboardLayout title="Sozlamalar">
      <PageTitle title="Sozlamalar" />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 -mb-px transition",
              activeTab === tab
                ? "border-[#3b82f6] text-[#3b82f6]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2 space-y-4">
          <h2 className="font-semibold">Umumiy ma&apos;lumotlar</h2>
          <div>
            <label className="text-sm font-medium mb-1 block">Do&apos;kon nomi</label>
            <input
              className="input-field"
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Telefon</label>
            <input
              className="input-field"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <input
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Manzil</label>
            <input
              className="input-field"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Valyuta</label>
              <select
                className="input-field"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              >
                <option>UZS (so&apos;m)</option>
                <option>USD</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Vaqt mintaqasi</label>
              <select
                className="input-field"
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              >
                <option>Asia/Tashkent (UTC+5)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Logo</h2>
          <div className="relative aspect-square max-w-[200px] mx-auto rounded-[20px] overflow-hidden bg-gray-100 mb-4">
            <Image
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <button type="button" className="btn-secondary w-full">
            Logo yuklash
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="button" className="btn-primary w-full sm:w-auto">
          Saqlash
        </button>
      </div>
    </DashboardLayout>
  );
}
