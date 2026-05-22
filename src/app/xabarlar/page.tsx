"use client";

import Image from "next/image";
import { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { chatThreads } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(chatThreads[0].id);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const thread = chatThreads.find((t) => t.id === activeId) || chatThreads[0];

  const selectThread = (id: string) => {
    setActiveId(id);
    setMobileShowChat(true);
  };

  return (
    <DashboardLayout title="Xabarlar" hideMobileNav>
      <div className="hidden lg:block">
        <PageTitle title="Xabarlar" subtitle="Mijozlar bilan chat" />
      </div>

      <div className="card flex flex-col lg:flex-row h-[calc(100vh-8rem)] lg:h-[calc(100vh-10rem)] min-h-[500px] overflow-hidden">
        <aside
          className={cn(
            "w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col",
            mobileShowChat ? "hidden lg:flex" : "flex"
          )}
        >
          <div className="p-4 border-b font-semibold hidden lg:block">Suhbatlar</div>
          <ul className="flex-1 overflow-y-auto">
            {chatThreads.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => selectThread(t.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition",
                    activeId === t.id && "bg-blue-50"
                  )}
                >
                  <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0">
                    <Image src={t.avatar} alt="" fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">{t.customerName}</span>
                      <span className="text-xs text-gray-400">{t.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{t.lastMessage}</p>
                  </div>
                  {t.unread ? (
                    <span className="h-5 w-5 rounded-full bg-[#3b82f6] text-white text-xs flex items-center justify-center">
                      {t.unread}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div
          className={cn(
            "flex-1 flex flex-col min-h-0",
            !mobileShowChat && "hidden lg:flex"
          )}
        >
          <div className="p-4 border-b flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden text-[#3b82f6] text-sm font-medium"
              onClick={() => setMobileShowChat(false)}
            >
              ← Orqaga
            </button>
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              <Image src={thread.avatar} alt="" fill className="object-cover" />
            </div>
            <div>
              <p className="font-semibold">{thread.customerName}</p>
              <p className="text-xs text-green-600">Onlayn</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f5f5f5]">
            {thread.messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.sender === "admin" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-[20px] px-4 py-2.5 text-sm shadow-sm",
                    m.sender === "admin"
                      ? "bg-[#f4a261] text-white rounded-br-sm"
                      : "bg-white text-[#1e1e2f] rounded-bl-sm"
                  )}
                >
                  <p>{m.text}</p>
                  <p
                    className={cn(
                      "text-[10px] mt-1",
                      m.sender === "admin" ? "text-white/80" : "text-gray-400"
                    )}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t flex gap-2 bg-white">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-gray-200 text-gray-500"
              aria-label="Fayl biriktirish"
            >
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Xabar yozing..."
              className="input-field flex-1"
            />
            <button type="button" className="btn-primary flex h-11 w-11 items-center justify-center p-0">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="h-4 lg:hidden" />
    </DashboardLayout>
  );
}
