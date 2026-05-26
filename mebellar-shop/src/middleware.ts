import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { AUTH_SECRET } from "@/lib/auth-secret";

const SESSION_COOKIE_NAMES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "__Host-next-auth.session-token",
] as const;

function deleteAuthCookies(res: NextResponse) {
  for (const name of SESSION_COOKIE_NAMES) {
    res.cookies.set(name, "", {
      maxAge: 0,
      path: "/",
    });
  }
}

function isProtectedPath(pathname: string) {
  return (
    pathname === "/profil" ||
    pathname.startsWith("/profil/") ||
    pathname === "/buyurtmalar" ||
    pathname.startsWith("/buyurtmalar/")
  );
}

function buildLoginUrl(req: NextRequest) {
  const callbackUrl = `${req.nextUrl.pathname}${req.nextUrl.search}`;
  const url = req.nextUrl.clone();
  url.pathname = "/kirish";
  url.searchParams.set("callbackUrl", callbackUrl);
  return url;
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const hasSessionCookie = SESSION_COOKIE_NAMES.some((n) => Boolean(req.cookies.get(n)?.value));

  let token: Awaited<ReturnType<typeof getToken>> | null = null;
  if (hasSessionCookie) {
    try {
      token = await getToken({ req, secret: AUTH_SECRET });
    } catch {
      // Cookie buzilgan yoki secret o'zgargan — cookie'ni tozalaymiz
      if (isProtectedPath(pathname)) {
        const res = NextResponse.redirect(buildLoginUrl(req));
        deleteAuthCookies(res);
        return res;
      }
      const res = NextResponse.next();
      deleteAuthCookies(res);
      return res;
    }
  }

  if (isProtectedPath(pathname)) {
    if (!token) {
      const res = NextResponse.redirect(buildLoginUrl(req));
      if (hasSessionCookie) deleteAuthCookies(res);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
