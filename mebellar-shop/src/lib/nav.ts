/** Nav link active holati */
export function isNavActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const AUTH_ROUTES = ["/auth", "/kirish", "/royxatdan-otish"] as const;

/** Login / register — pastki menyu yashiriladi */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
