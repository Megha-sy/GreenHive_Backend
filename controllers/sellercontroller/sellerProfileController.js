const User = require("../../models/usermodels/User");


exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.user._id).select("-password");

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json(seller);
  } catch (err) {
    console.error("getSellerProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/seller/profile
 */
exports.updateSellerProfile = async (req, res) => {
  try {
    const seller = req.user; // protect middleware already sets this

    // Safety check
    if (!seller || seller.role !== "seller") {
      return res.status(403).json({ message: "Not authorized as seller" });
    }

    const {
      name,
      email,
      password,
      address,
      shopName,
    } = req.body;

    // Same pattern as user update
    if (name) seller.name = name;
    if (email) seller.email = email;
    if (password) seller.password = password; // hashed by pre-save hook
    if (address) seller.address = address;

    // Seller-specific field (from your User model)
    if (shopName) seller.shopName = shopName;

    await seller.save();

    res.json({
      message: "Seller profile updated",
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        shopName: seller.shopName,
      },
    });
  } catch (err) {
    console.error("updateSellerProfile", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

