import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth-options";

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

/** getServerSession — eski/buzilgan cookie da crash qilmaydi */
export async function getAuthSession(): Promise<Session | null> {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    if (isJwtSessionError(error)) {
      console.warn("[auth] JWT sessiya o'qilmadi:", (error as Error).message);
    }
    return null;
  }
}
