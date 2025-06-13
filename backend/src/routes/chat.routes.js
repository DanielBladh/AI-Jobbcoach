import express from "express";
import { handleAssistantChat } from "../controllers/assistant.controller.js";

const router = express.Router();

router.post("/chat", handleAssistantChat);

export default router;
