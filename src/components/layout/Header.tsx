"use client";

import { Bell, Search, Menu, Globe } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function Header({ onMenuClick, title, showBack, onBack }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-100 bg-white px-4 lg:px-8">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-[14px] hover:bg-gray-100"
          aria-label="Orqaga"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-[14px] hover:bg-gray-100"
          aria-label="Menyu"
        >
          <Menu size={22} />
        </button>
      )}

      {title ? (
        <h1 className="text-lg font-semibold lg:hidden flex-1">{title}</h1>
      ) : (
        <div className="hidden lg:flex flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="search"
            placeholder="Qidirish..."
            className="input-field pl-10 w-full"
          />
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <div className="hidden sm:flex items-center gap-1 rounded-[14px] border border-gray-200 px-3 py-2 text-sm text-gray-600">
          <Globe size={16} />
          UZ
        </div>
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-[14px] hover:bg-gray-100"
          aria-label="Bildirishnomalar"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="hidden md:flex items-center gap-3 pl-2 border-l border-gray-200">
          <div className="h-9 w-9 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-semibold">
            AS
          </div>
          <div className="text-sm">
            <p className="font-medium leading-tight">Abdullah Saidov</p>
            <p className="text-gray-500 text-xs">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
