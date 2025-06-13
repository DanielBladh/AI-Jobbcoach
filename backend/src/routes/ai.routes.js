import express from "express";
import { generateCoverLetter } from "../controllers/assistant.controller.js";

const router = express.Router();

router.post("/generate-letter", generateCoverLetter);

export default router;
