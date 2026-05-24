"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { adminApi, type SettingsDto } from "@/lib/api";
import { cn } from "@/lib/utils";

const tabs = ["Umumiy", "Profil", "To'lov usullari", "Bildirishnomalar", "Xavfsizlik"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Umumiy");
  const [form, setForm] = useState<SettingsDto>({
    storeName: "Mebellar",
    phone: "",
    email: "",
    address: "",
    currency: "UZS (so'm)",
    timezone: "Asia/Tashkent (UTC+5)",
    logo: "",
    materials: [],
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    adminApi.getSettings().then(setForm).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const updated = await adminApi.saveSettings(form);
      setForm(updated);
      setMsg("Saqlandi!");
    } catch {
      setMsg("Saqlashda xato");
    } finally {
      setSaving(false);
    }
  };

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

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
              activeTab === tab ? "border-[#3b82f6] text-[#3b82f6]" : "border-transparent text-gray-500"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Umumiy" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="card p-6 lg:col-span-2 space-y-4">
            <h2 className="font-semibold">Umumiy ma&apos;lumotlar</h2>
            {[
              ["storeName", "Do'kon nomi"],
              ["phone", "Telefon"],
              ["email", "Email"],
              ["address", "Manzil"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="text-sm font-medium mb-1 block">{label}</label>
                <input
                  className="input-field"
                  value={form[key as keyof SettingsDto] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
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
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-semibold">Logo</h2>
            <div className="relative aspect-square max-w-[200px] mx-auto rounded-[20px] bg-gray-100 overflow-hidden">
              {form.logo ? (
                <Image src={form.logo} alt="Logo" fill className="object-contain p-4" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">Logo</div>
              )}
            </div>
            <label className="btn-secondary w-full text-center cursor-pointer block py-2.5">
              Logo yuklash
              <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
            </label>
          </div>

          <div className="lg:col-span-3 flex justify-end items-center gap-3">
            {msg && <span className="text-sm text-green-600">{msg}</span>}
            <button type="button" onClick={save} disabled={saving} className="btn-primary px-8">
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </div>
      )}
      {activeTab !== "Umumiy" && (
        <p className="text-gray-500 text-sm">Bu bo&apos;lim tez orada qo&apos;shiladi.</p>
      )}
    </DashboardLayout>
  );
}
