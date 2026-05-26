"use client";

import Link from "next/link";
import { SquareUser } from "lucide-react";
import { useSession } from "next-auth/react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { cn } from "@/lib/utils";

interface ProfileNavLinkProps {
  href: string;
  className?: string;
  active?: boolean;
  iconSize?: number;
  onHome?: boolean;
}

export function ProfileNavLink({
  href,
  className,
  active = false,
  iconSize = 20,
  onHome = false,
}: ProfileNavLinkProps) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAuthed = Boolean(user?.id || user?.name);

  return (
    <Link
      href={href}
      className={className}
      aria-label={isAuthed ? "Profil" : "Kirish"}
      aria-current={active ? "page" : undefined}
    >
      {isAuthed ? (
        <ProfileAvatar
          name={user?.name}
          phone={user?.phone}
          email={user?.email}
          image={user?.image}
          size="nav"
          active={active}
        />
      ) : status === "loading" ? (
        <span
          className={cn(
            "inline-flex h-7 w-7 shrink-0 animate-pulse rounded-full bg-[#f4a261]/30",
            onHome && "bg-white/30"
          )}
          aria-hidden
        />
      ) : (
        <span
          className={cn(
            "inline-flex items-center justify-center",
            onHome ? "text-white" : "text-gray-600 dark:text-[#f5f0e8]"
          )}
        >
          <SquareUser size={iconSize} strokeWidth={active ? 2.25 : 1.75} />
        </span>
      )}
    </Link>
  );
}
