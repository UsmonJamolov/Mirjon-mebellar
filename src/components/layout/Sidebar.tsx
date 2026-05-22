"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Warehouse,
  PenTool,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Bosh sahifa", icon: LayoutDashboard },
  { href: "/buyurtmalar", label: "Buyurtmalar", icon: ShoppingCart },
  { href: "/mijozlar", label: "Mijozlar", icon: Users },
  { href: "/mahsulotlar", label: "Mahsulotlar", icon: Package },
  { href: "/ombor", label: "Ombor", icon: Warehouse },
  { href: "/eskizlar", label: "Eskizlar", icon: PenTool },
  { href: "/xabarlar", label: "Xabarlar", icon: MessageSquare },
  { href: "/hisobotlar", label: "Hisobotlar", icon: BarChart3 },
  { href: "/sozlamalar", label: "Sozlamalar", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[#1a2744] text-white z-40">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3b82f6] font-bold text-lg">
          M
        </div>
        <span className="text-xl font-semibold tracking-tight">Mebellar</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-[#3b82f6] text-white shadow-md"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
