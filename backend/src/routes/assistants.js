const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/chat", async (req, res) => {
  const { userMessage, threadId } = req.body;

  try {
    let thread;

    if (threadId) {
      thread = await openai.beta.threads.retrieve(threadId);
    } else {
      thread = await openai.beta.threads.create();
    }

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.ASSISTANT_ID,
    });

    let runStatus;
    do {
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } while (runStatus.status !== "completed");

    const messages = await openai.beta.threads.messages.list(thread.id);

    const reply = messages.data.find((msg) => msg.role === "assistant");

    res.json({
      reply: reply?.content[0]?.text?.value || "",
      threadId: thread.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Assistant-svar misslyckades." });
  }
});

module.exports = router;
