const axios = require("axios");
const Resume = require("../models/resume");
const matchJobRole = require("../utils/jobRoleMatcher");
const generateResponse = require("../ai/chatResponses");

const askChatbot = async (req, res) => {
  try {
    const { question, role } = req.body;

    if (!question || !role) {
      return res.status(400).json({ message: "Question and role are required" });
    }

    // 1️⃣ Get intent from ML API
    const mlResponse = await axios.post(
      "http://127.0.0.1:5001/predict-intent",
      { text: question }
    );

    const intent = mlResponse.data.intent;

    // 2️⃣ Get latest resume
    const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    // 3️⃣ Match job role
    const jobResult = matchJobRole(resume.skills, role);

    if (!jobResult) {
      return res.status(400).json({ message: "Invalid job role" });
    }

    // 4️⃣ Generate chatbot response
    const answer = generateResponse(intent, jobResult);

    res.json({
      question,
      intent,
      role,
      response: answer,
      readinessScore: jobResult.readinessScore
    });

  } catch (error) {
    console.error("CHATBOT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { askChatbot };
