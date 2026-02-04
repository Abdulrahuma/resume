import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import ChatBox from "../components/chat/ChatBox";

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const resumeId = location.state?.resumeId;

  // ✅ Guard: no resume selected
  useEffect(() => {
    if (!resumeId) {
      alert("Please select a resume first");
      navigate("/profile");
    }
  }, [resumeId, navigate]);

  if (!resumeId) return null; // prevent render

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto h-[80vh] bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-3">
            AI Resume Chat
          </h2>

          <ChatBox resumeId={resumeId} />
        </div>
      </div>
    </>
  );
};

export default ChatPage;
