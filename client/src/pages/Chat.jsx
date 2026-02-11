import { useState, useContext, useRef, useEffect } from "react";
import api from "../services/api";
import { ResumeContext } from "../context/ResumeContext";

const Chat = () => {
  const { resumeText, jobDescription, atsResult } =
    useContext(ResumeContext);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  /* ===========================
     AUTO SCROLL TO BOTTOM
  ============================ */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ===========================
     BLOCK IF NO ANALYSIS
  ============================ */
  if (!resumeText || !atsResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <div className="bg-white shadow rounded-xl p-8 max-w-md">
          <h2 className="text-xl font-semibold mb-3">
            Analyze Resume First
          </h2>
          <p className="text-gray-600">
            Please upload and analyze your resume before using the
            Career Assistant.
          </p>
        </div>
      </div>
    );
  }

  /* ===========================
     SEND MESSAGE
  ============================ */
  const handleSend = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await api.post("/chat/ask", {
        question: question,
        resumeText: resumeText,
        jobDescription: jobDescription,
        atsScore: atsResult?.ats_score,
        matchedSkills: atsResult?.matched_skills || [],
        missingSkills: atsResult?.missing_skills || [],
      });

      const aiMessage = {
        role: "assistant",
        content: response.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      alert("Chat failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6 flex flex-col h-[80vh]">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">
            AI Career Assistant
          </h1>
          <p className="text-gray-600 mt-2">
            Ask about skills, interview prep, salary expectations,
            and resume improvements.
          </p>
        </div>

        {/* CHAT BOX */}
        <div className="flex-1 overflow-y-auto bg-white shadow rounded-xl p-6 space-y-4">

          {messages.length === 0 && (
            <div className="text-gray-400 text-center">
              Start by asking a career-related question.
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl max-w-[75%] ${
                msg.role === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="bg-gray-100 text-gray-600 p-4 rounded-xl w-fit">
              AI is thinking...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="mt-6 flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about skills, interview prep, salary..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
};

export default Chat;
