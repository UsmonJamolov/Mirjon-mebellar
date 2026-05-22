"use client";

import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

interface AuthSubmitButtonProps {
  loading: boolean;
  label: string;
  loadingLabel: string;
  icon: LucideIcon;
}

export function AuthSubmitButton({
  loading,
  label,
  loadingLabel,
  icon: Icon,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="auth-submit auth-fade-up group relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(244,162,97,0.3)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(244,162,97,0.4)] disabled:opacity-70"
      style={{ animationDelay: "320ms" }}
    >
      <span className="auth-submit-bg absolute inset-0" aria-hidden />
      <span className="auth-submit-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {loadingLabel}
          </>
        ) : (
          <>
            <Icon size={18} strokeWidth={2} />
            {label}
          </>
        )}
      </span>
    </button>
  );
}
