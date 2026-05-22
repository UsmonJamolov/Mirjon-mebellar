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
