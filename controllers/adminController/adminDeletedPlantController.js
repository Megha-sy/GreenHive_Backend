const Plant = require("../../models/sellermodels/Plant");

exports.getDeletedPlants = async (req, res) => {
  try {
    const plants = await Plant.find({
      isDeleted: true,
    })
      .populate("seller", "name email shopName")
      .populate("category", "name") // ✅
      .populate("deletedBy", "name email")
      .sort({ deletedAt: -1 });

    res.json(plants);
  } catch (err) {
    console.error(
      "GET DELETED PLANTS ERROR:",
      err
    );
    res.status(500).json({ message: "Server error" });
  }
};
