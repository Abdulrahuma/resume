import { deleteResume } from "../../services/resume"; // adjust path if needed

const ResumeList = ({ resumes, selectedId, onSelect, refresh }) => {
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );
    if (!confirmDelete) return;

    try {
      await deleteResume(id);
      refresh(); // reload resume list
    } catch (error) {
      console.error(error);
      alert("Failed to delete resume");
    }
  };

  if (!resumes || resumes.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No resumes uploaded yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {resumes.map((resume) => (
        <div
          key={resume._id}
          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer
            ${
              selectedId === resume._id
                ? "bg-blue-50 border-blue-400"
                : "bg-white hover:bg-gray-50"
            }`}
        >
          {/* Resume name */}
          <div
            onClick={() => onSelect(resume._id)}
            className="flex-1"
          >
            <p className="text-sm font-medium text-gray-800">
              {resume.fileName}
            </p>
            <p className="text-xs text-gray-500">
              Uploaded on{" "}
              {new Date(resume.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelect(resume._id)}
              className="text-blue-600 text-sm hover:underline"
            >
              Select
            </button>

            <button
              onClick={() => handleDelete(resume._id)}
              className="text-red-600 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResumeList;
