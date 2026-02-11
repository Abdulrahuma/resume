const axios = require("axios");
const path = require("path");

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // IMPORTANT: absolute path
    const absolutePath = path.resolve(req.file.path);

    const pythonResponse = await axios.post(
      "http://localhost:8000/parse-resume",
      {
        file_path: absolutePath
      }
    );

    res.json({
      message: "Resume uploaded successfully",
      resume_text: pythonResponse.data.text
    });
  } catch (error) {
    console.error("Resume parsing error:", error.message);
    res.status(500).json({ error: "Resume parsing failed" });
  }
};
