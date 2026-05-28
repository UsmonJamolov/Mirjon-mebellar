"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProductImagesEditor } from "@/components/products/ProductImagesEditor";
import { CategoryManager } from "@/components/products/CategoryManager";
import { adminApi } from "@/lib/api";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const isNew = id === "new";

  const [materials, setMaterials] = useState<string[]>([]);
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
    hideFromPopular: false,
    isPopular: false,
  });
  const [salesCount, setSalesCount] = useState(0);
  const [msg, setMsg] = useState("");
  const [msgOk, setMsgOk] = useState(false);

  useEffect(() => {
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
            hideFromPopular: Boolean(p.hideFromPopular),
            isPopular: Boolean(p.isPopular),
          });
          setImages(p.images?.length ? p.images : p.image ? [p.image] : []);
        })
        .catch(() => setMsg("Mahsulot topilmadi"));
      fetch("/api/products/sales", { cache: "no-store" })
        .then((r) => r.json())
        .then((data: { sales?: Record<string, number> }) => {
          setSalesCount(data.sales?.[id] ?? 0);
        })
        .catch(() => setSalesCount(0));
    }
  }, [id, isNew]);

  const addMaterial = async () => {
    if (!newMat.trim()) return;
    try {
      const r = await adminApi.addMaterial(newMat.trim());
      setMaterials(r.materials);
      setForm((f) => ({ ...f, material: newMat.trim() }));
      setNewMat("");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Material qo'shilmadi");
    }
  };

  const save = async () => {
    if (!form.name.trim()) {
      setMsgOk(false);
      setMsg("Mahsulot nomini kiriting");
      return;
    }
    if (!form.category.trim()) {
      setMsgOk(false);
      setMsg("Kategoriya tanlang");
      return;
    }

    const payload = {
      ...form,
      images: images.filter(Boolean),
      image: images.filter(Boolean)[0] || "",
    };
    try {
      if (isNew) {
        const p = await adminApi.createProduct(payload);
        setMsgOk(true);
        setMsg("Mahsulot qo'shildi — do'konda ko'rinadi");
        router.push(`/mahsulotlar/${p.id}`);
      } else {
        await adminApi.updateProduct(id, payload);
        setMsgOk(true);
        setMsg("Saqlandi — do'kon yangilandi");
      }
    } catch (e) {
      setMsgOk(false);
      setMsg(e instanceof Error ? e.message : "Saqlashda xato");
    }
  };

  return (
    <DashboardLayout title={isNew ? "Yangi mahsulot" : "Tahrirlash"} showBack onBack={() => router.back()} hideMobileNav>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Mahsulot ma&apos;lumotlari</h2>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Nomi <span className="text-red-500">*</span>
            </label>
            <input
              className="input-field"
              placeholder="Masalan: Zamonaviy divan"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <CategoryManager
            value={form.category}
            onChange={(category) => setForm({ ...form, category })}
            onMessage={setMsg}
          />
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

          {!isNew && (
            <p className="text-sm text-gray-600">
              Sotilgan: <strong>{salesCount}</strong> dona (buyurtmalardan)
            </p>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isPopular}
              onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
            />
            Mashhur mahsulot sifatida belgilash
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.hideFromPopular}
              onChange={(e) =>
                setForm({ ...form, hideFromPopular: e.target.checked })
              }
            />
            Bosh sahifa &quot;Mashhur mahsulotlar&quot; bo&apos;limidan yashirish
          </label>

          <button type="button" onClick={save} className="btn-primary w-full">
            {isNew ? "Mahsulot qo'shish" : "Saqlash"}
          </button>
          {msg && (
            <p className={`text-sm ${msgOk ? "text-green-600" : "text-red-600"}`}>{msg}</p>
          )}
        </div>

        <div className="card p-6">
          <ProductImagesEditor images={images} onChange={setImages} />
        </div>
      </div>
    </DashboardLayout>
  );
}
