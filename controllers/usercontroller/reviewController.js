// backend/controllers/reviewController.js
const Review = require('../../models/usermodels/Review');
const Product = require('../../models/usermodels/Product');

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Prevent multiple reviews by same user for same product (simple approach)
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json(existing);
    }

    const review = await Review.create({ user: req.user._id, product: productId, rating, comment });
    // Optionally update average rating on product model
    const reviews = await Review.find({ product: productId });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    product.rating = avg;
    await product.save();

    res.status(201).json(review);
  } catch (err) {
    console.error('createReview', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    console.error('getProductReviews', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
