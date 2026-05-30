import Constants from "expo-constants";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://10.181.191.114:3001";

export const BOT_USERNAME =
  process.env.EXPO_PUBLIC_BOT_USERNAME?.trim() || "mmebeluz_bot";

export function resolveMediaUrl(url?: string | null): string {
  if (!url?.trim()) return "";
  const raw = url.trim();
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return `${API_URL}${raw}`;
  return raw;
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function request<T>(
  path: string,
  init?: RequestInit & { auth?: boolean }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };
  if (init?.auth !== false && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `API ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getCategories: () => request<import("../types").Category[]>("/api/categories"),
  getProducts: (params?: {
    cat?: string;
    q?: string;
    popular?: boolean;
    recommended?: boolean;
  }) => {
    const qs = new URLSearchParams();
    if (params?.cat) qs.set("cat", params.cat);
    if (params?.q) qs.set("q", params.q);
    if (params?.popular) qs.set("popular", "true");
    if (params?.recommended) qs.set("recommended", "true");
    const q = qs.toString();
    return request<import("../types").Product[]>(
      `/api/products${q ? `?${q}` : ""}`
    );
  },
  getProduct: (id: string) =>
    request<import("../types").Product>(`/api/products/${encodeURIComponent(id)}`),
  getSettings: () =>
    request<{ storeName: string; logo: string }>("/api/settings"),
  otpStart: () =>
    request<import("../types").OtpSession>("/api/auth/otp/start", {
      method: "POST",
    }),
  otpResume: (token: string) =>
    request<import("../types").OtpSession>(
      `/api/auth/otp/resume?token=${encodeURIComponent(token)}`
    ),
  otpStatus: (token: string) =>
    request<{
      ok: boolean;
      state?: string;
      hasTelegram?: boolean;
      telegramName?: string;
      phone?: string;
    }>(`/api/auth/otp/status?token=${encodeURIComponent(token)}`),
  otpResend: (token: string) =>
    request<{ ok: boolean }>("/api/auth/otp/resend", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  mobileSignIn: (token: string, code: string) =>
    request<{ ok: boolean; accessToken: string; user: import("../types").AuthUser }>(
      "/api/auth/mobile/sign-in",
      { method: "POST", body: JSON.stringify({ token, code }), auth: false }
    ),
  me: () =>
    request<{ ok: boolean; user: import("../types").AuthUser }>("/api/auth/mobile/me"),
  getOrders: () => request<import("../types").UserOrder[]>("/api/orders"),
  createOrder: (body: object) =>
    request<{ ok: boolean; order: import("../types").UserOrder }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateProfile: (name: string, phone: string) =>
    request<{ ok: boolean; name: string; phone: string }>("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify({ name, phone }),
    }),
  chat: (body: object) =>
    request<object>("/api/chat", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getChat: () => request<object>("/api/chat"),
};

export { Constants };
