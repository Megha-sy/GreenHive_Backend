const Order = require("../../models/Order");

exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find({
      "products.seller": sellerId,
    })
      .populate("buyer", "name email")
      .populate("products.product", "name price images")
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map((order) => {
      const o = order.toObject();

      const sellerProducts = o.products.filter(
        (p) => p.seller.toString() === sellerId.toString()
      );

      return {
        _id: o._id,
        buyer: o.buyer,
        products: sellerProducts,
        totalPrice: o.totalPrice,
        status: o.status,
        payment: o.payment, // ✅ ADD THIS
        createdAt: o.createdAt,
      };
    });

    res.json(formattedOrders);
  } catch (err) {
    console.error("Seller Orders Error:", err);
    res.status(500).json({ message: "Failed to load seller orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,   // ✅ FIX
      { status },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

exports.markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    // Allow only COD orders
    if (order.payment.method !== "cod") {
      return res
        .status(400)
        .json({ message: "Only COD orders can be marked as paid" });
    }

    order.payment.status = "paid";
    await order.save();

    res.json(order);
  } catch (err) {
    console.error("Mark Paid Error:", err);
    res.status(500).json({ message: "Failed to update payment status" });
  }
};
