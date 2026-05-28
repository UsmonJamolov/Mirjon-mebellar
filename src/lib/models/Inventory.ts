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

export type InventoryDocument = mongoose.InferSchemaType<typeof inventorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const InventoryModel =
  mongoose.models.Inventory ??
  mongoose.model<InventoryDocument>("Inventory", inventorySchema);

export function toInventoryDto(doc: InventoryDocument) {
  return {
    id: doc.externalId,
    name: doc.name,
    category: doc.category ?? "Material",
    quantity: doc.quantity ?? 0,
    unit: doc.unit ?? "Dona",
    status: doc.status ?? "yetarli",
  };
}

export function inventoryStatus(quantity: number) {
  return quantity < 10 ? "kam" : "yetarli";
}
