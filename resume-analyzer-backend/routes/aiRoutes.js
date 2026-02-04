const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  generateOptimizedResume,
  downloadOptimizedResume,
  detectMissingFields,
  startFieldCollection,
  handleFieldResponse,
  generateStructuredResume,
} = require("../controllers/aiResumeController");

router.post(
  "/optimize-resume",
  protect,
  generateOptimizedResume
);
router.post(
  "/download-resume",
  protect,
  downloadOptimizedResume
);
router.post(
  "/detect-missing-fields",
  protect,
  detectMissingFields
);
router.post(
  "/start-field-collection",
  protect,
  startFieldCollection
);

router.post(
  "/field-response",
  protect,
  handleFieldResponse
);
router.post(
  "/generate-structured-resume",
  protect,
  generateStructuredResume
);

   
module.exports = router;
