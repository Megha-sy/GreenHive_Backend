const User = require('../models/usermodels/User');
const Product = require('../models/usermodels/Product');

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

exports.approveSeller = async (req, res) => {
  const u = await User.findById(req.params.id);
  if(!u) return res.status(404).json({ message: 'Not found' });
  u.role = 'seller';
  await u.save();
  res.json(u);
};

exports.deleteProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if(!p) return res.status(404).json({ message: 'Not found' });
  await p.remove();
  res.json({ message: 'Deleted' });
};
