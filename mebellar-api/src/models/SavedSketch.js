import mongoose from "mongoose";

const savedSketchSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true },
    type: String,
    length: Number,
    width: Number,
    height: Number,
    material: String,
    title: String,
  },
  { timestamps: true }
);

export function toSketchDto(doc) {
  return {
    id: doc.externalId,
    type: doc.type,
    length: doc.length,
    width: doc.width,
    height: doc.height,
    material: doc.material,
    title: doc.title,
    createdAt: doc.createdAt,
  };
}

export const SavedSketch = mongoose.model("SavedSketch", savedSketchSchema);
