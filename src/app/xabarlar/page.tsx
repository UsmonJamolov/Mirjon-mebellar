"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  deleteChatThread,
  fetchChatThread,
  formatMessageTime,
  sendAdminHeartbeat,
  type ChatThreadState,
} from "@/lib/chat-api";
import { adminApi } from "@/lib/api";
import { AdminChatPanel } from "./AdminChatPanel";
import { ChatThreadList, type ThreadListItem } from "./ChatThreadList";
import { createInitialDemoThreads } from "./demo-threads";
import { formatCustomerPresence } from "@/lib/chat-rules";
import { usePresenceTicker } from "@/hooks/usePresenceTicker";
import { Trash2 } from "lucide-react";
import { ChatAvatar } from "@/components/chat/ChatAvatar";
import { CustomerProfileModal } from "@/components/chat/CustomerProfileModal";
import { formatCustomerDisplayName } from "@/lib/chat-customer";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState("main");
  const [liveThread, setLiveThread] = useState<ChatThreadState | null>(null);
  const [demoThreads, setDemoThreads] = useState<Record<string, ChatThreadState>>(createInitialDemoThreads);
  const [listItems, setListItems] = useState<ThreadListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  usePresenceTicker(5000);

  const refreshLive = useCallback(async () => {
    try {
      setLiveThread(await sendAdminHeartbeat());
    } catch {
      try {
        setLiveThread(await fetchChatThread());
      } catch {
        /* API off */
      }
    }
  }, []);

  const loadThreads = useCallback(async () => {
    try {
      const apiThreads = await adminApi.getChatThreads();
      setListItems(apiThreads);
    } catch {
      if (liveThread?.cleared) {
        setListItems([]);
        return;
      }
      const last = liveThread?.messages[liveThread.messages.length - 1];
      if (liveThread) {
        setListItems([
          {
            id: "main",
            customerName:
              [liveThread.customerFirstName, liveThread.customerLastName]
                .filter(Boolean)
                .join(" ")
                .trim() ||
              liveThread.customerName?.trim() ||
              "Mijoz",
            customerFirstName: liveThread.customerFirstName ?? "",
            customerLastName: liveThread.customerLastName ?? "",
            customerPhone: liveThread.customerPhone ?? "",
            customerAvatar: liveThread.customerAvatar ?? "",
            customerTelegramUsername: liveThread.customerTelegramUsername ?? "",
            lastMessage: last?.text ?? "Chat",
            time: last ? formatMessageTime(last.createdAt) : "hozir",
            isLive: true,
            status: liveThread.status,
          },
        ]);
      }
    }
  }, [liveThread]);

  useEffect(() => {
    refreshLive();
    const id = setInterval(() => {
      if (document.visibilityState !== "hidden") refreshLive();
    }, 4000);
    return () => clearInterval(id);
  }, [refreshLive]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads, liveThread?.messages.length]);

  const handleDelete = async (threadId: string) => {
    const label =
      threadId === "main"
        ? "Mijoz chatini tozalashni tasdiqlaysizmi? Xabarlar o'chadi va ro'yxatdan yashirinadi."
        : "Bu chatni o'chirishni tasdiqlaysizmi?";
    if (!window.confirm(label)) return;

    try {
      if (threadId === "main") {
        const result = await deleteChatThread("main");
        if (result && "threadId" in result) {
          setLiveThread(result);
        } else {
          await refreshLive();
        }
        setListItems([]);
        setSelectedId("main");
        setMobileShowChat(false);
      } else {
        await adminApi.deleteChatThread(threadId);
        setDemoThreads((prev) => {
          const next = { ...prev };
          delete next[threadId];
          return next;
        });
        if (selectedId === threadId) setSelectedId("main");
      }
      await loadThreads();
    } catch (e) {
      alert(e instanceof Error ? e.message : "O'chirib bo'lmadi");
    }
  };

  const selectedItem = listItems.find((t) => t.id === selectedId);
  const resolveThreadName = (
    firstName?: string,
    lastName?: string,
    legacyName?: string
  ) => {
    const fromParts = formatCustomerDisplayName(firstName, lastName, "");
    if (fromParts) return fromParts;
    const legacy = legacyName?.trim();
    if (legacy && legacy !== "Mijoz") return legacy;
    return "Mijoz";
  };

  const selectedName = selectedItem
    ? resolveThreadName(
        selectedItem.customerFirstName,
        selectedItem.customerLastName,
        selectedItem.customerName
      )
    : liveThread?.cleared
      ? ""
      : resolveThreadName(
          liveThread?.customerFirstName,
          liveThread?.customerLastName,
          liveThread?.customerName
        );
  const isLiveChat = selectedId === "main";
  const activeThread = isLiveChat
    ? liveThread?.cleared
      ? null
      : liveThread
    : demoThreads[selectedId] ?? null;
  const chatCleared = isLiveChat && Boolean(liveThread?.cleared);
  const customerPresence = formatCustomerPresence(
    isLiveChat ? liveThread?.customerLastSeenAt : null
  );

  const handleThreadUpdate = (updated: ChatThreadState) => {
    if (isLiveChat) {
      setLiveThread(updated);
      loadThreads();
    } else {
      setDemoThreads((prev) => ({ ...prev, [selectedId]: updated }));
    }
  };

  return (
    <DashboardLayout title="Xabarlar" hideMobileNav>
      <div className="flex flex-col h-[calc(100dvh-6rem)] lg:h-[calc(100dvh-8rem)] overflow-hidden">
        <div className="card flex-1 min-h-0 overflow-hidden grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
          <div
            className={cn(
              "flex flex-col min-h-0 border-r border-gray-100",
              !mobileShowChat && "hidden lg:flex",
              mobileShowChat && "flex"
            )}
          >
            <div className="p-3 lg:p-4 border-b flex items-center justify-between shrink-0 bg-white gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  className="lg:hidden text-sm text-[#3b82f6] font-medium shrink-0"
                  onClick={() => setMobileShowChat(false)}
                >
                  ← Ro&apos;yxat
                </button>
                {selectedItem && selectedName && (
                  <button
                    type="button"
                    onClick={() => setProfileOpen(true)}
                    className="flex items-center gap-3 min-w-0 flex-1 text-left rounded-xl px-1 py-0.5 -mx-1 transition hover:bg-gray-50 cursor-pointer group"
                    title="Profilni ko'rish"
                  >
                    <ChatAvatar
                      name={selectedName}
                      imageUrl={selectedItem.customerAvatar}
                      size="sm"
                      online={selectedItem.isLive && customerPresence.online}
                      className="hidden sm:flex shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-sm lg:text-base font-semibold truncate block group-hover:text-[#3390ec]">
                        {selectedName}
                      </span>
                      {isLiveChat ? (
                        <span
                          className={`text-xs font-normal truncate block ${customerPresence.className}`}
                        >
                          <span
                            className={`mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                              customerPresence.online ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                          {customerPresence.label}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 block">CRM chat</span>
                      )}
                    </div>
                  </button>
                )}
                {!selectedName && (
                  <span className="text-sm lg:text-base font-semibold text-gray-500">
                    Xabarlar
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isLiveChat && (
                  <span className="text-xs font-normal text-green-600">Sinxron</span>
                )}
                {(selectedItem || !chatCleared) && (
                  <button
                    type="button"
                    title={isLiveChat ? "Mijoz chatini tozalash" : "Chatni o'chirish"}
                    onClick={() => handleDelete(selectedId)}
                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            <AdminChatPanel
              thread={activeThread}
              onThreadUpdate={handleThreadUpdate}
              onRefresh={refreshLive}
              localMode={!isLiveChat}
            />
          </div>

          <div className={cn("min-h-0 h-full overflow-hidden", mobileShowChat && "hidden lg:block")}>
            <ChatThreadList
              threads={listItems}
              selectedId={selectedId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelect={(id) => {
                setSelectedId(id);
                setMobileShowChat(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      <CustomerProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        phone={selectedItem?.customerPhone ?? liveThread?.customerPhone}
        presenceLabel={customerPresence.label}
        online={customerPresence.online}
      />
    </DashboardLayout>
  );
}
