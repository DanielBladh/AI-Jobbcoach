import express from "express";
import multer from "multer";
import { handleUpload } from "../controllers/file.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const multiUpload = upload.fields([
  { name: "cvFile", maxCount: 1 },
  { name: "coverLetterFile", maxCount: 1 },
  { name: "jobAdFile", maxCount: 1 },
]);

router.post("/upload", multiUpload, handleUpload);

export default router;
