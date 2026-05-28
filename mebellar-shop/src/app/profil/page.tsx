import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth-server";
import { ProfilePageContent } from "./ProfilePageContent";

export default async function ProfilePage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/auth?callbackUrl=/profil");
  }

  return <ProfilePageContent session={session} />;
}
