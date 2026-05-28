import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { dbConnectionMessage } from "@/lib/db-errors";
import { CategoryModel, slugify, toCategoryDto } from "@/lib/models/Category";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_CATEGORIES = [
  { externalId: "1", name: "Oshxona", slug: "oshxona", count: 0 },
  { externalId: "2", name: "Yotoqxona", slug: "yotoqxona", count: 0 },
  { externalId: "3", name: "Ofis", slug: "ofis", count: 0 },
  { externalId: "4", name: "Mehmonxona", slug: "mehmonxona", count: 0 },
  { externalId: "5", name: "Bolalar", slug: "bolalar", count: 0 },
];

async function ensureDefaultCategories() {
  const count = await CategoryModel.countDocuments();
  if (count > 0) return;
  await CategoryModel.insertMany(
    DEFAULT_CATEGORIES.map((c) => ({
      ...c,
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    }))
  );
}

export async function GET() {
  try {
    await connectDB();
    await ensureDefaultCategories();
    const docs = await CategoryModel.find().sort({ name: 1 });
    return NextResponse.json(docs.map(toCategoryDto));
  } catch (e) {
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Kategoriyalarni yuklashda xato" },
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
      return NextResponse.json({ error: "Kategoriya nomi kerak" }, { status: 400 });
    }

    const existing = await CategoryModel.findOne({
      name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });
    if (existing) {
      return NextResponse.json(toCategoryDto(existing));
    }

    let slug = slugify(name) || `cat-${Date.now()}`;
    const slugTaken = await CategoryModel.findOne({ slug });
    if (slugTaken) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const doc = await CategoryModel.create({
      externalId: `cat-${Date.now()}`,
      name,
      slug,
      image:
        String(body.image ?? "").trim() ||
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      count: 0,
    });

    return NextResponse.json(toCategoryDto(doc), { status: 201 });
  } catch (e) {
    console.error("Category create error:", e);
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Kategoriya qo'shishda xato" },
      { status: 500 }
    );
  }
}
