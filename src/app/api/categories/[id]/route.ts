import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { dbConnectionMessage } from "@/lib/db-errors";
import { CategoryModel, slugify, toCategoryDto } from "@/lib/models/Category";
import { ProductModel } from "@/lib/models/Product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function findCategory(id: string) {
  return CategoryModel.findOne({
    $or: [{ externalId: id }, { slug: id }],
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const doc = await findCategory(id);
    if (!doc) {
      return NextResponse.json({ error: "Kategoriya topilmadi" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const newName = body.name !== undefined ? String(body.name).trim() : "";
    const oldName = doc.name ?? "";

    if (newName && newName !== oldName) {
      const duplicate = await CategoryModel.findOne({
        name: { $regex: new RegExp(`^${newName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
        externalId: { $ne: doc.externalId },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: "Bunday kategoriya allaqachon mavjud" },
          { status: 400 }
        );
      }

      doc.name = newName;
      let slug = slugify(newName);
      const slugTaken = await CategoryModel.findOne({
        slug,
        externalId: { $ne: doc.externalId },
      });
      if (slugTaken) slug = `${slug}-${Date.now().toString().slice(-4)}`;
      doc.slug = slug;

      await ProductModel.updateMany({ category: oldName }, { $set: { category: newName } });
    }

    if (body.image !== undefined) {
      doc.image = String(body.image).trim() || doc.image;
    }

    const count = await ProductModel.countDocuments({ category: doc.name });
    doc.count = count;

    await doc.save();
    return NextResponse.json(toCategoryDto(doc));
  } catch (e) {
    console.error("Category update error:", e);
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Kategoriya yangilanmadi" },
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
    const doc = await findCategory(id);
    if (!doc) {
      return NextResponse.json({ error: "Kategoriya topilmadi" }, { status: 404 });
    }

    const productCount = await ProductModel.countDocuments({ category: doc.name });
    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Bu kategoriyada ${productCount} ta mahsulot bor. Avval mahsulotlarni boshqa kategoriyaga o'tkazing.`,
          productCount,
        },
        { status: 400 }
      );
    }

    await CategoryModel.deleteOne({ _id: doc._id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Category delete error:", e);
    const hint = dbConnectionMessage(e);
    return NextResponse.json(
      { error: hint ?? "Kategoriya o'chirilmadi" },
      { status: 500 }
    );
  }
}
