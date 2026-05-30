import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import type { CartItem, Product } from "../types";
import { useAuth } from "./AuthContext";

const CART_KEY = "mebellar-cart";
const LIKES_KEY = "mebellar-likes";

interface CartContextValue {
  items: CartItem[];
  likedIds: string[];
  total: number;
  count: number;
  hydrated: boolean;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleLike: (productId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [cartRaw, likesRaw] = await AsyncStorage.multiGet([
          CART_KEY,
          LIKES_KEY,
        ]);
        if (cartRaw[1]) setItems(JSON.parse(cartRaw[1]) as CartItem[]);
        if (likesRaw[1]) setLikedIds(JSON.parse(likesRaw[1]) as string[]);
      } catch {
        /* ignore */
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(CART_KEY, JSON.stringify(items)).catch(() => undefined);
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(LIKES_KEY, JSON.stringify(likedIds)).catch(
      () => undefined
    );
  }, [likedIds, hydrated]);

  const requireAuth = useCallback(() => {
    if (!user) {
      router.push("/auth");
      return false;
    }
    return true;
  }, [user, router]);

  const addItem = useCallback(
    (product: Product, qty = 1) => {
      if (!requireAuth()) return;
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.productId === product.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            quantity: next[idx].quantity + qty,
          };
          return next;
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
    [requireAuth]
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
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleLike = useCallback(
    (productId: string) => {
      if (!requireAuth()) return;
      setLikedIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    },
    [requireAuth]
  );

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );
  const count = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      likedIds,
      total,
      count,
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleLike,
    }),
    [
      items,
      likedIds,
      total,
      count,
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleLike,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart CartProvider ichida ishlatiladi");
  return ctx;
}
