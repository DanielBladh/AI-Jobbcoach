import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileRoutes from "./routes/file.routes.js";
import aiRoutes from "./routes/ai.routes.js"; 
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();
console.log(
  "OpenAI API Key (first 5 chars):",
  process.env.OPENAI_API_KEY
    ? process.env.OPENAI_API_KEY.substring(0, 5)
    : "Not found"
);

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/file", fileRoutes);
app.use("/api/ai", aiRoutes); 
app.use("/api/assistants", chatRoutes); 
app.get("/", (req, res) => res.send("Backend OK"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
