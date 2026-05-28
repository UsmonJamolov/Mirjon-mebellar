"use client";

import { useEffect, useState } from "react";
import { X, Phone, AtSign, Mail, ShoppingBag, Calendar } from "lucide-react";
import { ChatAvatar } from "@/components/chat/ChatAvatar";
import { formatCustomerDisplayName } from "@/lib/chat-customer";

export type CustomerProfileData = {
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string;
  image: string;
  telegramUsername: string;
  registeredAt: string;
  ordersCount: number;
  lastOrderDate: string;
  presenceLabel: string;
};

interface CustomerProfileModalProps {
  open: boolean;
  onClose: () => void;
  phone?: string;
  presenceLabel?: string;
  online?: boolean;
}

export function CustomerProfileModal({
  open,
  onClose,
  phone,
  presenceLabel,
  online,
}: CustomerProfileModalProps) {
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const qs = phone ? `?phone=${encodeURIComponent(phone)}` : "";
    fetch(`/api/chat/customer-profile${qs}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setProfile(data as CustomerProfileData))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [open, phone]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const displayName =
    profile?.fullName ||
    formatCustomerDisplayName(profile?.firstName, profile?.lastName);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[420px] rounded-2xl bg-white shadow-2xl overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Mijoz profili"
      >
        <div className="relative bg-gradient-to-b from-[#3390ec]/10 to-white px-6 pt-8 pb-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Yopish"
          >
            <X size={20} />
          </button>
          <div className="flex justify-center mb-3">
            <ChatAvatar
              name={displayName}
              imageUrl={profile?.image}
              size="lg"
              online={online}
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {presenceLabel || profile?.presenceLabel || "—"}
          </p>
        </div>

        <div className="px-2 pb-4 max-h-[50vh] overflow-y-auto">
          {loading && (
            <p className="text-center text-sm text-gray-500 py-8">Yuklanmoqda...</p>
          )}
          {!loading && profile && (
            <ul className="divide-y divide-gray-100">
              {profile.phone && (
                <ProfileRow
                  icon={<Phone size={18} className="text-[#3390ec]" />}
                  title={profile.phone}
                  subtitle="Telefon (mobil)"
                />
              )}
              {profile.telegramUsername && (
                <ProfileRow
                  icon={<AtSign size={18} className="text-[#3390ec]" />}
                  title={`@${profile.telegramUsername.replace(/^@/, "")}`}
                  subtitle="Telegram username"
                />
              )}
              {profile.email && (
                <ProfileRow
                  icon={<Mail size={18} className="text-[#3390ec]" />}
                  title={profile.email}
                  subtitle="Email"
                />
              )}
              <ProfileRow
                icon={<ShoppingBag size={18} className="text-[#3390ec]" />}
                title={`${profile.ordersCount} ta buyurtma`}
                subtitle={
                  profile.lastOrderDate
                    ? `Oxirgi: ${profile.lastOrderDate}`
                    : "Buyurtmalar tarixi"
                }
              />
              {profile.registeredAt && (
                <ProfileRow
                  icon={<Calendar size={18} className="text-[#3390ec]" />}
                  title={profile.registeredAt}
                  subtitle="Ro'yxatdan o'tgan sana"
                />
              )}
            </ul>
          )}
          {!loading && !profile && (
            <p className="text-center text-sm text-gray-500 py-8">
              Profil ma&apos;lumotlari topilmadi
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileRow({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl mx-1">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3390ec]/10">
        {icon}
      </span>
      <div className="min-w-0 text-left">
        <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </li>
  );
}
