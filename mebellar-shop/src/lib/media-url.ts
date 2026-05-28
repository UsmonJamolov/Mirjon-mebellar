/** Mahsulot rasmlari — telefonda localhost URL ishlamaydi */

export function normalizeMediaUrl(url?: string | null): string {
  if (!url?.trim()) return "";
  const raw = url.trim();

  if (raw.startsWith("/")) return raw;

  try {
    const parsed = new URL(raw);
    if (parsed.pathname.startsWith("/uploads/")) {
      return `${parsed.pathname}${parsed.search}`;
    }
  } catch {
    /* relative yoki noto'g'ri URL */
  }

  return raw;
}

export function normalizeMediaList(urls?: string[] | null): string[] {
  if (!urls?.length) return [];
  return urls.map((u) => normalizeMediaUrl(u)).filter(Boolean);
}
