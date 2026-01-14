
const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");

const {
  getSalesDashboard,getProductAnalytics,requestPayout
} = require("../../controllers/sellercontroller/sellerAnalyticsController");

// ✅ Dashboard
router.get("/analytics/products", protect, getProductAnalytics);
router.post("/payouts/request", protect, requestPayout);

router.get("/salesanalytics/dashboard", protect, getSalesDashboard);

module.exports = router;
