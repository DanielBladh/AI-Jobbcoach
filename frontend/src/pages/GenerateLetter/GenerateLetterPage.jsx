// frontend/src/pages/GenerateLetter/GenerateLetterPage.jsx

import React, { useState, useContext, useRef, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { callGenerateLetterApi } from "../../utils/api";
import TypingIndicator from "../../components/UI/TypingIndicator";
import AiAvatar from "../../assets/robot-avatar.avif";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../../assets/user-avatar.png";

const GenerateLetterPage = () => {
  const { cvText, jobAdText, setGeneratedLetter } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState("");
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]); // Här kommer alla chattmeddelanden att sparas
  const [threadId, setThreadId] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoToSelectClick = () => {
    navigate("/select");
  };

  const handleGoHomeClick = () => {
    navigate("/");
  };

  const handleAssistantChat = async (customMessage = null) => {
    const messageToSend = customMessage || chatInput.trim();
    if (!messageToSend) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: messageToSend },
    ]);
    setChatInput("");

    setChatLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/assistants/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: messageToSend,
          threadId,
          currentLetter: letter, // <-- Här skickas det aktuella brevet med
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json(); // Här förväntar vi oss nu { type: "letter_update" | "chat_message", ... }

      if (data.type === "letter_update") {
        setLetter(data.letterContent); // Uppdatera det synliga brevet med det nya innehållet
        setGeneratedLetter(data.letterContent); // Uppdatera AppContext med det nya brevet
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "ai",
            text: "Jag har uppdaterat brevet enligt din begäran. Vänligen granska det ovan.",
          },
        ]);
      } else if (data.type === "chat_message") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "ai", text: data.messageContent },
        ]);
      } else {
        // Fallback om 'type' saknas eller är okänd (mindre troligt med korrekt backend)
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "ai",
            text:
              data.reply ||
              "Okänd svarstyp från AI eller ingen 'reply' egenskap.",
          },
        ]);
      }

      if (!threadId) setThreadId(data.threadId);
    } catch (err) {
      console.error("Fel vid Assistants API:", err);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "ai",
          text: `Tyvärr, något gick fel när jag försökte svara: ${err.message}`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchLetter = async () => {
      if (!cvText || !jobAdText) {
        setError(
          "Viktig information saknas! Vänligen gå tillbaka till uppladdningssidan och se till att både ditt CV och jobbannonsen är uppladdade."
        );
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      if (letter) return; // Om brevet redan finns, generera inte igen

      setLoading(true);
      setError(null);
      try {
        const generated = await callGenerateLetterApi(cvText, jobAdText);
        setLetter(generated);
        setGeneratedLetter(generated);
      } catch (err) {
        console.error("Fel vid generering:", err);
        setError(
          err.message ||
            "Oj då! Något gick snett när jag försökte generera brevet. Vänligen försök igen, eller kontakta support om problemet kvarstår."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [cvText, jobAdText, letter, setGeneratedLetter, navigate]);

  useEffect(() => {
    if (letter && messages.length === 0 && !loading && !error) {
      setMessages([
        {
          sender: "ai",
          text: "Hur kan jag hjälpa dig med ditt personliga brev? Vill du ha hjälp att justera, förbättra eller svara på något specifikt?",
        },
      ]);
    }
  }, [letter, messages.length, loading, error]); // Beroenden: När brevet genereras, när meddelandelängden ändras, loading/error

  useEffect(() => {
    scrollToBottom();
  }, [letter, loading, error, messages, chatLoading]);

  const handleGenerateNewLetter = async () => {
    setLetter("");
    setMessages([]); // Rensa gamla chattmeddelanden
    setThreadId(null); // Nollställ tråd-ID
    setLoading(true);
    setError(null);
    try {
      const generated = await callGenerateLetterApi(cvText, jobAdText);
      setLetter(generated);
      setGeneratedLetter(generated);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Ett nytt utkast har genererats baserat på dina originaldokument.",
        },
      ]);
    } catch (err) {
      console.error("Fel vid regenerering:", err);
      setError(
        err.message ||
          "Kunde inte generera om brevet. Kontrollera dina uppladdade dokument och försök igen."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {!letter && !loading && !error && (
          <div className="ai-message-row">
            <div className="avatar-container">
              <img src={AiAvatar} alt="AI Coach Avatar" className="avatar" />
            </div>
            <div className="ai-bubble">
              <p>
                Jag har all information jag behöver och skapar nu ett utkast
                till ditt nya personliga brev. Detta tar bara en liten stund...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="ai-message-row">
            <div className="avatar-container bg-red-700">
              <img src={AiAvatar} alt="Error Avatar" className="avatar" />
            </div>
            <div className="ai-bubble bg-red-700">
              <p>{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="ai-message-row">
            <div className="avatar-container">
              <img src={AiAvatar} alt="AI Coach Avatar" className="avatar" />
            </div>
            <div className="ai-bubble">
              <TypingIndicator />
            </div>
          </div>
        )}

        {letter && (
          <>
            <div className="ai-message-row">
              <div className="avatar-container">
                <img src={AiAvatar} alt="AI Coach Avatar" className="avatar" />
              </div>
              <div className="ai-bubble">
                <p>
                  Här är mitt förslag på ett personligt brev, skräddarsytt för
                  jobbannonsen och baserat på din profil.
                </p>
                <p className="mt-2">
                  Läs igenom det noggrant. Alla delar kan enkelt redigeras och
                  anpassas efter dina önskemål.
                </p>
              </div>
            </div>
            {/* GENERERAT BREV OCH KOPPIERA KNAPP */}
            <div className="user-message-row letter-display-and-copy-row">
              <div className="generated-letter-display">
                {letter}
                <div className="copy-button-container mt-4">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(letter);
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 3000);
                    }}
                    className="action-button copy-button"
                  >
                    Kopiera brev
                  </button>
                  {copySuccess && (
                    <div className="copy-toast">
                      ✅ Brevet har kopierats till urklipp!
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="assistant-chat-box mt-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-row ${
                    msg.sender === "user"
                      ? "user-message-row"
                      : "ai-message-row"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className="avatar-container">
                      <img src={AiAvatar} alt="AI Avatar" className="avatar" />
                    </div>
                  )}
                  <div
                    className={`chat-bubble ${
                      msg.sender === "user" ? "user-bubble" : "ai-bubble"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  {msg.sender === "user" && (
                    <div className="avatar-container">
                      <img
                        src={UserAvatar}
                        alt="User Avatar"
                        className="avatar"
                      />
                    </div>
                  )}
                </div>
              ))}

              {chatLoading && (
                <div className="ai-message-row">
                  <div className="avatar-container">
                    <img src={AiAvatar} alt="AI Avatar" className="avatar" />
                  </div>
                  <div className="ai-bubble">
                    <TypingIndicator />
                  </div>
                </div>
              )}

              <div className="ai-message-row last-interaction-row mt-4">
                <div className="avatar-container">
                  <img
                    src={AiAvatar}
                    alt="AI Coach Avatar"
                    className="avatar"
                  />
                </div>
                <div className="ai-bubble complex-interaction-bubble">
                  <div className="input-section">
                    <p>
                      Vill du justera något i brevet? Skriv här så hjälper jag
                      dig!
                    </p>
                    <textarea
                      className="chat-textarea mt-2"
                      value={chatInput}
                      placeholder="Ex: Kan du skriva om inledningen så den känns mer personlig?"
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAssistantChat();
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAssistantChat()}
                      className="action-button primary-button mt-2"
                      disabled={chatLoading || !chatInput.trim()}
                    >
                      {chatLoading
                        ? "AI tänker..."
                        : "Ställ fråga till AI-coachen"}
                    </button>
                  </div>

                  {/* Sektion för övriga valmöjligheter */}
                  <div className="final-options-section">
                    <p>
                      Vad tycker du? Vill du att jag gör några justeringar i
                      brevet, eller är du redo att använda det som det är?
                    </p>
                    <div className="button-group mt-3">
                      <button
                        onClick={handleGenerateNewLetter}
                        className="action-button regenerate-button"
                      >
                        Generera om brevet (om du vill ha ett nytt utkast)
                      </button>
                      <button
                        onClick={handleGoToSelectClick}
                        className="action-button secondary-button"
                      >
                        Tillbaka till val
                      </button>
                      <button
                        onClick={handleGoHomeClick}
                        className="action-button secondary-button"
                      >
                        Tillbaka till Start
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default GenerateLetterPage;
