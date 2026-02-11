const { optimizeResume } = require("../services/groqService");

exports.optimize = async (req, res) => {
  try {
    const {
      resumeText,
      jobDescription,
      matchedSkills,
      missingSkills,
      template
    } = req.body;

    const optimizedResume = await optimizeResume({
      resumeText,
      jobDescription,
      matchedSkills,
      missingSkills,
      template
    });

    res.json({
      optimized_resume: optimizedResume
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Resume optimization failed" });
  }
};
