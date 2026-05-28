"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Check, X } from "lucide-react";
import { adminApi } from "@/lib/api";

export type CategoryItem = { id: string; name: string; slug?: string; count?: number };

type Props = {
  value: string;
  onChange: (categoryName: string) => void;
  onMessage?: (msg: string) => void;
};

export function CategoryManager({ value, onChange, onMessage }: Props) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [newCat, setNewCat] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await adminApi.getCategories();
      setCategories(list);
    } catch {
      onMessage?.("Kategoriyalar yuklanmadi");
    } finally {
      setLoading(false);
    }
  }, [onMessage]);

  useEffect(() => {
    load();
  }, [load]);

  const addCategory = async () => {
    if (!newCat.trim()) return;
    try {
      const c = await adminApi.createCategory(newCat.trim());
      setCategories((prev) => [...prev, c].sort((a, b) => a.name.localeCompare(b.name)));
      onChange(c.name);
      setNewCat("");
      onMessage?.("Kategoriya qo'shildi");
    } catch (e) {
      onMessage?.(e instanceof Error ? e.message : "Qo'shilmadi");
    }
  };

  const startEdit = (c: CategoryItem) => {
    setEditingId(c.id);
    setEditName(c.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (id: string) => {
    const name = editName.trim();
    if (!name) return;
    try {
      const updated = await adminApi.updateCategory(id, { name });
      setCategories((prev) =>
        prev
          .map((c) => (c.id === id ? { ...c, name: updated.name } : c))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      if (value === categories.find((c) => c.id === id)?.name) {
        onChange(updated.name);
      }
      cancelEdit();
      onMessage?.("Kategoriya yangilandi");
    } catch (e) {
      onMessage?.(e instanceof Error ? e.message : "Yangilanmadi");
    }
  };

  const deleteCategory = async (c: CategoryItem) => {
    if (!confirm(`"${c.name}" kategoriyasini o'chirishni tasdiqlaysizmi?`)) return;
    try {
      await adminApi.deleteCategory(c.id);
      const remaining = categories.filter((x) => x.id !== c.id);
      setCategories(remaining);
      if (value === c.name && remaining.length > 0) {
        onChange(remaining[0].name);
      }
      onMessage?.("Kategoriya o'chirildi");
    } catch (e) {
      onMessage?.(e instanceof Error ? e.message : "O'chirilmadi");
    }
  };

  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Kategoriya</label>
      <select
        className="input-field mb-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading || categories.length === 0}
      >
        {categories.length === 0 ? (
          <option value="">Kategoriya yo&apos;q</option>
        ) : (
          categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))
        )}
      </select>

      <div className="flex gap-2 mb-3">
        <input
          className="input-field flex-1"
          placeholder="Yangi kategoriya"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
        />
        <button
          type="button"
          onClick={addCategory}
          className="btn-secondary shrink-0"
          aria-label="Qo'shish"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="rounded-[14px] border border-gray-100 divide-y divide-gray-100 max-h-48 overflow-y-auto">
        {loading ? (
          <p className="p-3 text-sm text-gray-500">Yuklanmoqda...</p>
        ) : categories.length === 0 ? (
          <p className="p-3 text-sm text-gray-500">Kategoriya yo&apos;q</p>
        ) : (
          categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
            >
              {editingId === c.id ? (
                <>
                  <input
                    className="input-field flex-1 py-1.5 text-sm"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEdit(c.id);
                      }
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => saveEdit(c.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-emerald-600 hover:bg-emerald-50"
                    aria-label="Saqlash"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-gray-500 hover:bg-gray-100"
                    aria-label="Bekor"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium truncate">{c.name}</span>
                  <button
                    type="button"
                    onClick={() => startEdit(c)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-[#3b82f6] hover:bg-blue-50"
                    aria-label="Tahrirlash"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(c)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-red-500 hover:bg-red-50"
                    aria-label="O'chirish"
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
