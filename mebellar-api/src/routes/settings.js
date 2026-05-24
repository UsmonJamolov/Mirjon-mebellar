import { Router } from "express";
import { getSettingsDoc } from "../models/Settings.js";

export const settingsRouter = Router();

settingsRouter.get("/", async (_req, res) => {
  try {
    const doc = await getSettingsDoc();
    res.json({
      storeName: doc.storeName,
      phone: doc.phone,
      email: doc.email,
      address: doc.address,
      currency: doc.currency,
      timezone: doc.timezone,
      logo: doc.logo,
      materials: doc.materials ?? [],
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Sozlamalar yuklashda xato" });
  }
});

settingsRouter.patch("/", async (req, res) => {
  try {
    const doc = await getSettingsDoc();
    const fields = ["storeName", "phone", "email", "address", "currency", "timezone", "logo", "materials"];
    for (const f of fields) {
      if (req.body[f] !== undefined) doc[f] = req.body[f];
    }
    await doc.save();
    res.json({
      storeName: doc.storeName,
      phone: doc.phone,
      email: doc.email,
      address: doc.address,
      currency: doc.currency,
      timezone: doc.timezone,
      logo: doc.logo,
      materials: doc.materials ?? [],
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Saqlashda xato" });
  }
});

settingsRouter.post("/materials", async (req, res) => {
  try {
    const name = String(req.body.name ?? "").trim();
    if (!name) return res.status(400).json({ error: "Material nomi kerak" });
    const doc = await getSettingsDoc();
    if (!doc.materials.includes(name)) doc.materials.push(name);
    await doc.save();
    res.json({ materials: doc.materials });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Material qo'shishda xato" });
  }
});
