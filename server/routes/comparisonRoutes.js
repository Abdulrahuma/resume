const express = require("express");
const { compareResumes } = require("../controllers/comparisonController");

const router = express.Router();

router.post("/compare", compareResumes);

module.exports = router;
