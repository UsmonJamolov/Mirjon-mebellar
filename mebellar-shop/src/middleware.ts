import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/kirish",
  },
});

export const config = {
  matcher: ["/profil", "/buyurtmalar/:path*"],
};
