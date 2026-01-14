const User = require("../../models/usermodels/User");

// ✅ GET ALL SELLERS (pending + approved + rejected)
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({
      role: "seller",
    }).select("-password");

    res.json(sellers);
  } catch (err) {
    console.error("GET SELLERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ APPROVE / REJECT SELLER
exports.updateSellerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const update = {
      sellerStatus: status,
    };

    // ⭐ SAVE APPROVAL DATE
    if (status === "approved") {
      update.sellerApprovedAt = new Date();
    }

    const seller = await User.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).select("-password");

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    res.json(seller);
  } catch (err) {
    console.error("UPDATE SELLER STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
