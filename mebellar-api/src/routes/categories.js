import { Router } from "express";
import { Category, toCategoryDto } from "../models/Category.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (_req, res) => {
  try {
    const docs = await Category.find().sort({ externalId: 1 });
    res.json(docs.map(toCategoryDto));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Kategoriyalarni yuklashda xato" });
  }
});

categoriesRouter.post("/", async (req, res) => {
  try {
    const name = String(req.body.name ?? "").trim();
    if (!name) return res.status(400).json({ error: "Kategoriya nomi kerak" });
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const externalId = `cat-${Date.now()}`;
    const doc = await Category.create({
      externalId,
      name,
      slug,
      image:
        req.body.image ||
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      count: 0,
    });
    res.status(201).json(toCategoryDto(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Kategoriya qo'shishda xato" });
  }
});
