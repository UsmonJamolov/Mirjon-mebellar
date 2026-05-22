import type { SketchData } from "./sketch-types";

const PENDING_KEY = "mebellar_pending_sketch";

export function savePendingSketch(sketch: SketchData): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(sketch));
}

export function consumePendingSketch(): SketchData | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PENDING_KEY);
  try {
    return JSON.parse(raw) as SketchData;
  } catch {
    return null;
  }
}
