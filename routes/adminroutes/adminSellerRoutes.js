const express = require("express");
const router = express.Router();

const {
  getAllSellers,
  updateSellerStatus,
} = require("../../controllers/adminController/adminSellerController");

const { protect, authorizeRoles } = require("../../middleware/auth");

router.get(
  "/sellers",
  protect,
  authorizeRoles("admin"),
  getAllSellers
);

router.put(
  "/sellers/:id",
  protect,
  authorizeRoles("admin"),
  updateSellerStatus
);

module.exports = router;
