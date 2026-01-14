const Order = require("../../models/Order");

// ===============================
// GET ALL ORDERS (WITH FILTERS)
// ===============================
exports.getAllOrders = async (req, res) => {
  try {
    const { status, seller, startDate, endDate } = req.query;

    const filter = {};

    // Filter by order status
    if (status) {
      filter.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    let orders = await Order.find(filter)
      .populate("buyer", "name email")
      .populate("products.product", "name price")
      .populate("products.seller", "name email")
      .sort({ createdAt: -1 });

    // Filter by seller (inside products)
    if (seller) {
      orders = orders.filter((o) =>
        o.products.some(
          (p) => p.seller && p.seller._id.toString() === seller
        )
      );
    }

    res.json(orders);
  } catch (err) {
    console.error("GET ALL ORDERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
