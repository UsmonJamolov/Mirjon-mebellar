"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User, Phone, Pencil, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileContactEditor() {
  const { data: session, update } = useSession();
  const user = session?.user;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user?.name, user?.phone, user]);

  if (!user) return null;

  const cancel = () => {
    setName(user.name ?? "");
    setPhone(user.phone ?? "");
    setEditing(false);
    setError("");
  };

  const save = async () => {
    setError("");
    setSuccess(false);
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Saqlanmadi");
        return;
      }
      await update({ name: data.name, phone: data.phone });
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-6 lg:p-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-sm text-gray-500 dark:text-[#b5a898] uppercase tracking-wide">
          Kontakt
        </h2>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 rounded-[12px] px-3 py-1.5 text-xs font-semibold text-[#c97b3f] transition hover:bg-[#f4a261]/10"
          >
            <Pencil size={14} />
            Tahrirlash
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancel}
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-[12px] border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-[#3d3229] dark:text-[#b5a898] dark:hover:bg-[#3d3229]"
            >
              <X size={14} />
              Bekor
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-[12px] bg-[#f4a261] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#e88b4a] disabled:opacity-70"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Saqlash
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="mb-4 rounded-[12px] bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 rounded-[12px] bg-green-50 px-3 py-2 text-xs text-green-700 dark:bg-green-950/40 dark:text-green-400">
          Kontakt yangilandi
        </p>
      )}

      {editing ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#8b7d6f]">
              <User size={14} className="text-[#f4a261]" />
              Ism familiya
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field w-full"
              placeholder="Ism familiya"
              minLength={2}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#8b7d6f]">
              <Phone size={14} className="text-[#f4a261]" />
              Telefon
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field w-full"
              placeholder="+998 90 123 45 67"
            />
          </label>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
          <div className="flex items-center gap-3 rounded-[16px] bg-[#faf8f5] px-4 py-3.5 dark:bg-[#1a1612]">
            <User size={18} className="shrink-0 text-[#f4a261]" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8b7d6f]">Ism</p>
              <p className="truncate text-sm font-medium dark:text-[#f5f0e8]">{user.name || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[16px] bg-[#faf8f5] px-4 py-3.5 dark:bg-[#1a1612]">
            <Phone size={18} className="shrink-0 text-[#f4a261]" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8b7d6f]">Telefon</p>
              <p className="truncate text-sm font-medium dark:text-[#f5f0e8]">{user.phone || "—"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
