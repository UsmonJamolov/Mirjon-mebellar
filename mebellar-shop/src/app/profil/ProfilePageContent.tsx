"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  Globe,
  LogOut,
  Moon,
  Package,
  Heart,
  PenTool,
  MessageCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useLanguageStore } from "@/stores/language-store";
import { localeNames, type Locale } from "@/i18n/config";
import { ProfileAvatarEditor } from "@/components/profil/ProfileAvatarEditor";
import { ProfileContactEditor } from "@/components/profil/ProfileContactEditor";
import type { Session } from "next-auth";
import { useState } from "react";

export function ProfilePageContent({ session }: { session: Session }) {
  const t = useTranslations("profile");
  const { dark, ready, toggleDark } = useTheme();
  const locale = useLanguageStore((s) => s.locale);
  const setLocale = useLanguageStore((s) => s.setLocale);
  const [signingOut, setSigningOut] = useState(false);
  const user = session.user;

  const menuItems = [
    { href: "/buyurtmalar", label: t("orders"), icon: Package },
    { href: "/sevimlilar", label: t("favorites"), icon: Heart },
    { href: "/eskiz", label: t("createSketch"), icon: PenTool },
    { href: "/chat", label: t("chat"), icon: MessageCircle },
  ];

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12 xl:max-w-7xl xl:py-14">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-10">
        <aside className="mb-6 lg:col-span-4 lg:mb-0 xl:col-span-4">
          <div className="card p-6 text-center lg:p-8 xl:p-10">
            <ProfileAvatarEditor />
            <h1 className="text-xl font-bold dark:text-[#f5f0e8] lg:text-2xl">{user.name}</h1>
            <p className="text-sm text-gray-500 dark:text-[#b5a898] mt-1 lg:text-base">
              {t("customer")}
            </p>
            <p className="mt-4 text-xs text-[#8b7d6f] lg:text-sm">{t("premiumMember")}</p>
          </div>
        </aside>

        <div className="space-y-6 lg:col-span-8 lg:space-y-8 xl:col-span-8">
          <ProfileContactEditor />

          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <ul className="card divide-y divide-gray-100 dark:divide-[#3d3229] overflow-hidden">
              {menuItems.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-[#3d3229]/50 transition lg:px-6 lg:py-5"
                  >
                    <Icon size={20} className="text-[#f4a261] lg:w-6 lg:h-6" />
                    <span className="flex-1 font-medium text-sm dark:text-[#f5f0e8] lg:text-base">
                      {label}
                    </span>
                    <ChevronRight size={18} className="text-gray-400 dark:text-[#8b7d6f]" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="card p-6 space-y-5 lg:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-[#f4a261]" />
                  <span className="font-medium text-sm dark:text-[#f5f0e8] lg:text-base">
                    {t("language")}
                  </span>
                </div>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                  className="rounded-[14px] border border-gray-200 dark:border-[#3d3229] dark:bg-[#1a1612] dark:text-[#f5f0e8] px-3 py-2 text-sm lg:px-4 lg:py-2.5"
                >
                  <option value="uz">{localeNames.uz}</option>
                  <option value="ru">{localeNames.ru}</option>
                </select>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Moon size={20} className="text-[#f4a261]" />
                  <span className="font-medium text-sm dark:text-[#f5f0e8] lg:text-base">
                    {t("darkMode")}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={ready ? dark : false}
                  onClick={toggleDark}
                  disabled={!ready}
                  className={cn(
                    "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 lg:h-8 lg:w-14",
                    dark ? "bg-[#f4a261]" : "bg-gray-200 dark:bg-[#3d3229]"
                  )}
                  aria-label={t("darkModeAria")}
                >
                  <span
                    className={cn(
                      "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 lg:h-6 lg:w-6",
                      dark ? "left-6 lg:left-7" : "left-1"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            aria-busy={signingOut}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-[14px] text-sm font-semibold transition-all duration-200 lg:py-4 lg:text-base",
              signingOut
                ? "bg-red-600 border-2 border-red-600 text-white shadow-lg scale-[0.98]"
                : "border-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
            )}
          >
            {signingOut ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {t("signingOut")}
              </>
            ) : (
              <>
                <LogOut size={18} />
                {t("signOut")}
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
