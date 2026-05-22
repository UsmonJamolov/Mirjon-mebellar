import { Router } from "express";
import { Product, toProductDto } from "../models/Product.js";

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.popular === "true") filter.isPopular = true;
    if (req.query.recommended === "true") filter.isRecommended = true;
    if (req.query.cat) {
      const slug = String(req.query.cat);
      const catMap = {
        oshxona: "Oshxona",
        yotoqxona: "Yotoqxona",
        ofis: "Ofis",
        mehmonxona: "Mehmonxona",
        bolalar: "Bolalar",
      };
      if (catMap[slug]) filter.category = catMap[slug];
    }
    if (req.query.q) {
      filter.name = { $regex: String(req.query.q), $options: "i" };
    }

    const docs = await Product.find(filter).sort({ createdAt: -1 });
    res.json(docs.map(toProductDto));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Mahsulotlarni yuklashda xato" });
  }
});

productsRouter.get("/:id", async (req, res) => {
  try {
    const doc = await Product.findOne({ externalId: req.params.id });
    if (!doc) return res.status(404).json({ error: "Mahsulot topilmadi" });
    res.json(toProductDto(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Mahsulotni yuklashda xato" });
  }
});
