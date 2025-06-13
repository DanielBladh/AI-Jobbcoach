import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cvText, setCvText] = useState(""); 
  const [jobAdText, setJobAdText] = useState(""); 
  const [coverLetterText, setCoverLetterText] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState(""); 

  const contextValue = {
    cvText,
    setCvText,
    jobAdText,
    setJobAdText,
    coverLetterText,
    setCoverLetterText,
    generatedLetter,
    setGeneratedLetter,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
