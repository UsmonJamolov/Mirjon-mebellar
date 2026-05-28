"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500 text-sm">
        Yuklanmoqda...
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
