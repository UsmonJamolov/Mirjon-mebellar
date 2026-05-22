"use client";

import type { ChatSender, ChatThreadState } from "@/lib/chat-types";

interface ChatAgreementBarProps {
  role: ChatSender;
  thread: ChatThreadState;
  onAgree: () => void;
  loading?: boolean;
}

export function ChatAgreementBar({ role, thread, onAgree, loading }: ChatAgreementBarProps) {
  const myAgreed = role === "customer" ? thread.customerAgreed : thread.adminAgreed;
  const otherAgreed = role === "customer" ? thread.adminAgreed : thread.customerAgreed;
  const done = thread.status === "buyurtma_boshlandi";

  if (done) {
    return (
      <div className="px-4 py-3 bg-green-50 border-t border-green-200 text-center text-sm text-green-800 font-medium">
        Buyurtma qabul qilindi — ish boshlandi
      </div>
    );
  }

  return (
    <div className="px-4 py-3 bg-[#faf8f5] border-t border-[#ebe6df] flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
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
        className="btn-accent text-xs py-2 px-4 disabled:opacity-50 shrink-0"
      >
        {myAgreed ? "Rozilik berilgan" : "Ishni boshlashga roziman"}
      </button>
    </div>
  );
}
