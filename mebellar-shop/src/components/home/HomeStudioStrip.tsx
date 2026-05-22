import Link from "next/link";

export function HomeStudioStrip() {
  return (
    <section className="bg-[#3d3229] text-[#faf8f5]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 lg:gap-20">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/40 mb-6">Mebellar studio</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-light leading-relaxed text-white/85">
            Biz zamonaviy mebel, individual o&apos;lcham va 2D eskiz xizmatini bir joyda taqdim etamiz —
            uyingiz uchun kelajakdagi yashash makonini birgalikda yaratamiz.
          </p>
        </div>
        <div className="flex flex-col justify-between gap-8">
          <div className="space-y-4 text-sm text-white/60">
            <p>
              <span className="text-white/40 uppercase text-[10px] tracking-widest block mb-1">
                Bog&apos;lanish
              </span>
              <Link href="/chat" className="hover:text-[#f4a261] transition">
                Chat orqali mutaxassis
              </Link>
            </p>
            <p>
              <span className="text-white/40 uppercase text-[10px] tracking-widest block mb-1">
                Eskiz
              </span>
              <Link href="/eskiz" className="hover:text-[#f4a261] transition">
                Individual 2D eskiz yaratish
              </Link>
            </p>
          </div>
          <Link
            href="/chat"
            className="inline-flex w-fit items-center gap-3 text-xs uppercase tracking-[0.25em] border border-white/30 px-6 py-4 hover:bg-[#f4a261] hover:border-[#f4a261] transition"
          >
            Biz bilan bog&apos;lanish
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
