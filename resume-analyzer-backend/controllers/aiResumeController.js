const Resume = require("../models/resume");
const ResumeSession = require("../models/ResumeSession");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");

// ✅ USE GROQ VIA UTILITY (NOT SDK DIRECTLY)
const generateWithGroq = require("../utils/groqAI");

/* ================================
   🔒 SAFE JSON PARSER (MANDATORY)
================================ */
const safeJsonParse = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("No JSON found in AI response");
    }
    return JSON.parse(match[0]);
  }
};

/* ================================
   1️⃣ DETECT MISSING FIELDS
================================ */
const detectMissingFields = async (req, res) => {
   console.log("🔥 detectMissingFields HIT");
   console.log("REQ BODY:", req.body);

  try {
    const { resumeId, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resumeId" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const prompt = `
Return ONLY valid JSON.
No explanation. No markdown.

Format:
{
  "missingFields": [
    { "field": "", "reason": "" }
  ]
}

Analyze the resume for role: ${role}

Resume:
${resume.resumeText}
`;

    const aiText = await generateWithGroq(prompt);
    const result = safeJsonParse(aiText);

    res.json({
      resumeId,
      missingFields: result.missingFields || [],
    });
  } catch (error) {
    console.error("DETECT MISSING ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   2️⃣ START FIELD COLLECTION
================================ */
const startFieldCollection = async (req, res) => {
  try {
    const { resumeId, role, missingFields } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(resumeId) ||
      !Array.isArray(missingFields)
    ) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const session = await ResumeSession.create({
      user: req.user._id,
      resumeId,
      role,
      pendingFields: missingFields.map((f) => f.field),
      currentField: missingFields[0]?.field,
      collectedData: {},
    });

    res.json({
      sessionId: session._id,
      question: `Your resume is missing "${session.currentField}". Would you like to add it? (yes / skip)`,
    });
  } catch (error) {
    console.error("START SESSION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   3️⃣ HANDLE FIELD RESPONSE
================================ */
const handleFieldResponse = async (req, res) => {
  try {
    const { sessionId, userInput } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid sessionId" });
    }

    const session = await ResumeSession.findById(sessionId);
    if (!session || session.isCompleted) {
      return res
        .status(404)
        .json({ message: "Session not found or completed" });
    }

    const field = session.currentField;

    if (userInput.toLowerCase() === "skip") {
      session.collectedData[field] = null;
    } else if (userInput.toLowerCase() === "yes") {
      return res.json({
        question: `Please provide your ${field}:`,
        waitingForValue: true,
      });
    } else {
      session.collectedData[field] = userInput;
    }

    session.pendingFields.shift();
    session.currentField = session.pendingFields[0];

    if (!session.currentField) {
      session.isCompleted = true;
      await session.save();
      return res.json({
        completed: true,
        collectedData: session.collectedData,
      });
    }

    await session.save();
    res.json({
      question: `Your resume is missing "${session.currentField}". Would you like to add it? (yes / skip)`,
    });
  } catch (error) {
    console.error("FIELD RESPONSE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   4️⃣ GENERATE STRUCTURED RESUME
================================ */
const generateStructuredResume = async (req, res) => {
  try {
    const { resumeId, sessionId, role } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(resumeId) ||
      !mongoose.Types.ObjectId.isValid(sessionId)
    ) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const resume = await Resume.findById(resumeId);
    const session = await ResumeSession.findById(sessionId);

    if (!resume || !session || !session.isCompleted) {
      return res.status(400).json({
        message: "Resume session not completed",
      });
    }

    const prompt = `
Return ONLY valid JSON.
No explanation.

Generate ATS-friendly structured resume JSON.
Include ONLY fields with values.

Resume:
${resume.resumeText}

Extra Data:
${JSON.stringify(session.collectedData, null, 2)}

Format:
{
  "name": "",
  "contact": {},
  "summary": "",
  "skills": [],
  "education": [],
  "experience": [],
  "projects": [],
  "certifications": []
}
`;

    const aiText = await generateWithGroq(prompt);
    const structuredResume = safeJsonParse(aiText);

    res.json({
      resumeId,
      structuredResume,
    });
  } catch (error) {
    console.error("STRUCTURED RESUME ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   5️⃣ GENERATE OPTIMIZED RESUME
================================ */
const generateOptimizedResume = async (req, res) => {
  try {
    const { resumeId, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: "Invalid resumeId" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const prompt = `
Optimize this resume for ATS for role: ${role}.
Return plain text only.

Resume:
${resume.resumeText}
`;

    const optimizedResume = await generateWithGroq(prompt);

    res.json({ optimizedResume });
  } catch (error) {
    console.error("OPTIMIZE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   6️⃣ DOWNLOAD OPTIMIZED RESUME PDF
================================ */
const downloadOptimizedResume = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content required" });
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=optimized_resume.pdf"
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);
    doc.fontSize(11).text(content);
    doc.end();
  } catch (error) {
    console.error("PDF ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   ✅ EXPORTS (SINGLE EXPORT ONLY)
================================ */
module.exports = {
  detectMissingFields,
  startFieldCollection,
  handleFieldResponse,
  generateStructuredResume,
  generateOptimizedResume,
  downloadOptimizedResume,
};
