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

export function toCategoryDto(doc) {
  return {
    id: doc.externalId,
    name: doc.name,
    slug: doc.slug,
    image: doc.image,
    count: doc.count,
  };
}

export const Category = mongoose.model("Category", categorySchema);
