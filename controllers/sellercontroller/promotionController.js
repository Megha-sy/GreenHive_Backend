const Plant = require("../../models/sellermodels/Plant");

exports.applyPromotion = async (req, res) => {
  try {
    const { discountPercent, isFeatured, offerEndsAt } = req.body;

    if (discountPercent < 0 || discountPercent > 90) {
      return res
        .status(400)
        .json({ message: "Discount must be between 0 and 90%" });
    }

    const plant = await Plant.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!plant)
      return res.status(404).json({ message: "Plant not found" });

    plant.discountPercent =
      discountPercent !== undefined
        ? discountPercent
        : plant.discountPercent;

    plant.isFeatured =
      isFeatured !== undefined ? isFeatured : plant.isFeatured;

    plant.offerEndsAt = offerEndsAt || null;

    await plant.save();

    res.json({
      message: "Promotion updated successfully",
      plant,
    });
  } catch (err) {
    console.error("Promotion Error:", err);
    res.status(500).json({ message: "Promotion failed" });
  }
};
