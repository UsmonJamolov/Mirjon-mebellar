"use client";

import type { ReactNode } from "react";
import { AuthLogo } from "@/components/auth/AuthLogo";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
  badge?: string;
}

export function AuthShell({ title, subtitle, children, footer, badge }: AuthShellProps) {
  return (
    <main className="auth-page relative min-h-[calc(100dvh-3.5rem)] lg:min-h-[calc(100vh-4rem)]">
      <div className="auth-bg-gradient pointer-events-none absolute inset-0" aria-hidden />
      <div className="auth-orb auth-orb-1 pointer-events-none absolute" aria-hidden />
      <div className="auth-orb auth-orb-2 pointer-events-none absolute" aria-hidden />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl min-h-[inherit] items-center justify-center px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
        <div className="auth-card w-full max-w-[420px] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <div className="auth-card-shine pointer-events-none absolute inset-0 rounded-[22px] lg:rounded-[28px]" aria-hidden />

          <div className="relative px-6 pt-6 pb-2 text-center sm:px-8 sm:pt-8 lg:px-10 lg:pt-10">
            <AuthLogo />
            {badge && (
              <p className="auth-badge mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#c97b3f] lg:text-sm">
                {badge}
              </p>
            )}
            <h1 className="text-xl font-semibold tracking-tight text-[#2a221c] sm:text-2xl lg:text-3xl dark:text-[#f5f0e8]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-[#6b5f52]/85 lg:text-base dark:text-[#b5a898]">{subtitle}</p>
            )}
          </div>

          <div className="relative px-6 pb-5 sm:px-8 lg:px-10 lg:pb-8 auth-form-body">{children}</div>

          <div className="relative border-t border-[#ebe6df]/80 px-6 py-4 text-center text-sm text-[#6b5f52] sm:px-8 lg:px-10 lg:py-5 dark:border-[#3d3229] dark:text-[#b5a898]">
            {footer}
          </div>
        </div>
      </div>
    </main>
  );
}
