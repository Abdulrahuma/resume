const express = require("express");
const { generatePDF } = require("../controllers/pdfController");

const router = express.Router();

router.post("/download", generatePDF);

module.exports = router;
