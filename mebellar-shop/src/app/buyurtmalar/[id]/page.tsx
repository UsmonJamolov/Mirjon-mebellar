import Link from "next/link";
import { notFound } from "next/navigation";
import { userOrders, formatPrice, getOrderStatusLabel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyle: Record<string, string> = {
  yangi: "bg-[#f4a261]/20 text-[#c97b3f]",
  jarayonda: "bg-amber-100 text-amber-700",
  tugallangan: "bg-green-100 text-green-700",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = userOrders.find((o) => o.id === id);
  if (!order) notFound();

  const steps = ["yangi", "jarayonda", "tugallangan"] as const;
  const currentIdx = steps.indexOf(order.status as (typeof steps)[number]);

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <Link href="/buyurtmalar" className="text-sm text-[#f4a261] hover:underline mb-6 inline-block">
        ← Buyurtmalarim
      </Link>

      <div className="card p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold">Buyurtma #{order.id}</h1>
            <p className="text-sm text-gray-500">{order.date}</p>
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
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
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {i + 1}
              </div>
              <p className="text-[10px] mt-2 text-center text-gray-500">
                {getOrderStatusLabel(step)}
              </p>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-4 left-1/2 w-full h-0.5",
                    i < currentIdx ? "bg-[#f4a261]" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <h2 className="font-semibold mb-3">Mahsulotlar</h2>
        <ul className="space-y-2 text-sm text-gray-600 mb-6">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between py-2 border-b border-gray-50">
              <span>{item.name}</span>
              <span>×{item.quantity}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between text-lg font-bold pt-4 border-t">
          <span>Jami</span>
          <span className="text-[#f4a261]">{formatPrice(order.total)}</span>
        </div>
      </div>

      <Link href="/chat" className="btn-accent block text-center mt-6">
        Savdo bilan bog&apos;lanish
      </Link>
    </main>
  );
}
