import Link from "next/link";

export function PremiumFooter() {
  return (
    <footer className="border-t border-white/[0.06] py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-semibold tracking-[0.2em] text-white">
              MEBELLAR
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              Premium mebel — kelajak interyeri uchun zamonaviy studiya.
            </p>
          </div>
          <div>
            <p className="premium-label mb-4">Katalog</p>
            <ul className="space-y-2 text-sm text-white/45">
              <li>
                <Link href="/katalog" className="hover:text-white transition">
                  Barcha mahsulotlar
                </Link>
              </li>
              <li>
                <Link href="/katalog?cat=oshxona" className="hover:text-white transition">
                  Oshxona
                </Link>
              </li>
              <li>
                <Link href="/katalog?cat=yotoqxona" className="hover:text-white transition">
                  Yotoqxona
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="premium-label mb-4">Xizmat</p>
            <ul className="space-y-2 text-sm text-white/45">
              <li>
                <Link href="/eskiz" className="hover:text-white transition">
                  Eskiz
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white transition">
                  Chat
                </Link>
              </li>
              <li>
                <Link href="/buyurtmalar" className="hover:text-white transition">
                  Buyurtmalar
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="premium-label mb-4">Aloqa</p>
            <ul className="space-y-2 text-sm text-white/45">
              <li>+998 71 200 00 00</li>
              <li>info@mebellar.uz</li>
              <li>Toshkent</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-[10px] tracking-[0.3em] text-white/25 sm:flex-row">
          <span>© 2026 MEBELLAR</span>
          <span>PREMIUM FUTURE INTERIOR</span>
        </div>
      </div>
    </footer>
  );
}
