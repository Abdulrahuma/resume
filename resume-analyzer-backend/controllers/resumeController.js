const fs = require("fs");
const pdfParse = require("pdf-parse");
const Resume = require("../models/resume");
const extractSkills = require("../utils/skillExtractor");
const path = require("path");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }

    // 1️⃣ Read uploaded PDF file
    const dataBuffer = fs.readFileSync(req.file.path);

    // 2️⃣ Parse PDF (pdf-parse v1.1.1)
    const pdfData = await pdfParse(dataBuffer);

    // 3️⃣ Extract skills from resume text
    const skills = extractSkills(pdfData.text);

    // 4️⃣ Save resume data to database
    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.filename,
      resumeText: pdfData.text,
      skills: skills,
    });

    // 5️⃣ Send response
    res.status(201).json({
      message: "Resume uploaded, parsed, and skills extracted successfully",
      resumeId: resume._id,
      extractedSkills: skills,
    });

  } catch (error) {
    console.error("RESUME UPLOAD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select("_id fileName createdAt extractedSkills");

    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * DELETE RESUME
 */
const deleteResume = async (req, res) => {
  try {
    const resumeId = req.params.id;

    // Find resume belonging to logged-in user
    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Build file path
    const filePath = path.join(__dirname, "..", "uploads", resume.fileName);

    // Delete file if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete DB record
    await Resume.deleteOne({ _id: resumeId });

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("DELETE RESUME ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { uploadResume, getMyResumes, deleteResume };