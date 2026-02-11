const axios = require("axios");

exports.compareResumes = async (req, res) => {
  try {
    const { originalResume, optimizedResume, jobDescription } = req.body;

    const originalAnalysis = await axios.post(
      "http://localhost:8000/analyze",
      {
        resume_text: originalResume,
        job_description: jobDescription
      }
    );

    const optimizedAnalysis = await axios.post(
      "http://localhost:8000/analyze",
      {
        resume_text: optimizedResume,
        job_description: jobDescription
      }
    );

    res.json({
      before: originalAnalysis.data,
      after: optimizedAnalysis.data,
      improvement: (
        optimizedAnalysis.data.ats_score -
        originalAnalysis.data.ats_score
      ).toFixed(2)
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Resume comparison failed" });
  }
};
