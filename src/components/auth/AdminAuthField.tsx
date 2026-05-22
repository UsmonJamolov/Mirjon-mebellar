"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminAuthFieldProps {
  id: string;
  label: string;
  type?: string;
  icon: LucideIcon;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
}

export function AdminAuthField({
  id,
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  minLength,
}: AdminAuthFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div
        className={cn(
          "flex items-stretch overflow-hidden rounded-[14px] border border-gray-200 bg-white",
          "transition focus-within:border-[#3b82f6] focus-within:ring-2 focus-within:ring-[#3b82f6]/20"
        )}
      >
        <span
          className="flex w-11 shrink-0 items-center justify-center border-r border-gray-100 bg-gray-50 text-gray-400"
          aria-hidden
        >
          <Icon size={18} strokeWidth={1.75} className="pointer-events-none" />
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          minLength={minLength}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}
