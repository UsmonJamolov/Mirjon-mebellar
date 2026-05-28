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
