import { createContext, useState } from "react";

export const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [atsResult, setAtsResult] = useState(null);

  return (
    <ResumeContext.Provider
      value={{
        resumeText,
        setResumeText,
        jobDescription,
        setJobDescription,
        atsResult,
        setAtsResult,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};
