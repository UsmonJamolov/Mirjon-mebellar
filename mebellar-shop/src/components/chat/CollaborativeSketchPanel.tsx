"use client";

import { useState } from "react";
import { SketchPreview } from "@/components/sketch/SketchPreview";
import { DimensionInput } from "@/components/sketch/DimensionInput";
import type { ChatSender, ActiveSketch } from "@/lib/chat-types";
import type { SketchData } from "@/lib/sketch-types";
import { formatSketchSummary } from "@/lib/sketch-types";

const TYPES = ["Shkaf", "Oshxona", "Stol", "Divan"];
const MATERIALS = ["MDF 18mm", "MDF 16mm", "Laminat"];

interface CollaborativeSketchPanelProps {
  role: ChatSender;
  activeSketch: ActiveSketch | null;
  onSave: (sketch: SketchData) => Promise<void>;
  onClose?: () => void;
  expanded?: boolean;
}

export function CollaborativeSketchPanel({
  role,
  activeSketch,
  onSave,
  onClose,
  expanded: initialExpanded = false,
}: CollaborativeSketchPanelProps) {
  const [expanded, setExpanded] = useState(initialExpanded || !activeSketch);
  const [type, setType] = useState(activeSketch?.data.type ?? "Shkaf");
  const [length, setLength] = useState(activeSketch?.data.length ?? 200);
  const [width, setWidth] = useState(activeSketch?.data.width ?? 60);
  const [height, setHeight] = useState(activeSketch?.data.height ?? 220);
  const [material, setMaterial] = useState(activeSketch?.data.material ?? "MDF 18mm");
  const [saving, setSaving] = useState(false);

  if (!activeSketch && !expanded) {
    return (
      <div className="px-4 py-2 border-b border-[#ebe6df] bg-white">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-xs text-[#c97b3f] font-medium hover:underline"
        >
          + Umumiy eskiz yaratish / tahrirlash
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ type, length, width, height, material });
      setExpanded(false);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-b border-[#ebe6df] bg-white">
      <div className="px-4 py-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#3d3229]">Umumiy eskiz (har ikkala tomondan)</p>
          {activeSketch && (
            <p className="text-[10px] text-[#6b5f52]">
              v{activeSketch.version} · {activeSketch.updatedBy === "customer" ? "Mijoz" : "Sotuvchi"}{" "}
              tahrirlagan
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="text-xs text-[#c97b3f] hover:underline"
        >
          {expanded ? "Yig'ish" : "Tahrirlash"}
        </button>
      </div>

      {activeSketch && !expanded && (
        <div className="px-4 pb-3 pointer-events-none opacity-90 max-h-[200px] overflow-hidden">
          <SketchPreview
            length={activeSketch.data.length}
            width={activeSketch.data.width}
            height={activeSketch.data.height}
            type={activeSketch.data.type}
            material={activeSketch.data.material}
          />
        </div>
      )}

      {expanded && (
        <div className="px-4 pb-4 grid sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto">
          <div className="space-y-2">
            <select className="input-field py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <DimensionInput id={`sk-${role}-l`} label="Uzunlik" value={length} onChange={setLength} />
            <DimensionInput id={`sk-${role}-w`} label="Chuqurlik" value={width} onChange={setWidth} />
            <DimensionInput id={`sk-${role}-h`} label="Balandlik" value={height} onChange={setHeight} />
            <select
              className="input-field py-2 text-sm"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              {MATERIALS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-accent w-full text-sm py-2"
            >
              {saving ? "Saqlanmoqda..." : "Eskizni saqlash va chatga yuborish"}
            </button>
            <p className="text-[10px] text-[#6b5f52]">{formatSketchSummary({ type, length, width, height, material })}</p>
          </div>
          <div className="hidden sm:block">
            <SketchPreview length={length} width={width} height={height} type={type} material={material} />
          </div>
        </div>
      )}
    </div>
  );
}
