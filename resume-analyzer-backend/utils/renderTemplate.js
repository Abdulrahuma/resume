const fs = require("fs");
const path = require("path");

const renderTemplate = (templateName, data) => {
  let html = fs.readFileSync(
    path.join(__dirname, `../templates/${templateName}.html`),
    "utf8"
  );

  const replace = (key, value) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, value || "");
  };

  replace("name", data.name);
  replace("email", data.contact?.email);
  replace("phone", data.contact?.phone);
  replace("linkedin", data.contact?.linkedin || "");

  replace("summary", data.summary);
  replace("skills", data.skills?.join(", "));

  replace("education", data.education?.map(e =>
    `<p><b>${e.degree}</b>, ${e.institution} (${e.year})</p>`
  ).join(""));

  replace("experience", data.experience?.map(exp =>
    `<p><b>${exp.role}</b> - ${exp.company}</p>
     <ul>${exp.points.map(p => `<li>${p}</li>`).join("")}</ul>`
  ).join(""));

  replace("projects", data.projects?.map(p =>
    `<p><b>${p.title}</b></p>
     <ul>${p.points.map(pt => `<li>${pt}</li>`).join("")}</ul>`
  ).join(""));

  replace("certifications", data.certifications?.map(c =>
    `<p>${c}</p>`
  ).join(""));

  return html;
};

module.exports = renderTemplate;
