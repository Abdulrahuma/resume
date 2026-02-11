const express = require("express");
require("dotenv").config();
const cors = require("cors");

const resumeRoutes = require("./routes/resumeRoutes");
const atsRoutes = require("./routes/atsRoutes");
const comparisonRoutes = require("./routes/comparisonRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const chatRoutes = require("./routes/chatRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");

const app = express();

app.use(express.json());

app.use("/api/resume", resumeRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/compare", comparisonRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/analyze", analyzeRoutes);

module.exports = app;
