import type { SketchData } from "@/lib/sketch-types";

export function sketchItemName(sketch?: SketchData | null) {
  if (!sketch) return "Buyurtma (chat)";
  return `${sketch.type} · ${sketch.length}×${sketch.width}×${sketch.height} sm`;
}

export function estimateSketchTotal(sketch?: SketchData | null) {
  if (!sketch) return 5_000_000;
  const vol = (sketch.length || 100) * (sketch.width || 60) * (sketch.height || 200);
  return Math.max(1_500_000, Math.round(vol * 120));
}

