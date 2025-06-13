import openai from "../config/openai.js";

export const generateLetter = async (req, res) => {
  const { cvText, jobAdText } = req.body;

  if (!cvText || !jobAdText) {
    return res.status(400).json({ error: "cvText och jobAdText krävs." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content:
            "Du är en expert på att skriva professionella personliga brev.",
        },
        {
          role: "user",
          content: `Här är mitt CV:\n${cvText}\n\nOch här är jobbannonsen:\n${jobAdText}\n\nSkriv ett personligt brev som matchar jobbet.`,
        },
      ],
    });

    const letter = response.choices[0]?.message?.content;
    res.json({ letter });
  } catch (error) {
    console.error("Fel vid OpenAI-anrop:", error);
    res.status(500).json({ error: "Misslyckades att generera brev." });
  }
};
