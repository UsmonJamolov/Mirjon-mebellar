import { getShopApiBase } from "./api-config";
import type { Category, Product, UserOrder } from "./types";
import { categories as mockCategories, products as mockProducts, userOrders as mockOrders } from "./mock-data";
import { getProductSalesMap, pickBestsellerProducts } from "./product-sales";

async function get<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getShopApiBase()}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    return await get<Category[]>("/api/categories", { cache: "no-store" });
  } catch {
    return mockCategories;
  }
}

export async function fetchProducts(params?: {
  cat?: string;
  q?: string;
  popular?: boolean;
  recommended?: boolean;
}): Promise<Product[]> {
  try {
    const qs = new URLSearchParams();
    if (params?.cat) qs.set("cat", params.cat);
    if (params?.q) qs.set("q", params.q);
    if (params?.popular) qs.set("popular", "true");
    if (params?.recommended) qs.set("recommended", "true");
    const query = qs.toString() ? `?${qs}` : "";
    return await get<Product[]>(`/api/products${query}`, { cache: "no-store" });
  } catch {
    let list = [...mockProducts];
    if (params?.cat) {
      const name = mockCategories.find((c) => c.slug === params.cat)?.name;
      if (name) list = list.filter((p) => p.category === name);
    }
    if (params?.q) list = list.filter((p) => p.name.toLowerCase().includes(params.q!.toLowerCase()));
    if (params?.popular) list = list.filter((p) => p.isPopular);
    if (params?.recommended) list = list.filter((p) => p.isRecommended);
    return list;
  }
}

export async function fetchBestsellers(limit = 4): Promise<Product[]> {
  const [products, salesMap] = await Promise.all([
    fetchProducts(),
    getProductSalesMap(),
  ]);
  return pickBestsellerProducts(products, salesMap, limit);
}

export async function fetchProduct(id: string): Promise<Product | null> {
  try {
    return await get<Product>(`/api/products/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
  } catch {
    return mockProducts.find((p) => p.id === id) ?? null;
  }
}

export type PublicSettings = {
  storeName: string;
  logo: string;
  phone?: string;
  email?: string;
  address?: string;
};

export async function fetchPublicSettings(): Promise<PublicSettings> {
  try {
    return await get<PublicSettings>("/api/settings", { cache: "no-store" });
  } catch {
    return { storeName: "Mebellar", logo: "" };
  }
}

export async function fetchOrders(): Promise<UserOrder[]> {
  try {
    const res = await fetch("/api/orders", { cache: "no-store", credentials: "include" });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as UserOrder[];
  } catch {
    return mockOrders;
  }
}

export async function createOrder(body: {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: { name: string; quantity: number; productId?: string; price?: number }[];
  total: number;
}): Promise<UserOrder> {
  const res = await fetch(`${getShopApiBase()}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Buyurtma yaratilmadi");
  return res.json() as Promise<UserOrder>;
}
