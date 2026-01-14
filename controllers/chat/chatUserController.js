const User = require("../../models/usermodels/User");

exports.getAllSellers = async (req, res) => {
  const sellers = await User.find(
    {
      role: "seller",
      sellerStatus: "approved",
      isActive: true,
    },
    "name email shopName role"
  );

  res.json(sellers);
};


