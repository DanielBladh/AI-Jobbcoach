import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const UploadForm = () => {
  const { setCvText, setCoverLetterText, setJobAdText } =
    useContext(AppContext);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [jobAdFile, setJobAdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    if (cvFile) formData.append("cvFile", cvFile);
    if (coverLetterFile) formData.append("coverLetterFile", coverLetterFile);
    if (jobAdFile) formData.append("jobAdFile", jobAdFile);

    try {
      const response = await fetch("http://localhost:5000/api/file/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Filuppladdning misslyckades.");
      }

      const data = await response.json();

      setCvText(data.cvText || "");
      setCoverLetterText(data.coverLetterText || "");
      setJobAdText(data.jobAdText || "");

      navigate("/select");
    } catch (error) {
      console.error("Fel vid uppladdning:", error);
      alert("Uppladdningen misslyckades: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      {/* CV Upload */}
      <div>
        <label className="block text-lg font-bold mb-2">Ditt CV (PDF):</label>
        <div className="file-input-container">
          <label htmlFor="cv-upload" className="file-input-label">
            Välj fil
          </label>
          <span className="file-name">
            {cvFile ? cvFile.name : "Ingen fil har valts"}
          </span>
          <input
            id="cv-upload"
            type="file"
            accept=".pdf"
            onChange={(e) => setCvFile(e.target.files[0])}
            className="file-input"
          />
        </div>
      </div>

      {/* Personligt brev Upload */}
      <div>
        <label className="block text-lg font-bold mb-2">
          Ditt personliga brev (PDF):
        </label>
        <div className="file-input-container">
          <label htmlFor="cover-letter-upload" className="file-input-label">
            Välj fil
          </label>
          <span className="file-name">
            {coverLetterFile ? coverLetterFile.name : "Ingen fil har valts"}
          </span>
          <input
            id="cover-letter-upload"
            type="file"
            accept=".pdf"
            onChange={(e) => setCoverLetterFile(e.target.files[0])}
            className="file-input"
          />
        </div>
      </div>

      {/* Jobbannons Upload */}
      <div>
        <label className="block text-lg font-bold mb-2">
          Jobbannonsen (PDF):
        </label>
        <div className="file-input-container">
          <label htmlFor="job-ad-upload" className="file-input-label">
            Välj fil
          </label>
          <span className="file-name">
            {jobAdFile ? jobAdFile.name : "Ingen fil har valts"}
          </span>
          <input
            id="job-ad-upload"
            type="file"
            accept=".pdf"
            onChange={(e) => setJobAdFile(e.target.files[0])}
            className="file-input"
          />
        </div>
      </div>

      {/* Submit-knapp */}
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? "Laddar upp..." : "Ladda upp dokument"}
      </button>
    </form>
  );
};

export default UploadForm;
