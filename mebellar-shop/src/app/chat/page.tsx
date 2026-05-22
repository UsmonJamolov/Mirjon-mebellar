import { Suspense } from "react";
import { ChatPageContent } from "./ChatPageContent";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500 text-sm">
          Chat yuklanmoqda...
        </main>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
