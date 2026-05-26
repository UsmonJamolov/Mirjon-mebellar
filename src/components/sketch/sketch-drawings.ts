export type FurnitureSketchType = "Shkaf" | "Oshxona" | "Stol" | "Divan";

export interface SketchDims {
  length: number;
  width: number;
  height: number;
  type: string;
}

const C = {
  stroke: "#3d3229",
  strokeMuted: "#a89888",
  fill: "#faf8f5",
  fillPanel: "#f0ebe3",
  fillAccent: "#fde8d4",
  accent: "#f4a261",
  grid: "#e8e2d9",
};

function doorCount(length: number) {
  if (length >= 240) return 3;
  if (length >= 120) return 2;
  return 1;
}

/** Oldindan ko'rinish — mahsulot turiga qarab */
export function drawFront(
  type: string,
  x: number,
  y: number,
  w: number,
  h: number,
  lengthSm: number
): string {
  const doors = doorCount(lengthSm);
  const doorW = w / doors;

  switch (type) {
    case "Oshxona": {
      const counterH = h * 0.08;
      const baseH = h * 0.72;
      const topY = y + h - baseH - counterH;
      let d = `M ${x} ${y + h} L ${x} ${topY} L ${x + w} ${topY} L ${x + w} ${y + h} Z`;
      d += ` M ${x} ${topY} L ${x} ${topY - counterH} L ${x + w} ${topY - counterH} L ${x + w} ${topY} Z`;
      const cols = Math.max(2, Math.min(5, Math.floor(w / 55)));
      const cw = w / cols;
      for (let i = 1; i < cols; i++) {
        const cx = x + i * cw;
        d += ` M ${cx} ${topY + baseH * 0.15} L ${cx} ${y + h - 8}`;
      }
      const handleY = topY + baseH * 0.55;
      for (let i = 0; i < cols; i++) {
        const hx = x + (i + 0.5) * cw;
        d += ` M ${hx - 3} ${handleY} L ${hx + 3} ${handleY}`;
      }
      return d;
    }
    case "Stol": {
      const topH = Math.max(12, h * 0.12);
      const legW = Math.max(8, w * 0.06);
      const legInset = w * 0.08;
      let d = `M ${x} ${y + topH} L ${x + w} ${y + topH} L ${x + w} ${y} L ${x} ${y} Z`;
      const legs = [
        [x + legInset, y + topH],
        [x + w - legInset - legW, y + topH],
      ];
      for (const [lx] of legs) {
        d += ` M ${lx} ${y + topH} L ${lx} ${y + h} L ${lx + legW} ${y + h} L ${lx + legW} ${y + topH}`;
      }
      return d;
    }
    case "Divan": {
      const seatH = h * 0.38;
      const backH = h * 0.42;
      const armW = w * 0.12;
      let d = `M ${x} ${y + h} L ${x} ${y + h - seatH} L ${x + armW} ${y + h - seatH}`;
      d += ` L ${x + armW} ${y + h - seatH - backH} L ${x + w - armW} ${y + h - seatH - backH}`;
      d += ` L ${x + w - armW} ${y + h - seatH} L ${x + w} ${y + h - seatH} L ${x + w} ${y + h} Z`;
      d += ` M ${x + armW} ${y + h - seatH} L ${x + w - armW} ${y + h - seatH}`;
      const cushionY = y + h - seatH * 0.55;
      d += ` M ${x + armW + 8} ${cushionY} L ${x + w - armW - 8} ${cushionY}`;
      return d;
    }
    default: {
      let d = `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
      for (let i = 1; i < doors; i++) {
        const dx = x + i * doorW;
        d += ` M ${dx} ${y + 6} L ${dx} ${y + h - 6}`;
      }
      const shelves = 4;
      for (let i = 1; i < shelves; i++) {
        const sy = y + (h / shelves) * i;
        d += ` M ${x + 8} ${sy} L ${x + w - 8} ${sy}`;
      }
      for (let i = 0; i < doors; i++) {
        const hx = x + (i + 0.5) * doorW;
        const hy = y + h * 0.52;
        d += ` M ${hx - 4} ${hy - 8} L ${hx - 4} ${hy + 8} M ${hx + 4} ${hy - 8} L ${hx + 4} ${hy + 8}`;
      }
      return d;
    }
  }
}

/** Yon ko'rinish (chuqurlik × balandlik) */
export function drawSide(
  type: string,
  x: number,
  y: number,
  d: number,
  h: number
): string {
  switch (type) {
    case "Oshxona": {
      const counterH = h * 0.08;
      const baseH = h * 0.72;
      const topY = y + h - baseH - counterH;
      return `M ${x} ${y + h} L ${x} ${topY} L ${x + d} ${topY} L ${x + d} ${y + h} Z M ${x} ${topY} L ${x} ${topY - counterH} L ${x + d} ${topY - counterH} L ${x + d} ${topY} Z`;
    }
    case "Stol": {
      const topH = Math.max(10, h * 0.1);
      const legW = Math.max(6, d * 0.35);
      return `M ${x} ${y + topH} L ${x + d} ${y + topH} L ${x + d} ${y} L ${x} ${y} Z M ${x + (d - legW) / 2} ${y + topH} L ${x + (d - legW) / 2} ${y + h} L ${x + (d + legW) / 2} ${y + h} L ${x + (d + legW) / 2} ${y + topH}`;
    }
    case "Divan": {
      const seatH = h * 0.38;
      const backH = h * 0.42;
      return `M ${x} ${y + h} L ${x} ${y + h - seatH} L ${x + d} ${y + h - seatH} L ${x + d} ${y + h - seatH - backH} L ${x} ${y + h - seatH - backH} Z`;
    }
    default: {
      const shelves = 4;
      let path = `M ${x} ${y} L ${x + d} ${y} L ${x + d} ${y + h} L ${x} ${y + h} Z`;
      for (let i = 1; i < shelves; i++) {
        const sy = y + (h / shelves) * i;
        path += ` M ${x + 4} ${sy} L ${x + d - 4} ${sy}`;
      }
      return path;
    }
  }
}

/** Reja (yuqoridan) */
export function drawTop(
  type: string,
  x: number,
  y: number,
  w: number,
  d: number,
  lengthSm: number
): string {
  switch (type) {
    case "Oshxona": {
      const depthSplit = d * 0.65;
      return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + d} L ${x} ${y + d} Z M ${x} ${y + depthSplit} L ${x + w} ${y + depthSplit}`;
    }
    case "Stol": {
      const inset = Math.min(w, d) * 0.1;
      let p = `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + d} L ${x} ${y + d} Z`;
      const leg = Math.max(8, Math.min(w, d) * 0.08);
      const corners = [
        [x + inset, y + inset],
        [x + w - inset - leg, y + inset],
        [x + inset, y + d - inset - leg],
        [x + w - inset - leg, y + d - inset - leg],
      ];
      for (const [cx, cy] of corners) {
        p += ` M ${cx} ${cy} L ${cx + leg} ${cy} L ${cx + leg} ${cy + leg} L ${cx} ${cy + leg} Z`;
      }
      return p;
    }
    case "Divan": {
      const armD = d * 0.22;
      return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + d} L ${x} ${y + d} Z M ${x} ${y + armD} L ${x + w} ${y + armD} M ${x + w * 0.35} ${y} L ${x + w * 0.35} ${y + d}`;
    }
    default: {
      const doors = doorCount(lengthSm);
      const doorW = w / doors;
      let p = `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + d} L ${x} ${y + d} Z`;
      for (let i = 1; i < doors; i++) {
        const dx = x + i * doorW;
        p += ` M ${dx} ${y + 4} L ${dx} ${y + d - 4}`;
      }
      return p;
    }
  }
}

export const sketchColors = C;

export function computeLayout(length: number, width: number, height: number) {
  const pad = 24;
  const gap = 28;
  const labelH = 22;
  const dimOffset = 18;

  const maxFrontW = 200;
  const maxFrontH = 160;
  const maxSideD = 70;
  const maxTopD = 80;

  const sLen = maxFrontW / Math.max(length, 40);
  const sH = maxFrontH / Math.max(height, 40);
  const sFront = Math.min(sLen, sH, 0.55);

  const sDepth = Math.min(maxSideD / Math.max(width, 30), sFront * 0.85);
  const sTopLen = Math.min(160 / Math.max(length, 40), sFront * 0.75);
  const sTopDep = Math.min(maxTopD / Math.max(width, 30), sTopLen * 0.9);

  const fw = length * sFront;
  const fh = height * sFront;
  const sw = width * sDepth;
  const sh = height * sDepth;
  const tw = length * sTopLen;
  const td = width * sTopDep;

  const frontX = pad + dimOffset;
  const frontY = pad + labelH + dimOffset;
  const sideX = frontX + fw + gap;
  const sideY = frontY;
  const topX = frontX;
  const topY = frontY + fh + gap + labelH;

  const totalW = sideX + sw + pad + dimOffset;
  const totalH = topY + td + pad + dimOffset + 24;

  return {
    sFront,
    sDepth,
    sTopLen,
    sTopDep,
    fw,
    fh,
    sw,
    sh,
    tw,
    td,
    frontX,
    frontY,
    sideX,
    sideY,
    topX,
    topY,
    viewW: Math.max(400, totalW),
    viewH: Math.max(320, totalH),
    pad,
    dimOffset,
  };
}
