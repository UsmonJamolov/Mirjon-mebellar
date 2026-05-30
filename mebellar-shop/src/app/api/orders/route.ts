import { NextResponse } from "next/server";
import { getRequestUser } from "@/lib/request-user";
import {
  createOrderFromShop,
  listOrdersForCustomer,
  type OrderItem,
} from "@/lib/order-persistence";
import { normalizePhone } from "@/lib/phone-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getRequestUser(req);
  const phone = user?.phone ?? "";
  const orders = await listOrdersForCustomer(phone);
  return NextResponse.json(orders);
}

/** Checkout — savatdan buyurtma yaratish (admin `data/orders.json` ga tushadi) */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await getRequestUser(req);

    if (!user?.id) {
      return NextResponse.json(
        { error: "To'lov uchun avval ro'yxatdan o'ting" },
        { status: 401 }
      );
    }

    const customerName = String(body.customerName ?? user?.name ?? "").trim();
    const customerPhone = normalizePhone(
      String(body.customerPhone ?? user?.phone ?? "")
    );
    const customerAddress = String(body.customerAddress ?? "").trim();
    const paymentMethod = String(body.paymentMethod ?? "payme");
    const total = Number(body.total) || 0;
    const items = (body.items ?? []) as OrderItem[];

    if (!customerName || customerName.length < 2) {
      return NextResponse.json(
        { error: "Ism kamida 2 harf bo'lishi kerak" },
        { status: 400 }
      );
    }
    if (!customerPhone || customerPhone.replace(/\D/g, "").length < 9) {
      return NextResponse.json(
        { error: "Telefon raqam noto'g'ri" },
        { status: 400 }
      );
    }
    if (!customerAddress || customerAddress.length < 5) {
      return NextResponse.json(
        { error: "Manzil to'liq kiriting" },
        { status: 400 }
      );
    }
    if (!items.length || total <= 0) {
      return NextResponse.json(
        { error: "Savatcha bo'sh yoki summa noto'g'ri" },
        { status: 400 }
      );
    }

    const order = await createOrderFromShop({
      customerName,
      customerPhone,
      customerAddress,
      paymentMethod,
      items,
      total,
    });

    return NextResponse.json({ ok: true, order }, { status: 201 });
  } catch (e) {
    console.error("Shop order create error:", e);
    return NextResponse.json(
      { error: "Buyurtma yaratilmadi" },
      { status: 500 }
    );
  }
}
