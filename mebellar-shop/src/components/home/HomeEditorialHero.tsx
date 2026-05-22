import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE = "/images/bg1.png";

export function HomeEditorialHero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-[#1a1612]">
      <Image
        src={HERO_IMAGE}
        alt="Zamonaviy mebel interyeri"
        fill
        priority
        className="object-cover object-center opacity-55"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1612]/40 via-transparent to-[#1a1612]/90" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24 pt-32">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/50 mb-8 sm:mb-12">
          O&apos;zbekiston / Toshkent / Online
        </p>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 items-end">
          <div className="lg:col-span-8">
            <h1 className="editorial-display text-[#fffaf5]">
              <span className="block font-light text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] tracking-tight">
                Mebel
              </span>
              <span className="block font-light italic text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] tracking-tight text-[#f4a261]">
                Kelajak
              </span>
              <span className="block font-bold text-[clamp(2.75rem,9vw,6rem)] leading-[0.9] tracking-tighter uppercase mt-1">
                Uy uchun
              </span>
            </h1>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="editorial-tagline text-white/70 max-w-sm lg:ml-auto">
              <span className="italic text-white/90">Zamonaviy</span> yashash{" "}
              <strong className="font-semibold text-white not-italic">dizayn</strong>{" "}
              studiyasi. Oshxona, yotoqxona va individual eskiz.
            </p>
            <Link
              href="/katalog"
              className="mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white border-b border-white/40 pb-1 hover:border-[#f4a261] hover:text-[#f4a261] transition"
            >
              Katalogni ko&apos;rish
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="mt-16 sm:mt-24 flex flex-wrap gap-x-8 gap-y-2 text-[10px] uppercase tracking-[0.25em] text-white/40">
          <span>Furnishing</span>
          <span>Interior</span>
          <span>Custom sketch</span>
        </div>
      </div>
    </section>
  );
}
