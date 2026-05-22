"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { SketchPreview } from "@/components/sketch/SketchPreview";

export default function SketchPage() {
  const [length, setLength] = useState(200);
  const [width, setWidth] = useState(60);
  const [height, setHeight] = useState(220);
  const [type, setType] = useState("Shkaf");
  const [material, setMaterial] = useState("MDF 18mm");

  const clear = () => {
    setLength(200);
    setWidth(60);
    setHeight(220);
    setType("Shkaf");
    setMaterial("MDF 18mm");
  };

  return (
    <DashboardLayout title="Eskiz yaratish">
      <PageTitle title="Eskiz yaratish" subtitle="Individual mebel o'lchamlari uchun 2D eskiz" />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Mahsulot turi</label>
            <select
              className="input-field"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Shkaf</option>
              <option>Oshxona</option>
              <option>Stol</option>
              <option>Divan</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Uzunlik (sm)</label>
            <input
              type="number"
              className="input-field"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Kenglik / Chuqurlik (sm)</label>
            <input
              type="number"
              className="input-field"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Balandlik (sm)</label>
            <input
              type="number"
              className="input-field"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Material</label>
            <select
              className="input-field"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              <option>MDF 18mm</option>
              <option>MDF 16mm</option>
              <option>Laminat</option>
              <option>Yog&apos;och</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-primary flex-1">
              Eskiz yaratish
            </button>
            <button type="button" onClick={clear} className="btn-secondary flex-1">
              Tozalash
            </button>
          </div>
          <p className="text-xs text-gray-400">
            PDF va PNG eksport production bosqichida qo&apos;shiladi.
          </p>
        </div>

        <div className="card p-4 lg:p-6">
          <h2 className="font-semibold mb-4">Eskiz preview</h2>
          <SketchPreview
            length={length}
            width={width}
            height={height}
            type={type}
          />
          <p className="text-center text-sm text-gray-500 mt-2">{material}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
