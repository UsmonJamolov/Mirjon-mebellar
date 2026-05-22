"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: LucideIcon;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
  delay?: number;
}

export function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  required,
  autoComplete,
  minLength,
  delay = 0,
}: AuthFieldProps) {
  return (
    <div
      className="auth-field auth-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <label htmlFor={id} className="auth-label mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8b7d6f]">
        {label}
      </label>
      <div className="auth-input-group group flex items-stretch overflow-hidden rounded-[14px] border border-[#e8e0d6] bg-white transition-all duration-300 focus-within:border-[#f4a261]/70 focus-within:shadow-[0_0_0_3px_rgba(244,162,97,0.12)]">
        <span
          className="auth-input-icon flex w-10 shrink-0 items-center justify-center border-r border-[#f0ebe3] bg-[#faf8f5] text-[#c97b3f] transition-colors duration-300 group-focus-within:bg-[#fff8f2] group-focus-within:text-[#e88b4a]"
          aria-hidden
        >
          <Icon size={17} strokeWidth={1.75} className="pointer-events-none" />
        </span>
        <input
          id={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          minLength={minLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "auth-input min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm text-[#3d3229]",
            "placeholder:text-[#b5a898] outline-none"
          )}
        />
      </div>
    </div>
  );
}
