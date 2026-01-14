const router = require("express").Router();

const {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrderByUser,
  refundPayment,
} = require("../../controllers/usercontroller/orderController");

const { protect, authorizeRoles } = require("../../middleware/auth");

// ================= USER ROUTES =================
router.post("/", protect, createOrder);
router.get("/my", protect, getOrdersByUser);

// ❗ cancel must be before :id
router.put("/:id/cancel", protect, cancelOrderByUser);
router.get("/:id", protect, getOrderById);

// ================= ADMIN / SELLER ROUTES =================
router.get("/", protect, authorizeRoles("admin"), getAllOrders);
router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin", "seller"),
  updateOrderStatus
);

// ================= ADMIN REFUND =================
router.put(
  "/:id/refund",
  protect,
  authorizeRoles("admin"),
  refundPayment
);

module.exports = router;
