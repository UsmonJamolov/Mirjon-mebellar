"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, ShoppingCart, Menu, X, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ProfileNavLink } from "@/components/layout/ProfileNavLink";
import { isAuthRoute, isNavActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/katalog", label: "Katalog" },
  { href: "/eskiz", label: "Eskiz" },
  { href: "/chat", label: "Chat" },
];

export function ShopHeader() {
  const pathname = usePathname();
  const isAuth = isAuthRoute(pathname);
  const isProfile = pathname === "/profil" || pathname.startsWith("/profil/");
  const { data: session } = useSession();
  const user = session?.user;
  const profileHref = user ? "/profil" : "/kirish";
  const { count, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const profileLinkClass = () => {
    if (user) {
      return "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#ebe6df] bg-white text-[#3d3229] transition hover:border-[#f4a261]/50";
    }
    return cn(
      "inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#ebe6df] bg-white text-[#6b5f52] transition hover:border-[#f4a261]/50",
      isProfile && "border-[#f4a261]/60 text-[#c97b3f]"
    );
  };

  if (isAuth) {
    return (
      <header className="sticky top-0 z-50 w-full bg-[#faf8f5] pt-3">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between rounded-[24px] border border-[#ebe6df] bg-white px-4 py-2.5 shadow-[0_18px_40px_rgba(61,50,41,0.08)] sm:px-5">
          <BrandLogo showText={false} />
          <ProfileNavLink
            href={profileHref}
            className={profileLinkClass()}
            active={isProfile}
            iconSize={20}
          />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#faf8f5] pt-3 pb-2">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-3 rounded-[28px] border border-[#ebe6df] bg-white px-3 py-2 shadow-[0_20px_50px_rgba(61,50,41,0.08)] sm:gap-4 sm:px-4 sm:py-2.5">
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#ebe6df] text-[#3d3229] transition hover:border-[#f4a261]/50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menyu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <BrandLogo className="hidden sm:flex" />
          <BrandLogo showText={false} className="sm:hidden" />

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-7 pl-4">
            {navLinks.map((l) => {
              const active = isNavActive(l.href, pathname);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative text-sm font-medium transition pb-1",
                    active
                      ? "text-[#c97b3f]"
                      : "text-[#3d3229]/70 hover:text-[#c97b3f]"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-[#f4a261]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Big search */}
          <div className="hidden md:flex flex-1 max-w-[420px] mx-auto relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6b5f52]"
              size={16}
              aria-hidden
            />
            <input
              type="search"
              placeholder="Mebel qidirish..."
              className="w-full rounded-full border border-[#ebe6df] bg-[#faf6ef] py-2.5 pl-11 pr-4 text-sm text-[#3d3229] placeholder:text-[#8b7d6f] outline-none transition focus:border-[#f4a261] focus:bg-white focus:ring-2 focus:ring-[#f4a261]/20 [&::-webkit-search-cancel-button]:appearance-none"
            />
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1.5 ml-auto sm:gap-2">
            <button
              type="button"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#ebe6df] text-[#3d3229] transition hover:border-[#f4a261]/50"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Qidiruv"
            >
              <Search size={18} />
            </button>
            <Link
              href="/sevimlilar"
              className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#ebe6df] text-[#3d3229] transition hover:border-[#f4a261]/50"
              aria-label="Sevimlilar"
            >
              <Heart size={18} />
            </Link>
            <Link
              href="/savatcha"
              className="relative flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#ebe6df] text-[#3d3229] transition hover:border-[#f4a261]/50"
              aria-label="Savatcha"
            >
              <ShoppingCart size={18} />
              {hydrated && count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f4a261] px-1 text-[10px] font-bold text-white shadow-[0_4px_10px_rgba(244,162,97,0.45)]">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
            <ProfileNavLink
              href={profileHref}
              className={profileLinkClass()}
              active={isProfile}
              iconSize={18}
            />
          </div>
        </div>

        {searchOpen && (
          <div className="mt-2 md:hidden">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6b5f52]"
                size={16}
                aria-hidden
              />
              <input
                type="search"
                placeholder="Mebel qidirish..."
                className="w-full rounded-full border border-[#ebe6df] bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#f4a261] focus:ring-2 focus:ring-[#f4a261]/20"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        <div
          className={cn(
            "lg:hidden mt-2 overflow-hidden rounded-[20px] border border-[#ebe6df] bg-white transition-all",
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-transparent"
          )}
        >
          <nav className="space-y-1 p-2">
            {navLinks.map((l) => {
              const active = isNavActive(l.href, pathname);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-[14px] px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-[#f4a261]/12 text-[#c97b3f] font-semibold"
                      : "text-[#3d3229] hover:bg-[#faf6ef]"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/buyurtmalar"
              onClick={() => setMenuOpen(false)}
              className="block rounded-[14px] px-4 py-3 text-sm font-medium text-[#3d3229] hover:bg-[#faf6ef]"
            >
              Buyurtmalarim
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
