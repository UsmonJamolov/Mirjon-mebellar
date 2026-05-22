"use client";

export function AuthAlert({ message }: { message: string }) {
  return (
    <div
      className="auth-alert auth-fade-up mb-2 flex items-start gap-2 rounded-[12px] border border-red-200/80 bg-red-50/90 px-3 py-2 text-xs text-red-700"
      role="alert"
    >
      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500 animate-pulse" />
      <span>{message}</span>
    </div>
  );
}
