import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

export function toProductDto(doc) {
  return {
    id: doc.externalId,
    name: doc.name,
    category: doc.category,
    price: doc.price,
    material: doc.material,
    width: doc.width,
    depth: doc.depth,
    height: doc.height,
    description: doc.description,
    image: doc.image,
    images: doc.images ?? [],
    rating: doc.rating,
    reviews: doc.reviews,
    isNew: doc.isNew,
    isPopular: doc.isPopular,
    isRecommended: doc.isRecommended,
  };
}

export const Product = mongoose.model("Product", productSchema);
