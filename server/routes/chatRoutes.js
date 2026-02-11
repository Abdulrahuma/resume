const express = require("express");
const { careerChat } = require("../controllers/chatController");

const router = express.Router();

router.post("/ask", careerChat);

module.exports = router;
