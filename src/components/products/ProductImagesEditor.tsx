"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, Trash2, Upload } from "lucide-react";

interface ProductImagesEditorProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ProductImagesEditor({ images, onChange }: ProductImagesEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [error, setError] = useState("");

  const list = images.filter(Boolean);

  const uploadFile = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Yuklash xatosi");
      }
      onChange([...list, data.url]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rasm yuklanmadi");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const addUrl = () => {
    const url = urlDraft.trim();
    if (!url) return;
    onChange([...list, url]);
    setUrlDraft("");
  };

  const removeAt = (index: number) => {
    onChange(list.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Rasmlar</h2>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {uploading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Yuklanmoqda...
          </>
        ) : (
          <>
            <Upload size={18} />
            Qurilmadan rasm yuklash
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 flex items-center gap-1">
        <ImagePlus size={14} />
        JPG, PNG, WebP — maks. 5 MB
      </p>

      <div className="flex gap-2">
        <input
          className="input-field flex-1"
          placeholder="Yoki URL kiriting (ixtiyoriy)"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
        />
        <button type="button" onClick={addUrl} className="btn-secondary shrink-0 px-3" title="URL qo'shish">
          <Link2 size={18} />
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {list.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {list.map((url, i) => (
            <div key={`${url}-${i}`} className="relative aspect-video rounded-[14px] overflow-hidden bg-gray-100 group">
              <Image src={url} alt="" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white opacity-90 hover:bg-red-600"
                aria-label="Rasmni o'chirish"
              >
                <Trash2 size={14} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-2 left-2 rounded-full bg-[#3b82f6] px-2 py-0.5 text-[10px] font-medium text-white">
                  Asosiy
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
