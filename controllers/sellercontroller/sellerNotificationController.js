const Notification = require("../../models/sellermodels/Notification");

// ✅ Seller Notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Fetch Notifications Failed" });
  }
};
