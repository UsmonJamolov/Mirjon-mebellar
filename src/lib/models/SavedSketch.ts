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

export type SavedSketchDocument = mongoose.InferSchemaType<typeof savedSketchSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SavedSketchModel =
  mongoose.models.SavedSketch ??
  mongoose.model<SavedSketchDocument>("SavedSketch", savedSketchSchema);

export function toSketchDto(doc: SavedSketchDocument) {
  return {
    id: doc.externalId,
    type: doc.type ?? "",
    length: doc.length ?? 0,
    width: doc.width ?? 0,
    height: doc.height ?? 0,
    material: doc.material ?? "",
    title: doc.title ?? "",
    createdAt: doc.createdAt,
  };
}
