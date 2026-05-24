import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, default: "Material" },
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: "Dona" },
    status: { type: String, enum: ["yetarli", "kam"], default: "yetarli" },
  },
  { timestamps: true }
);

export function toInventoryDto(doc) {
  return {
    id: doc.externalId,
    name: doc.name,
    category: doc.category,
    quantity: doc.quantity,
    unit: doc.unit,
    status: doc.status,
  };
}

export const Inventory = mongoose.model("Inventory", inventorySchema);
