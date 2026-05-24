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

productsRouter.post("/", async (req, res) => {
  try {
    const body = req.body;
    const externalId = body.id || `p-${Date.now()}`;
    const doc = await Product.create({
      externalId,
      name: body.name,
      category: body.category,
      price: Number(body.price) || 0,
      material: body.material,
      width: Number(body.width) || 0,
      depth: Number(body.depth) || 0,
      height: Number(body.height) || 0,
      description: body.description || "",
      image: body.image || body.images?.[0] || "",
      images: body.images || [],
      isNew: Boolean(body.isNew),
      isPopular: Boolean(body.isPopular),
      isRecommended: Boolean(body.isRecommended),
    });
    res.status(201).json(toProductDto(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Mahsulot yaratishda xato" });
  }
});

productsRouter.patch("/:id", async (req, res) => {
  try {
    const doc = await Product.findOne({ externalId: req.params.id });
    if (!doc) return res.status(404).json({ error: "Mahsulot topilmadi" });
    const fields = [
      "name",
      "category",
      "price",
      "material",
      "width",
      "depth",
      "height",
      "description",
      "image",
      "images",
      "isNew",
      "isPopular",
      "isRecommended",
    ];
    for (const f of fields) {
      if (req.body[f] !== undefined) doc[f] = req.body[f];
    }
    await doc.save();
    res.json(toProductDto(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Yangilashda xato" });
  }
});

productsRouter.delete("/:id", async (req, res) => {
  try {
    const r = await Product.deleteOne({ externalId: req.params.id });
    if (!r.deletedCount) return res.status(404).json({ error: "Topilmadi" });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "O'chirishda xato" });
  }
});
