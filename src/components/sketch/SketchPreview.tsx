"use client";

import { forwardRef } from "react";

interface SketchPreviewProps {
  length: number;
  width: number;
  height: number;
  type?: string;
}

export const SketchPreview = forwardRef<SVGSVGElement, SketchPreviewProps>(function SketchPreview(
  { length, width, height, type = "Shkaf" },
  ref
) {
  const scale = 0.35;
  const w = Math.max(length * scale, 80);
  const h = Math.max(height * scale, 120);
  const d = Math.max(width * scale * 0.4, 30);
  const t = type.toLowerCase();

  const isTable = t.includes("stol");
  const isSofa = t.includes("divan");
  const isKitchen = t.includes("oshxona");

  return (
    <div className="flex h-full min-h-[280px] items-center justify-center rounded-[20px] bg-gray-100 p-6">
      <svg
        ref={ref}
        viewBox="0 0 320 280"
        className="w-full max-w-md"
        aria-label={`${type} eskizi`}
      >
        {isTable ? (
          <>
            <rect x="60" y="80" width={w} height="12" fill="#e2e8f0" stroke="#1e1e2f" strokeWidth="2" />
            <line x1="70" y1="92" x2="70" y2={92 + h * 0.5} stroke="#1e1e2f" strokeWidth="2" />
            <line x1={60 + w - 10} y1="92" x2={60 + w - 10} y2={92 + h * 0.5} stroke="#1e1e2f" strokeWidth="2" />
          </>
        ) : isSofa ? (
          <>
            <rect x="50" y={100} width={w} height={h * 0.35} rx="8" fill="#e2e8f0" stroke="#1e1e2f" strokeWidth="2" />
            <rect x="40" y={90} width="24" height={h * 0.45} rx="6" fill="#cbd5e1" stroke="#1e1e2f" strokeWidth="2" />
            <rect x={50 + w - 14} y={90} width="24" height={h * 0.45} rx="6" fill="#cbd5e1" stroke="#1e1e2f" strokeWidth="2" />
          </>
        ) : isKitchen ? (
          <>
            <rect x="40" y="50" width={w} height={h} fill="none" stroke="#1e1e2f" strokeWidth="2" />
            <line x1="40" y1={50 + h * 0.35} x2={40 + w} y2={50 + h * 0.35} stroke="#94a3b8" strokeWidth="1" />
            <rect x="48" y="58" width="40" height="30" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
            <rect x={40 + w - 55} y="58" width="45" height={h * 0.55} fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
          </>
        ) : (
          <>
            <rect x="40" y="40" width={w} height={h} fill="none" stroke="#1e1e2f" strokeWidth="2" />
            <line x1="40" y1="40" x2={40 - d} y2={40 - d * 0.5} stroke="#1e1e2f" strokeWidth="1.5" />
            <line x1={40 + w} y1="40" x2={40 + w - d} y2={40 - d * 0.5} stroke="#1e1e2f" strokeWidth="1.5" />
            <line x1={40 + w} y1={40 + h} x2={40 + w - d} y2={40 + h - d * 0.5} stroke="#1e1e2f" strokeWidth="1.5" />
            <line x1="40" y1={40 + h} x2={40 - d} y2={40 + h - d * 0.5} stroke="#1e1e2f" strokeWidth="1.5" />
            <line x1={40 - d} y1={40 - d * 0.5} x2={40 - d} y2={40 + h - d * 0.5} stroke="#1e1e2f" strokeWidth="1.5" />
            <line x1={40 - d} y1={40 - d * 0.5} x2={40 + w - d} y2={40 - d * 0.5} stroke="#1e1e2f" strokeWidth="1.5" />
          </>
        )}
        <text x={40 + w / 2} y="28" textAnchor="middle" className="fill-[#3b82f6] text-[11px] font-medium">
          {length} sm
        </text>
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
});
