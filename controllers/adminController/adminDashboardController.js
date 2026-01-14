const User = require("../../models/usermodels/User");
const Plant = require("../../models/sellermodels/Plant");
const Order = require("../../models/Order");

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalPlants = await Plant.countDocuments();

    // ⚠️ IMPORTANT FIX (YOUR REVENUE BUG)
    const deliveredOrders = await Order.find({
      "payment.status": "paid", // ✅ FIX
    });

    const totalOrders = deliveredOrders.length;

    const totalRevenue = deliveredOrders.reduce(
      (sum, o) => sum + (o.totalPrice || 0),
      0
    );

    res.json({
      totalUsers,
      totalSellers,
      totalPlants,
      totalOrders,
      totalRevenue,
      monthlyRevenue: [],
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Dashboard load failed" });
  }
};
