"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/katalog", label: "Katalog" },
  { href: "/eskiz", label: "Eskiz" },
  { href: "/chat", label: "Chat" },
];

export function ShopHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { count, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      className={cn(
        "top-0 z-50 w-full transition-colors duration-300",
        isHome
          ? "absolute bg-transparent border-b border-white/10"
          : "sticky bg-white/95 backdrop-blur-md border-b border-[#ebe6df] shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <button
            type="button"
            className={cn(
              "lg:hidden p-2 -ml-2 rounded-[14px]",
              isHome ? "hover:bg-white/10 text-white" : "hover:bg-gray-100"
            )}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menyu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <BrandLogo inverted={isHome} className="hidden sm:flex" />
          <BrandLogo inverted={isHome} showText={false} className="sm:hidden" />

          <nav className="hidden lg:flex items-center gap-8 ml-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm font-medium transition",
                  isHome ? "text-white/80 hover:text-[#f4a261]" : "text-gray-600 hover:text-[#f4a261]"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex flex-1 max-w-md mx-auto relative">
            <Search
              className={cn(
                "pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2",
                isHome ? "text-white/50" : "text-gray-400"
              )}
              size={18}
              aria-hidden
            />
            <input
              type="search"
              placeholder="Mebel qidirish..."
              className={cn(
                "w-full rounded-[14px] border py-2.5 pl-10 pr-4 text-sm outline-none transition [&::-webkit-search-cancel-button]:appearance-none",
                isHome
                  ? "border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-[#f4a261] focus:ring-2 focus:ring-[#f4a261]/25"
                  : "border-gray-200 bg-white placeholder:text-gray-400 focus:border-[#f4a261] focus:ring-2 focus:ring-[#f4a261]/25"
              )}
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            <button
              type="button"
              className={cn(
                "md:hidden p-2 rounded-[14px]",
                isHome ? "hover:bg-white/10 text-white" : "hover:bg-gray-100"
              )}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Qidiruv"
            >
              <Search size={20} />
            </button>
            <Link
              href="/sevimlilar"
              className={cn(
                "p-2 rounded-[14px]",
                isHome ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-600"
              )}
              aria-label="Sevimlilar"
            >
              <Heart size={20} />
            </Link>
            <Link
              href="/savatcha"
              className={cn(
                "relative p-2 rounded-[14px]",
                isHome ? "hover:bg-white/10 text-white" : "hover:bg-gray-100"
              )}
              aria-label="Savatcha"
            >
              <ShoppingCart size={20} />
              {hydrated && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-[#f4a261] text-white text-[10px] font-bold flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
            <Link
              href="/profil"
              className={cn(
                "p-2 rounded-[14px]",
                isHome ? "hover:bg-white/10 text-white" : "hover:bg-gray-100"
              )}
              aria-label="Profil"
            >
              <User size={20} />
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="md:hidden pb-4 relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400"
              size={18}
              aria-hidden
            />
            <input
              type="search"
              placeholder="Mebel qidirish..."
              className="w-full rounded-[14px] border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#f4a261] focus:ring-2 focus:ring-[#f4a261]/25"
              autoFocus
            />
          </div>
        )}
      </div>

      <div
        className={cn(
          "lg:hidden border-t border-gray-100 overflow-hidden transition-all",
          menuOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="px-4 py-4 space-y-1 bg-white">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-[14px] text-sm font-medium hover:bg-gray-50"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/buyurtmalar"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-3 rounded-[14px] text-sm font-medium hover:bg-gray-50"
          >
            Buyurtmalarim
          </Link>
        </nav>
      </div>
    </header>
  );
}
