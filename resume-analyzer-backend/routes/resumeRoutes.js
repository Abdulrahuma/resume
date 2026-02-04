const express = require("express");
const {
  uploadResume,
  getMyResumes,
  deleteResume, // ✅ added
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/my", protect, getMyResumes);

// ✅ DELETE resume
router.delete("/:id", protect, deleteResume);

module.exports = router;
