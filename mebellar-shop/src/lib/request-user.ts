import type { Session } from "next-auth";
import { getAuthSession } from "@/lib/auth-server";
import { getBearerToken, verifyMobileToken } from "@/lib/mobile-auth";

export interface RequestUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  role: string;
}

/** NextAuth cookie yoki mobil Bearer JWT */
export async function getRequestUser(req?: Request): Promise<RequestUser | null> {
  if (req) {
    const bearer = getBearerToken(req);
    if (bearer) {
      const mobile = await verifyMobileToken(bearer);
      if (mobile) return mobile;
    }
  }

  const session = await getAuthSession();
  if (!session?.user?.id) return null;

  return sessionToUser(session);
}

export function sessionToUser(session: Session): RequestUser {
  return {
    id: session.user.id,
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    phone: session.user.phone ?? "",
    image: session.user.image ?? "",
    role: (session.user as { role?: string }).role ?? "customer",
  };
}
