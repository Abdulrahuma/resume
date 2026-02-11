import React from "react";

const JobDescriptionInput = ({ value, onChange }) => {
  return (
    <textarea
      rows="6"
      placeholder="Paste job description here..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default JobDescriptionInput;
