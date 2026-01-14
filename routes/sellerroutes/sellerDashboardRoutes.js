const router = require("express").Router();
const { protect } = require("../../middleware/auth");
const {
  getSellerDashboard,
} = require("../../controllers/sellercontroller/sellerDashboardController");

router.get("/dashboard", protect, getSellerDashboard);

module.exports = router;
