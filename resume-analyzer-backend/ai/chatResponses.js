const generateResponse = (intent, jobResult) => {
  switch (intent) {

    case "SKILL_GAP":
      if (jobResult.missingSkills.length === 0) {
        return `You already have all the required skills for ${jobResult.role}. Great job!`;
      }
      return `You are missing the following skills for ${jobResult.role}: ${jobResult.missingSkills.join(", ")}.`;

    case "JOB_FIT":
      return `You are ${jobResult.readinessScore}% ready for the ${jobResult.role} role.`;

    case "LEARNING_PATH":
      if (jobResult.missingSkills.length === 0) {
        return "You are well prepared. Focus on advanced projects and system design.";
      }
      return `To improve your profile, you should learn: ${jobResult.missingSkills.join(", ")}.`;

    case "RESUME_IMPROVE":
      return `Try adding more projects and highlighting these skills: ${jobResult.missingSkills.join(", ")}.`;

    default:
      return "I can help you analyze your resume, skills, and job readiness.";
  }
};

module.exports = generateResponse;
