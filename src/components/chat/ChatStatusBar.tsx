"use client";

import { CHAT_STATUS_LABELS, type ChatOrderStatus } from "@/lib/chat-types";

interface ChatStatusBarProps {
  status: ChatOrderStatus;
  customerAgreed: boolean;
  adminAgreed: boolean;
}

export function ChatStatusBar({ status, customerAgreed, adminAgreed }: ChatStatusBarProps) {
  return (
    <div className="px-4 py-2 bg-[#faf8f5] border-b border-[#ebe6df] flex flex-wrap items-center gap-2 text-xs">
      <span
        className={`rounded-full px-2.5 py-1 font-medium ${
          status === "buyurtma_boshlandi"
            ? "bg-green-100 text-green-800"
            : "bg-[#fde8d4] text-[#3d3229]"
        }`}
      >
        {CHAT_STATUS_LABELS[status]}
      </span>
      <span className="text-[#6b5f52]">
        Mijoz: {customerAgreed ? "✓ rozi" : "—"} · Sotuvchi: {adminAgreed ? "✓ rozi" : "—"}
      </span>
    </div>
  );
}
