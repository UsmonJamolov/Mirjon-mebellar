"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { fetchChatThread, formatMessageTime, sendAdminHeartbeat, type ChatThreadState } from "@/lib/chat-api";
import { adminApi } from "@/lib/api";
import { AdminChatPanel } from "./AdminChatPanel";
import { ChatThreadList, type ThreadListItem } from "./ChatThreadList";
import { createInitialDemoThreads } from "./demo-threads";
import { cn } from "@/lib/utils";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop";

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState("main");
  const [liveThread, setLiveThread] = useState<ChatThreadState | null>(null);
  const [demoThreads, setDemoThreads] = useState<Record<string, ChatThreadState>>(createInitialDemoThreads);
  const [listItems, setListItems] = useState<ThreadListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

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
      setListItems(
        apiThreads.map((t) => ({
          ...t,
          avatar: DEFAULT_AVATAR,
        }))
      );
    } catch {
      const last = liveThread?.messages[liveThread.messages.length - 1];
      if (liveThread) {
        setListItems([
          {
            id: "main",
            customerName: liveThread.customerName,
            avatar: DEFAULT_AVATAR,
            lastMessage: last?.text ?? "Chat",
            time: last ? formatMessageTime(last.createdAt) : "hozir",
            isLive: true,
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
    try {
      await adminApi.deleteChatThread(threadId);
      if (selectedId === threadId) setSelectedId("main");
      loadThreads();
    } catch (e) {
      alert(e instanceof Error ? e.message : "O'chirib bo'lmadi");
    }
  };

  const selectedName = listItems.find((t) => t.id === selectedId)?.customerName ?? "Mijoz";
  const isLiveChat = selectedId === "main";
  const activeThread = isLiveChat ? liveThread : demoThreads[selectedId] ?? null;

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
        <div className="card flex-1 min-h-0 overflow-hidden grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div
            className={cn(
              "flex flex-col min-h-0 border-r border-gray-100",
              !mobileShowChat && "hidden lg:flex",
              mobileShowChat && "flex"
            )}
          >
            <div className="p-3 lg:p-4 border-b font-semibold flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  className="lg:hidden text-sm text-[#3b82f6] font-medium shrink-0"
                  onClick={() => setMobileShowChat(false)}
                >
                  ← Ro&apos;yxat
                </button>
                <span className="text-sm lg:text-base truncate">
                  {selectedName}
                  {isLiveChat ? (
                    <span className="ml-2 text-xs font-normal text-green-600">· jonli</span>
                  ) : (
                    <span className="ml-2 text-xs font-normal text-gray-400">· CRM</span>
                  )}
                </span>
              </div>
              {isLiveChat && (
                <span className="text-xs font-normal text-green-600 shrink-0">Sinxron</span>
              )}
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
    </DashboardLayout>
  );
}
