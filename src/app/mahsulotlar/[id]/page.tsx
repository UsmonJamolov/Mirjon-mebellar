"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProductImagesEditor } from "@/components/products/ProductImagesEditor";
import { adminApi } from "@/lib/api";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const isNew = id === "new";

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");
  const [newMat, setNewMat] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "Oshxona",
    price: 0,
    material: "MDF 18mm",
    width: 0,
    depth: 0,
    height: 0,
    description: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    adminApi.getCategories().then(setCategories).catch(() => []);
    adminApi.getSettings().then((s) => setMaterials(s.materials || [])).catch(() => {});
    if (!isNew) {
      adminApi
        .getProduct(id)
        .then((p) => {
          setForm({
            name: p.name,
            category: p.category,
            price: p.price,
            material: p.material || "MDF",
            width: p.width || 0,
            depth: p.depth || 0,
            height: p.height || 0,
            description: p.description || "",
          });
          setImages(p.images?.length ? p.images : p.image ? [p.image] : []);
        })
        .catch(() => setMsg("Mahsulot topilmadi"));
    }
  }, [id, isNew]);

  const addCategory = async () => {
    if (!newCat.trim()) return;
    const c = await adminApi.createCategory(newCat.trim());
    setCategories((prev) => [...prev, c]);
    setForm((f) => ({ ...f, category: c.name }));
    setNewCat("");
  };

  const addMaterial = async () => {
    if (!newMat.trim()) return;
    const r = await adminApi.addMaterial(newMat.trim());
    setMaterials(r.materials);
    setForm((f) => ({ ...f, material: newMat.trim() }));
    setNewMat("");
  };

  const save = async () => {
    const payload = {
      ...form,
      images: images.filter(Boolean),
      image: images.filter(Boolean)[0] || "",
      isRecommended: true,
    };
    try {
      if (isNew) {
        const p = await adminApi.createProduct(payload);
        setMsg("Mahsulot qo'shildi — do'konda ko'rinadi");
        router.push(`/mahsulotlar/${p.id}`);
      } else {
        await adminApi.updateProduct(id, payload);
        setMsg("Saqlandi — do'kon yangilandi");
      }
    } catch {
      setMsg("Saqlashda xato");
    }
  };

  return (
    <DashboardLayout title={isNew ? "Yangi mahsulot" : "Tahrirlash"} showBack onBack={() => router.back()} hideMobileNav>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Mahsulot ma&apos;lumotlari</h2>
          <input
            className="input-field"
            placeholder="Nomi"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div>
            <label className="text-sm font-medium mb-1 block">Kategoriya</label>
            <select
              className="input-field mb-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                className="input-field flex-1"
                placeholder="Yangi kategoriya"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
              />
              <button type="button" onClick={addCategory} className="btn-secondary shrink-0">
                <Plus size={18} />
              </button>
            </div>
          </div>
          <input
            type="number"
            className="input-field"
            placeholder="Narxi"
            value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
          <div>
            <label className="text-sm font-medium mb-1 block">Material</label>
            <select
              className="input-field mb-2"
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
            >
              {materials.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                className="input-field flex-1"
                placeholder="Yangi material"
                value={newMat}
                onChange={(e) => setNewMat(e.target.value)}
              />
              <button type="button" onClick={addMaterial} className="btn-secondary shrink-0">
                <Plus size={18} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              className="input-field"
              placeholder="Kenglik"
              value={form.width || ""}
              onChange={(e) => setForm({ ...form, width: Number(e.target.value) })}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Chuqurlik"
              value={form.depth || ""}
              onChange={(e) => setForm({ ...form, depth: Number(e.target.value) })}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Balandlik"
              value={form.height || ""}
              onChange={(e) => setForm({ ...form, height: Number(e.target.value) })}
            />
          </div>
          <textarea
            className="input-field min-h-[80px]"
            placeholder="Tavsif"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="button" onClick={save} className="btn-primary w-full">
            {isNew ? "Mahsulot qo'shish" : "Saqlash"}
          </button>
          {msg && <p className="text-sm text-green-600">{msg}</p>}
        </div>

        <div className="card p-6">
          <ProductImagesEditor images={images} onChange={setImages} />
        </div>
      </div>
    </DashboardLayout>
  );
}
