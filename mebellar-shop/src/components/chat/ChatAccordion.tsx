"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatAccordionProps {
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
}

export function ChatAccordion({
  title,
  subtitle,
  open,
  onToggle,
  children,
  badge,
}: ChatAccordionProps) {
  return (
    <div className="border-b border-[#ebe6df] last:border-b-0 dark:border-[#3d3229]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[#faf8f5] dark:hover:bg-[#2a221c]/50"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#3d3229] dark:text-[#f5f0e8]">{title}</p>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-[#6b5f52] dark:text-[#b5a898]">{subtitle}</p>
          )}
        </div>
        {badge && (
          <span className="shrink-0 rounded-full bg-[#f4a261]/15 px-2 py-0.5 text-[10px] font-semibold text-[#c97b3f]">
            {badge}
          </span>
        )}
        <ChevronDown
          size={20}
          className={cn(
            "shrink-0 text-[#c97b3f] transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
