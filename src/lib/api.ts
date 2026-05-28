const API_BASE =
  typeof window !== "undefined"
    ? ""
    : process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:4000";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      cache: "no-store",
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error || "So'rov xatosi");
    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

export type OrderDto = {
  id: string;
  date: string;
  total: number;
  status: string;
  customerName: string;
  items?: { name: string; quantity: number; price?: number }[];
};

export type ProductDto = {
  id: string;
  name: string;
  category: string;
  price: number;
  material?: string;
  width?: number;
  depth?: number;
  height?: number;
  description?: string;
  image?: string;
  images?: string[];
  isRecommended?: boolean;
  isPopular?: boolean;
  hideFromPopular?: boolean;
};

export type CustomerDto = {
  id: string;
  name: string;
  phone: string;
  address: string;
  registeredAt: string;
  status: string;
  avatar: string;
  notes: string[];
  orders: OrderDto[];
  lastOrderDate?: string;
};

export type InventoryDto = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: string;
};

export type ThreadDto = {
  id: string;
  customerName: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerPhone?: string;
  customerAvatar?: string;
  customerTelegramUsername?: string;
  lastMessage: string;
  time: string;
  isLive?: boolean;
  unread?: number;
  status?: string;
};

export type ReportSummary = {
  totalOrders: number;
  newOrders: number;
  totalIncome: number;
  activeCustomers: number;
  incomeChartData: { day: string; summa: number }[];
  salesByCategory: { name: string; value: number; color: string }[];
  avgCheck: number;
};

export type SettingsDto = {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  timezone: string;
  logo: string;
  materials: string[];
};

export const adminApi = {
  getReports: () => api<ReportSummary>("/api/reports/summary"),
  getOrders: (params?: { status?: string; q?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    if (params?.q) q.set("q", params.q);
    const qs = q.toString();
    return api<OrderDto[]>(`/api/orders${qs ? `?${qs}` : ""}`);
  },
  getOrder: (id: string) => api<OrderDto>(`/api/orders/${encodeURIComponent(id)}`),
  createOrder: (body: Record<string, unknown>) =>
    api<OrderDto>("/api/orders", { method: "POST", body: JSON.stringify(body) }),
  patchOrder: (id: string, body: Record<string, unknown>) =>
    api<OrderDto>(`/api/orders/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  getCustomers: (q?: string) =>
    api<CustomerDto[]>(`/api/customers${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  deleteCustomer: (id: string) =>
    api<{ ok: boolean; deletedOrders: number }>(`/api/customers/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  getProducts: () => api<ProductDto[]>("/api/products"),
  getProduct: (id: string) => api<ProductDto>(`/api/products/${id}`),
  createProduct: (body: Record<string, unknown>) =>
    api<ProductDto>("/api/products", { method: "POST", body: JSON.stringify(body) }),
  updateProduct: (id: string, body: Record<string, unknown>) =>
    api<ProductDto>(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteProduct: (id: string) =>
    api<{ ok: boolean }>(`/api/products/${id}`, { method: "DELETE" }),
  getCategories: () => api<{ id: string; name: string; slug: string }[]>("/api/categories"),
  createCategory: (name: string) =>
    api<{ id: string; name: string }>("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  updateCategory: (id: string, body: { name?: string; image?: string }) =>
    api<{ id: string; name: string; slug?: string }>(`/api/categories/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteCategory: (id: string) =>
    api<{ ok: boolean }>(`/api/categories/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  getInventory: (params?: { q?: string; category?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.q) q.set("q", params.q);
    if (params?.category) q.set("category", params.category);
    if (params?.status) q.set("status", params.status);
    const qs = q.toString();
    return api<InventoryDto[]>(`/api/inventory${qs ? `?${qs}` : ""}`);
  },
  createInventory: (body: Record<string, unknown>) =>
    api<InventoryDto>("/api/inventory", { method: "POST", body: JSON.stringify(body) }),
  getSettings: () => api<SettingsDto>("/api/settings"),
  saveSettings: (body: Partial<SettingsDto>) =>
    api<SettingsDto>("/api/settings", { method: "PATCH", body: JSON.stringify(body) }),
  addMaterial: (name: string) =>
    api<{ materials: string[] }>("/api/settings/materials", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  getChatThreads: () => api<ThreadDto[]>("/api/chat/threads"),
  deleteChatThread: (id: string) =>
    api<{ ok: boolean }>(`/api/chat/threads/${id}`, { method: "DELETE" }),
  saveSketch: (body: Record<string, unknown>) =>
    api<{ id: string }>("/api/sketches", { method: "POST", body: JSON.stringify(body) }),
};

export function formatPrice(n: number): string {
  return `${Math.round(n).toLocaleString("uz-UZ")} so'm`;
}
