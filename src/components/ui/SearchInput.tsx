"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** Qidiruv — ikonka alohida ustunda, placeholder bilan ustma-ust tushmaydi */
export function SearchInput({
  value,
  onChange,
  placeholder = "Qidirish...",
  className,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex w-full items-stretch overflow-hidden rounded-[14px] border border-gray-200 bg-white transition focus-within:border-[#3b82f6] focus-within:ring-2 focus-within:ring-[#3b82f6]/20",
        className
      )}
    >
      <div
        className="flex w-11 shrink-0 items-center justify-center border-r border-gray-200 text-gray-400"
        aria-hidden
      >
        <Search size={18} />
      </div>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
      />
    </div>
  );
}
