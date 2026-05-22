import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    id: String,
    sender: { type: String, enum: ["customer", "admin"] },
    text: String,
    sketch: mongoose.Schema.Types.Mixed,
    createdAt: String,
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    threadId: { type: String, required: true, unique: true },
    customerName: String,
    status: {
      type: String,
      enum: ["kelishuv", "mijoz_rozi", "sotuvchi_rozi", "buyurtma_boshlandi"],
      default: "kelishuv",
    },
    customerAgreed: { type: Boolean, default: false },
    adminAgreed: { type: Boolean, default: false },
    messages: [messageSchema],
    activeSketch: mongoose.Schema.Types.Mixed,
    adminLastSeenAt: { type: String, default: null },
    orderRound: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const ChatThread = mongoose.model("ChatThread", chatSchema);
