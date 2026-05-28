"use client";

import { useEffect, useState } from "react";
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
  const [msgOk, setMsgOk] = useState(true);

  useEffect(() => {
    adminApi.getSettings().then(setForm).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const updated = await adminApi.saveSettings(form);
      setForm(updated);
      setMsgOk(true);
      setMsg("Saqlandi!");
    } catch (e) {
      setMsgOk(false);
      setMsg(e instanceof Error ? e.message : "Saqlashda xato");
    } finally {
      setSaving(false);
    }
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

          <div className="card p-6 space-y-3 flex flex-col justify-center">
            <h2 className="font-semibold">Brand logo</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Admin va do&apos;kon headerida har doim <strong>M + Mebellar</strong> brand logosi
              ko&apos;rinadi — u o&apos;zgarmaydi.
            </p>
            <div className="flex items-center gap-3 rounded-[16px] bg-[#1a2744] px-4 py-3 w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3b82f6] font-bold text-lg text-white">
                M
              </div>
              <span className="text-lg font-semibold text-white">Mebellar</span>
            </div>
          </div>

          <div className="lg:col-span-3 flex justify-end items-center gap-3">
            {msg && (
              <span className={`text-sm ${msgOk ? "text-green-600" : "text-red-600"}`}>{msg}</span>
            )}
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
