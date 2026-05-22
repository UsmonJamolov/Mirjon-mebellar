"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Bosh sahifa", icon: LayoutDashboard },
  { href: "/buyurtmalar", label: "Buyurtmalar", icon: ShoppingCart },
  { href: "/mijozlar", label: "Mijozlar", icon: Users },
  { href: "/mahsulotlar", label: "Mahsulotlar", icon: Package },
  { href: "/ko-proq", label: "Ko'proq", icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-gray-200 bg-white px-2 safe-area-pb">
      {items.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/"
            ? pathname === "/"
            : href === "/ko-proq"
              ? ["/ombor", "/eskizlar", "/xabarlar", "/hisobotlar", "/sozlamalar"].some(
                  (p) => pathname.startsWith(p)
                )
              : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition",
              active ? "text-[#3b82f6]" : "text-gray-500"
            )}
          >
            <Icon size={22} />
            <span className="truncate max-w-[56px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
