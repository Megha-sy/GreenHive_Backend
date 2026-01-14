const router = require("express").Router();
const { protect } = require("../../middleware/auth");
const {
  getSellerOrders,
  updateOrderStatus,
  markOrderAsPaid,
} = require("../../controllers/sellercontroller/sellerOrderController");

router.get("/orders", protect, getSellerOrders);
router.put("/orders/:orderId/status", protect, updateOrderStatus);
router.put(
  "/orders/:orderId/mark-paid",
  protect,
  markOrderAsPaid
);


module.exports = router;
