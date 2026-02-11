const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function optimizeResume({
  resumeText,
  jobDescription,
  matchedSkills,
  missingSkills,
  template
}) {
  const prompt = `
You are an ATS resume optimization assistant.

STRICT RULES:
- Do NOT add fake experience, skills, companies, or projects
- Use ONLY information already present in the resume
- Do NOT add missing skills: ${missingSkills.join(", ")}
- Improve wording using ATS-friendly language
- Keep content truthful
- TEMPLATE STYLE INSTRUCTIONS:

If template is "Professional":
- Traditional formatting
- Clear section headings
- Formal tone

If template is "Modern":
- Concise bullet points
- Strong action verbs
- Impact-driven statements

If template is "Minimal":
- Clean simple wording
- Short sentences
- Straightforward structure

Use ${template} template style.


TASK:
Rewrite the resume to improve ATS compatibility for the given job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Output ONLY the optimized resume text.
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });

  return response.choices[0].message.content;
}

module.exports = { optimizeResume };
