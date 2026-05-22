"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { AdminChatPanel } from "./AdminChatPanel";

export default function MessagesPage() {
  return (
    <DashboardLayout title="Xabarlar" hideMobileNav>
      <div className="hidden lg:block">
        <PageTitle title="Xabarlar" subtitle="Mijoz bilan umumiy chat (sinxron)" />
      </div>

      <div className="card flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-10rem)] min-h-[500px] overflow-hidden">
        <div className="p-4 border-b font-semibold flex items-center justify-between">
          <span>{/* mijoz nomi API dan */}Asosiy suhbat — Mijoz</span>
          <span className="text-xs font-normal text-green-600">Sinxron</span>
        </div>
        <AdminChatPanel />
      </div>
      <div className="h-4 lg:hidden" />
    </DashboardLayout>
  );
}
