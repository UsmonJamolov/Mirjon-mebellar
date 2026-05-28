import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    image: { type: String, default: "" },
    passwordHash: { type: String, select: false },
    telegramId: { type: String, default: "", index: true },
    telegramUsername: { type: String, default: "" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true }
);

export type UserDocument = mongoose.InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const User =
  mongoose.models.User ?? mongoose.model<UserDocument>("User", userSchema);
