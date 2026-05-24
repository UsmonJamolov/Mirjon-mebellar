import { Router } from "express";
import { Inventory, toInventoryDto } from "../models/Inventory.js";

export const inventoryRouter = Router();

inventoryRouter.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.q) {
      filter.name = { $regex: String(req.query.q), $options: "i" };
    }
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    const docs = await Inventory.find(filter).sort({ name: 1 });
    res.json(docs.map(toInventoryDto));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ombor yuklashda xato" });
  }
});

inventoryRouter.post("/", async (req, res) => {
  try {
    const { name, category, quantity, unit, status } = req.body;
    const doc = await Inventory.create({
      externalId: `inv-${Date.now()}`,
      name: String(name || "").trim(),
      category: category || "Material",
      quantity: Number(quantity) || 0,
      unit: unit || "Dona",
      status: quantity < 10 ? "kam" : status || "yetarli",
    });
    res.status(201).json(toInventoryDto(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Qo'shishda xato" });
  }
});

inventoryRouter.patch("/:id", async (req, res) => {
  try {
    const doc = await Inventory.findOne({ externalId: req.params.id });
    if (!doc) return res.status(404).json({ error: "Topilmadi" });
    const fields = ["name", "category", "quantity", "unit", "status"];
    for (const f of fields) {
      if (req.body[f] !== undefined) doc[f] = req.body[f];
    }
    if (req.body.quantity !== undefined && req.body.quantity < 10) doc.status = "kam";
    await doc.save();
    res.json(toInventoryDto(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Yangilashda xato" });
  }
});

inventoryRouter.delete("/:id", async (req, res) => {
  try {
    const r = await Inventory.deleteOne({ externalId: req.params.id });
    if (!r.deletedCount) return res.status(404).json({ error: "Topilmadi" });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "O'chirishda xato" });
  }
});
