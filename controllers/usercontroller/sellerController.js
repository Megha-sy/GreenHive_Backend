const User = require('../../models/usermodels/User');

exports.applySeller = async (req, res) => {
  const user = req.user;
  // store documents or details
  user.role = 'seller';
  user.shopName = req.body.shopName || user.shopName;
  await user.save();
  res.json({ message: 'Seller application successful', user });
};

exports.getSellers = async (req, res) => {
  const sellers = await User.find({ role: 'seller' }).select('-password');
  res.json(sellers);
};
