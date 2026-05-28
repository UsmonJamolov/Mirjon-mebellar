import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    storeName: { type: String, default: "Mebellar" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    currency: { type: String, default: "UZS (so'm)" },
    timezone: { type: String, default: "" },
    logo: { type: String, default: "" },
    materials: { type: [String], default: [] },
  },
  { timestamps: true }
);

export type SettingsDocument = mongoose.InferSchemaType<typeof settingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SettingsModel =
  mongoose.models.Settings ??
  mongoose.model<SettingsDocument>("Settings", settingsSchema);

export async function getSettingsDoc() {
  let doc = await SettingsModel.findOne({ key: "main" });
  if (!doc) doc = await SettingsModel.create({});
  return doc;
}

export function settingsToPublicDto(doc: SettingsDocument) {
  return {
    storeName: doc.storeName ?? "Mebellar",
    logo: doc.logo ?? "",
    phone: doc.phone ?? "",
    email: doc.email ?? "",
    address: doc.address ?? "",
  };
}
