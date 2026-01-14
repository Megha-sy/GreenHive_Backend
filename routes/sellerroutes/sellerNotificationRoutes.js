const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");

const {
  getNotifications,
} = require("../../controllers/sellercontroller/sellerNotificationController");

// ✅ NOTIFICATIONS
router.get("/notifications", protect, getNotifications);

module.exports = router;
