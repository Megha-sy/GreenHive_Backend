
const Order = require("../../models/Order");
const Product = require("../../models/sellermodels/Plant");
const Cart = require("../../models/usermodels/Cart");
const User = require("../../models/usermodels/User"); 


exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { payment } = req.body;

    // 🔹 Load user
    const user = await User.findById(userId);
    if (!user || !user.address) {
      return res.status(400).json({ message: "User address not found" });
    }

    const address = {
      line1: user.address.line1,
      city: user.address.city,
      district: user.address.district,
      state: user.address.state,
      pincode: user.address.pincode,
      country: "India",
    };

    // 🔹 Load cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;
    const products = [];

    // ✅ STOCK CHECK + CALCULATION
    for (const item of cart.items) {
      if (!item.product) continue;

      if (item.qty > item.product.stock) {
        return res.status(400).json({
          message: `${item.product.name} is out of stock`,
        });
      }

      totalPrice += item.product.price * item.qty;

      products.push({
        product: item.product._id,
        qty: item.qty,
        seller: item.product.seller,
        price: item.product.price,
      });
    }

    if (products.length === 0) {
      return res.status(400).json({ message: "Invalid cart items" });
    }

    // 🔹 Payment info
    const paymentData = {
      method: payment?.method || "cod",
      status: payment?.status || "unpaid",
      transactionId: payment?.transactionId || null,
    };

    // ✅ CREATE ORDER
    const order = await Order.create({
      buyer: userId,
      products,
      totalPrice,
      payment: paymentData,
      address,
      status: "processing",
    });

    // 🔥 DECREASE STOCK (CRITICAL FIX)
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      });
    }

    // 🔹 Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "name email")
      .populate("products.product", "name price images")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("products.product", "name price images")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product", "name price images")
      .populate("products.seller", "name shopName")
      .populate("buyer", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ ROLE & OWNER CHECK (PLACE IT HERE)
    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    const isSeller = req.user.role === "seller";

    if (!isBuyer && !isAdmin && !isSeller) {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ SEND ORDER
    res.json(order);

  } catch (err) {
    console.error("getOrderById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order updated", order });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.cancelOrderByUser = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        message: "Cancellation reason is required",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!["pending", "processing"].includes(order.status)) {
      return res.status(400).json({
        message: "Order cannot be cancelled now",
      });
    }

    // 🔴 PAID ORDER → ONLY REQUEST REFUND
    if (order.payment?.status === "paid") {
      order.status = "cancel_requested";
      order.refundRequested = true;
      order.refundRequestedAt = new Date();
      order.cancelReason = reason;

      await order.save({ validateBeforeSave: false });

      return res.json({
        message:
          "Cancellation requested. Refund will be processed after admin approval.",
        order,
      });
    }

    // 🟢 UNPAID → DIRECT CANCEL
    order.status = "cancelled";
    order.cancelReason = reason;
    order.cancelledAt = new Date();

    await order.save({ validateBeforeSave: false });

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};



exports.refundPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (!order.refundRequested) {
      return res.status(400).json({
        message: "No refund request found for this order",
      });
    }

    if (order.payment.status !== "paid") {
      return res.status(400).json({
        message: "Only paid orders can be refunded",
      });
    }

    // 🔄 Restore stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty },
      });
    }

    order.payment.status = "refunded";
    order.payment.refundedAt = new Date();
    order.status = "cancelled";
    order.refundApprovedAt = new Date();
    order.refundRequested = false;

    await order.save();

    res.json({
      message: "Refund approved and processed",
      order,
    });
  } catch (err) {
    console.error("Refund error:", err);
    res.status(500).json({ message: "Refund failed" });
  }
};





