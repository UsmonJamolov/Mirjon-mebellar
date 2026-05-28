"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Instagram, Send, Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";

const socials = [
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://t.me", icon: Send, label: "Telegram" },
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
];

const payments = ["VISA", "Mastercard", "UZCARD", "HUMO"];

export function ShopFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const pathname = usePathname();

  const sections = [
    {
      title: t("company"),
      items: [
        { label: t("about"), href: "/" },
        { label: t("news"), href: "/" },
        { label: t("career"), href: "/" },
        { label: t("contact"), href: "/" },
      ],
    },
    {
      title: t("services"),
      items: [
        { label: t("delivery"), href: "/" },
        { label: t("payment"), href: "/" },
        { label: tNav("catalog"), href: "/katalog" },
        { label: t("returns"), href: "/" },
      ],
    },
    {
      title: t("help"),
      items: [
        { label: t("faq"), href: "/" },
        { label: t("support"), href: "/chat" },
        { label: t("terms"), href: "/" },
        { label: t("privacy"), href: "/" },
      ],
    },
  ];

  if (pathname === "/chat" || pathname.startsWith("/chat/")) {
    return null;
  }
  if (pathname === "/auth" || pathname.startsWith("/auth/")) {
    return null;
  }

  return (
    <footer className="border-t border-[#ebe6df] bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.1fr]">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#f4a261] font-bold text-white">
                M
              </div>
              <span className="text-lg font-bold text-[#3d3229]">Mebellar</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#8b7d6f]">
              {t("tagline")}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-[#ebe6df] text-[#6b5f52] transition hover:border-[#f4a261] hover:text-[#c97b3f]"
                >
                  <Icon size={16} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold text-[#3d3229]">{section.title}</p>
              <ul className="mt-4 space-y-2 text-sm text-[#6b5f52]">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="transition hover:text-[#c97b3f]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-sm font-semibold text-[#3d3229]">{t("contact")}</p>
            <ul className="mt-4 space-y-3 text-sm text-[#6b5f52]">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#c97b3f]" />
                +998 90 123 45 67
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#c97b3f]" />
                info@mebellar.uz
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-[#c97b3f]" />
                {t("location")}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#ebe6df] pt-6 text-xs text-[#8b7d6f] sm:flex-row">
          <span>{t("copyright")}</span>
          <div className="flex flex-wrap items-center gap-2">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded-md border border-[#ebe6df] bg-[#faf6ef] px-2.5 py-1 text-[10px] font-semibold tracking-[0.15em] text-[#6b5f52]"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
