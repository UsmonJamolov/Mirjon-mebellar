import Link from "next/link";

export function ShopFooter() {
  return (
    <footer className="bg-[#3d3229] text-[#f5ebe0] mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-[#f4a261] flex items-center justify-center font-bold">
                M
              </div>
              <span className="text-lg font-bold">Mebellar</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              O&apos;zbekistondagi eng yaxshi mebel do&apos;koni. Sifatli va zamonaviy mebellar.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Katalog</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/katalog?cat=oshxona" className="hover:text-[#f4a261]">Oshxona</Link></li>
              <li><Link href="/katalog?cat=yotoqxona" className="hover:text-[#f4a261]">Yotoqxona</Link></li>
              <li><Link href="/katalog?cat=ofis" className="hover:text-[#f4a261]">Ofis</Link></li>
              <li><Link href="/katalog?cat=mehmonxona" className="hover:text-[#f4a261]">Mehmonxona</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Yordam</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/buyurtmalar" className="hover:text-[#f4a261]">Buyurtmalarim</Link></li>
              <li><Link href="/eskiz" className="hover:text-[#f4a261]">Eskiz yaratish</Link></li>
              <li><Link href="/chat" className="hover:text-[#f4a261]">Chat</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Aloqa</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>+998 71 200 00 00</li>
              <li>info@mebellar.uz</li>
              <li>Toshkent sh., Chilonzor</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-white/40">
          © 2026 Mebellar. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
