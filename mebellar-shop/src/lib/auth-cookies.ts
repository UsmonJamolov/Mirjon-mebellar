/** Shop (:3001) — admin cookie bilan aralashmasligi uchun alohida nom */
export const SHOP_SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-mmebellar-shop.session-token"
    : "mmebellar-shop.session-token";

export const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
  "mebellar-dev-secret-change-in-production";

export function shopSessionCookieOptions() {
  const secure = process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure,
  };
}
