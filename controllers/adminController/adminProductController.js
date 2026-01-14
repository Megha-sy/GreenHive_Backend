const Plant = require("../../models/sellermodels/Plant");

/* =========================
   GET ALL PRODUCTS (ADMIN)
========================= */
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Plant.find({ isDeleted: false })
      .populate("seller", "name shopName")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("Admin Products Error:", err);
    res.status(500).json({ message: "Failed to load products" });
  }
};

/* =========================
   SOFT DELETE PRODUCT
========================= */
exports.deleteProduct = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        message: "Delete reason required",
      });
    }

    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        isActive: false,
        deleteReason: reason,
        deletedAt: new Date(),
        deletedBy: req.user._id,
      },
      { new: true }
    );

    if (!plant) {
      return res.status(404).json({
        message: "Plant not found",
      });
    }

    res.json({
      message: "Plant deleted successfully",
    });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
