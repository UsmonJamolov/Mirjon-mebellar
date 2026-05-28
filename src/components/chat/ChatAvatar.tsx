import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  getAvatarColor,
  getInitials,
  isValidAvatarUrl,
} from "@/lib/chat-avatar";

interface ChatAvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
  className?: string;
}

const sizes = {
  sm: "h-10 w-10 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-14 w-14 text-base",
};

export function ChatAvatar({
  name,
  imageUrl,
  size = "md",
  online,
  className,
}: ChatAvatarProps) {
  const displayName = name.trim() || "Mijoz";
  const initials = getInitials(displayName);
  const color = getAvatarColor(displayName);
  const showImage = isValidAvatarUrl(imageUrl);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        sizes[size],
        className
      )}
    >
      {showImage ? (
        <Image
          src={imageUrl!}
          alt={displayName}
          fill
          className="object-cover"
          sizes="56px"
          unoptimized={imageUrl!.startsWith("http://localhost")}
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {initials}
        </span>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
      )}
    </div>
  );
}
