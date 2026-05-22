"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { chatThreads } from "@/lib/mock-data";
import { fetchChatThread, formatMessageTime, sendAdminHeartbeat, type ChatThreadState } from "@/lib/chat-api";
import { AdminChatPanel } from "./AdminChatPanel";
import { ChatThreadList, buildThreadList } from "./ChatThreadList";
import { createInitialDemoThreads } from "./demo-threads";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState("main");
  const [liveThread, setLiveThread] = useState<ChatThreadState | null>(null);
  const [demoThreads, setDemoThreads] = useState<Record<string, ChatThreadState>>(createInitialDemoThreads);
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

  useEffect(() => {
    refreshLive();
    const id = setInterval(() => {
      if (document.visibilityState !== "hidden") refreshLive();
    }, 4000);
    return () => clearInterval(id);
  }, [refreshLive]);

  const listItems = useMemo(() => {
    const last = liveThread?.messages[liveThread.messages.length - 1];
    const liveMeta = liveThread
      ? {
          customerName: liveThread.customerName,
          lastMessage: last?.text ?? "Eskiz / kelishuv",
          time: last
            ? formatMessageTime(last.createdAt)
            : "hozir",
        }
      : null;

    const mockWithUpdates = chatThreads.map((t) => {
      const demo = demoThreads[t.id];
      const lastDemo = demo?.messages[demo.messages.length - 1];
      return {
        ...t,
        lastMessage: lastDemo?.text ?? t.lastMessage,
        time: lastDemo ? formatMessageTime(lastDemo.createdAt) : t.time,
        unread: selectedId === t.id ? 0 : t.unread,
      };
    });

    return buildThreadList(liveMeta, mockWithUpdates);
  }, [liveThread, demoThreads, selectedId]);

  const selectedName =
    listItems.find((t) => t.id === selectedId)?.customerName ?? "Mijoz";
  const isLiveChat = selectedId === "main";

  const activeThread = isLiveChat ? liveThread : demoThreads[selectedId] ?? null;

  const handleThreadUpdate = (updated: ChatThreadState) => {
    if (isLiveChat) {
      setLiveThread(updated);
    } else {
      setDemoThreads((prev) => ({ ...prev, [selectedId]: updated }));
    }
  };

  return (
    <DashboardLayout title="Xabarlar" hideMobileNav>
      <div className="hidden lg:block mb-4">
        <PageTitle title="Xabarlar" subtitle="Mijozlar bilan chat (Telegram uslubi)" />
      </div>

      <div className="card overflow-hidden min-h-[calc(100vh-7rem)] lg:min-h-[calc(100vh-10rem)] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div
          className={cn(
            "flex flex-col min-h-0 min-h-[480px] border-r border-gray-100",
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

        <div
          className={cn(
            "min-h-[280px] lg:min-h-0 lg:h-full",
            mobileShowChat && "hidden lg:block"
          )}
        >
          <ChatThreadList
            threads={listItems}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              setMobileShowChat(true);
            }}
          />
        </div>
      </div>
      <div className="h-4 lg:hidden" />
    </DashboardLayout>
  );
}
