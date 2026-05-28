/** Admin (:3000) — shop cookie bilan aralashmasligi uchun alohida nom */
export const ADMIN_SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-mmebellar-admin.session-token"
    : "mmebellar-admin.session-token";

export const authSecret =
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
  "mebellar-admin-dev-secret-change-in-production";

export function adminSessionCookieOptions() {
  const secure = process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure,
  };
}
