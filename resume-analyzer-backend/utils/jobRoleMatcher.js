const JOB_ROLES = require("../ai/jobRoles");

const matchJobRole = (resumeSkills, roleName) => {
  const roleSkills = JOB_ROLES[roleName];

  if (!roleSkills) {
    return null;
  }

  const matchedSkills = resumeSkills.filter(skill =>
    roleSkills.includes(skill)
  );

  const missingSkills = roleSkills.filter(skill =>
    !resumeSkills.includes(skill)
  );

  const readinessScore = Math.round(
    (matchedSkills.length / roleSkills.length) * 100
  );

  return {
    role: roleName,
    matchedSkills,
    missingSkills,
    readinessScore
  };
};

module.exports = matchJobRole;
