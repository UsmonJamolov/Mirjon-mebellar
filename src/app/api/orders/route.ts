import { NextRequest, NextResponse } from "next/server";
import {
  createManualOrder,
  listOrders,
  type OrderStatus,
} from "@/lib/order-persistence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const data = await listOrders({
    status: searchParams.get("status") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = await createManualOrder({
      customerName: String(body.customerName ?? "Mijoz"),
      customerPhone: String(body.customerPhone ?? ""),
      total: Number(body.total) || 0,
      status: (body.status as OrderStatus) ?? "yangi",
      items: body.items,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Buyurtma yaratilmadi" }, { status: 500 });
  }
}
