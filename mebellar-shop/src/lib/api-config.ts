/** Express backend (mebellar-api) */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

export const CHAT_API = `${API_BASE}/api/chat`;
