import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { AUTH_SECRET, SHOP_SESSION_COOKIE_NAME } from "@/lib/auth-cookies";
import { buildAuthRedirectUrl, isAuthRequiredPath } from "@/lib/auth-protected";

function isProtectedPath(pathname: string) {
  return (
    isAuthRequiredPath(pathname) ||
    pathname === "/profil" ||
    pathname.startsWith("/profil/") ||
    pathname === "/buyurtmalar" ||
    pathname.startsWith("/buyurtmalar/")
  );
}

function buildLoginUrl(req: NextRequest) {
  const callbackUrl = `${req.nextUrl.pathname}${req.nextUrl.search}`;
  const url = req.nextUrl.clone();
  url.pathname = "/auth";
  url.search = "";
  const redirect = buildAuthRedirectUrl(callbackUrl);
  const q = redirect.split("?")[1];
  if (q) url.search = `?${q}`;
  return url;
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const hasCookie = Boolean(req.cookies.get(SHOP_SESSION_COOKIE_NAME)?.value);

  let token: Awaited<ReturnType<typeof getToken>> | null = null;
  if (hasCookie) {
    try {
      token = await getToken({
        req,
        secret: AUTH_SECRET,
        cookieName: SHOP_SESSION_COOKIE_NAME,
      });
    } catch {
      token = null;
    }
  }

  if (!token) {
    const res = NextResponse.redirect(buildLoginUrl(req));
    if (hasCookie) {
      res.cookies.set(SHOP_SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/chat/:path*",
    "/savatcha/:path*",
    "/sevimlilar/:path*",
    "/eskiz/:path*",
    "/checkout",
    "/checkout/:path*",
    "/profil/:path*",
    "/buyurtmalar/:path*",
  ],
};
