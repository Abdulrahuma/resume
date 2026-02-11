const express = require("express");
const { optimize } = require("../controllers/optimizeController");

const router = express.Router();

router.post("/optimize", optimize);

module.exports = router;
