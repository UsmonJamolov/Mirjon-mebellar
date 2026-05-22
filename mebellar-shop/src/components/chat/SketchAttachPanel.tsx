"use client";

import { useState } from "react";
import Link from "next/link";
import type { SketchData } from "@/lib/sketch-types";
import { DimensionInput } from "@/components/sketch/DimensionInput";
import { SketchPreview } from "@/components/sketch/SketchPreview";

const PRODUCT_TYPES = ["Shkaf", "Oshxona", "Stol", "Divan"] as const;
const MATERIALS = ["MDF 18mm", "MDF 16mm", "Laminat"] as const;

interface SketchAttachPanelProps {
  initial?: SketchData | null;
  onAttach: (sketch: SketchData) => void;
  onClose: () => void;
}

export function SketchAttachPanel({ initial, onAttach, onClose }: SketchAttachPanelProps) {
  const [type, setType] = useState(initial?.type ?? "Shkaf");
  const [length, setLength] = useState(initial?.length ?? 200);
  const [width, setWidth] = useState(initial?.width ?? 60);
  const [height, setHeight] = useState(initial?.height ?? 220);
  const [material, setMaterial] = useState(initial?.material ?? "MDF 18mm");

  const attach = () => {
    onAttach({ type, length, width, height, material });
    onClose();
  };

  return (
    <div
      className="absolute bottom-full left-0 right-0 mb-2 z-20 rounded-[20px] border border-[#ebe6df] bg-white p-4 shadow-[0_8px_32px_rgba(61,50,41,0.12)]"
      role="dialog"
      aria-label="Eskiz yuborish"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-sm text-[#3d3229]">Eskiz yuborish</p>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-[#3d3229] text-lg leading-none px-1"
          aria-label="Yopish"
        >
          ×
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        <div className="space-y-2">
          <label className="text-xs font-medium text-[#6b5f52]">Mahsulot turi</label>
          <select className="input-field py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
            {PRODUCT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <DimensionInput id="chat-sketch-l" label="Uzunlik (sm)" value={length} onChange={setLength} />
          <DimensionInput id="chat-sketch-w" label="Chuqurlik (sm)" value={width} onChange={setWidth} />
          <DimensionInput id="chat-sketch-h" label="Balandlik (sm)" value={height} onChange={setHeight} />
          <label className="text-xs font-medium text-[#6b5f52]">Material</label>
          <select
            className="input-field py-2 text-sm"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          >
            {MATERIALS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <SketchPreview length={length} width={width} height={height} type={type} material={material} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <button type="button" onClick={attach} className="btn-accent flex-1 min-w-[120px] py-2.5 text-sm">
          Chatga qo&apos;shish
        </button>
        <Link
          href="/eskiz"
          className="btn-outline flex-1 min-w-[120px] text-center py-2.5 text-sm"
          onClick={onClose}
        >
          To&apos;liq eskiz
        </Link>
      </div>
    </div>
  );
}
