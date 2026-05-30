import { SignJWT, jwtVerify } from "jose";
import { AUTH_SECRET } from "@/lib/auth-cookies";

export const MOBILE_JWT_ISSUER = "mmebellar-mobile";
export const MOBILE_TOKEN_HEADER = "authorization";

export interface MobileUserPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  role: string;
}

function secretKey() {
  return new TextEncoder().encode(AUTH_SECRET);
}

export async function signMobileToken(user: MobileUserPayload): Promise<string> {
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image ?? "",
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(MOBILE_JWT_ISSUER)
    .setExpirationTime("30d")
    .sign(secretKey());
}

export async function verifyMobileToken(
  token: string
): Promise<MobileUserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: MOBILE_JWT_ISSUER,
    });
    const id = String(payload.id ?? "");
    if (!id) return null;
    return {
      id,
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
      phone: String(payload.phone ?? ""),
      image: String(payload.image ?? ""),
      role: String(payload.role ?? "customer"),
    };
  } catch {
    return null;
  }
}

export function getBearerToken(req: Request): string | null {
  const header = req.headers.get(MOBILE_TOKEN_HEADER);
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}
