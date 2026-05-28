"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { buildAuthRedirectUrl } from "@/lib/auth-protected";

/** Ro'yxatdan o'tmagan bo'lsa /auth ga yo'naltiradi */
export function useRequireAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(buildAuthRedirectUrl(pathname));
    }
  }, [status, router, pathname]);

  return {
    session,
    status,
    isAuthenticated: status === "authenticated" && Boolean(session?.user),
    isLoading: status === "loading",
  };
}

/** Harakatdan oldin login tekshiruvi (savatcha, like, ...) */
export function useAuthAction() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const runAuthAction = (action: () => void, callbackPath?: string) => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push(buildAuthRedirectUrl(callbackPath ?? pathname));
      return;
    }
    action();
  };

  return { runAuthAction, isAuthenticated: Boolean(session?.user), status };
}
