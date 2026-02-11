const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

exports.careerChat = async (req, res) => {
  try {
    const {
      question,
      resumeText,
      jobDescription,
      atsScore,
      matchedSkills,
      missingSkills
    } = req.body;

    const prompt = `
You are a professional career assistant for job seekers.

CONTEXT:
Resume ATS Score: ${atsScore}
Matched Skills: ${matchedSkills.join(", ")}
Missing Skills: ${missingSkills.join(", ")}

Resume:
${resumeText}

Job Description:
${jobDescription}

RULES:
- Give practical, realistic advice
- Do NOT add fake skills or experience
- Keep answers concise and actionable
- Focus on improving job application success

User Question:
${question}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4
    });

    res.json({
      answer: response.choices[0].message.content
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Career assistant failed" });
  }
};
