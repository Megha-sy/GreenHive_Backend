// analyticsController.js
const Order = require("../../models/sellermodels/Order");

exports.productAnalytics = async (req, res) => {
  const analytics = await Order.aggregate([
    { $match: { seller: req.user._id } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        sold: { $sum: "$items.qty" },
        revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } }
      }
    }
  ]);

  res.json(analytics);
};
