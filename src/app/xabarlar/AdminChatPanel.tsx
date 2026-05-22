"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";
import {
  agreeToStartWork,
  fetchChatThread,
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

export function AdminChatPanel() {
  const [thread, setThread] = useState<ChatThreadState | null>(null);
  const [input, setInput] = useState("");
  const [sketchOpen, setSketchOpen] = useState(false);
  const [draftSketch, setDraftSketch] = useState<SketchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [sketchForm, setSketchForm] = useState<SketchData>({
    type: "Shkaf",
    length: 200,
    width: 60,
    height: 220,
    material: "MDF 18mm",
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      setThread(await fetchChatThread());
    } catch {
      /* shop server off */
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 2500);
    return () => clearInterval(id);
  }, [load]);

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
    try {
      setThread(await sendChatMessage(ROLE, { text: text || undefined, sketch: draftSketch ?? undefined }));
      setInput("");
      setDraftSketch(null);
    } finally {
      setLoading(false);
    }
  };

  const saveSketch = async () => {
    setLoading(true);
    try {
      setThread(await updateChatSketch(ROLE, sketchForm));
      setSketchOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAgree = async () => {
    setLoading(true);
    try {
      setThread(await agreeToStartWork(ROLE));
    } finally {
      setLoading(false);
    }
  };

  if (!thread) {
    return (
      <p className="p-8 text-center text-sm text-gray-500">
        Chat yuklanmoqda... (mebellar-shop :3001 ishlayotganini tekshiring)
      </p>
    );
  }

  const myAgreed = thread.adminAgreed;
  const done = thread.status === "buyurtma_boshlandi";

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-4 py-2 bg-gray-50 border-b flex flex-wrap gap-2 text-xs">
        <span className="font-medium text-[#1e1e2f]">{CHAT_STATUS_LABELS[thread.status]}</span>
        <span className="text-gray-500">
          Mijoz: {thread.customerAgreed ? "✓" : "—"} · Sotuvchi: {thread.adminAgreed ? "✓" : "—"}
        </span>
      </div>

      <div className="border-b bg-white px-4 py-2">
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

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f5f5f5]">
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

      {!done && (
        <div className="px-4 py-2 border-t bg-gray-50 flex justify-between items-center gap-2">
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

      {done && (
        <div className="px-4 py-2 border-t bg-green-50 text-center text-sm text-green-800 font-medium">
          Buyurtma qabul qilindi
        </div>
      )}

      <div className="p-4 border-t flex gap-2 bg-white">
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
          disabled={loading}
          className="btn-primary flex h-11 w-11 items-center justify-center p-0"
        >
          <Send size={18} />
        </button>
      </div>
      {draftSketch && (
        <p className="text-xs text-center text-gray-500 pb-2">
          Yuboriladi: {formatSketchSummary(draftSketch)}{" "}
          <button type="button" className="text-red-500" onClick={() => setDraftSketch(null)}>
            bekor
          </button>
        </p>
      )}
    </div>
  );
}
