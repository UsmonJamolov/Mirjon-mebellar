"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { ChatDateSeparator } from "@/components/chat/ChatDateSeparator";
import { SketchMessageCard } from "@/components/chat/SketchMessageCard";
import { ChatAgreementBar } from "@/components/chat/ChatAgreementBar";
import { ChatStatusBar } from "@/components/chat/ChatStatusBar";
import { IconSend } from "@/components/ui/ChatIcons";
import { SketchPreview } from "@/components/sketch/SketchPreview";
import { DimensionInput } from "@/components/sketch/DimensionInput";
import {
  agreeToStartWork,
  cancelChatAgreement,
  formatMessageTime,
  formatSketchSummary,
  sendChatMessage,
  updateChatSketch,
  type ChatThreadState,
  type SketchData,
} from "@/lib/chat-api";
import { formatCustomerPresence, isOrderStarted } from "@/lib/chat-rules";
import { usePresenceTicker } from "@/hooks/usePresenceTicker";
import { formatChatDayLabel, shouldShowChatDaySeparator } from "@/lib/chat-date";
import { getLatestSketchMessageId } from "@/lib/chat-types";
import { cn } from "@/lib/utils";

const ROLE = "admin" as const;

interface AdminChatPanelProps {
  thread: ChatThreadState | null;
  onThreadUpdate: (t: ChatThreadState) => void;
  onRefresh: () => void;
  localMode?: boolean;
}

export function AdminChatPanel({
  thread,
  onThreadUpdate,
  onRefresh,
  localMode = false,
}: AdminChatPanelProps) {
  const [input, setInput] = useState("");
  const [draftSketch, setDraftSketch] = useState<SketchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [openSketch, setOpenSketch] = useState<SketchData | null>(null);
  const [openSketchMessageId, setOpenSketchMessageId] = useState<string | null>(null);
  const [modalDraft, setModalDraft] = useState<SketchData | null>(null);
  const [modalSaving, setModalSaving] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  usePresenceTicker(5000);

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
          text: text || (draftSketch ? "📐 Eskiz yuborildi" : ""),
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
        await sendChatMessage(ROLE, {
          text: text || (draftSketch ? "📐 Eskiz yuborildi" : undefined),
          sketch: draftSketch ?? undefined,
        })
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

  const handleAgree = async (messageId?: string) => {
    setLoading(true);
    try {
      const targetId =
        messageId ?? openSketchMessageId ?? getLatestSketchMessageId(thread?.messages ?? []);
      if (localMode && thread) {
        onThreadUpdate({ ...thread, adminAgreed: true, status: "sotuvchi_rozi" });
        return;
      }
      onThreadUpdate(await agreeToStartWork(ROLE, targetId ?? undefined));
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAgreement = async () => {
    setLoading(true);
    try {
      onThreadUpdate(await cancelChatAgreement());
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  if (!thread) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3 text-center">
        <p className="text-sm text-gray-600 font-medium">Chat tozalandi</p>
        <p className="text-sm text-gray-500 max-w-xs">
          Mijoz yangi xabar yozganda shu yerda ko&apos;rinadi. O&apos;ng tomondan mijozni tanlang.
        </p>
        <button type="button" onClick={onRefresh} className="btn-secondary text-xs py-2 px-4">
          Yangilash
        </button>
      </div>
    );
  }

  const done = isOrderStarted(thread);
  const customerPresence = formatCustomerPresence(
    localMode ? null : thread.customerLastSeenAt
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {!localMode && (
        <ChatStatusBar
          status={thread.status}
          customerAgreed={thread.customerAgreed}
          adminAgreed={thread.adminAgreed}
        />
      )}

      <div className="chat-messages-panel min-h-0 flex-1 p-4 space-y-3 bg-gray-50">
        {thread.messages.map((m, index) => {
          const isOutgoing = m.sender === ROLE;

          return (
            <Fragment key={m.id}>
              {shouldShowChatDaySeparator(thread.messages, index) && (
                <ChatDateSeparator label={formatChatDayLabel(m.createdAt)} />
              )}
              <div className={cn("flex", isOutgoing ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[min(85%,320px)] rounded-[20px] px-4 py-2.5 text-sm text-white shadow-sm",
                    isOutgoing
                      ? "bg-[#f4a261] rounded-br-sm"
                      : "bg-[#f4a261] rounded-bl-sm"
                  )}
                >
                  {m.sketch && (
                    <SketchMessageCard
                      sketch={m.sketch}
                      variant="customer"
                      onOpen={() => {
                        setOpenSketch(m.sketch!);
                        setOpenSketchMessageId(m.id);
                        setModalDraft({ ...m.sketch! });
                      }}
                    />
                  )}
                  {m.text && <p className={m.sketch ? "mt-2 text-white" : "text-white"}>{m.text}</p>}
                  <p className="text-[10px] mt-1.5 text-white/80">
                    {formatMessageTime(m.createdAt)}
                  </p>
                </div>
              </div>
            </Fragment>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {!localMode && (
        <>
          <ChatAgreementBar
            role={ROLE}
            thread={thread}
            onAgree={() => handleAgree()}
            onCancelAgreement={handleCancelAgreement}
            loading={loading}
          />

          {!done && (thread.customerAgreed || thread.adminAgreed) && (
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
        </>
      )}

      <div className="relative border-t bg-white shrink-0">
        {sendError && <p className="px-4 pt-2 text-xs text-red-600">{sendError}</p>}

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

        <div className="p-4 flex flex-wrap gap-2 items-center">
          {!localMode && thread.activeSketch && !draftSketch && (
            <button
              type="button"
              onClick={() => setDraftSketch({ ...thread.activeSketch!.data })}
              className="text-xs font-medium text-[#f4a261] hover:underline shrink-0"
            >
              Eskiz biriktirish
            </button>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && send()}
            placeholder="Xabar yozing..."
            className="input-field flex-1 min-w-[140px] py-2.5 border-[#e5dfd6] focus:border-[#f4a261] focus:ring-[#f4a261]/25"
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

      {openSketch && !localMode && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/35 p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={() => {
            setOpenSketch(null);
            setOpenSketchMessageId(null);
          }}
        >
          <div
            className="w-full max-w-3xl rounded-[22px] bg-white shadow-[0_30px_120px_rgba(0,0,0,0.25)] overflow-hidden"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#ebe6df] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#3d3229]">Eskiz</p>
                <p className="text-[11px] text-[#6b5f52]">
                  {openSketch.type} · {openSketch.length}×{openSketch.width}×{openSketch.height} sm ·{" "}
                  {openSketch.material}
                </p>
              </div>
              <button
                type="button"
                className="h-10 w-10 rounded-[14px] border border-[#ebe6df] text-[#3d3229] hover:bg-[#faf8f5]"
                onClick={() => {
                  setOpenSketch(null);
                  setOpenSketchMessageId(null);
                }}
                aria-label="Yopish"
              >
                ×
              </button>
            </div>
            <div className="grid gap-4 p-4 bg-[#faf8f5] lg:grid-cols-[1.15fr_0.85fr]">
              <div className="bg-white rounded-[18px] border border-[#ebe6df] p-3">
                <SketchPreview
                  length={(modalDraft ?? openSketch).length}
                  width={(modalDraft ?? openSketch).width}
                  height={(modalDraft ?? openSketch).height}
                  type={(modalDraft ?? openSketch).type}
                  material={(modalDraft ?? openSketch).material}
                />
              </div>
              <div className="bg-white rounded-[18px] border border-[#ebe6df] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6b5f52]">
                  Tahrirlash
                </p>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Mahsulot turi</label>
                    <select
                      className="input-field border-[#e5dfd6] focus:border-[#f4a261] focus:ring-[#f4a261]/25"
                      value={(modalDraft ?? openSketch).type}
                      onChange={(e) =>
                        setModalDraft((s) => ({ ...(s ?? openSketch), type: e.target.value }))
                      }
                      disabled={done}
                    >
                      <option>Shkaf</option>
                      <option>Oshxona</option>
                      <option>Stol</option>
                      <option>Divan</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <DimensionInput
                      id="admin-modal-l"
                      label="Uzunlik (sm)"
                      value={(modalDraft ?? openSketch).length}
                      onChange={(n) =>
                        setModalDraft((s) => ({ ...(s ?? openSketch), length: n }))
                      }
                    />
                    <DimensionInput
                      id="admin-modal-w"
                      label="Chuqurlik (sm)"
                      value={(modalDraft ?? openSketch).width}
                      onChange={(n) =>
                        setModalDraft((s) => ({ ...(s ?? openSketch), width: n }))
                      }
                    />
                    <DimensionInput
                      id="admin-modal-h"
                      label="Balandlik (sm)"
                      value={(modalDraft ?? openSketch).height}
                      onChange={(n) =>
                        setModalDraft((s) => ({ ...(s ?? openSketch), height: n }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Material</label>
                    <select
                      className="input-field border-[#e5dfd6] focus:border-[#f4a261] focus:ring-[#f4a261]/25"
                      value={(modalDraft ?? openSketch).material}
                      onChange={(e) =>
                        setModalDraft((s) => ({
                          ...(s ?? openSketch),
                          material: e.target.value,
                        }))
                      }
                      disabled={done}
                    >
                      <option>MDF 18mm</option>
                      <option>MDF 16mm</option>
                      <option>Laminat</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className="btn-accent w-full"
                    disabled={modalSaving || done || !modalDraft}
                    onClick={async () => {
                      if (!modalDraft) return;
                      setModalSaving(true);
                      try {
                        onThreadUpdate(await updateChatSketch(ROLE, modalDraft));
                        setOpenSketch(modalDraft);
                        setSendError(null);
                        onRefresh();
                      } catch {
                        setSendError("Eskiz saqlanmadi.");
                      } finally {
                        setModalSaving(false);
                      }
                    }}
                  >
                    {modalSaving ? "Saqlanmoqda..." : "Saqlash va chatga yuborish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
