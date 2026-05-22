"use client";

import { useEffect, useState } from "react";

const MIN = 30;
const MAX = 500;

function normalizeDigits(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits === "") return "";
  return String(parseInt(digits, 10));
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

interface DimensionInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}

export function DimensionInput({
  id,
  label,
  value,
  onChange,
  min = MIN,
  max = MAX,
}: DimensionInputProps) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium mb-1 block">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        className="input-field"
        value={text}
        onChange={(e) => {
          const normalized = normalizeDigits(e.target.value);
          setText(normalized);
          if (normalized === "") return;
          const n = parseInt(normalized, 10);
          if (n >= min && n <= max) onChange(n);
        }}
        onBlur={() => {
          const parsed = parseInt(text, 10);
          const next =
            Number.isFinite(parsed) && parsed > 0 ? clamp(parsed, min, max) : clamp(value, min, max);
          onChange(next);
          setText(String(next));
        }}
      />
    </div>
  );
}
