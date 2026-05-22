/** Profil bosh harfi */
export function getProfileInitial(
  name?: string | null,
  phone?: string | null,
  email?: string | null
): string {
  const trimmed = name?.trim();
  if (trimmed) return trimmed[0].toUpperCase();
  const p = phone?.replace(/\D/g, "");
  if (p && p.length > 0) return p[p.length - 1].toUpperCase();
  const e = email?.replace(/@mmebel\.local$/, "")?.trim();
  if (e && e[0]) return e[0].toUpperCase();
  return "M";
}
