const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const {
  updatePlant,
} = require("../../controllers/sellercontroller/sellerProductController");
const {
  applyPromotion,
} = require("../../controllers/sellercontroller/promotionController");

// normal update
router.put("/plants/:id", protect, updatePlant);

// promotion update ✅
router.put("/plants/:id/promotion", protect, applyPromotion);

module.exports = router;
