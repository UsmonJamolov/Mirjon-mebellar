/** NextAuth secret — bitta manba (mongoose bog‘lamasdan) */
export const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
  "mebellar-dev-secret-change-in-production";
