"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { MobileDrawer } from "./MobileDrawer";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  hideMobileNav?: boolean;
}

export function DashboardLayout({
  children,
  title,
  showBack,
  onBack,
  hideMobileNav,
}: DashboardLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Sidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="lg:pl-64 flex flex-col min-h-screen min-h-0">
        <Header
          onMenuClick={() => setDrawerOpen(true)}
          title={title}
          showBack={showBack}
          onBack={onBack}
        />
        <main
          className={`flex-1 min-h-0 p-4 lg:p-8 ${
            hideMobileNav ? "overflow-hidden" : "pb-20 lg:pb-8"
          }`}
        >
          {children}
        </main>
        {!hideMobileNav && <MobileNav />}
      </div>
    </div>
  );
}
