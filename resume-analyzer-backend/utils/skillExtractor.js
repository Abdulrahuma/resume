const SKILLS = require("../ai/skills");

const extractSkills = (resumeText) => {
  const text = resumeText.toLowerCase();
  const extractedSkills = [];

  SKILLS.forEach(skill => {
    if (text.includes(skill)) {
      extractedSkills.push(skill);
    }
  });

  return extractedSkills;
};

module.exports = extractSkills;
