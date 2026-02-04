import API from "../../services/api";
import { useState } from "react";

const UploadResume = ({ onUploaded }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) {
      alert("Please select a PDF resume");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      await API.post("/resume/upload", formData);

      setFile(null);
      onUploaded(); // refresh resume list
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to upload resume");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">
        Upload Resume
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        Upload your resume in PDF format for analysis.
      </p>

      <div className="flex items-center gap-3">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-700
                     file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0
                     file:text-sm file:font-medium
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />

        <button
          onClick={upload}
          disabled={loading}
          className={`px-5 py-2 rounded text-white font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default UploadResume;
