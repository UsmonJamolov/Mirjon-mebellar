"use client";

import Image from "next/image";
import { SquareUser } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProfileInitial } from "@/lib/profile";

const sizes = {
  nav: "h-7 w-7 text-[11px]",
  sm: "h-9 w-9 text-sm",
  md: "h-11 w-11 text-base",
  lg: "h-24 w-24 text-3xl",
} as const;

type ProfileAvatarSize = keyof typeof sizes;

interface ProfileAvatarProps {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  image?: string | null;
  size?: ProfileAvatarSize;
  active?: boolean;
  className?: string;
  showFallbackIcon?: boolean;
}

export function ProfileAvatar({
  name,
  phone,
  email,
  image,
  size = "sm",
  active = false,
  className,
  showFallbackIcon = false,
}: ProfileAvatarProps) {
  const initial = getProfileInitial(name, phone, email);
  const sizeClass = sizes[size];
  const ringClass = active ? "ring-2 ring-[#f4a261] ring-offset-1 ring-offset-transparent" : "";

  if (image) {
    return (
      <span
        className={cn(
          "relative inline-flex shrink-0 overflow-hidden rounded-full bg-[#f4a261]",
          sizeClass,
          ringClass,
          className
        )}
      >
        <Image
          src={image}
          alt={name ? `${name} profil` : "Profil"}
          fill
          className="object-cover"
          sizes="96px"
          unoptimized
        />
      </span>
    );
  }

  if (showFallbackIcon && !name) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full text-[#c97b3f]",
          sizeClass,
          className
        )}
      >
        <SquareUser
          size={size === "nav" ? 20 : size === "lg" ? 40 : 22}
          strokeWidth={active ? 2.25 : 1.75}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-[#f4a261] font-bold text-white",
        sizeClass,
        ringClass,
        className
      )}
      aria-hidden={!name}
    >
      {initial}
    </span>
  );
}
