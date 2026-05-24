import { Router } from "express";
import { SavedSketch, toSketchDto } from "../models/SavedSketch.js";

export const sketchesRouter = Router();

sketchesRouter.get("/", async (_req, res) => {
  try {
    const docs = await SavedSketch.find().sort({ createdAt: -1 }).limit(50);
    res.json(docs.map(toSketchDto));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Eskizlar yuklashda xato" });
  }
});

sketchesRouter.post("/", async (req, res) => {
  try {
    const { type, length, width, height, material, title } = req.body;
    const doc = await SavedSketch.create({
      externalId: `sk-${Date.now()}`,
      type: type || "Shkaf",
      length: Number(length) || 0,
      width: Number(width) || 0,
      height: Number(height) || 0,
      material: material || "",
      title: title || `${type || "Eskiz"} ${length}×${width}×${height}`,
    });
    res.status(201).json(toSketchDto(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Saqlashda xato" });
  }
});
