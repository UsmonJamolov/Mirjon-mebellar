"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { products } from "@/lib/mock-data";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const product = products.find((p) => p.id === params.id) || products[0];
  const [form, setForm] = useState({
    name: product.name,
    category: product.category,
    price: product.price,
    material: product.material,
    width: product.width || 0,
    depth: product.depth || 0,
    height: product.height || 0,
    description: product.description || "",
  });

  return (
    <DashboardLayout
      title="Mahsulot tahrirlash"
      showBack
      onBack={() => router.back()}
      hideMobileNav
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold hidden lg:block">Mahsulot ma&apos;lumotlari</h2>
          <div>
            <label className="text-sm font-medium mb-1 block">Nomi</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Kategoriya</label>
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Oshxona</option>
              <option>Yotoqxona</option>
              <option>Ofis</option>
              <option>Mehmonxona</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Narxi (so&apos;m)</label>
            <input
              type="number"
              className="input-field"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Material</label>
            <select
              className="input-field"
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
            >
              <option>MDF</option>
              <option>MDF, Laminat</option>
              <option>Yog&apos;och</option>
              <option>Mato</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Kenglik</label>
              <input
                type="number"
                className="input-field"
                value={form.width}
                onChange={(e) => setForm({ ...form, width: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Chuqurlik</label>
              <input
                type="number"
                className="input-field"
                value={form.depth}
                onChange={(e) => setForm({ ...form, depth: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Balandlik</label>
              <input
                type="number"
                className="input-field"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Tavsif</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Rasmlar</h2>
          <div className="relative aspect-video rounded-[20px] overflow-hidden mb-4">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {(product.images || [product.image]).map((img, i) => (
              <div
                key={i}
                className="relative h-16 w-16 shrink-0 rounded-[14px] overflow-hidden border-2 border-[#3b82f6]"
              >
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
            <button
              type="button"
              className="h-16 w-16 shrink-0 rounded-[14px] border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-2xl"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:static flex gap-3 p-4 lg:mt-6 lg:justify-end lg:p-0 bg-white lg:bg-transparent border-t lg:border-0 z-20">
        <button type="button" onClick={() => router.back()} className="btn-secondary flex-1 lg:flex-none">
          Bekor qilish
        </button>
        <button type="button" className="btn-primary flex-1 lg:flex-none">
          Saqlash
        </button>
      </div>
      <div className="h-20 lg:hidden" />
    </DashboardLayout>
  );
}
