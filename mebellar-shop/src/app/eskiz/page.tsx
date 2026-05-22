"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DimensionInput } from "@/components/sketch/DimensionInput";
import { SketchPreview } from "@/components/sketch/SketchPreview";
import { savePendingSketch } from "@/lib/sketch-storage";

export default function SketchPage() {
  const router = useRouter();
  const [length, setLength] = useState(200);
  const [width, setWidth] = useState(60);
  const [height, setHeight] = useState(220);
  const [type, setType] = useState("Shkaf");
  const [material, setMaterial] = useState("MDF 18mm");

  const sendToChat = () => {
    savePendingSketch({ type, length, width, height, material });
    router.push("/chat?eskiz=1");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl font-bold mb-2">Individual eskiz</h1>
      <p className="text-gray-500 text-sm mb-8">
        O&apos;lchamlaringizni kiriting — 2D eskiz avtomatik yaratiladi
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card p-6 space-y-4 bg-gray-50/50">
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
          <DimensionInput
            id="eskiz-length"
            label="Uzunlik (sm)"
            value={length}
            onChange={setLength}
          />
          <DimensionInput
            id="eskiz-width"
            label="Kenglik / Chuqurlik (sm)"
            value={width}
            onChange={setWidth}
          />
          <DimensionInput
            id="eskiz-height"
            label="Balandlik (sm)"
            value={height}
            onChange={setHeight}
          />
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
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-accent flex-1">
              Eskiz yaratish
            </button>
            <button type="button" onClick={sendToChat} className="btn-outline flex-1">
              Mutaxassisga yuborish
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-4">Eskiz preview</h2>
          <SketchPreview
            length={length}
            width={width}
            height={height}
            type={type}
            material={material}
          />
        </div>
      </div>
    </main>
  );
}
