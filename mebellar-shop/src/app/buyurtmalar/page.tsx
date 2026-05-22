import Link from "next/link";
import { fetchOrders } from "@/lib/api";
import { formatPrice, getOrderStatusLabel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyle: Record<string, string> = {
  yangi: "bg-[#f4a261]/20 text-[#c97b3f]",
  jarayonda: "bg-amber-100 text-amber-700",
  tugallangan: "bg-green-100 text-green-700",
};

export default async function OrdersPage() {
  const userOrders = await fetchOrders();

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="text-2xl font-bold mb-2">Buyurtmalarim</h1>
      <p className="text-gray-500 text-sm mb-8">Buyurtmalaringiz holatini kuzating</p>

      <ul className="space-y-4">
        {userOrders.map((order) => (
          <li key={order.id} className="card p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold">#{order.id}</p>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>
              <span
                className={cn(
                  "text-xs font-medium px-3 py-1 rounded-full",
                  statusStyle[order.status] ?? "bg-gray-100"
                )}
              >
                {getOrderStatusLabel(order.status)}
              </span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mb-3">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="font-bold">{formatPrice(order.total)}</span>
              <Link
                href={`/buyurtmalar/${order.id}`}
                className="text-sm text-[#f4a261] font-medium hover:underline"
              >
                Batafsil →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
