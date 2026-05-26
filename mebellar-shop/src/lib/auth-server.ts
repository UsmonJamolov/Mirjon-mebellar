import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const SESSION_COOKIE_NAMES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "__Host-next-auth.session-token",
];

function isJwtSessionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes("decryption") ||
    msg.includes("jwt") ||
    msg.includes("jwe") ||
    msg.includes("jwt_session_error")
  );
}

async function clearStaleAuthCookies() {
  try {
    const store = await cookies();
    for (const name of SESSION_COOKIE_NAMES) {
      store.delete(name);
    }
  } catch {
    /* ignore */
  }
}

/** getServerSession — eski/buzilgan cookie da crash qilmaydi */
export async function getAuthSession(): Promise<Session | null> {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    if (isJwtSessionError(error)) {
      await clearStaleAuthCookies();
    }
    return null;
  }
}
