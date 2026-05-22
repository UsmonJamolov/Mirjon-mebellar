"use client";

import { useId } from "react";
import {
  computeLayout,
  drawFront,
  drawSide,
  drawTop,
  sketchColors as C,
} from "./sketch-drawings";

interface SketchPreviewProps {
  length: number;
  width: number;
  height: number;
  type?: string;
  material?: string;
  /** Chat yon paneli — faqat chizma, qisqaroq */
  compact?: boolean;
}

function DimHorizontal({
  x1,
  x2,
  y,
  label,
  offset = 14,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  offset?: number;
}) {
  const yDim = y - offset;
  const mid = (x1 + x2) / 2;
  return (
    <g className="text-[10px] font-semibold" fill={C.accent} stroke={C.accent}>
      <line x1={x1} y1={y} x2={x1} y2={yDim - 4} stroke={C.strokeMuted} strokeWidth={0.75} />
      <line x1={x2} y1={y} x2={x2} y2={yDim - 4} stroke={C.strokeMuted} strokeWidth={0.75} />
      <line x1={x1} y1={yDim} x2={x2} y2={yDim} strokeWidth={1} />
      <polygon points={`${x1},${yDim} ${x1 + 5},${yDim - 3} ${x1 + 5},${yDim + 3}`} fill={C.accent} stroke="none" />
      <polygon points={`${x2},${yDim} ${x2 - 5},${yDim - 3} ${x2 - 5},${yDim + 3}`} fill={C.accent} stroke="none" />
      <text x={mid} y={yDim - 6} textAnchor="middle" fill={C.accent} stroke="none">
        {label}
      </text>
    </g>
  );
}

function DimVertical({
  x,
  y1,
  y2,
  label,
  offset = 14,
}: {
  x: number;
  y1: number;
  y2: number;
  label: string;
  offset?: number;
}) {
  const xDim = x - offset;
  const mid = (y1 + y2) / 2;
  return (
    <g className="text-[10px] font-semibold" fill={C.accent} stroke={C.accent}>
      <line x1={x} y1={y1} x2={xDim - 4} y2={y1} stroke={C.strokeMuted} strokeWidth={0.75} />
      <line x1={x} y1={y2} x2={xDim - 4} y2={y2} stroke={C.strokeMuted} strokeWidth={0.75} />
      <line x1={xDim} y1={y1} x2={xDim} y2={y2} strokeWidth={1} />
      <polygon points={`${xDim},${y1} ${xDim - 3},${y1 + 5} ${xDim + 3},${y1 + 5}`} fill={C.accent} stroke="none" />
      <polygon points={`${xDim},${y2} ${xDim - 3},${y2 - 5} ${xDim + 3},${y2 - 5}`} fill={C.accent} stroke="none" />
      <text
        x={xDim - 8}
        y={mid}
        textAnchor="middle"
        fill={C.accent}
        stroke="none"
        transform={`rotate(-90 ${xDim - 8} ${mid})`}
      >
        {label}
      </text>
    </g>
  );
}

function ViewLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} className="fill-[#6b5f52] text-[10px] font-medium uppercase tracking-wide">
      {text}
    </text>
  );
}

function SketchSvg({
  length,
  width,
  height,
  type,
}: {
  length: number;
  width: number;
  height: number;
  type: string;
}) {
  const uid = useId().replace(/:/g, "");
  const gridId = `sketchGrid-${uid}`;
  const fillId = `panelFill-${uid}`;
  const L = computeLayout(
    Math.max(length, 1),
    Math.max(width, 1),
    Math.max(height, 1)
  );
  const len = Math.max(length, 1);
  const frontPath = drawFront(type, L.frontX, L.frontY, L.fw, L.fh, len);
  const sidePath = drawSide(type, L.sideX, L.sideY, L.sw, L.sh);
  const topPath = drawTop(type, L.topX, L.topY, L.tw, L.td, len);

  return (
    <svg
      viewBox={`0 0 ${L.viewW} ${L.viewH}`}
      className="mx-auto block h-auto w-full max-h-[280px]"
      role="img"
      aria-label={`${type} eskizi: ${length}×${width}×${height} sm`}
    >
      <defs>
        <pattern id={gridId} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke={C.grid} strokeWidth="0.5" />
        </pattern>
        <linearGradient id={fillId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor={C.fillPanel} />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      <ViewLabel x={L.frontX} y={L.frontY - 8} text="Oldindan" />
      <rect
        x={L.frontX - 4}
        y={L.frontY - 4}
        width={L.fw + 8}
        height={L.fh + 8}
        rx="4"
        fill={`url(#${fillId})`}
        stroke={C.grid}
        strokeWidth={1}
      />
      <path
        d={frontPath}
        fill={C.fillAccent}
        fillOpacity={0.35}
        stroke={C.stroke}
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <path d={frontPath} fill="none" stroke={C.stroke} strokeWidth={1.75} strokeLinejoin="round" />
      <DimHorizontal x1={L.frontX} x2={L.frontX + L.fw} y={L.frontY} label={`${length} sm`} />
      <DimVertical
        x={L.frontX + L.fw}
        y1={L.frontY}
        y2={L.frontY + L.fh}
        label={`${height} sm`}
        offset={20}
      />
      <ViewLabel x={L.sideX} y={L.sideY - 8} text="Yon tomondan" />
      <rect
        x={L.sideX - 4}
        y={L.sideY - 4}
        width={L.sw + 8}
        height={L.sh + 8}
        rx="4"
        fill={`url(#${fillId})`}
        stroke={C.grid}
        strokeWidth={1}
      />
      <path
        d={sidePath}
        fill={C.fillAccent}
        fillOpacity={0.25}
        stroke={C.stroke}
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <path d={sidePath} fill="none" stroke={C.stroke} strokeWidth={1.75} strokeLinejoin="round" />
      <DimHorizontal
        x1={L.sideX}
        x2={L.sideX + L.sw}
        y={L.sideY + L.sh}
        label={`${width} sm`}
        offset={-16}
      />
      <ViewLabel x={L.topX} y={L.topY - 8} text="Reja (yuqoridan)" />
      <rect
        x={L.topX - 4}
        y={L.topY - 4}
        width={L.tw + 8}
        height={L.td + 8}
        rx="4"
        fill={`url(#${fillId})`}
        stroke={C.grid}
        strokeWidth={1}
      />
      <path
        d={topPath}
        fill={C.fillAccent}
        fillOpacity={0.2}
        stroke={C.stroke}
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <path d={topPath} fill="none" stroke={C.stroke} strokeWidth={1.75} strokeLinejoin="round" />
      <DimHorizontal
        x1={L.topX}
        x2={L.topX + L.tw}
        y={L.topY + L.td}
        label={`${length} sm`}
        offset={-14}
      />
      <DimVertical
        x={L.topX + L.tw}
        y1={L.topY}
        y2={L.topY + L.td}
        label={`${width} sm`}
        offset={18}
      />
    </svg>
  );
}

export function SketchPreview({
  length,
  width,
  height,
  type = "Shkaf",
  material,
  compact = false,
}: SketchPreviewProps) {
  const typeIcon: Record<string, string> = {
    Shkaf: "🗄️",
    Oshxona: "🍳",
    Stol: "🪑",
    Divan: "🛋️",
  };

  if (compact) {
    return (
      <div className="w-full overflow-hidden rounded-[12px] border border-[#ebe6df] bg-[#faf8f5] p-2">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-[#6b5f52]">
          {type} · {length}×{width}×{height} sm
          {material ? ` · ${material}` : ""}
        </p>
        <SketchSvg length={length} width={width} height={height} type={type} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#ebe6df] bg-[#faf8f5] shadow-inner">
      <div className="flex items-center justify-between border-b border-[#ebe6df] bg-white/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fde8d4] text-base">
            {typeIcon[type] ?? "📐"}
          </span>
          <div>
            <p className="text-sm font-semibold text-[#3d3229]">{type}</p>
            <p className="text-[11px] text-[#8b7d6f]">
              {length} × {width} × {height} sm
            </p>
          </div>
        </div>
        {material && (
          <span className="rounded-full bg-[#3d3229] px-3 py-1 text-[10px] font-medium text-white">
            {material}
          </span>
        )}
      </div>

      <div className="relative p-3 sm:p-4">
        <SketchSvg length={length} width={width} height={height} type={type} />
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[#ebe6df] bg-white/60 px-4 py-3">
        {(["Oldindan", "Yon", "Reja"] as const).map((v) => (
          <span
            key={v}
            className="rounded-full bg-[#f5f0e8] px-2.5 py-1 text-[10px] font-medium text-[#6b5f52]"
          >
            {v}
          </span>
        ))}
        <span className="ml-auto text-[10px] text-[#a89888]">Masshtab avtomatik</span>
      </div>
    </div>
  );
}
