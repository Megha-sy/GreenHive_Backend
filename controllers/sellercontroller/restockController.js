const Plant = require("../../models/sellermodels/Plant");

exports.restockPlant = async (req, res) => {
  const { productId, qty } = req.body;

  const plant = await Plant.findById(productId);
  if (!plant) {
    return res.status(404).json({ message: "Plant not found" });
  }

  // Increase stock for buyer seller
  plant.stock += qty;
  await plant.save();

  res.json({ message: "Restocked successfully", plant });
};
