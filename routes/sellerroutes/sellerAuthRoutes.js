const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");

const { applySeller } = require("../../controllers/sellercontroller/sellerAuthController");

// ✅ Seller Apply Route
router.post("/apply", protect, applySeller);

module.exports = router;
