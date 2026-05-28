import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  ADMIN_SESSION_COOKIE_NAME,
  authSecret,
} from "@/lib/auth-cookies";

const PUBLIC_PATHS = new Set(["/kirish", "/royxatdan-otish"]);

function isProtectedPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return false;
  return (
    pathname === "/" ||
    pathname.startsWith("/buyurtmalar") ||
    pathname.startsWith("/mijozlar") ||
    pathname.startsWith("/mahsulotlar") ||
    pathname.startsWith("/ombor") ||
    pathname.startsWith("/eskizlar") ||
    pathname.startsWith("/xabarlar") ||
    pathname.startsWith("/hisobotlar") ||
    pathname.startsWith("/sozlamalar") ||
    pathname.startsWith("/ko-proq")
  );
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api") || !isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const hasCookie = Boolean(req.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value);

  let token: Awaited<ReturnType<typeof getToken>> | null = null;
  if (hasCookie) {
    try {
      token = await getToken({
        req,
        secret: authSecret,
        cookieName: ADMIN_SESSION_COOKIE_NAME,
      });
    } catch {
      token = null;
    }
  }

  if (!token || token.role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/kirish";
    url.searchParams.set("callbackUrl", `${pathname}${req.nextUrl.search}`);
    const res = NextResponse.redirect(url);
    if (hasCookie) {
      res.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/buyurtmalar/:path*",
    "/mijozlar/:path*",
    "/mahsulotlar/:path*",
    "/ombor/:path*",
    "/eskizlar/:path*",
    "/xabarlar/:path*",
    "/hisobotlar/:path*",
    "/sozlamalar/:path*",
    "/ko-proq/:path*",
    "/kirish",
    "/royxatdan-otish",
  ],
};
