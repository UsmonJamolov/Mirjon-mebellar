"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";
import {
  agreeToStartWork,
  cancelChatAgreement,
  formatMessageTime,
  formatSketchSummary,
  sendChatMessage,
  updateChatSketch,
  CHAT_STATUS_LABELS,
  type ChatThreadState,
  type SketchData,
} from "@/lib/chat-api";
import { cn } from "@/lib/utils";

const ROLE = "admin" as const;

interface AdminChatPanelProps {
  thread: ChatThreadState | null;
  onThreadUpdate: (t: ChatThreadState) => void;
  onRefresh: () => void;
  /** Mock mijozlar — xabarlar mahalliy saqlanadi (API emas) */
  localMode?: boolean;
}

export function AdminChatPanel({
  thread,
  onThreadUpdate,
  onRefresh,
  localMode = false,
}: AdminChatPanelProps) {
  const [input, setInput] = useState("");
  const [sketchOpen, setSketchOpen] = useState(false);
  const [draftSketch, setDraftSketch] = useState<SketchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sketchForm, setSketchForm] = useState<SketchData>({
    type: "Shkaf",
    length: 200,
    width: 60,
    height: 220,
    material: "MDF 18mm",
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (thread?.activeSketch) setSketchForm({ ...thread.activeSketch.data });
  }, [thread?.activeSketch?.version]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages.length]);

  const send = async () => {
    const text = input.trim();
    if (!text && !draftSketch) return;
    setLoading(true);
    setSendError(null);
    try {
      if (localMode && thread) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender: "admin" as const,
          text: text || (draftSketch ? `📐 ${formatSketchSummary(draftSketch)}` : ""),
          sketch: draftSketch ?? undefined,
          createdAt: new Date().toISOString(),
        };
        onThreadUpdate({
          ...thread,
          messages: [...thread.messages, newMsg],
        });
        setInput("");
        setDraftSketch(null);
        return;
      }

      onThreadUpdate(
        await sendChatMessage(ROLE, { text: text || undefined, sketch: draftSketch ?? undefined })
      );
      setInput("");
      setDraftSketch(null);
      onRefresh();
    } catch (e) {
      setSendError(e instanceof Error ? e.message : "Xabar yuborilmadi");
    } finally {
      setLoading(false);
    }
  };

  const saveSketch = async () => {
    setLoading(true);
    try {
      onThreadUpdate(await updateChatSketch(ROLE, sketchForm));
      setSketchOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAgree = async () => {
    setLoading(true);
    try {
      onThreadUpdate(await agreeToStartWork(ROLE));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAgreement = async () => {
    if (!confirm("Kelishuvni bekor qilasizmi? Mijoz yana eskizni tahrirlashi mumkin bo'ladi.")) return;
    setLoading(true);
    try {
      onThreadUpdate(await cancelChatAgreement());
    } finally {
      setLoading(false);
    }
  };

  if (!thread) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3">
        <p className="text-sm text-gray-500 text-center">
          Chat yuklanmoqda... (mebellar-api :4000 ishlayotganini tekshiring)
        </p>
        <button type="button" onClick={onRefresh} className="btn-primary text-xs py-2 px-4">
          Qayta urinish
        </button>
      </div>
    );
  }

  const myAgreed = thread.adminAgreed;
  const done = thread.status === "buyurtma_boshlandi";

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {!localMode && (
      <div className="px-4 py-2 bg-gray-50 border-b flex flex-wrap gap-2 text-xs shrink-0">
        <span className="font-medium text-[#1e1e2f]">{CHAT_STATUS_LABELS[thread.status]}</span>
        <span className="text-gray-500">
          Mijoz: {thread.customerAgreed ? "✓" : "—"} · Sotuvchi: {thread.adminAgreed ? "✓" : "—"}
        </span>
      </div>
      )}

      {!localMode && (
      <div className="border-b bg-white px-4 py-2 shrink-0">
        <button
          type="button"
          onClick={() => setSketchOpen((o) => !o)}
          className="text-xs font-medium text-[#3b82f6] hover:underline"
        >
          {sketchOpen ? "Eskiz panelini yopish" : "Umumiy eskizni tahrirlash / yuborish"}
        </button>
        {thread.activeSketch && !sketchOpen && (
          <p className="text-xs text-gray-500 mt-1">{formatSketchSummary(thread.activeSketch.data)}</p>
        )}
        {sketchOpen && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
            <input
              className="input-field text-xs"
              value={sketchForm.type}
              onChange={(e) => setSketchForm((s) => ({ ...s, type: e.target.value }))}
            />
            <input
              type="number"
              className="input-field text-xs"
              placeholder="Uzunlik"
              value={sketchForm.length}
              onChange={(e) => setSketchForm((s) => ({ ...s, length: Number(e.target.value) }))}
            />
            <input
              type="number"
              className="input-field text-xs"
              placeholder="Chuqurlik"
              value={sketchForm.width}
              onChange={(e) => setSketchForm((s) => ({ ...s, width: Number(e.target.value) }))}
            />
            <input
              type="number"
              className="input-field text-xs"
              placeholder="Balandlik"
              value={sketchForm.height}
              onChange={(e) => setSketchForm((s) => ({ ...s, height: Number(e.target.value) }))}
            />
            <button type="button" onClick={saveSketch} disabled={loading} className="btn-primary text-xs py-2">
              Saqlash
            </button>
          </div>
        )}
      </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide p-4 space-y-3 bg-[#f5f5f5]">
        {thread.messages.map((m) => (
          <div key={m.id} className={cn("flex", m.sender === "admin" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-[20px] px-4 py-2.5 text-sm shadow-sm",
                m.sender === "admin"
                  ? "bg-[#f4a261] text-white rounded-br-sm"
                  : "bg-white text-[#1e1e2f] rounded-bl-sm"
              )}
            >
              {m.sketch && (
                <div
                  className={cn(
                    "rounded-lg p-2 text-xs mb-2",
                    m.sender === "admin" ? "bg-white/15" : "bg-gray-50 border"
                  )}
                >
                  📐 {formatSketchSummary(m.sketch)}
                </div>
              )}
              {m.text && <p>{m.text}</p>}
              <p className={cn("text-[10px] mt-1", m.sender === "admin" ? "text-white/80" : "text-gray-400")}>
                {formatMessageTime(m.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {!localMode && !done && (
        <div className="px-4 py-2 border-t bg-gray-50 flex flex-wrap justify-between items-center gap-2 shrink-0">
          <p className="text-xs text-gray-500">
            {myAgreed ? "Rozilik berilgan" : "Mijoz bilan kelishgach tasdiqlang"}
          </p>
          <button
            type="button"
            onClick={handleAgree}
            disabled={myAgreed || loading}
            className="btn-primary text-xs py-2 px-3 disabled:opacity-50"
          >
            Ishni boshlashga roziman
          </button>
        </div>
      )}

      {!localMode && done && (
        <div className="px-4 py-2 border-t bg-green-50 shrink-0 space-y-2">
          <p className="text-center text-sm font-medium text-green-800">
            Buyurtma qabul qilindi — mijoz eskizni o&apos;zgartira olmaydi
          </p>
          <button
            type="button"
            onClick={handleCancelAgreement}
            disabled={loading}
            className="w-full rounded-[12px] border border-amber-300 bg-amber-50 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
          >
            Kelishuvni bekor qilish
          </button>
        </div>
      )}

      {!localMode && (thread.customerAgreed || thread.adminAgreed) && !done && (
        <div className="px-4 py-2 border-t bg-amber-50 shrink-0">
          <button
            type="button"
            onClick={handleCancelAgreement}
            disabled={loading}
            className="w-full text-xs font-medium text-amber-800 hover:underline"
          >
            Kelishuvni bekor qilish
          </button>
        </div>
      )}

      {sendError && (
        <p className="px-4 pt-2 text-xs text-red-600 shrink-0">{sendError}</p>
      )}
      <div className="p-4 border-t flex gap-2 bg-white shrink-0">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-gray-200"
          onClick={() =>
            setDraftSketch(
              thread.activeSketch?.data ?? {
                type: "Shkaf",
                length: 200,
                width: 60,
                height: 220,
                material: "MDF 18mm",
              }
            )
          }
          aria-label="Eskiz"
        >
          <Paperclip size={20} />
        </button>
        <input
          className="input-field flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Xabar yozing..."
          disabled={loading}
        />
        <button
          type="button"
          onClick={send}
          disabled={loading || (!input.trim() && !draftSketch)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#3b82f6] text-white shadow-md transition hover:bg-[#2563eb] disabled:opacity-50"
          aria-label="Yuborish"
        >
          <Send size={22} strokeWidth={2.25} className="shrink-0" />
        </button>
      </div>
      {draftSketch && (
        <p className="text-xs text-center text-gray-500 pb-2 shrink-0">
          Yuboriladi: {formatSketchSummary(draftSketch)}{" "}
          <button type="button" className="text-red-500" onClick={() => setDraftSketch(null)}>
            bekor
          </button>
        </p>
      )}
    </div>
  );
}
