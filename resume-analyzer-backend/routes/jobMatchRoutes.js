const express = require("express");
const { checkJobMatch } = require("../controllers/jobMatchController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/match", protect, checkJobMatch);

module.exports = router;
