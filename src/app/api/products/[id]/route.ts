import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { dbConnectionMessage } from "@/lib/db-errors";
import { ProductModel, toProductDto } from "@/lib/models/Product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function findProduct(id: string) {
  if (id === "sales") return null;
  return ProductModel.findOne({ externalId: id });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const doc = await findProduct(id);
    if (!doc) {
      return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 });
    }
    return NextResponse.json(toProductDto(doc));
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Mahsulotni yuklashda xato" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const doc = await findProduct(id);
    if (!doc) {
      return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const fields = [
      "name",
      "category",
      "price",
      "material",
      "width",
      "depth",
      "height",
      "description",
      "image",
      "images",
      "isNew",
      "isPopular",
      "isRecommended",
      "hideFromPopular",
    ] as const;

    for (const f of fields) {
      if (body[f] !== undefined) {
        (doc as Record<string, unknown>)[f] = body[f];
      }
    }

    if (body.images && Array.isArray(body.images)) {
      const imgs = body.images.filter((u: unknown) => typeof u === "string" && u.trim());
      doc.images = imgs;
      if (!doc.image && imgs[0]) doc.image = imgs[0];
    }

    await doc.save();
    return NextResponse.json(toProductDto(doc));
  } catch (e) {
    console.error("Product update error:", e);
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Yangilashda xato" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const doc = await findProduct(id);
    if (!doc) {
      return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 });
    }
    await ProductModel.deleteOne({ _id: doc._id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "O'chirishda xato" },
      { status: 500 }
    );
  }
}
