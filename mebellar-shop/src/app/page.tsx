import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, Shield, Headphones } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { categories, products } from "@/lib/mock-data";

const HERO_IMAGE = "/images/bg1.png";

const features = [
  { icon: Truck, title: "Bepul yetkazish", desc: "Toshkent bo'ylab" },
  { icon: Shield, title: "5 yillik kafolat", desc: "Barcha mahsulotlar" },
  { icon: Headphones, title: "24/7 qo'llab-quvvatlash", desc: "Online chat" },
];

export default function HomePage() {
  const popular = products.filter((p) => p.isPopular);
  const newest = products.filter((p) => p.isNew);
  const recommended = products.filter((p) => p.isRecommended);

  return (
    <main className="bg-[#faf8f5]">
      {/* Hero — iliq jigarrang gradient + rasm */}
      <section className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="Zamonaviy mebel interyeri"
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        {/* Iliq jigarrang/sariq overlay — ko'k emas */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#4a3f35]/90 via-[#6b5d4f]/50 to-[#f4a261]/10"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#3d3229]/50 via-transparent to-[#faf8f5]/20"
          aria-hidden
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-center pb-28 lg:pb-32">
          <span className="inline-block w-fit rounded-full bg-[#f4a261]/25 border border-[#f4a261]/40 text-[#fff8f0] text-sm font-medium px-4 py-1.5 mb-5 backdrop-blur-sm">
            Yangi kolleksiya 2026
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold leading-[1.15] text-[#fffaf5] max-w-2xl drop-shadow-sm">
            Yangi zamonaviy
            <br />
            yaxshi mebellar
          </h1>
          <p className="mt-5 text-[#f5ebe0] text-base lg:text-lg max-w-xl leading-relaxed">
            Oshxonadan yotoqxonagacha — sifatli, zamonaviy va arzon narxlarda.
            Individual o&apos;lcham va eskiz xizmati.
          </p>
          <div className="mt-8">
            <Link href="/katalog" className="btn-accent inline-flex items-center gap-2 shadow-lg">
              Katalogni ko&apos;rish
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature kartalar */}
      <section className="relative z-20 -mt-14 sm:-mt-16 lg:-mt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4 lg:gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-[20px] bg-white p-5 lg:p-6 shadow-[0_8px_32px_rgba(61,50,41,0.1)] border border-[#ebe6df]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f4a261]/20 text-[#c97b3f]">
                  <Icon size={26} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="font-semibold text-[#3d3229]">{title}</p>
                  <p className="text-sm text-[#6b5f52] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24 pb-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-[#3d3229]">Kategoriyalar</h2>
          <Link
            href="/katalog"
            className="text-sm font-medium text-[#c97b3f] hover:text-[#f4a261] hover:underline flex items-center gap-1"
          >
            Barchasi <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/katalog?cat=${cat.slug}`}
              className="card overflow-hidden group text-center p-0"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-[#3d3229]">{cat.name}</p>
                <p className="text-xs text-[#6b5f52]">{cat.count} ta mahsulot</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f5f0e8] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-[#3d3229]">Mashhur mahsulotlar</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {popular.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8 text-[#3d3229]">Yangi mahsulotlar</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {newest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-[#f5f0e8] py-16 border-t border-[#ebe6df]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2 text-[#3d3229]">Tavsiya etilgan</h2>
          <p className="text-[#6b5f52] mb-8 text-sm">
            Siz uchun tanlangan eng yaxshi mahsulotlar
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {recommended.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
