import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth-server";
import { getOrderForCustomer } from "@/lib/order-persistence";
import { formatPrice, getOrderStatusLabel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyle: Record<string, string> = {
  yangi: "bg-[#f4a261]/20 text-[#c97b3f] dark:bg-[#f4a261]/15 dark:text-[#f4a261]",
  jarayonda: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  tugallangan: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  bekor: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300",
};

const sourceLabel: Record<string, string> = {
  shop: "Do'kon buyurtmasi",
  chat: "Chat buyurtmasi",
  manual: "Admin buyurtmasi",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/auth?callbackUrl=/buyurtmalar");
  }

  const { id } = await params;
  const phone = session.user.phone ?? "";
  const order = phone ? await getOrderForCustomer(phone, id) : null;
  if (!order) notFound();

  const steps = ["yangi", "jarayonda", "tugallangan"] as const;
  const currentIdx = steps.indexOf(order.status as (typeof steps)[number]);

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <Link
        href="/buyurtmalar"
        className="text-sm text-[#f4a261] hover:underline mb-6 inline-block"
      >
        ← Buyurtmalarim
      </Link>

      <div className="card p-6">
        <div className="flex justify-between items-start mb-6 gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#3d3229] dark:text-[#f5f0e8]">
              Buyurtma #{order.id}
            </h1>
            <p className="text-sm text-gray-500 dark:text-[#b5a898]">{order.date}</p>
            <p className="text-xs text-[#6b5f52] dark:text-[#b5a898] mt-1">
              {sourceLabel[order.source] ?? order.source}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium shrink-0",
              statusStyle[order.status]
            )}
          >
            {getOrderStatusLabel(order.status)}
          </span>
        </div>

        <div className="flex justify-between mb-8">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-col items-center flex-1 relative">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold z-10",
                  i <= currentIdx
                    ? "bg-[#f4a261] text-white"
                    : "bg-gray-200 dark:bg-[#3d3229] text-gray-500 dark:text-[#b5a898]"
                )}
              >
                {i + 1}
              </div>
              <p className="text-[10px] mt-2 text-center text-gray-500 dark:text-[#b5a898]">
                {getOrderStatusLabel(step)}
              </p>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-4 left-1/2 w-full h-0.5",
                    i < currentIdx ? "bg-[#f4a261]" : "bg-gray-200 dark:bg-[#3d3229]"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {order.customerAddress && (
          <div className="mb-6 rounded-[14px] bg-[#faf6ef] dark:bg-[#231b16] px-4 py-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b5f52] dark:text-[#b5a898] mb-1">
              Yetkazish manzili
            </p>
            <p className="text-[#3d3229] dark:text-[#f5f0e8]">{order.customerAddress}</p>
          </div>
        )}

        <h2 className="font-semibold mb-3 text-[#3d3229] dark:text-[#f5f0e8]">
          Mahsulotlar
        </h2>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-[#b5a898] mb-6">
          {order.items.map((item, i) => (
            <li
              key={i}
              className="flex justify-between py-2 border-b border-gray-50 dark:border-[#3d3229]"
            >
              <span>{item.name}</span>
              <span>×{item.quantity}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-100 dark:border-[#3d3229]">
          <span className="text-[#3d3229] dark:text-[#f5f0e8]">Jami</span>
          <span className="text-[#f4a261]">{formatPrice(order.total)}</span>
        </div>
      </div>

      {order.source === "chat" ? (
        <Link href="/chat" className="btn-accent block text-center mt-6">
          Savdo bilan bog&apos;lanish
        </Link>
      ) : (
        <Link
          href="/katalog"
          className="btn-accent block text-center mt-6"
        >
          Yana xarid qilish
        </Link>
      )}
    </main>
  );
}
