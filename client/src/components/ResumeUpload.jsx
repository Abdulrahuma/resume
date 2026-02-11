import React from "react";

const ResumeUpload = ({ onFileSelect }) => {
  return (
    <div className="border border-dashed border-gray-300 p-6 rounded-lg text-center">
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => onFileSelect(e.target.files[0])}
        className="hidden"
        id="resumeUpload"
      />
      <label
        htmlFor="resumeUpload"
        className="cursor-pointer text-blue-600 font-medium"
      >
        Click to upload resume (PDF / DOCX)
      </label>
    </div>
  );
};

export default ResumeUpload;
