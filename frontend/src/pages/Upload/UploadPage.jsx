// frontend/src/pages/Upload/UploadPage.jsx
import React from "react";
import UploadForm from "../../components/Form/UploadForm";
import AiAvatar from "../../assets/robot-avatar.avif";

const UploadPage = () => {
  return (
    <div className="chat-container">
      <div className="chat-messages">
        {/* AI:s välkomstmeddelande */}
        <div className="ai-message-row">
          <div className="avatar-container">
            <img src={AiAvatar} alt="AI Coach Avatar" className="avatar" />
          </div>
          <div className="ai-bubble">
            <p>
              Hej! Jag är din personliga AI Jobbcoach, redo att hjälpa dig ta
              nästa steg i karriären.
            </p>
            <p className="mt-2">
              Mitt uppdrag är att skräddarsy ditt personliga brev så det perfekt
              matchar varje jobbannons du söker.
            </p>
            <p className="mt-2">
              För att komma igång, vänligen ladda upp ditt CV och jobbannonsen.
              Om du redan har ett utkast till personligt brev, kan du även ladda
              upp det för att ge mig mer kontext.
            </p>
          </div>
        </div>

        {/* AI:s uppmaning till uppladdning */}
        <div className="ai-message-row">
          <div className="avatar-container">
            <img src={AiAvatar} alt="AI Coach Avatar" className="avatar" />
          </div>
          <div className="ai-bubble">
            <p>
              Ladda upp dina dokument här nedanför. Jag ser fram emot att hjälpa
              dig!
            </p>
          </div>
        </div>

        {/* Ladda upp-formuläret */}
        <div className="user-message-row form-container-row">
          <div className="upload-form-container">
            <UploadForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
