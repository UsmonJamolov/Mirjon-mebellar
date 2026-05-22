import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

interface HomeCategoryRailProps {
  categories: Category[];
}

export function HomeCategoryRail({ categories }: HomeCategoryRailProps) {
  return (
    <section className="py-16 sm:py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="text-[11px] uppercase tracking-[0.35em] text-[#6b5f52] mb-10">
          Kategoriyalar
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/katalog?cat=${cat.slug}`}
              className="snap-start shrink-0 w-[200px] sm:w-[240px] group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe6df]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="240px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612]/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium tracking-wide">{cat.name}</p>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest mt-0.5">
                    {cat.count} mahsulot
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
