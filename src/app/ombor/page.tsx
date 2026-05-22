"use client";

import { Filter, Plus, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTitle } from "@/components/ui/PageTitle";
import { inventory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function WarehousePage() {
  return (
    <DashboardLayout title="Ombor">
      <PageTitle
        title="Ombor (Inventar)"
        action={
          <button type="button" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Yangi qo&apos;shish
          </button>
        }
      />

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="search" placeholder="Qidirish..." className="input-field pl-10" />
        </div>
        <button type="button" className="btn-secondary flex items-center gap-2">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="card hidden lg:block overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80 text-gray-500 border-b">
              <th className="text-left px-6 py-4 font-medium">Nomi</th>
              <th className="text-left px-6 py-4 font-medium">Kategoriya</th>
              <th className="text-left px-6 py-4 font-medium">Miqdori</th>
              <th className="text-left px-6 py-4 font-medium">O&apos;lchov birligi</th>
              <th className="text-left px-6 py-4 font-medium">Holati</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4 text-gray-500">{item.category}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">{item.unit}</td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      item.status === "yetarli"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    )}
                  >
                    {item.status === "yetarli" ? "Yetarli" : "Kam"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-3">
        {inventory.map((item) => (
          <div key={item.id} className="card p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">{item.category}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  item.status === "yetarli"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                )}
              >
                {item.status === "yetarli" ? "Yetarli" : "Kam"}
              </span>
            </div>
            <div className="flex gap-4 mt-3 text-sm text-gray-600">
              <span>Miqdor: {item.quantity}</span>
              <span>Birlik: {item.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
