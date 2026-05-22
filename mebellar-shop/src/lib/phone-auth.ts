/** Telefon → login email (ichki, foydalanuvchi ko‘rmaydi) */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("998") && digits.length >= 12) return `+${digits.slice(0, 12)}`;
  if (digits.length === 9) return `+998${digits}`;
  if (digits.length >= 9) return `+${digits}`;
  return raw.trim();
}

export function phoneToLoginEmail(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `${digits || "unknown"}@mmebel.local`;
}

export function isEmailLike(value: string): boolean {
  return value.includes("@");
}
