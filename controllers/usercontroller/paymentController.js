const Razorpay = require("razorpay");
const crypto = require("crypto");

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // ✅ PAYMENT VERIFIED
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};


const Cart = require("../../models/usermodels/Cart");

/* ===============================
   CREATE RAZORPAY ORDER
   (Amount calculated from cart)
================================ */
exports.createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Get cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2️⃣ Calculate total
    let totalAmount = 0;
    cart.items.forEach((item) => {
      totalAmount += item.qty * item.product.price;
    });

    // 3️⃣ Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: "order_rcpt_" + Date.now(),
    });

    // 4️⃣ Send to frontend
    res.json({
      orderId: order.id,
      amount: totalAmount,
      currency: "INR",
    });
  } catch (err) {
    console.error("Razorpay Error:", err);
    res.status(500).json({ message: "Payment error" });
  }
};
