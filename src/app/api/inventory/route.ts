import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { dbConnectionMessage } from "@/lib/db-errors";
import {
  InventoryModel,
  inventoryStatus,
  toInventoryDto,
} from "@/lib/models/Inventory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const filter: Record<string, unknown> = {};

    const q = searchParams.get("q");
    if (q) filter.name = { $regex: q, $options: "i" };
    if (searchParams.get("category")) filter.category = searchParams.get("category");
    if (searchParams.get("status")) filter.status = searchParams.get("status");

    const docs = await InventoryModel.find(filter).sort({ name: 1 });
    return NextResponse.json(docs.map(toInventoryDto));
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Ombor yuklashda xato" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const name = String(body.name ?? "").trim();
    if (!name) {
      return NextResponse.json({ error: "Material nomi kerak" }, { status: 400 });
    }

    const quantity = Number(body.quantity) || 0;
    const doc = await InventoryModel.create({
      externalId: `inv-${Date.now()}`,
      name,
      category: String(body.category ?? "Material").trim() || "Material",
      quantity,
      unit: String(body.unit ?? "Dona").trim() || "Dona",
      status: inventoryStatus(quantity),
    });

    return NextResponse.json(toInventoryDto(doc), { status: 201 });
  } catch (e) {
    console.error("Inventory create error:", e);
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Qo'shishda xato" },
      { status: 500 }
    );
  }
}
