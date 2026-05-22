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
  X,
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

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <>
      <div
        className="lg:hidden fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#1a2744] text-white flex flex-col shadow-xl">
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3b82f6] font-bold">
              M
            </div>
            <span className="text-lg font-semibold">Mebellar</span>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X size={22} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-medium",
                  active ? "bg-[#3b82f6]" : "text-white/70 hover:bg-white/10"
                )}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
