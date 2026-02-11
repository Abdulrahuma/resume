import React from "react";

const ATSResult = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-6 space-y-4">
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold">
          ATS Score: <span className="text-blue-600">{result.ats_score}</span>
        </h3>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h4 className="font-semibold mb-2">Matched Skills</h4>
        <div className="flex flex-wrap gap-2">
          {result.matched_skills.map((skill, i) => (
            <span
              key={i}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h4 className="font-semibold mb-2">Missing Skills</h4>
        <div className="flex flex-wrap gap-2">
          {result.missing_skills.map((skill, i) => (
            <span
              key={i}
              className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ATSResult;
