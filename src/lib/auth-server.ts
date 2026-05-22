import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export function getAdminSession() {
  return getServerSession(authOptions);
}
