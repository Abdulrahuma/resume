import React, { useState, useContext } from "react";
import api from "../services/api";
import ResumeUpload from "../components/ResumeUpload";
import JobDescriptionInput from "../components/JobDescriptionInput";
import ATSResult from "../components/ATSResult";
import { ResumeContext } from "../context/ResumeContext";

const Analyze = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState("");
  const [comparison, setComparison] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("Professional");

  const {
    resumeText,
    setResumeText,
    jobDescription,
    setJobDescription,
    atsResult,
    setAtsResult,
  } = useContext(ResumeContext);

  /* ===========================
     ANALYZE HANDLER
  ============================ */
  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription) {
      alert("Upload resume and add job description");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resumeFile);

      // 1️⃣ Upload resume
      const uploadRes = await api.post("/resume/upload", formData);
      const extractedText = uploadRes.data.resume_text;
      setResumeText(extractedText);

      // 2️⃣ Analyze ATS
      const analysisRes = await api.post("/analyze", {
        resume_text: extractedText,
        job_description: jobDescription,
      });

      setAtsResult(analysisRes.data);

    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     OPTIMIZE HANDLER
  ============================ */
  const handleOptimize = async () => {
    try {
      setOptimizing(true);

      // 1️⃣ Optimize Resume
      const optimizeRes = await api.post("/ats/optimize", {
        resumeText,
        jobDescription,
        matchedSkills: atsResult?.matched_skills || [],
        missingSkills: atsResult?.missing_skills || [],
        template: selectedTemplate,
      });

      const optimizedText = optimizeRes.data.optimized_resume;
      setOptimizedResume(optimizedText);

      // 2️⃣ Compare Scores
      const compareRes = await api.post("/compare/compare", {
        originalResume: resumeText,
        optimizedResume: optimizedText,
        jobDescription,
      });

      setComparison(compareRes.data);

    } catch (err) {
      console.error(err);
      alert("Optimization failed");
    } finally {
      setOptimizing(false);
    }
  };

  /* ===========================
     DOWNLOAD PDF
  ============================ */
  const handleDownloadPDF = async () => {
    const response = await api.post(
      "/pdf/download",
      { resumeText: optimizedResume },
      { responseType: "blob" }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "optimized_resume.pdf";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6 space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            AI Resume ATS Analyzer
          </h1>
          <p className="text-gray-600 mt-2">
            Analyze and optimize your resume for ATS systems
          </p>
        </div>

        {/* UPLOAD + JD SECTION */}
        <div className="bg-white shadow rounded-xl p-6 space-y-6">
          <ResumeUpload onFileSelect={setResumeFile} />

          <JobDescriptionInput
            value={jobDescription}
            onChange={setJobDescription}
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {/* ATS RESULT */}
        {atsResult && (
          <div className="bg-white shadow rounded-xl p-6 space-y-6">
            <ATSResult result={atsResult} />
                 
                 <div className="space-y-2">
                     <h3 className="font-semibold text-gray-700">
                        Select Resume Template
                     </h3>

                  <div className="flex gap-6">

                {["Professional", "Modern", "Minimal"].map((template) => (
                  <label
                    key={template}
                    className={`cursor-pointer px-4 py-2 rounded-lg border transition ${
                    selectedTemplate === template
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-purple-500"
                  }`}
                  >
                      <input
                      type="radio"
                      name="template"
                      value={template}
                      checked={selectedTemplate === template}
                      onChange={() => setSelectedTemplate(template)}
                      className="hidden"
                       />
                    {template}
                  </label>
               ))}
 
               </div>
            </div>


            <button
              onClick={handleOptimize}
              disabled={optimizing}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {optimizing ? "Optimizing..." : "Optimize Resume"}
            </button>
          </div>
        )}

        {/* COMPARISON RESULT */}
        {comparison && (
          <div className="bg-white shadow rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-bold text-center">
              Optimization Result
            </h2>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-gray-500">Original Score</p>
                <p className="text-2xl font-bold text-red-500">
                  {comparison.before.ats_score}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Optimized Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {comparison.after.ats_score}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Improvement</p>
                <p className="text-2xl font-bold text-blue-600">
                  +{comparison.improvement}
                </p>
              </div>
            </div>

            {/* OPTIMIZED PREVIEW */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Optimized Resume Preview
              </h3>

              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {optimizedResume}
              </pre>

              <button
                onClick={handleDownloadPDF}
                className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Download Optimized Resume PDF
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Analyze;
