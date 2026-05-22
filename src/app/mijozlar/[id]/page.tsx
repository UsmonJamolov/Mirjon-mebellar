"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  customers,
  formatPrice,
  getStatusLabel,
  getStatusClass,
} from "@/lib/mock-data";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customer = customers.find((c) => c.id === params.id) || customers[0];
  const [newNote, setNewNote] = useState("");

  return (
    <DashboardLayout
      title={customer.name}
      showBack
      onBack={() => router.back()}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 text-center lg:text-left">
          <div className="relative h-24 w-24 mx-auto lg:mx-0 rounded-full overflow-hidden mb-4">
            <Image src={customer.avatar} alt={customer.name} fill className="object-cover" />
          </div>
          <h2 className="text-xl font-bold">{customer.name}</h2>
          <span className="status-done inline-block mt-2">Faol mijoz</span>
          <dl className="mt-6 space-y-3 text-sm text-left">
            <div>
              <dt className="text-gray-500">Telefon</dt>
              <dd className="font-medium">{customer.phone}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Manzil</dt>
              <dd>{customer.address}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Ro&apos;yxatdan o&apos;tgan</dt>
              <dd>{customer.registeredAt}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Buyurtmalar tarixi</h3>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="text-left py-2">ID</th>
                    <th className="text-left py-2">Sana</th>
                    <th className="text-left py-2">Summa</th>
                    <th className="text-left py-2">Holat</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((o) => (
                    <tr key={o.id} className="border-b border-gray-50">
                      <td className="py-3">
                        <Link href={`/buyurtmalar/${o.id}`} className="text-[#3b82f6]">
                          #{o.id}
                        </Link>
                      </td>
                      <td className="py-3">{o.date}</td>
                      <td className="py-3">{formatPrice(o.total)}</td>
                      <td className="py-3">
                        <span className={getStatusClass(o.status)}>
                          {getStatusLabel(o.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="lg:hidden space-y-3">
              {customer.orders.map((o) => (
                <Link
                  key={o.id}
                  href={`/buyurtmalar/${o.id}`}
                  className="flex justify-between items-center py-2 border-b border-gray-50"
                >
                  <div>
                    <p className="font-medium text-[#3b82f6]">#{o.id}</p>
                    <p className="text-xs text-gray-500">{o.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(o.total)}</p>
                    <span className={getStatusClass(o.status)}>
                      {getStatusLabel(o.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Eslatmalar</h3>
            <ul className="space-y-2 mb-4">
              {customer.notes.map((n, i) => (
                <li key={i} className="text-sm bg-gray-50 rounded-[14px] px-4 py-2">
                  {n}
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Yangi eslatma..."
                className="input-field flex-1"
              />
              <button type="button" className="btn-primary shrink-0">
                Qo&apos;shish
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
