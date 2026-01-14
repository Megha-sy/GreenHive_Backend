const router = require("express").Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../../controllers/usercontroller/paymentController");

const { protect } = require("../../middleware/auth");

router.post("/razorpay", protect, createRazorpayOrder);
router.post("/razorpay/verify", protect, verifyRazorpayPayment);

module.exports = router;
