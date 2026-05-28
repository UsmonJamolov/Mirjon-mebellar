import { Suspense } from "react";
import { AuthPageContent } from "./AuthPageContent";

export const dynamic = "force-dynamic";

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0c0805] text-white/70">
          Yuklanmoqda...
        </main>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
