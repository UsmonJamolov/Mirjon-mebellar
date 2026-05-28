import mongoose from "mongoose";
import { normalizeMediaList, normalizeMediaUrl } from "@/lib/media-url";

const productSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true },
    name: String,
    category: String,
    price: Number,
    material: String,
    width: Number,
    depth: Number,
    height: Number,
    description: String,
    image: String,
    images: [String],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    isNew: Boolean,
    isPopular: Boolean,
    isRecommended: Boolean,
    hideFromPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type ProductDocument = mongoose.InferSchemaType<typeof productSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ProductModel =
  mongoose.models.Product ??
  mongoose.model<ProductDocument>("Product", productSchema);

export function toProductDto(doc: ProductDocument) {
  return {
    id: doc.externalId,
    name: doc.name ?? "",
    category: doc.category ?? "",
    price: doc.price ?? 0,
    material: doc.material,
    width: doc.width,
    depth: doc.depth,
    height: doc.height,
    description: doc.description ?? "",
    image: normalizeMediaUrl(doc.image),
    images: normalizeMediaList(doc.images),
    rating: doc.rating ?? 0,
    reviews: doc.reviews ?? 0,
    isNew: doc.isNew,
    isPopular: doc.isPopular,
    isRecommended: doc.isRecommended,
    hideFromPopular: doc.hideFromPopular ?? false,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : undefined,
  };
}
