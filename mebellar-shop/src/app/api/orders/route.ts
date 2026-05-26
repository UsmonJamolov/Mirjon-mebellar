import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-server";
import { listOrdersForCustomer } from "@/lib/order-persistence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAuthSession();
  const phone = session?.user?.phone ?? "";
  const orders = await listOrdersForCustomer(phone);
  return NextResponse.json(orders);
}
