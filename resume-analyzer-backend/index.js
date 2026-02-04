const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

console.log("🔥 Backend starting");

const app = express();

// DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log("🌐 BACKEND RECEIVED:", req.method, req.url);
  next();
});


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/job", require("./routes/jobMatchRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("Resume Analyzer Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Keep alive (Windows safety)
process.stdin.resume();
