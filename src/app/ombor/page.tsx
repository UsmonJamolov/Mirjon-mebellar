"use client";

import { useCallback, useEffect, useState } from "react";
import { Filter, Plus, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { SearchInput } from "@/components/ui/SearchInput";
import { adminApi, type InventoryDto } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function WarehousePage() {
  const [items, setItems] = useState<InventoryDto[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Material",
    quantity: 0,
    unit: "Dona",
  });

  const load = useCallback(async () => {
    try {
      setItems(
        await adminApi.getInventory({
          q: search.trim() || undefined,
          category: filterCat || undefined,
        })
      );
    } catch {
      setItems([]);
    }
  }, [search, filterCat]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Material nomini kiriting");
      return;
    }
    try {
      await adminApi.createInventory(form);
      setShowNew(false);
      setForm({ name: "", category: "Material", quantity: 0, unit: "Dona" });
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Qo'shilmadi");
    }
  };

  return (
    <DashboardLayout title="Ombor">
      <PageTitle
        title="Ombor (Inventar)"
        action={
          <button type="button" onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Yangi qo&apos;shish
          </button>
        }
      />

      <div className="flex gap-2 mb-6">
        <SearchInput
          className="flex-1"
          placeholder="Qidirish..."
          value={search}
          onChange={setSearch}
        />
        <button
          type="button"
          onClick={() => setShowFilter((v) => !v)}
          className={cn("btn-secondary flex items-center gap-2", showFilter && "ring-2 ring-[#3b82f6]")}
        >
          <Filter size={18} />
          Filter
        </button>
      </div>

      {showFilter && (
        <div className="card p-4 mb-4 flex flex-wrap gap-2">
          {["", "Material", "Aksessuar"].map((c) => (
            <button
              key={c || "all"}
              type="button"
              onClick={() => setFilterCat(c)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                filterCat === c ? "bg-[#3b82f6] text-white" : "bg-gray-100"
              )}
            >
              {c || "Barchasi"}
            </button>
          ))}
        </div>
      )}

      <div className="card hidden lg:block overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80 text-gray-500 border-b">
              <th className="text-left px-6 py-4 font-medium">Nomi</th>
              <th className="text-left px-6 py-4 font-medium">Kategoriya</th>
              <th className="text-left px-6 py-4 font-medium">Miqdori</th>
              <th className="text-left px-6 py-4 font-medium">O&apos;lchov birligi</th>
              <th className="text-left px-6 py-4 font-medium">Holati</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4 text-gray-500">{item.category}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">{item.unit}</td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      item.status === "yetarli"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    )}
                  >
                    {item.status === "yetarli" ? "Yetarli" : "Kam"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleAdd} className="card p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">Yangi material</h3>
              <button type="button" onClick={() => setShowNew(false)}>
                <X size={20} />
              </button>
            </div>
            <input
              className="input-field"
              placeholder="Nomi"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Material</option>
              <option>Aksessuar</option>
            </select>
            <input
              type="number"
              className="input-field"
              placeholder="Miqdor"
              value={form.quantity || ""}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            />
            <input
              className="input-field"
              placeholder="Birlik (Dona, m²...)"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
            <button type="submit" className="btn-primary w-full">
              Saqlash
            </button>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
