"use client";

type AuthAlertVariant = "error" | "success";

const styles: Record<AuthAlertVariant, { box: string; dot: string }> = {
  error: {
    box: "border-red-200/80 bg-red-50/90 text-red-700",
    dot: "bg-red-500",
  },
  success: {
    box: "border-emerald-200/80 bg-emerald-50/90 text-emerald-800",
    dot: "bg-emerald-500",
  },
};

export function AuthAlert({
  message,
  variant = "error",
}: {
  message: string;
  variant?: AuthAlertVariant;
}) {
  const s = styles[variant];
  return (
    <div
      className={`auth-alert auth-fade-up mb-2 flex items-start gap-2 rounded-[12px] border px-3 py-2 text-xs ${s.box}`}
      role="alert"
    >
      <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full animate-pulse ${s.dot}`} />
      <span>{message}</span>
    </div>
  );
}
