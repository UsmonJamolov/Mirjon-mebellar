"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { SketchPreview } from "@/components/sketch/SketchPreview";
import { DimensionInput } from "@/components/sketch/DimensionInput";
import { ChatAccordion } from "@/components/chat/ChatAccordion";
import type { ChatSender, ActiveSketch } from "@/lib/chat-types";
import type { SketchData } from "@/lib/sketch-types";
import { formatSketchSummary } from "@/lib/sketch-types";

const TYPES = ["Shkaf", "Oshxona", "Stol", "Divan"];
const MATERIALS = ["MDF 18mm", "MDF 16mm", "Laminat"];

interface CollaborativeSketchPanelProps {
  role: ChatSender;
  activeSketch: ActiveSketch | null;
  onSave: (sketch: SketchData) => Promise<void>;
  sketchLocked?: boolean;
  onClose?: () => void;
  expanded?: boolean;
  variant?: "inline" | "sidebar";
}

export function CollaborativeSketchPanel({
  role,
  activeSketch,
  onSave,
  sketchLocked = false,
  onClose,
  expanded: initialExpanded = false,
  variant = "inline",
}: CollaborativeSketchPanelProps) {
  const isSidebar = variant === "sidebar";
  const canEdit = !sketchLocked || role === "admin";

  const [previewOpen, setPreviewOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(!activeSketch && canEdit);
  const [expanded, setExpanded] = useState(
    isSidebar ? true : initialExpanded || !activeSketch
  );
  const [type, setType] = useState(activeSketch?.data.type ?? "Shkaf");
  const [length, setLength] = useState(activeSketch?.data.length ?? 200);
  const [width, setWidth] = useState(activeSketch?.data.width ?? 60);
  const [height, setHeight] = useState(activeSketch?.data.height ?? 220);
  const [material, setMaterial] = useState(activeSketch?.data.material ?? "MDF 18mm");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!activeSketch?.data) return;
    setType(activeSketch.data.type);
    setLength(activeSketch.data.length);
    setWidth(activeSketch.data.width);
    setHeight(activeSketch.data.height);
    setMaterial(activeSketch.data.material);
  }, [activeSketch?.version, activeSketch?.updatedAt]);

  const handleSave = async () => {
    if (!canEdit) return;
    setSaving(true);
    try {
      await onSave({ type, length, width, height, material });
      if (!isSidebar) setExpanded(false);
      setPreviewOpen(true);
      setSettingsOpen(false);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  const summary = formatSketchSummary({ type, length, width, height, material });
  const versionBadge = activeSketch ? `v${activeSketch.version}` : undefined;
  const editorLabel = activeSketch
    ? activeSketch.updatedBy === "customer"
      ? "Mijoz"
      : "Sotuvchi"
    : null;

  const lockNotice =
    sketchLocked && role === "customer" ? (
      <p className="mb-3 flex items-center gap-2 rounded-[12px] bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        <Lock size={14} className="shrink-0" />
        Kelishuv tasdiqlangan — eskizni faqat sotuvchi o&apos;zgartiradi
      </p>
    ) : null;

  const settingsForm = (
    <div className="space-y-3">
      {lockNotice}
      {!canEdit ? null : (
        <>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#6b5f52]">Mahsulot turi</label>
            <select
              className="input-field py-2 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={!canEdit}
            >
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <DimensionInput id={`sk-${role}-l`} label="Uzunlik (sm)" value={length} onChange={setLength} />
            <DimensionInput id={`sk-${role}-w`} label="Chuqurlik (sm)" value={width} onChange={setWidth} />
            <DimensionInput id={`sk-${role}-h`} label="Balandlik (sm)" value={height} onChange={setHeight} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#6b5f52]">Material</label>
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
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-accent w-full py-2.5 text-sm"
          >
            {saving ? "Saqlanmoqda..." : activeSketch ? "Eskizni yangilash" : "Eskizni saqlash"}
          </button>
        </>
      )}
      <p className="text-center text-[10px] text-[#6b5f52]">{summary}</p>
    </div>
  );

  if (isSidebar) {
    return (
      <div className="flex h-auto shrink-0 flex-col bg-white dark:bg-[#2a221c] lg:h-full lg:min-h-0">
        <ChatAccordion
          title="Umumiy eskiz"
          subtitle="Chatdagi joriy eskiz"
          open={previewOpen}
          onToggle={() => setPreviewOpen((o) => !o)}
          badge={versionBadge}
        >
          {editorLabel && (
            <p className="mb-2 text-[10px] font-medium text-[#c97b3f]">{editorLabel} tahrirlagan</p>
          )}
          <div className="rounded-[16px] border border-[#ebe6df] bg-[#faf8f5] p-2 dark:border-[#3d3229] dark:bg-[#1a1612]">
            <SketchPreview
              compact
              length={length}
              width={width}
              height={height}
              type={type}
              material={material}
            />
          </div>
        </ChatAccordion>

        <ChatAccordion
          title="Eskiz o'lchamlari"
          subtitle={canEdit ? "O'lcham va material sozlamalari" : "Faqat ko'rish"}
          open={settingsOpen}
          onToggle={() => setSettingsOpen((o) => !o)}
        >
          {settingsForm}
        </ChatAccordion>
      </div>
    );
  }

  if (!activeSketch && !expanded) {
    return (
      <div className="border-b border-[#ebe6df] bg-white px-4 py-2">
        <button
          type="button"
          onClick={() => {
            setExpanded(true);
            setSettingsOpen(true);
          }}
          className="text-xs font-medium text-[#c97b3f] hover:underline"
        >
          + Umumiy eskiz yaratish
        </button>
      </div>
    );
  }

  return (
    <div className="border-b border-[#ebe6df] bg-white">
      <ChatAccordion
        title="Umumiy eskiz"
        subtitle="Har ikkala tomondan"
        open={previewOpen}
        onToggle={() => setPreviewOpen((o) => !o)}
        badge={versionBadge}
      >
        <SketchPreview compact length={length} width={width} height={height} type={type} material={material} />
      </ChatAccordion>
      <ChatAccordion
        title="Eskiz o'lchamlari"
        subtitle={summary}
        open={settingsOpen}
        onToggle={() => setSettingsOpen((o) => !o)}
      >
        {settingsForm}
      </ChatAccordion>
    </div>
  );
}
