import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    date: String,
    total: Number,
    status: {
      type: String,
      enum: ["yangi", "jarayonda", "tugallangan", "bekor"],
      default: "yangi",
    },
    customerName: String,
    customerPhone: String,
    customerAddress: String,
    items: [{ name: String, quantity: Number, productId: String, price: Number }],
    source: { type: String, default: "manual" },
    chatRound: { type: Number, default: null },
  },
  { timestamps: true }
);

export function toOrderDto(doc) {
  return {
    id: doc.orderNumber,
    date: doc.date,
    total: doc.total,
    status: doc.status,
    customerName: doc.customerName,
    items: doc.items,
  };
}

export const Order = mongoose.model("Order", orderSchema);
