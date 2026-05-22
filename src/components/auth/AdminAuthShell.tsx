"use client";

import type { ReactNode } from "react";
import Link from "next/link";

interface AdminAuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
  badge?: string;
}

export function AdminAuthShell({ title, subtitle, children, footer, badge }: AdminAuthShellProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a2744] via-[#243b5c] to-[#1e1e2f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3b82f6] font-bold text-lg">
              M
            </span>
            <span className="text-xl font-semibold tracking-tight">Mebellar</span>
          </Link>
          <p className="text-white/60 text-xs mt-1">Admin panel</p>
        </div>

        <div className="card p-6 sm:p-8 shadow-2xl">
          {badge && (
            <p className="text-xs font-bold uppercase tracking-widest text-[#3b82f6] mb-2 text-center">
              {badge}
            </p>
          )}
          <h1 className="text-xl sm:text-2xl font-semibold text-center text-[#1e1e2f]">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 text-center mt-1 mb-4">{subtitle}</p>
          )}
          {!subtitle && <div className="mb-4" />}
          {children}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-600">
            {footer}
          </div>
        </div>
      </div>
    </main>
  );
}
