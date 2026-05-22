"use client";

interface SketchPreviewProps {
  length: number;
  width: number;
  height: number;
  type?: string;
}

export function SketchPreview({
  length,
  width,
  height,
  type = "Shkaf",
}: SketchPreviewProps) {
  const scale = 0.35;
  const w = Math.max(length * scale, 80);
  const h = Math.max(height * scale, 120);
  const d = Math.max(width * scale * 0.4, 30);

  return (
    <div className="flex h-full min-h-[280px] items-center justify-center rounded-[20px] bg-gray-100 p-6">
      <svg
        viewBox="0 0 320 280"
        className="w-full max-w-md"
        aria-label={`${type} eskizi`}
      >
        <rect x="40" y="40" width={w} height={h} fill="none" stroke="#1e1e2f" strokeWidth="2" />
        <line x1="40" y1="40" x2={40 - d} y2={40 - d * 0.5} stroke="#1e1e2f" strokeWidth="1.5" />
        <line
          x1={40 + w}
          y1="40"
          x2={40 + w - d}
          y2={40 - d * 0.5}
          stroke="#1e1e2f"
          strokeWidth="1.5"
        />
        <line
          x1={40 + w}
          y1={40 + h}
          x2={40 + w - d}
          y2={40 + h - d * 0.5}
          stroke="#1e1e2f"
          strokeWidth="1.5"
        />
        <line x1="40" y1={40 + h} x2={40 - d} y2={40 + h - d * 0.5} stroke="#1e1e2f" strokeWidth="1.5" />
        <line
          x1={40 - d}
          y1={40 - d * 0.5}
          x2={40 - d}
          y2={40 + h - d * 0.5}
          stroke="#1e1e2f"
          strokeWidth="1.5"
        />
        <line
          x1={40 - d}
          y1={40 - d * 0.5}
          x2={40 + w - d}
          y2={40 - d * 0.5}
          stroke="#1e1e2f"
          strokeWidth="1.5"
        />
        <line x1="40" y1="40" x2={40 + w} y2="40" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
        <text x={40 + w / 2} y="32" textAnchor="middle" className="fill-[#3b82f6] text-[11px] font-medium">
          {length} sm
        </text>
        <line
          x1="32"
          y1="40"
          x2="32"
          y2={40 + h}
          stroke="#94a3b8"
          strokeWidth="1"
          strokeDasharray="4"
        />
        <text
          x="18"
          y={40 + h / 2}
          textAnchor="middle"
          transform={`rotate(-90 18 ${40 + h / 2})`}
          className="fill-[#3b82f6] text-[11px] font-medium"
        >
          {height} sm
        </text>
        <text x={40 + w / 2} y={40 + h / 2 + 5} textAnchor="middle" className="fill-gray-500 text-xs">
          {type}
        </text>
        <text x={40 + w / 2} y={40 + h + 24} textAnchor="middle" className="fill-gray-400 text-[10px]">
          Chuqurlik: {width} sm
        </text>
      </svg>
    </div>
  );
}
