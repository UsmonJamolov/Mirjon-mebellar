"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { ComponentProps } from "react";
import { buildAuthRedirectUrl } from "@/lib/auth-protected";

type ProtectedNavLinkProps = ComponentProps<typeof Link>;

/** Login bo'lmasa /auth ga yo'naltiradigan havola */
export function ProtectedNavLink({
  href,
  onClick,
  ...props
}: ProtectedNavLinkProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const path = typeof href === "string" ? href : (href.pathname ?? "/");

  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (status === "loading") return;
        if (!session?.user) {
          e.preventDefault();
          router.push(buildAuthRedirectUrl(path));
        }
      }}
    />
  );
}
