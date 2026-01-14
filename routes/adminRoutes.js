const express = require("express");
const router = express.Router();

const { getAdminDashboard } = require("../controllers/adminController/adminDashboardController");
const { protect, authorizeRoles } = require("../middleware/auth");

router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);

module.exports = router;
