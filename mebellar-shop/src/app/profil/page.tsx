"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Globe,
  LogOut,
  Moon,
  Package,
  Heart,
  PenTool,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/buyurtmalar", label: "Buyurtmalarim", icon: Package },
  { href: "/sevimlilar", label: "Sevimlilar", icon: Heart },
  { href: "/eskiz", label: "Eskiz yaratish", icon: PenTool },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("uz");

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <div className="card p-6 text-center mb-6">
        <div className="relative h-24 w-24 mx-auto rounded-full overflow-hidden mb-4 ring-4 ring-[#f4a261]/30">
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
            alt="Profil"
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-xl font-bold">Dilshod Akbarov</h1>
        <p className="text-sm text-gray-500 mt-1">Mijoz</p>
      </div>

      <div className="card p-6 space-y-4 mb-6">
        <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">
          Kontakt
        </h2>
        <div className="flex items-center gap-3 text-sm">
          <Phone size={18} className="text-[#f4a261]" />
          <span>+998 90 123 45 67</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Mail size={18} className="text-[#f4a261]" />
          <span>dilshod@mail.uz</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <User size={18} className="text-[#f4a261]" />
          <span>Toshkent sh., Chilonzor</span>
        </div>
      </div>

      <ul className="card divide-y divide-gray-100 mb-6 overflow-hidden">
        {menuItems.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition"
            >
              <Icon size={20} className="text-[#f4a261]" />
              <span className="flex-1 font-medium text-sm">{label}</span>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-[#f4a261]" />
            <span className="font-medium text-sm">Til</span>
          </div>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="rounded-[14px] border border-gray-200 px-3 py-1.5 text-sm"
          >
            <option value="uz">O&apos;zbek</option>
            <option value="ru">Русский</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon size={20} className="text-[#f4a261]" />
            <span className="font-medium text-sm">Qorong&apos;u rejim</span>
          </div>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={cn(
              "relative h-7 w-12 rounded-full transition",
              darkMode ? "bg-[#f4a261]" : "bg-gray-200"
            )}
            aria-label="Dark mode"
          >
            <span
              className={cn(
                "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition",
                darkMode ? "left-6" : "left-1"
              )}
            />
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Dark mode UI keyinroq to&apos;liq qo&apos;shiladi.
        </p>
      </div>

      <button
        type="button"
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-[14px] border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
      >
        <LogOut size={18} />
        Chiqish
      </button>
    </main>
  );
}
