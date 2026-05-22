"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SketchAttachPanel } from "@/components/chat/SketchAttachPanel";
import { SketchMessageCard } from "@/components/chat/SketchMessageCard";
import { ChatAgreementBar } from "@/components/chat/ChatAgreementBar";
import { ChatStatusBar } from "@/components/chat/ChatStatusBar";
import { CollaborativeSketchPanel } from "@/components/chat/CollaborativeSketchPanel";
import { IconPaperclip, IconRuler, IconSend, SupportAvatar } from "@/components/ui/ChatIcons";
import {
  agreeToStartWork,
  fetchChatThread,
  sendChatMessage,
  updateChatSketch,
} from "@/lib/chat-client";
import { consumePendingSketch } from "@/lib/sketch-storage";
import type { ChatThreadState } from "@/lib/chat-types";
import { formatMessageTime } from "@/lib/chat-types";
import type { SketchData } from "@/lib/sketch-types";
import { formatSketchSummary } from "@/lib/sketch-types";

const ROLE = "customer" as const;

export function ChatPageContent() {
  const searchParams = useSearchParams();
  const [thread, setThread] = useState<ChatThreadState | null>(null);
  const [input, setInput] = useState("");
  const [draftSketch, setDraftSketch] = useState<SketchData | null>(null);
  const [attachOpen, setAttachOpen] = useState(false);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const attachRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchChatThread();
      setThread(data);
    } catch {
      /* retry on poll */
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 2500);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (searchParams.get("eskiz") !== "1") return;
    const pending = consumePendingSketch();
    if (pending) setDraftSketch(pending);
  }, [searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages.length]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (attachRef.current && !attachRef.current.contains(e.target as Node)) {
        setAttachMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text && !draftSketch) return;
    setLoading(true);
    try {
      const state = await sendChatMessage(ROLE, { text: text || undefined, sketch: draftSketch ?? undefined });
      setThread(state);
      setInput("");
      setDraftSketch(null);
      setAttachOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSketchSave = async (sketch: SketchData) => {
    setLoading(true);
    try {
      const state = await updateChatSketch(ROLE, sketch);
      setThread(state);
    } finally {
      setLoading(false);
    }
  };

  const handleAgree = async () => {
    setLoading(true);
    try {
      const state = await agreeToStartWork(ROLE);
      setThread(state);
    } finally {
      setLoading(false);
    }
  };

  if (!thread) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center text-sm text-gray-500">
        Chat yuklanmoqda...
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)] py-4">
      <div className="card flex-1 flex flex-col overflow-hidden p-0">
        <div className="p-4 border-b flex items-center gap-3 bg-white">
          <SupportAvatar />
          <div>
            <p className="font-semibold text-sm">Mebellar qo&apos;llab-quvvatlash</p>
            <p className="text-xs text-green-600">Onlayn</p>
          </div>
        </div>

        <ChatStatusBar
          status={thread.status}
          customerAgreed={thread.customerAgreed}
          adminAgreed={thread.adminAgreed}
        />

        <CollaborativeSketchPanel
          role={ROLE}
          activeSketch={thread.activeSketch}
          onSave={handleSketchSave}
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {thread.messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "customer" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[min(85%,320px)] rounded-[20px] px-4 py-2.5 text-sm shadow-sm ${
                  m.sender === "customer"
                    ? "bg-[#f4a261] text-white rounded-br-sm"
                    : "bg-white text-[#3d3229] rounded-bl-sm border border-[#ebe6df]"
                }`}
              >
                {m.sketch && (
                  <SketchMessageCard sketch={m.sketch} variant={m.sender} />
                )}
                {m.text && <p className={m.sketch ? "mt-2" : ""}>{m.text}</p>}
                <p
                  className={`text-[10px] mt-1.5 ${
                    m.sender === "customer" ? "text-white/80" : "text-gray-400"
                  }`}
                >
                  {formatMessageTime(m.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <ChatAgreementBar role={ROLE} thread={thread} onAgree={handleAgree} loading={loading} />

        <div className="relative border-t bg-white">
          {draftSketch && (
            <div className="px-4 pt-3 flex items-start gap-2 border-b border-[#f5f0e8]">
              <div className="flex-1 min-w-0 rounded-[14px] bg-[#faf8f5] border border-[#ebe6df] px-3 py-2">
                <p className="text-[10px] font-semibold text-[#f4a261] uppercase tracking-wide mb-0.5">
                  Yuboriladigan eskiz
                </p>
                <p className="text-xs text-[#3d3229] truncate">{formatSketchSummary(draftSketch)}</p>
              </div>
              <button
                type="button"
                onClick={() => setDraftSketch(null)}
                className="shrink-0 text-gray-400 hover:text-[#3d3229] text-lg px-1"
                aria-label="Olib tashlash"
              >
                ×
              </button>
            </div>
          )}

          {attachOpen && (
            <div className="px-4 pt-3 relative">
              <SketchAttachPanel
                initial={draftSketch}
                onAttach={(s) => {
                  setDraftSketch(s);
                  setAttachOpen(false);
                }}
                onClose={() => setAttachOpen(false)}
              />
            </div>
          )}

          <div className="p-4 flex gap-2" ref={attachRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setAttachMenuOpen((o) => !o);
                  setAttachOpen(false);
                }}
                className="btn-icon h-11 w-11 rounded-[14px] border border-gray-200 text-gray-500 hover:bg-gray-50"
                aria-label="Biriktirish"
              >
                <IconPaperclip size={20} />
              </button>
              {attachMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-48 rounded-[14px] border border-[#ebe6df] bg-white py-1 shadow-lg z-30">
                  <button
                    type="button"
                    onClick={() => {
                      setAttachMenuOpen(false);
                      setAttachOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-[#faf8f5]"
                  >
                    <IconRuler size={18} className="text-[#f4a261]" />
                    Eskiz yuborish
                  </button>
                </div>
              )}
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && send()}
              placeholder="Xabar yozing..."
              className="input-field flex-1 py-2.5"
              disabled={loading}
            />
            <button
              type="button"
              onClick={send}
              disabled={loading || (!input.trim() && !draftSketch)}
              className="btn-icon-accent disabled:opacity-50"
              aria-label="Yuborish"
            >
              <IconSend size={20} />
            </button>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center mt-3">
        Xabarlar saqlanadi · Admin bilan sinxron (har 2.5s)
      </p>
    </main>
  );
}
