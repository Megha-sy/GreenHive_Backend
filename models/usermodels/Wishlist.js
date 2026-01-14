const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Plant" },
      addedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
