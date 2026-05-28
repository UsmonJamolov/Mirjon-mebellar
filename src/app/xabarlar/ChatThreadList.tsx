"use client";

import { Trash2 } from "lucide-react";
import { ChatAvatar } from "@/components/chat/ChatAvatar";
import type { ChatOrderStatus } from "@/lib/chat-types";
import { formatCustomerDisplayName } from "@/lib/chat-customer";
import { cn } from "@/lib/utils";

export interface ThreadListItem {
  id: string;
  customerName: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerPhone?: string;
  customerAvatar?: string;
  customerTelegramUsername?: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isLive?: boolean;
  status?: ChatOrderStatus;
}

interface ChatThreadListProps {
  threads: ThreadListItem[];
  selectedId: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
}

function resolveDisplayName(t: ThreadListItem) {
  const fromParts = formatCustomerDisplayName(
    t.customerFirstName,
    t.customerLastName,
    ""
  );
  if (fromParts) return fromParts;
  const legacy = t.customerName?.trim();
  if (legacy && legacy !== "Mijoz") return legacy;
  return "Mijoz";
}

export function ChatThreadList({
  threads,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelect,
  onDelete,
}: ChatThreadListProps) {
  const q = searchQuery.trim().toLowerCase();
  const filtered = threads.filter((t) => {
    if (!q) return true;
    const phone = (t.customerPhone ?? "").replace(/\D/g, "");
    const qDigits = q.replace(/\D/g, "");
    const displayName = resolveDisplayName(t);
    return (
      displayName.toLowerCase().includes(q) ||
      (t.customerPhone ?? "").toLowerCase().includes(q) ||
      (qDigits.length > 0 && phone.includes(qDigits)) ||
      t.lastMessage.toLowerCase().includes(q)
    );
  });

  return (
    <aside className="flex flex-col h-full min-h-0 border-l border-gray-200 bg-[#f4f4f5]">
      <div className="p-3 border-b border-gray-200 shrink-0 bg-white">
        <input
          type="search"
          placeholder="Qidiruv"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-[#f4f4f5] px-3 py-2.5 text-sm outline-none focus:border-[#3b82f6] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/15"
        />
      </div>

      <ul className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        {filtered.map((t) => {
          const active = t.id === selectedId;
          const displayName = resolveDisplayName(t);
          const unread = t.unread ?? 0;

          return (
            <li key={t.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(t.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                  active ? "bg-[#3390ec]/12" : "bg-white hover:bg-[#f4f4f5]"
                )}
              >
                <ChatAvatar
                  name={displayName}
                  imageUrl={t.customerAvatar}
                  size="md"
                  online={t.isLive}
                />

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-[15px] font-semibold truncate leading-tight",
                      active ? "text-[#3390ec]" : "text-[#000]"
                    )}
                  >
                    {displayName}
                  </p>
                  <p
                    className={cn(
                      "text-[14px] truncate mt-0.5 leading-snug",
                      unread > 0 ? "text-[#000] font-medium" : "text-[#707579]"
                    )}
                  >
                    {t.lastMessage}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-end self-start pt-0.5 gap-1.5 min-w-[42px]">
                  <span
                    className={cn(
                      "text-xs tabular-nums leading-none",
                      unread > 0 ? "text-[#3390ec] font-medium" : "text-[#999]"
                    )}
                  >
                    {t.time}
                  </span>
                  {unread > 0 ? (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#3390ec] text-white text-xs font-semibold flex items-center justify-center">
                      {unread > 99 ? "99+" : unread}
                    </span>
                  ) : (
                    <span className="h-5" aria-hidden />
                  )}
                </div>
              </button>
              {onDelete && (
                <button
                  type="button"
                  title={t.id === "main" ? "Chatni tozalash" : "O'chirish"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(t.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="p-8 text-center text-sm text-gray-500 bg-white m-3 rounded-xl">
            {searchQuery.trim()
              ? "Mijoz topilmadi"
              : "Chatlar yo'q. Mijoz yozganda shu yerda ko'rinadi."}
          </li>
        )}
      </ul>
    </aside>
  );
}
