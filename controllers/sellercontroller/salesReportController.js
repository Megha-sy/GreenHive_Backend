const Order = require("../../models/Order");

exports.getSalesReport = async (req, res) => {
  const report = await Order.aggregate([
    { $match: { seller: req.user._id } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" },
        totalOrders: { $sum: 1 }
      }
    }
  ]);

  res.json(report[0] || { totalRevenue: 0, totalOrders: 0 });
};
