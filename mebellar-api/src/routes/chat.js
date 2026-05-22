import { Router } from "express";
import * as chat from "../services/chatService.js";

export const chatRouter = Router();

chatRouter.get("/", async (_req, res) => {
  try {
    const state = await chat.getOrCreateThread();
    res.json(state);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Chat yuklashda xato" });
  }
});

chatRouter.post("/", async (req, res) => {
  try {
    const { action, sender, text, sketch } = req.body;
    if (action === "message") {
      const state = await chat.addMessage(sender, { text, sketch });
      return res.json(state);
    }
    if (action === "agree") {
      const state = await chat.setAgreement(sender);
      return res.json(state);
    }
    if (action === "heartbeat" && sender === "admin") {
      const state = await chat.touchAdminPresence();
      return res.json(state);
    }
    if (action === "cancelAgreement") {
      const state = await chat.cancelAgreement();
      return res.json(state);
    }
    if (action === "newOrder" && sender === "customer") {
      const state = await chat.startNewOrder();
      return res.json(state);
    }
    res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Chat xatosi" });
  }
});

chatRouter.patch("/", async (req, res) => {
  try {
    const { action, sender, sketch } = req.body;
    if (action === "updateSketch") {
      const state = await chat.updateActiveSketch(sketch, sender);
      return res.json(state);
    }
    res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Chat xatosi" });
  }
});
