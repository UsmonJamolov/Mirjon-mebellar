"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, ShoppingCart, User, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Bosh", icon: Home },
  { href: "/katalog", label: "Katalog", icon: Grid3X3 },
  { href: "/savatcha", label: "Savat", icon: ShoppingCart, badge: true },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/profil", label: "Profil", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-gray-100 bg-white/95 backdrop-blur-sm px-2">
      {items.map(({ href, label, icon: Icon, badge }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium",
              active ? "text-[#f4a261]" : "text-gray-500"
            )}
          >
            <Icon size={22} />
            <span>{label}</span>
            {badge && hydrated && count > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#f4a261] text-white text-[9px] flex items-center justify-center">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
