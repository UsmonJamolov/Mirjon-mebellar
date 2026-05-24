"use client";

import Image from "next/image";
import { Settings, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThreadListItem {
  id: string;
  customerName: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isLive?: boolean;
}

interface ChatThreadListProps {
  threads: ThreadListItem[];
  selectedId: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
}

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop";

export function ChatThreadList({
  threads,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelect,
  onDelete,
}: ChatThreadListProps) {
  const filtered = threads.filter((t) =>
    t.customerName.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <aside className="flex flex-col h-full min-h-0 border-l border-gray-100 bg-[#f8f9fc]">
      <div className="p-3 border-b border-gray-100 shrink-0 space-y-2">
        <input
          type="search"
          placeholder="Mijoz qidirish..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-[12px] border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
        />
        <p className="text-[10px] text-gray-400 flex items-center gap-1">
          <Settings size={12} />
          O&apos;chirish: chat ustidagi chiqitish tugmasi (main dan tashqari)
        </p>
      </div>

      <ul className="flex-1 min-h-0 overflow-y-auto scrollbar-hide divide-y divide-gray-100">
        {filtered.map((t) => {
          const active = t.id === selectedId;
          return (
            <li key={t.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(t.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 text-left transition hover:bg-white/80 pr-10",
                  active && "bg-white border-l-4 border-l-[#3b82f6] pl-2"
                )}
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200">
                  <Image
                    src={t.avatar || DEFAULT_AVATAR}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                  {t.isLive && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className={cn("text-sm font-semibold truncate", active && "text-[#3b82f6]")}>
                      {t.customerName}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0">{t.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{t.lastMessage}</p>
                </div>
                {t.unread ? (
                  <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-[#3b82f6] text-white text-[10px] font-bold flex items-center justify-center">
                    {t.unread > 9 ? "9+" : t.unread}
                  </span>
                ) : null}
              </button>
              {onDelete && t.id !== "main" && (
                <button
                  type="button"
                  title="Chatni o'chirish"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`"${t.customerName}" chatini o'chirasizmi?`)) onDelete(t.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="p-6 text-center text-sm text-gray-500">Mijoz topilmadi</li>
        )}
      </ul>
    </aside>
  );
}
