"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { buildAuthRedirectUrl } from "@/lib/auth-protected";
import type { CartItem, Product } from "@/lib/types";

export interface ChatCartItemInput {
  productId: string;
  name: string;
  price: number;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  addChatOrderItem: (item: ChatCartItemInput) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  likedIds: string[];
  toggleLike: (productId: string) => void;
  /** localStorage yuklanguncha false — hydration mosligi uchun */
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mebellar-cart";
const LIKES_KEY = "mebellar-likes";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const ensureAuth = useCallback(
    (callbackPath = "/savatcha") => {
      if (status === "loading") return false;
      if (!session?.user) {
        router.push(buildAuthRedirectUrl(callbackPath));
        return false;
      }
      return true;
    },
    [session?.user, status, router]
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const likes = localStorage.getItem(LIKES_KEY);
      if (saved) setItems(JSON.parse(saved));
      if (likes) setLikedIds(JSON.parse(likes));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LIKES_KEY, JSON.stringify(likedIds));
  }, [likedIds, hydrated]);

  const addChatOrderItem = useCallback(
    (item: ChatCartItemInput) => {
      if (!ensureAuth("/chat")) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) return prev;
      return [
        ...prev,
        {
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image ?? "",
          quantity: 1,
        },
      ];
    });
  },
    [ensureAuth]
  );

  const addItem = useCallback(
    (product: Product, qty = 1) => {
      if (!ensureAuth("/savatcha")) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: qty,
        },
      ];
    });
  },
    [ensureAuth]
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleLike = useCallback(
    (productId: string) => {
      if (!ensureAuth("/sevimlilar")) return;
      setLikedIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    },
    [ensureAuth]
  );

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addChatOrderItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        count,
        likedIds,
        toggleLike,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
