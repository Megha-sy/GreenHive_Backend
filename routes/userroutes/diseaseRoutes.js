const express = require("express");
const router = express.Router();
const { getUserReports } = require("../controllers/diseaseController");
const auth = require("../middleware/auth");

router.get("/my-reports", auth, getUserReports);

module.exports = router;

