import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import UploadResume from "../components/resume/UploadResume";
import ResumeList from "../components/resume/ResumeList";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const navigate = useNavigate();

  // Fetch resumes
  const loadResumes = async () => {
    const res = await API.get("/resume/my");
    setResumes(res.data);
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const goToChat = () => {
    if (!selectedResumeId) {
      alert("Please select a resume first");
      return;
    }

    navigate("/ask", {
      state: { resumeId: selectedResumeId },
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Resume Analyzer Dashboard
        </h1>

        {/* Upload Resume Card */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <UploadResume onUploaded={loadResumes} />
        </div>

        {/* Resume List Card */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold mb-3">My Resumes</h2>
          <ResumeList
            resumes={resumes}
            selectedId={selectedResumeId}
            onSelect={setSelectedResumeId}
            refresh={loadResumes}
          />
        </div>

        {/* Go to Chat */}
        <button
          onClick={goToChat}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Go to AI Chat
        </button>
      </div>
    </>
  );
};

export default Dashboard;
