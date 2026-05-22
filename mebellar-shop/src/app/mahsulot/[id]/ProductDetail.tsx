"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Star,
  Share2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { formatPrice } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const whatsappUrl = `https://wa.me/998712000000?text=${encodeURIComponent(
    `Salom! "${product.name}" haqida ma'lumot olmoqchiman.`
  )}`;

  const handleAddToCart = () => {
    addItem(product, qty);
    router.push("/savatcha");
  };

  const handleOrder = () => {
    addItem(product, qty);
    router.push("/checkout");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#f4a261] mb-6"
      >
        <ChevronLeft size={18} /> Orqaga
      </button>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden card p-0">
            <Image
              src={product.images[activeImage] || product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              quality={75}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImage((i) => (i === 0 ? product.images.length - 1 : i - 1))
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImage((i) => (i === product.images.length - 1 ? 0 : i + 1))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative h-16 w-16 shrink-0 rounded-[14px] overflow-hidden border-2 transition",
                  activeImage === i ? "border-[#f4a261]" : "border-transparent"
                )}
              >
                <Image src={img} alt="" fill className="object-cover" quality={70} sizes="64px" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-[#f4a261] font-medium">{product.category}</p>
          <h1 className="text-2xl lg:text-3xl font-bold mt-1">{product.name}</h1>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i <= Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} ({product.reviews} ta sharh)
            </span>
          </div>

          <p className="text-3xl font-bold text-[#f4a261] mt-6">
            {formatPrice(product.price)}
          </p>

          <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="card p-3">
              <dt className="text-gray-500">Material</dt>
              <dd className="font-medium">{product.material}</dd>
            </div>
            {product.width && (
              <div className="card p-3">
                <dt className="text-gray-500">O&apos;lchamlar</dt>
                <dd className="font-medium">
                  {product.width}×{product.depth}×{product.height} sm
                </dd>
              </div>
            )}
          </dl>

          <div className="flex items-center gap-4 mt-8">
            <span className="text-sm font-medium">Miqdor:</span>
            <div className="flex items-center rounded-[14px] border border-gray-200">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-3 hover:bg-gray-50"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="p-3 hover:bg-gray-50"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn-outline flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Savatchaga qo&apos;shish
            </button>
            <button type="button" onClick={handleOrder} className="btn-accent flex-1">
              Buyurtma berish
            </button>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[14px] border border-gray-200 text-sm hover:bg-gray-50"
            >
              <Share2 size={16} /> Ulashish
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[14px] bg-green-500 text-white text-sm font-medium hover:bg-green-600"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
