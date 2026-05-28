/** Faqat ro'yxatdan o'tgan (login) foydalanuvchilar uchun sahifalar */

export const AUTH_REQUIRED_PATHS = [
  "/chat",
  "/savatcha",
  "/sevimlilar",
  "/eskiz",
  "/checkout",
] as const;

export function isAuthRequiredPath(pathname: string): boolean {
  return AUTH_REQUIRED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function buildAuthRedirectUrl(callbackPath: string): string {
  const cb =
    callbackPath.startsWith("/") && !callbackPath.startsWith("/auth")
      ? callbackPath
      : "/";
  return `/auth?callbackUrl=${encodeURIComponent(cb)}`;
}
