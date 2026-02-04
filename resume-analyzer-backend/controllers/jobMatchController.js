const Resume = require("../models/resume");
const matchJobRole = require("../utils/jobRoleMatcher");

const checkJobMatch = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Job role is required" });
    }

    const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    const result = matchJobRole(resume.skills, role);

    if (!result) {
      return res.status(400).json({ message: "Invalid job role" });
    }

    res.json(result);

  } catch (error) {
    console.error("JOB MATCH ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkJobMatch };
