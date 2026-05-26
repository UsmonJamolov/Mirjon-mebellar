export interface SketchData {
  type: string;
  length: number;
  width: number;
  height: number;
  material: string;
}

export function formatSketchSummary(s: SketchData): string {
  return `${s.type} · ${s.length}×${s.width}×${s.height} sm · ${s.material}`;
}
