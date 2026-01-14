
const Plant = require("../../models/sellermodels/Plant");

exports.updateStock = async (req, res) => {
  const { stock } = req.body;

  const plant = await Plant.findOneAndUpdate(
    { _id: req.params.id, seller: req.user._id },
    { stock },
    { new: true }
  );

  res.json(plant);
};
