// frontend/src/pages/FunctionSelect/FunctionSelect.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import AiAvatar from "../../assets/robot-avatar.avif";
import UserAvatar from "../../assets/user-avatar.png"; // Se till att denna sökväg är korrekt

const FunctionSelect = () => {
  const navigate = useNavigate();

  const handleGenerateLetterClick = () => {
    navigate("/generate-letter"); // Navigera till genereringssidan
  };

  const handleGoHomeClick = () => {
    navigate("/"); // Navigera tillbaka till startsidan (UploadPage)
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {/* AI-meddelande */}
        <div className="ai-message-row">
          <div className="avatar-container">
            <img src={AiAvatar} alt="AI Coach Avatar" className="avatar" />
          </div>
          <div className="ai-bubble">
            <p>
              Utmärkt! Jag har nu framgångsrikt bearbetat all information från
              dina dokument.
            </p>
            <p className="mt-2">
              Vad kan jag hjälpa dig med härnäst för att optimera din ansökan?
            </p>
          </div>
        </div>

        <div className="user-message-row">
          {" "}
          <div className="user-bubble">
            <div className="button-group-in-bubble">
              <button
                onClick={handleGenerateLetterClick}
                className="action-button primary-button"
              >
                Generera ett nytt personligt brev
              </button>
              <button
                onClick={handleGoHomeClick}
                className="action-button secondary-button"
              >
                Tillbaka till Start
              </button>
            </div>
          </div>
          <div className="avatar-container">
            <img src={UserAvatar} alt="User Avatar" className="avatar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionSelect;
