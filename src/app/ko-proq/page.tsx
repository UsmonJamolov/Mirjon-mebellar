"use client";

import Link from "next/link";
import {
  Warehouse,
  PenTool,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const moreItems = [
  { href: "/ombor", label: "Ombor", icon: Warehouse, desc: "Inventar boshqaruvi" },
  { href: "/eskizlar", label: "Eskizlar", icon: PenTool, desc: "2D eskiz yaratish" },
  { href: "/xabarlar", label: "Xabarlar", icon: MessageSquare, desc: "Mijozlar bilan chat" },
  { href: "/hisobotlar", label: "Hisobotlar", icon: BarChart3, desc: "Analitika va statistika" },
  { href: "/sozlamalar", label: "Sozlamalar", icon: Settings, desc: "Tizim sozlamalari" },
];

export default function MorePage() {
  return (
    <DashboardLayout title="Ko'proq">
      <h1 className="text-xl font-bold mb-6 hidden lg:block">Ko&apos;proq</h1>
      <ul className="space-y-3">
        {moreItems.map(({ href, label, icon: Icon, desc }) => (
          <li key={href}>
            <Link
              href={href}
              className="card flex items-center gap-4 p-4 hover:shadow-md transition"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-blue-50 text-[#3b82f6]">
                <Icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{label}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
              <ChevronRight className="text-gray-400 shrink-0" size={20} />
            </Link>
          </li>
        ))}
      </ul>
    </DashboardLayout>
  );
}
