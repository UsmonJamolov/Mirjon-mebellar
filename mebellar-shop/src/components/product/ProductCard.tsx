"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProductImage } from "./ProductImage";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { DynamicText } from "@/hooks/useDynamicTranslate";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("common");
  const { likedIds, toggleLike, hydrated } = useCart();
  const liked = hydrated && likedIds.includes(product.id);

  return (
    <article className="card group overflow-hidden flex flex-col">
      <Link
        href={`/mahsulot/${product.id}`}
        className="relative aspect-[4/3] overflow-hidden block bg-[#f5f5f5]"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 rounded-full bg-[#3d3229] text-white text-[10px] font-bold px-2.5 py-1">
            {t("productNew")}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleLike(product.id);
          }}
          className={cn(
            "absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center shadow-md transition",
            liked ? "bg-[#f4a261] text-white" : "bg-white text-gray-400 hover:text-[#f4a261]"
          )}
          aria-label="Sevimlilar"
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/mahsulot/${product.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-[#f4a261] transition">
            <DynamicText text={product.name} />
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="font-medium text-[#3d3229]">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <p className="text-[#c97b3f] font-bold mt-auto pt-3 text-sm lg:text-base">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
}
