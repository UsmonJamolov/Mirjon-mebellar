"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, ShoppingCart, SquareUser, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { isAuthRoute, isNavActive } from "@/lib/nav";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Bosh", icon: Home, profile: false },
  { href: "/katalog", label: "Katalog", icon: Grid3X3, profile: false },
  { href: "/savatcha", label: "Savat", icon: ShoppingCart, badge: true, profile: false },
  { href: "/chat", label: "Chat", icon: MessageCircle, profile: false },
  { href: "/profil", label: "Profil", icon: SquareUser, profile: true },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();
  const { data: session } = useSession();

  if (isAuthRoute(pathname)) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-gray-100 bg-white/95 backdrop-blur-sm px-2 dark:border-[#3d3229] dark:bg-[#2a221c]/95">
      {items.map(({ href, label, icon: Icon, badge, profile }) => {
        const active = isNavActive(href, pathname);
        const user = session?.user;

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition",
              active ? "text-[#f4a261] font-semibold" : "text-gray-500"
            )}
          >
            {profile && user ? (
              <ProfileAvatar
                name={user.name}
                phone={user.phone}
                email={user.email}
                image={user.image}
                size="nav"
                active={false}
              />
            ) : (
              <Icon size={22} />
            )}
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
