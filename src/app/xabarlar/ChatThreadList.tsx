"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ChatThread } from "@/lib/types";

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
  onSelect: (id: string) => void;
}

export function ChatThreadList({ threads, selectedId, onSelect }: ChatThreadListProps) {
  return (
    <aside className="flex flex-col h-full min-h-0 border-l border-gray-100 bg-[#f8f9fc]">
      <div className="p-3 border-b border-gray-100 shrink-0">
        <input
          type="search"
          placeholder="Mijoz qidirish..."
          className="w-full rounded-[12px] border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
        />
      </div>

      <ul className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {threads.map((t) => {
          const active = t.id === selectedId;
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onSelect(t.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 text-left transition hover:bg-white/80",
                  active && "bg-white border-l-4 border-l-[#3b82f6] pl-2"
                )}
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200">
                  <Image src={t.avatar} alt="" fill className="object-cover" sizes="48px" />
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
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

/** Mock + jonli thread ro'yxati */
export function buildThreadList(
  live: { customerName: string; lastMessage?: string; time?: string } | null,
  mock: ChatThread[]
): ThreadListItem[] {
  const liveItem: ThreadListItem | null = live
    ? {
        id: "main",
        customerName: live.customerName,
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
        lastMessage: live.lastMessage ?? "Chat boshlandi",
        time: live.time ?? "hozir",
        isLive: true,
        unread: 0,
      }
    : null;

  const mockItems: ThreadListItem[] = mock.map((t) => ({
    id: t.id,
    customerName: t.customerName,
    avatar: t.avatar,
    lastMessage: t.lastMessage,
    time: t.time,
    unread: t.unread,
  }));

  return liveItem ? [liveItem, ...mockItems.filter((m) => m.id !== "main")] : mockItems;
}
