const express = require("express");
const router = express.Router();
const {
  generateCareWithAI,
} = require("../../controllers/usercontroller/aiCareController");

router.get("/generate-care/:plantName", generateCareWithAI);

module.exports = router;
