"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function ShopMainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChat = pathname === "/chat" || pathname.startsWith("/chat/");
  const isAuth = pathname === "/auth" || pathname.startsWith("/auth/");

  if (isAuth) {
    return (
      <div className="fixed inset-0 h-[100dvh] w-screen overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-[#faf8f5] dark:bg-[#1a1612] transition-colors",
        isChat
          ? "flex h-[calc(100dvh-4rem-4rem)] max-h-[calc(100dvh-4rem-4rem)] flex-col overflow-hidden md:h-[calc(100dvh-4rem)] md:max-h-[calc(100dvh-4rem)]"
          : "min-h-[calc(100vh-4rem)] pb-20 md:pb-0"
      )}
    >
      {children}
    </div>
  );
}
