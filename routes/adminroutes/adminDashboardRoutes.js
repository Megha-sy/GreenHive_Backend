const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
} = require("../../controllers/adminController/adminDashboardController");

const {
  protect,
  authorizeRoles,
} = require("../../middleware/auth");

/* =========================
   ADMIN DASHBOARD
========================= */
router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard // ⚠️ MUST EXIST
);

module.exports = router;
