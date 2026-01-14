const Plant = require("../models/sellermodels/Plant");

// ===============================
// 🌟 FEATURED PLANTS
// ===============================
exports.getFeaturedPlants = async (req, res) => {
  try {
    const plants = await Plant.find({
      isFeatured: true,
      isActive: true,
    }).limit(6);

    console.log("FEATURED COUNT:", plants.length);
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: "Failed to load featured plants" });
  }
};

// ===============================
// 🔥 OFFER PLANTS (FIXED)
// ===============================
exports.getOfferPlants = async (req, res) => {
  try {
    const plants = await Plant.find({
      discountPercent: { $gt: 0 },
      isActive: true,
      $or: [
        { offerEndsAt: { $exists: false } },
        { offerEndsAt: { $gte: new Date() } },
      ],
    }).limit(8);

    console.log("OFFER COUNT:", plants.length);
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: "Failed to load offer plants" });
  }
};
