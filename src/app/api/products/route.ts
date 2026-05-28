import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { dbConnectionMessage } from "@/lib/db-errors";
import { ProductModel, toProductDto } from "@/lib/models/Product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const filter: Record<string, unknown> = {};

    if (searchParams.get("popular") === "true") filter.isPopular = true;
    if (searchParams.get("recommended") === "true") filter.isRecommended = true;
    if (searchParams.get("category")) filter.category = searchParams.get("category");
    if (searchParams.get("q")) {
      filter.name = { $regex: searchParams.get("q"), $options: "i" };
    }

    const docs = await ProductModel.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(docs.map(toProductDto));
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Mahsulotlarni yuklashda xato" },
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
      return NextResponse.json({ error: "Mahsulot nomi kerak" }, { status: 400 });
    }
    if (!String(body.category ?? "").trim()) {
      return NextResponse.json({ error: "Kategoriya tanlang" }, { status: 400 });
    }

    const externalId = String(body.id ?? `p-${Date.now()}`);
    const images = Array.isArray(body.images)
      ? body.images.filter((u: unknown) => typeof u === "string" && u.trim())
      : [];
    const image =
      String(body.image ?? "").trim() || images[0] || "/images/products/1.jpg";

    const doc = await ProductModel.create({
      externalId,
      name,
      category: String(body.category).trim(),
      price: Number(body.price) || 0,
      material: String(body.material ?? "").trim() || undefined,
      width: Number(body.width) || 0,
      depth: Number(body.depth) || 0,
      height: Number(body.height) || 0,
      description: String(body.description ?? "").trim(),
      image,
      images: images.length ? images : [image],
      isNew: Boolean(body.isNew),
      isPopular: Boolean(body.isPopular),
      isRecommended: Boolean(body.isRecommended),
      hideFromPopular: Boolean(body.hideFromPopular),
    });

    return NextResponse.json(toProductDto(doc), { status: 201 });
  } catch (e) {
    console.error("Product create error:", e);
    const hint = dbConnectionMessage(e);
    const msg =
      e instanceof Error && e.message.includes("duplicate")
        ? "Bunday ID bilan mahsulot mavjud"
        : hint ?? "Mahsulot yaratishda xato";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
