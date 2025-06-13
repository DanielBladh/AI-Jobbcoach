import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import UploadPage from "./pages/Upload/UploadPage";
import FunctionSelect from "./pages/FunctionSelect/FunctionSelect";
import GenerateLetterPage from "./pages/GenerateLetter/GenerateLetterPage";

function App() {
  return (
    <AppProvider>
          <div className="chat-container bg-black bg-opacity-60 backdrop-blur-md p-6 rounded-xl shadow-lg">
      <Router>
        <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/select" element={<FunctionSelect />} />
            <Route path="/generate-letter" element={<GenerateLetterPage />} />
        </Routes>
      </Router>
          </div>
    </AppProvider>
  );
}

export default App;
