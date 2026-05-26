"use client";

import type { ChatSender, ChatThreadState } from "@/lib/chat-types";
import { isOrderStarted } from "@/lib/chat-rules";

interface ChatAgreementBarProps {
  role: ChatSender;
  thread: ChatThreadState;
  onAgree: () => void;
  onNewOrder?: () => void;
  loading?: boolean;
}

export function ChatAgreementBar({
  role,
  thread,
  onAgree,
  onNewOrder,
  loading,
}: ChatAgreementBarProps) {
  const myAgreed = role === "customer" ? thread.customerAgreed : thread.adminAgreed;
  const otherAgreed = role === "customer" ? thread.adminAgreed : thread.customerAgreed;
  const done = isOrderStarted(thread);

  if (done && role === "customer") {
    return (
      <div className="space-y-0 border-t border-green-200 bg-green-50">
        <div className="px-4 py-3 text-center text-sm font-medium text-green-800">
          Buyurtma qabul qilindi — ish boshlandi
          {thread.orderRound && thread.orderRound > 1 ? ` (#${thread.orderRound})` : ""}
        </div>
        {onNewOrder && (
          <div className="border-t border-green-200/80 px-4 py-3">
            <p className="mb-2 text-center text-xs text-green-900">
              Yangi mebel buyurtmasi uchun yangi eskiz va kelishuv kerakmi?
            </p>
            <button
              type="button"
              onClick={onNewOrder}
              disabled={loading}
              className="btn-accent w-full py-2.5 text-sm disabled:opacity-50"
            >
              Yangi buyurtma boshlash
            </button>
          </div>
        )}
      </div>
    );
  }

  if (done) {
    return (
      <div className="border-t border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800">
        Buyurtma qabul qilindi — ish boshlandi
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 border-t border-[#ebe6df] bg-[#faf8f5] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-[#6b5f52]">
        {myAgreed
          ? "Siz rozi bildingiz. Ikkinchi tomon tasdigini kuting."
          : otherAgreed
            ? "Boshqa tomon rozi. Siz ham tasdiqlang."
            : "Eskiz va shartlar kelishilgach, ishni boshlashga rozi ekanligingizni bildiring."}
      </p>
      <button
        type="button"
        onClick={onAgree}
        disabled={myAgreed || loading}
        className={`shrink-0 px-4 py-2 text-xs disabled:opacity-100 ${
          myAgreed ? "btn-success" : "btn-accent"
        }`}
      >
        {myAgreed ? "Rozilik berilgan" : "Ishni boshlashga roziman"}
      </button>
    </div>
  );
}
