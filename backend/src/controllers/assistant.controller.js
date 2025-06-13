import openai from "../config/openai.js";

export const generateCoverLetter = async (req, res) => {
  const { cvText, jobAdText } = req.body;

  if (!cvText || !jobAdText) {
    return res
      .status(400)
      .json({ error: "cvText och jobAdText krävs för att generera brev." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content:
            "Du är en expert på att skriva professionella personliga brev. Skriv ett personligt brev som matchar jobbet baserat på angivet CV och jobbannons.",
        },
        {
          role: "user",
          content: `Här är mitt CV:\n${cvText}\n\nOch här är jobbannonsen:\n${jobAdText}\n\nSkriv ett personligt brev som matchar jobbet.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000, // Passande längd för ett brev
    });

    const letter = response.choices[0]?.message?.content;
    res.json({ letter });
  } catch (error) {
    console.error("Fel vid OpenAI-anrop för brevgenerering:", error);
    res.status(500).json({
      error: `Misslyckades att generera brev: ${error.message || "Okänt fel"}`,
    });
  }
};

// Funktion för att hantera chatt med assistenten (UPPDATERAD FÖR STRUKTURERADE SVAR)
export const handleAssistantChat = async (req, res) => {
  const { userMessage, threadId, currentLetter } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "userMessage krävs för chatt." });
  }

  try {
    let messages = [
      {
        role: "system",
        content: `Du är en hjälpsam AI-assistent specialiserad på personliga brev. Din uppgift är att assistera användaren med att justera, förbättra eller svara på frågor om deras personliga brev.

        **Instruktion för brevmodifiering:**
        Om användaren ber dig att ändra brevet, ta det 'Befintliga brevet' som din bas. Bibehåll hela brevets ursprungliga struktur, styckeindelning, formatering och allmänna ton. Gör endast den specifika ändringen som användaren begär. Om inget annat anges, behåll platshållare som [Företagets Namn], [Ditt Namn], [Din Stadsadress], etc.

        **Viktigt:** Om användarens begäran innebär en modifiering av brevet, ska du returnera *hela det uppdaterade brevet*. Annars, om begäran är en fråga som inte kräver brevmodifiering, svara då på frågan kortfattat utan att returnera ett brev.`,
      },
    ];

    // Lägg till det befintliga brevet och användarens begäran i user-meddelandet
    messages.push({
      role: "user",
      content: `Befintligt brev att modifiera (om tillämpligt):
---START BREV---
${currentLetter}
---SLUT BREV---

Användarens begäran:
${userMessage}

Baserat på ovanstående instruktioner, utför den begärda åtgärden. Om du modifierar brevet, leverera det fullständiga, uppdaterade brevet. Annars, ge bara ditt svar på frågan.`,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const reply = response.choices[0]?.message?.content;

    const isLetterUpdate =
      reply.toLowerCase().includes("med vänliga hälsningar") ||
      reply.toLowerCase().includes("vänligen granska det ovan") ||
      reply.toLowerCase().includes("vänligen försök igen") || //
      reply.length > 500; // Om svaret är långt, antas det vara ett brev

    if (isLetterUpdate) {
      res.json({
        type: "letter_update",
        letterContent: reply,
        threadId: threadId || "new_thread_id_example",
      });
    } else {
      res.json({
        type: "chat_message",
        messageContent: reply,
        threadId: threadId || "new_thread_id_example",
      });
    }
  } catch (error) {
    console.error("Fel vid OpenAI-anrop för chatt:", error);
    res.status(500).json({
      error: `Misslyckades att svara i chatt: ${error.message || "Okänt fel"}`,
    });
  }
};
