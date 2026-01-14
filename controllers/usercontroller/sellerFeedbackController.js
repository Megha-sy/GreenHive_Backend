const SellerFeedback = require('../../models/usermodels/SellerFeedback');
const User = require('../../models/usermodels/User');

exports.createSellerFeedback = async (req, res) => {
  try {
    const { sellerId, rating, comment } = req.body;

    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== 'seller') 
      return res.status(404).json({ message: 'Seller not found' });

    const existing = await SellerFeedback.findOne({ user: req.user._id, seller: sellerId });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json(existing);
    }

    const feedback = await SellerFeedback.create({
      seller: sellerId,
      user: req.user._id,
      rating,
      comment
    });

    res.status(201).json(feedback);
  } catch (err) {
    console.error('createSellerFeedback', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSellerFeedback = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const feedback = await SellerFeedback.find({ seller: sellerId }).populate('user', 'name');
    res.json(feedback);
  } catch (err) {
    console.error('getSellerFeedback', err);
    res.status(500).json({ message: 'Server error' });
  }
};
