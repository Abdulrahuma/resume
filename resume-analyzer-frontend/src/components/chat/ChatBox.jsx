import { useEffect, useState } from "react";
import API from "../../services/api";
import Message from "./Message";
import InputBox from "./InputBox";

const ChatBox = ({ resumeId }) => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [role, setRole] = useState("MERN_DEVELOPER");

  const [missingFields, setMissingFields] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [structuredResume, setStructuredResume] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");

  const [loading, setLoading] = useState(false);

  // ===============================
  // STEP 1: Detect Missing Fields
  // ===============================
  useEffect(() => {
    if (!resumeId) return;

    const detectMissing = async () => {
      try {
        setLoading(true);
        const res = await API.post("/ai/detect-missing-fields", {
          resumeId,
          role,
        });

        setMissingFields(res.data.missingFields || []);

        setMessages([
          {
            sender: "bot",
            text:
              res.data.missingFields.length > 0
                ? "I found some missing sections in your resume. Let’s improve it step by step."
                : "Your resume looks complete. You can still optimize it.",
          },
        ]);

        if (res.data.missingFields.length > 0) {
          startFieldCollection(res.data.missingFields);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    detectMissing();
  }, [resumeId, role]);

  // =================================
  // STEP 2: Start Field Collection
  // =================================
  const startFieldCollection = async (fields) => {
    try {
      const res = await API.post("/ai/start-field-collection", {
        resumeId,
        role,
        missingFields: fields,
      });

      setSessionId(res.data.sessionId);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.question },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  // =================================
  // STEP 3: Handle Chat Input
  // =================================
  const sendMessage = async () => {
    if (!question.trim()) return;

    const userText = question;
    setQuestion("");

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText },
    ]);

    // 🔥 Phase-2 interaction
    if (sessionId) {
      try {
        const res = await API.post("/ai/field-response", {
          sessionId,
          userInput: userText,
        });

        if (res.data.completed) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text:
                "All required details collected. Generating optimized resume...",
            },
          ]);

          generateStructuredResume();
          return;
        }

        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.data.question },
        ]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // =================================
  // STEP 4: Generate Structured Resume
  // =================================
  const generateStructuredResume = async () => {
    try {
      setLoading(true);

      const res = await API.post("/ai/generate-structured-resume", {
        resumeId,
        sessionId,
        role,
      });

      setStructuredResume(res.data.structuredResume);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "Your ATS-optimized resume is ready. Choose a template and download it.",
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =================================
  // STEP 5: Download PDF
  // =================================
  const downloadPdf = async () => {
  try {
    // Convert structured resume to readable text
    const content = `
${structuredResume.name || ""}

SUMMARY
${structuredResume.summary || ""}

SKILLS
${(structuredResume.skills || []).join(", ")}

EDUCATION
${(structuredResume.education || [])
  .map((e) => `${e.degree || ""} - ${e.institution || ""}`)
  .join("\n")}

EXPERIENCE
${(structuredResume.experience || [])
  .map((e) => `${e.role || ""} at ${e.company || ""}`)
  .join("\n")}

PROJECTS
${(structuredResume.projects || [])
  .map((p) => p.title || "")
  .join("\n")}

CERTIFICATIONS
${(structuredResume.certifications || []).join(", ")}
`;

    const res = await API.post(
      "/ai/download-resume",
      { content },
      { responseType: "blob" }
    );

    const blob = new Blob([res.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ATS_Optimized_Resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert("Failed to download resume");
  }
};


  return (
    <div className="flex flex-col h-full bg-white rounded shadow">
      {/* HEADER */}
      <div className="border-b p-3">
        <h2 className="font-semibold text-lg">
          AI Resume Assistant
        </h2>

        <select
          className="mt-2 w-full border rounded px-2 py-1 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="MERN_DEVELOPER">MERN Developer</option>
          <option value="FRONTEND_DEVELOPER">Frontend Developer</option>
          <option value="BACKEND_DEVELOPER">Backend Developer</option>
        </select>
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
        {messages.map((msg, i) => (
          <Message key={i} {...msg} />
        ))}

        {loading && (
          <p className="text-xs text-gray-500">
            AI is processing...
          </p>
        )}
      </div>

      {/* INPUT */}
      <div className="border-t p-3">
        <InputBox
          value={question}
          onChange={setQuestion}
          onSend={sendMessage}
        />

        {/* TEMPLATE + DOWNLOAD */}
        {structuredResume && (
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">
              Choose Resume Template
            </label>

            <select
              value={selectedTemplate}
              onChange={(e) =>
                setSelectedTemplate(e.target.value)
              }
              className="w-full border rounded px-2 py-1 mb-2"
            >
              <option value="classic">Classic ATS</option>
              <option value="modern">Modern ATS</option>
            </select>

            <button
              onClick={downloadPdf}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Download Resume PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
