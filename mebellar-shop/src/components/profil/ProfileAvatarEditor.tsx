"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { cn } from "@/lib/utils";

export function ProfileAvatarEditor() {
  const { data: session, update } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const user = session?.user;
  if (!user) return null;

  const upload = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/user/profile", { method: "PATCH", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Xato yuz berdi");
        return;
      }
      await update({ image: data.image });
    } catch {
      setError("Rasm yuklanmadi");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    setError("");
    setUploading(true);
    try {
      const res = await fetch("/api/user/profile", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Xato yuz berdi");
        return;
      }
      await update({ image: "" });
    } catch {
      setError("Rasm o'chirilmadi");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="relative mx-auto mb-4 inline-block">
        <ProfileAvatar
          name={user.name}
          phone={user.phone}
          email={user.email}
          image={user.image}
          size="lg"
          className="ring-4 ring-[#f4a261]/30"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full",
            "bg-[#f4a261] text-white shadow-md transition hover:bg-[#e88b4a]",
            uploading && "opacity-70"
          )}
          aria-label="Profil rasmini yuklash"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>

      {user.image && (
        <button
          type="button"
          disabled={uploading}
          onClick={removeImage}
          className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400"
        >
          <Trash2 size={14} />
          Rasmni o&apos;chirish
        </button>
      )}

      <p className="text-xs text-gray-500 dark:text-[#b5a898]">
        JPG, PNG yoki WEBP — maks. 2MB
      </p>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
