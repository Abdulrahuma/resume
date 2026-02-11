const PDFDocument = require("pdfkit");

exports.generatePDF = (req, res) => {
  const { resumeText } = req.body;

  const doc = new PDFDocument({
    margin: 40
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");

  doc.pipe(res);

  doc.font("Times-Roman").fontSize(11);

  resumeText.split("\n").forEach(line => {
    doc.text(line, { lineGap: 6 });
  });

  doc.end();
};
