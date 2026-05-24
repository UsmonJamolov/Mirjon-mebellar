import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    storeName: { type: String, default: "Mebellar" },
    phone: { type: String, default: "+998 71 200 00 00" },
    email: { type: String, default: "info@mebellar.uz" },
    address: { type: String, default: "Toshkent sh., Chilonzor tumani" },
    currency: { type: String, default: "UZS (so'm)" },
    timezone: { type: String, default: "Asia/Tashkent (UTC+5)" },
    logo: { type: String, default: "" },
    materials: { type: [String], default: ["MDF 18mm", "MDF 16mm", "Laminat", "Yog'och", "Mato"] },
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);

export async function getSettingsDoc() {
  let doc = await Settings.findOne({ key: "main" });
  if (!doc) doc = await Settings.create({});
  return doc;
}
