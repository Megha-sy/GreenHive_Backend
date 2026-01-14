const express = require("express");
const router = express.Router();

const adminProductController = require(
  "../../controllers/adminController/adminProductController"
);

const {
  protect,
  authorizeRoles,
} = require("../../middleware/auth");

/* =========================
   ADMIN PRODUCTS
========================= */

router.get(
  "/products",
  protect,
  authorizeRoles("admin"),
  adminProductController.getAdminProducts
);

router.delete(
  "/products/:id",
  protect,
  authorizeRoles("admin"),
  adminProductController.deleteProduct
);

module.exports = router;
