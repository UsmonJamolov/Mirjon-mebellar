"use client";

import { useRef, useState } from "react";
import { Download } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { SketchPreview } from "@/components/sketch/SketchPreview";
import { adminApi } from "@/lib/api";

export default function SketchPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [length, setLength] = useState(200);
  const [width, setWidth] = useState(60);
  const [height, setHeight] = useState(220);
  const [type, setType] = useState("Shkaf");
  const [material, setMaterial] = useState("MDF 18mm");
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");

  const clear = () => {
    setLength(200);
    setWidth(60);
    setHeight(220);
    setType("Shkaf");
    setMaterial("MDF 18mm");
    setSaved(false);
    setMsg("");
  };

  const save = async () => {
    try {
      await adminApi.saveSketch({ type, length, width, height, material });
      setSaved(true);
      setMsg("Eskiz saqlandi!");
    } catch {
      setMsg("Saqlashda xato");
    }
  };

  const downloadPng = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 560;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = `eskiz-${type}-${Date.now()}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = url;
  };

  return (
    <DashboardLayout title="Eskiz yaratish">
      <PageTitle title="Eskiz yaratish" subtitle="Kategoriya bo'yicha shakl" />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Mahsulot turi</label>
            <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
              <option>Shkaf</option>
              <option>Oshxona</option>
              <option>Stol</option>
              <option>Divan</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Uzunlik (sm)</label>
            <input type="number" className="input-field" value={length} onChange={(e) => setLength(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Kenglik / Chuqurlik (sm)</label>
            <input type="number" className="input-field" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Balandlik (sm)</label>
            <input type="number" className="input-field" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Material</label>
            <input className="input-field" value={material} onChange={(e) => setMaterial(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={save} className="btn-primary flex-1">
              Saqlash
            </button>
            <button type="button" onClick={clear} className="btn-secondary flex-1">
              Tozalash
            </button>
          </div>
          {msg && <p className="text-sm text-green-600">{msg}</p>}
          {saved && (
            <button type="button" onClick={downloadPng} className="btn-secondary w-full flex items-center justify-center gap-2">
              <Download size={18} />
              PNG yuklab olish
            </button>
          )}
        </div>

        <div className="card p-4 lg:p-6">
          <h2 className="font-semibold mb-4">Eskiz preview</h2>
          <SketchPreview ref={svgRef} length={length} width={width} height={height} type={type} />
          <p className="text-center text-sm text-gray-500 mt-2">{material}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
