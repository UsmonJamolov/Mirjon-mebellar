import { Router } from "express";
import { dbState } from "../db.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.json({ ok: true, service: "mebellar-api" });
});

healthRouter.get("/health/db", (_req, res) => {
  const db = dbState();
  res.status(db.ok ? 200 : 503).json(db);
});
