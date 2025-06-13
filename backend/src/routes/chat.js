const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  const { userMessage, threadId } = req.body;

  try {
    let currentThreadId = threadId;

    // Om ingen tråd finns, skapa en ny
    if (!currentThreadId) {
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
    }

    // Lägg till användarens meddelande i tråden
    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: userMessage,
    });

    // Kör assistant
    const run = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: process.env.ASSISTANT_ID,
    });

    // Pollar tills assistenten är klar
    let runStatus = await openai.beta.threads.runs.retrieve(
      currentThreadId,
      run.id
    );

    while (runStatus.status !== "completed" && runStatus.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // vänta 1s
      runStatus = await openai.beta.threads.runs.retrieve(
        currentThreadId,
        run.id
      );
    }

    if (runStatus.status === "failed") {
      return res.status(500).json({ error: "Assistant-run misslyckades" });
    }

    // Hämta senaste meddelande
    const messages = await openai.beta.threads.messages.list(currentThreadId);
    const latestMessage = messages.data.find((msg) => msg.role === "assistant");

    return res.json({
      threadId: currentThreadId,
      reply:
        latestMessage?.content?.[0]?.text?.value ||
        "Inget svar från assistenten.",
    });
  } catch (err) {
    console.error("Fel i Assistants-routen:", err);
    res.status(500).json({ error: "Något gick fel i chatten" });
  }
});

module.exports = router;
