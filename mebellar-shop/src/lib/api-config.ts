/** Do'kon o'z API route'lari (MongoDB) */
export function getShopApiBase(): string {
  if (typeof window !== "undefined") return "";
  return (
    process.env.INTERNAL_SHOP_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:3001"
  );
}

/** Chat hali alohida backendda bo'lishi mumkin */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

export const CHAT_API = `${API_BASE}/api/chat`;
