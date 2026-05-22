import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/mock-data";

interface HomeArchiveListProps {
  products: Product[];
  title?: string;
}

export function HomeArchiveList({ products, title = "Arxiv" }: HomeArchiveListProps) {
  return (
    <section className="border-t border-[#3d3229]/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="flex items-baseline justify-between gap-4 mb-10 sm:mb-14">
          <h2 className="text-[11px] uppercase tracking-[0.35em] text-[#6b5f52]">{title}</h2>
          <Link
            href="/katalog"
            className="text-[11px] uppercase tracking-[0.2em] text-[#3d3229] hover:text-[#f4a261] transition"
          >
            Barchasi →
          </Link>
        </div>

        <ul className="divide-y divide-[#3d3229]/10">
          {products.map((p, i) => (
            <li key={p.id}>
              <Link
                href={`/mahsulot/${p.id}`}
                className="group grid grid-cols-12 gap-4 sm:gap-6 py-6 sm:py-8 items-center hover:bg-[#f5f0e8]/60 -mx-4 px-4 sm:-mx-6 sm:px-6 transition-colors"
              >
                <span className="col-span-1 hidden sm:block text-[11px] text-[#a89888] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="col-span-12 sm:col-span-5">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-light tracking-tight text-[#3d3229] group-hover:text-[#c97b3f] transition">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#a89888]">
                    {p.category} / {formatPrice(p.price)}
                  </p>
                </div>
                <div className="col-span-8 sm:col-span-4 flex gap-2 text-[10px] uppercase tracking-wider text-[#6b5f52]">
                  <span>{p.category}</span>
                  <span className="text-[#ebe6df]">/</span>
                  <span>UZ</span>
                </div>
                <div className="col-span-4 sm:col-span-2 flex justify-end">
                  <div className="relative h-14 w-20 sm:h-16 sm:w-24 overflow-hidden rounded-sm bg-[#ebe6df]">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      quality={70}
                      className="object-cover opacity-90 group-hover:scale-105 transition duration-500"
                      sizes="96px"
                    />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
