const Wishlist = require("../../models/usermodels/Wishlist");
const Plant = require("../../models/sellermodels/Plant");

// GET WISHLIST
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate("items.product", "name price images stock");

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    // ✅ REMOVE NULL PRODUCTS
    wishlist.items = wishlist.items.filter(
      (item) => item.product !== null
    );

    await wishlist.save();

    res.json(wishlist);
  } catch (err) {
    console.error("getWishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ADD
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, items: [] });

    const exists = wishlist.items.some(i => i.product.toString() === productId);
    if (!exists) wishlist.items.push({ product: productId });

    await wishlist.save();
    res.json(wishlist);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// REMOVE
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    wishlist.items = wishlist.items.filter(i => i.product.toString() !== productId);

    await wishlist.save();
    res.json(wishlist);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
