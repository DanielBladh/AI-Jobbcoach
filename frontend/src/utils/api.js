// utils/api.js
// Obs: Du hade redan denna funktion, men nu ändrar vi endpointen den anropar.
export const callGenerateLetterApi = async (cvText, jobAdText) => {
  const response = await fetch("http://localhost:5000/api/ai/generate-letter", {
    // <--- NY ENDPOINT FÖR BREVGENERERING
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cvText, jobAdText }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Ett fel uppstod vid generering av brevet.");
  }

  const data = await response.json();
  return data.letter;
};

// Du behöver INTE en separat export för handleAssistantChat här
// eftersom den redan anropas direkt i GenerateLetterPage.jsx
// Men om du vill ha en konsekvent struktur kan du lägga till den:
/*
export const callAssistantChatApi = async (userMessage, threadId) => {
  const response = await fetch("http://localhost:5000/api/assistants/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userMessage, threadId }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Ett fel uppstod vid chatt med assistenten.");
  }

  const data = await response.json();
  return data.reply; // Returnera bara svaret för chatt
};
*/
