import { withAuth } from "next-auth/middleware";

const authSecret =
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
  "mebellar-admin-dev-secret-change-in-production";

export default withAuth({
  secret: authSecret,
  pages: {
    signIn: "/kirish",
  },
  callbacks: {
    authorized: ({ token }) => token?.role === "admin",
  },
});

/** Faqat admin sahifalari — /kirish va /royxatdan-otish middleware dan tashqari */
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
  ],
};
