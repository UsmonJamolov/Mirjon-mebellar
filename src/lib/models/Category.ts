import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true },
    name: String,
    slug: { type: String, unique: true },
    image: String,
    count: Number,
  },
  { timestamps: true }
);

export type CategoryDocument = mongoose.InferSchemaType<typeof categorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const CategoryModel =
  mongoose.models.Category ??
  mongoose.model<CategoryDocument>("Category", categorySchema);

export function toCategoryDto(doc: CategoryDocument) {
  return {
    id: doc.externalId,
    name: doc.name ?? "",
    slug: doc.slug ?? "",
    image: doc.image ?? "",
    count: doc.count ?? 0,
  };
}

export function slugify(name: string): string {
  let s = name.trim().toLowerCase();
  s = s.replace(/o[''`]/g, "o").replace(/g[''`]/g, "g");
  s = s.replace(/[''`]/g, "");
  s = s.replace(/\s+/g, "-");
  s = s.replace(/[^a-z0-9-]/g, "");
  return s.replace(/-+/g, "-").replace(/^-|-$/g, "") || `cat-${Date.now()}`;
}
