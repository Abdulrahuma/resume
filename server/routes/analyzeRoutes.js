const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/analyze",
      {
        resume_text: req.body.resume_text,
        job_description: req.body.job_description,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("ATS analyze error:", error.message);
    res.status(500).json({ error: "ATS analysis failed" });
  }
});

module.exports = router;
