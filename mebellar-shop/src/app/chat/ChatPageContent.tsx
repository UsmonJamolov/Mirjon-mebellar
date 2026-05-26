"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { estimateSketchTotal } from "@/lib/order-persistence";
import { ChatDateSeparator } from "@/components/chat/ChatDateSeparator";
import { SketchMessageCard } from "@/components/chat/SketchMessageCard";
import { ChatAgreementBar } from "@/components/chat/ChatAgreementBar";
import { ChatStatusBar } from "@/components/chat/ChatStatusBar";
import { IconSend, SupportAvatar } from "@/components/ui/ChatIcons";
import {
  agreeToStartWork,
  deleteChatMessage,
  fetchChatThread,
  sendCustomerHeartbeat,
  sendChatMessage,
  startNewChatOrder,
  updateChatSketch,
} from "@/lib/chat-client";
import {
  formatAdminPresence,
  isOrderStarted,
  isSketchLockedForCustomer,
} from "@/lib/chat-rules";
import { consumePendingSketch } from "@/lib/sketch-storage";
import type { ChatThreadState } from "@/lib/chat-types";
import {
  formatMessageTime,
  getLatestSketchMessageId,
  isAgreedMessageId,
  isAgreedSketchMessage,
} from "@/lib/chat-types";
import type { SketchData } from "@/lib/sketch-types";
import { formatSketchSummary } from "@/lib/sketch-types";
import { SketchPreview } from "@/components/sketch/SketchPreview";
import { DimensionInput } from "@/components/sketch/DimensionInput";
import { usePresenceTicker } from "@/hooks/usePresenceTicker";
import { formatChatDayLabel, shouldShowChatDaySeparator } from "@/lib/chat-date";

const ROLE = "customer" as const;

export function ChatPageContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { addChatOrderItem } = useCart();
  const customerMeta = useMemo(
    () => ({
      customerName: session?.user?.name ?? undefined,
      customerPhone: session?.user?.phone ?? undefined,
    }),
    [session?.user?.name, session?.user?.phone]
  );
  const cartSyncedRef = useRef<string | null>(null);
  const [thread, setThread] = useState<ChatThreadState | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [draftSketch, setDraftSketch] = useState<SketchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pendingSentRef = useRef(false);
  const [openSketch, setOpenSketch] = useState<SketchData | null>(null);
  const [openSketchMessageId, setOpenSketchMessageId] = useState<string | null>(null);
  const [modalDraft, setModalDraft] = useState<SketchData | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  const pollRef = useRef(false);
  usePresenceTicker(5000);

  const load = useCallback(async (silent = false) => {
    if (pollRef.current) return;
    pollRef.current = true;
    try {
      const data = await fetchChatThread();
      setThread((prev) => {
        if (!prev) return data;
        const lastPrev = prev.messages[prev.messages.length - 1]?.id;
        const lastNew = data.messages[data.messages.length - 1]?.id;
        const same =
          prev.messages.length === data.messages.length &&
          lastPrev === lastNew &&
          prev.status === data.status &&
          prev.customerAgreed === data.customerAgreed &&
          prev.adminAgreed === data.adminAgreed &&
          prev.agreedMessageId === data.agreedMessageId &&
          prev.activeSketch?.version === data.activeSketch?.version &&
          prev.adminLastSeenAt === data.adminLastSeenAt &&
          prev.customerLastSeenAt === data.customerLastSeenAt;
        return same ? prev : data;
      });
      setLoadError(null);
    } catch {
      if (!silent) {
        setLoadError("Chat yuklanmadi. Sahifani yangilang yoki qayta urinib ko'ring.");
      }
    } finally {
      pollRef.current = false;
    }
  }, []);

  useEffect(() => {
    const refresh = async (silent: boolean) => {
      if (document.visibilityState === "hidden") return;
      try {
        const data = await sendCustomerHeartbeat();
        setThread((prev) => {
          if (!prev) return data;
          const lastPrev = prev.messages[prev.messages.length - 1]?.id;
          const lastNew = data.messages[data.messages.length - 1]?.id;
          const same =
            prev.messages.length === data.messages.length &&
            lastPrev === lastNew &&
            prev.status === data.status &&
            prev.customerAgreed === data.customerAgreed &&
            prev.adminAgreed === data.adminAgreed &&
            prev.agreedMessageId === data.agreedMessageId &&
            prev.activeSketch?.version === data.activeSketch?.version &&
            prev.adminLastSeenAt === data.adminLastSeenAt &&
            prev.customerLastSeenAt === data.customerLastSeenAt;
          return same ? prev : data;
        });
        setLoadError(null);
      } catch {
        if (!silent) load(false);
        else load(true);
      }
    };

    refresh(false);
    const POLL_MS = 4000;
    const id = setInterval(() => refresh(true), POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh(true);
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  useEffect(() => {
    if (searchParams.get("eskiz") !== "1") return;
    const pending = consumePendingSketch();
    if (pending) setDraftSketch(pending);
  }, [searchParams]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [thread?.messages.length]);

  useEffect(() => {
    if (!thread || thread.status !== "buyurtma_boshlandi") return;
    const key = `chat-round-${thread.orderRound ?? 1}`;
    if (cartSyncedRef.current === key) return;
    cartSyncedRef.current = key;
    const sketch = thread.activeSketch?.data;
    const name = sketch
      ? `${sketch.type} · ${sketch.length}×${sketch.width}×${sketch.height} sm`
      : "Chat buyurtmasi";
    addChatOrderItem({
      productId: key,
      name,
      price: estimateSketchTotal(sketch),
    });
  }, [thread, addChatOrderItem]);

  // Eskiz faqat /eskiz sahifasidan yuboriladi. Chat ochilganda avtomatik yuboramiz.
  useEffect(() => {
    if (!thread) return;
    if (pendingSentRef.current) return;
    if (searchParams.get("eskiz") !== "1") return;
    if (!draftSketch) return;

    pendingSentRef.current = true;
    (async () => {
      setLoading(true);
      try {
        const state = await sendChatMessage(ROLE, {
          text: "📐 Eskiz yuborildi",
          sketch: draftSketch,
          ...customerMeta,
        });
        setThread(state);
        setDraftSketch(null);
        setInput("");
      } catch {
        setSendError("Eskiz yuborilmadi. Qayta urinib ko'ring.");
        pendingSentRef.current = false;
      } finally {
        setLoading(false);
      }
    })();
  }, [draftSketch, searchParams, thread]);

  const send = async () => {
    const text = input.trim();
    if (!text && !draftSketch) return;
    setLoading(true);
    try {
      const state = await sendChatMessage(ROLE, {
        text: text || undefined,
        sketch: draftSketch ?? undefined,
        ...customerMeta,
      });
      setThread(state);
      setInput("");
      setDraftSketch(null);
      setSendError(null);
    } catch {
      setSendError("Xabar yuborilmadi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleAgree = async (messageId?: string) => {
    setLoading(true);
    try {
      const targetId =
        messageId ?? openSketchMessageId ?? getLatestSketchMessageId(thread?.messages ?? []);
      const state = await agreeToStartWork(ROLE, targetId ?? undefined, customerMeta);
      setThread(state);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setLoading(true);
    try {
      const state = await deleteChatMessage(ROLE, messageId);
      setThread(state);
      if (openSketchMessageId === messageId) {
        setOpenSketch(null);
        setOpenSketchMessageId(null);
        setModalDraft(null);
      }
      setSendError(null);
    } catch {
      setSendError("Eskiz o'chirilmadi. Rozilik berilgan eskizni o'chirib bo'lmaydi.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = async () => {
    setLoading(true);
    try {
      const state = await startNewChatOrder();
      setThread(state);
    } finally {
      setLoading(false);
    }
  };

  const presence = formatAdminPresence(thread?.adminLastSeenAt);
  const sketchLocked = thread ? isSketchLockedForCustomer(thread) : false;
  const modalIsAgreedSketch = Boolean(
    thread && openSketchMessageId && isAgreedMessageId(openSketchMessageId, thread)
  );

  if (!thread) {
    return (
      <main className="flex h-full min-h-0 flex-col items-center justify-center px-4 text-center">
        {loadError ? (
          <>
            <p className="text-sm text-red-600 mb-4">{loadError}</p>
            <button type="button" onClick={() => load()} className="btn-accent text-sm">
              Qayta urinish
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-500">Chat yuklanmoqda...</p>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col px-3 py-2 sm:px-6 sm:py-3">
      <div className="card flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center gap-3 border-b bg-white p-4 dark:bg-[#2a221c]">
          <SupportAvatar />
          <div>
            <p className="font-semibold text-sm">Mebellar qo&apos;llab-quvvatlash</p>
            <p className={`text-xs ${presence.className}`}>
              <span
                className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                  presence.online ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {presence.label}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <ChatStatusBar
            status={thread.status}
            customerAgreed={thread.customerAgreed}
            adminAgreed={thread.adminAgreed}
          />
        </div>

        <div
          ref={messagesRef}
          className="chat-messages-panel min-h-0 flex-1 overscroll-contain p-4 space-y-3 bg-gray-50"
        >
          {thread.messages.map((m, index) => {
            const isOutgoing = m.sender === ROLE;
            const isAgreed = isOutgoing && isAgreedSketchMessage(m, thread);

            return (
            <Fragment key={m.id}>
              {shouldShowChatDaySeparator(thread.messages, index) && (
                <ChatDateSeparator label={formatChatDayLabel(m.createdAt)} />
              )}
            <div
              className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[min(85%,320px)] rounded-[20px] px-4 py-2.5 text-sm text-white shadow-sm ${
                  isAgreed
                    ? "bg-green-600 rounded-br-sm"
                    : isOutgoing
                      ? "bg-[#f4a261] rounded-br-sm"
                      : "bg-[#f4a261] rounded-bl-sm"
                }`}
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
                    onDelete={
                      m.sender === "customer"
                        ? () => handleDeleteMessage(m.id)
                        : undefined
                    }
                    deleteDisabled={
                      loading ||
                      isOrderStarted(thread) ||
                      isAgreedSketchMessage(m, thread)
                    }
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

        <div className="shrink-0">
          <ChatAgreementBar
            role={ROLE}
            thread={thread}
            onAgree={handleAgree}
            onNewOrder={handleNewOrder}
            loading={loading}
          />
        </div>

        <div className="relative shrink-0 border-t bg-white dark:bg-[#2a221c]">
          {sendError && (
            <p className="px-4 pt-2 text-xs text-red-600">{sendError}</p>
          )}
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

          <div className="p-4 flex gap-2">
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

      {openSketch && (
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
                  {openSketch.type} · {openSketch.length}×{openSketch.width}×{openSketch.height} sm · {openSketch.material}
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
                      className="input-field"
                      value={(modalDraft ?? openSketch).type}
                      onChange={(e) =>
                        setModalDraft((s) => ({ ...(s ?? openSketch), type: e.target.value }))
                      }
                      disabled={sketchLocked}
                    >
                      <option>Shkaf</option>
                      <option>Oshxona</option>
                      <option>Stol</option>
                      <option>Divan</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <DimensionInput
                      id="modal-sketch-l"
                      label="Uzunlik (sm)"
                      value={(modalDraft ?? openSketch).length}
                      onChange={(n) =>
                        setModalDraft((s) => ({ ...(s ?? openSketch), length: n }))
                      }
                    />
                    <DimensionInput
                      id="modal-sketch-w"
                      label="Chuqurlik (sm)"
                      value={(modalDraft ?? openSketch).width}
                      onChange={(n) =>
                        setModalDraft((s) => ({ ...(s ?? openSketch), width: n }))
                      }
                    />
                    <DimensionInput
                      id="modal-sketch-h"
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
                      className="input-field"
                      value={(modalDraft ?? openSketch).material}
                      onChange={(e) =>
                        setModalDraft((s) => ({
                          ...(s ?? openSketch),
                          material: e.target.value,
                        }))
                      }
                      disabled={sketchLocked}
                    >
                      <option>MDF 18mm</option>
                      <option>MDF 16mm</option>
                      <option>Laminat</option>
                    </select>
                  </div>

                  {sketchLocked ? (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-[14px] p-3">
                      Kelishuv tasdiqlangan — eskizni faqat sotuvchi o&apos;zgartiradi.
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      className="btn-outline flex-1 min-w-[140px]"
                      disabled={modalSaving || sketchLocked || !modalDraft}
                      onClick={async () => {
                        if (!modalDraft) return;
                        setModalSaving(true);
                        try {
                          const state = await updateChatSketch(ROLE, modalDraft);
                          setThread(state);
                          setOpenSketch(modalDraft);
                          setSendError(null);
                        } catch {
                          setSendError("Eskiz saqlanmadi. Qayta urinib ko'ring.");
                        } finally {
                          setModalSaving(false);
                        }
                      }}
                    >
                      {modalSaving ? "Saqlanmoqda..." : "Saqlash"}
                    </button>
                    <button
                      type="button"
                      className={`flex-1 min-w-[140px] ${
                        modalIsAgreedSketch ? "btn-success" : "btn-accent"
                      }`}
                      disabled={loading || thread.customerAgreed}
                      onClick={() => handleAgree(openSketchMessageId ?? undefined)}
                    >
                      {modalIsAgreedSketch ? "Siz rozi bo'lgansiz" : "Ishni boshlash"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
