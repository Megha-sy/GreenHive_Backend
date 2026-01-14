const express = require("express");
const router = express.Router();

const {
  getAllOrders,
} = require("../../controllers/adminController/adminOrderController");

const { protect, authorizeRoles } = require("../../middleware/auth");

router.get(
  "/orders",
  protect,
  authorizeRoles("admin"),
  getAllOrders
);

module.exports = router;
