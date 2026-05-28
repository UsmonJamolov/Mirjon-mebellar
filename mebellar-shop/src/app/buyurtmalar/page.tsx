import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth-server";
import { listOrdersForCustomer } from "@/lib/order-persistence";
import { OrdersPageClient } from "./OrdersPageClient";

export default async function OrdersPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/auth?callbackUrl=/buyurtmalar");
  }

  const phone = session.user.phone ?? "";
  const userOrders = phone ? await listOrdersForCustomer(phone) : [];

  return <OrdersPageClient userOrders={userOrders} hasPhone={Boolean(phone)} />;
}
