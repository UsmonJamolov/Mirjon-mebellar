import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  inverted?: boolean;
}

/** Do'kon brand logosi — har doim M + Mebellar, sozlamalardan o'zgarmaydi */
export function BrandLogo({ className, showText = true, inverted = false }: BrandLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 shrink-0", className)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f4a261] text-lg font-bold leading-none text-white shadow-sm">
        M
      </span>
      {showText && (
        <span
          className={cn(
            "text-xl font-bold tracking-tight",
            inverted ? "text-white" : "text-[#3d3229] dark:text-[#f5f0e8]"
          )}
        >
          Mebellar
        </span>
      )}
    </Link>
  );
}
