/** Chat ro'yxati uchun avatar (rasm yoki bosh harflar) */

const AVATAR_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#ef4444",
  "#6366f1",
];

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "M";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function getAvatarColor(name: string): string {
  let hash = 0;
  const s = name.trim() || "mijoz";
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function isValidAvatarUrl(url?: string | null): boolean {
  if (!url?.trim()) return false;
  const u = url.trim();
  return u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/");
}

export function formatPhoneDisplay(phone?: string): string {
  if (!phone?.trim() || phone === "—") return "";
  return phone.trim();
}
