const Cart = require('../../models/usermodels/Cart');
const Plant = require("../../models/sellermodels/Plant");


exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images stock');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (err) {
    console.error('getCart', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD ITEM ---------------------------------
exports.addItem = async (req, res) => {
  const { productId, qty = 1 } = req.body;

  const product = await Plant.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existing = cart.items.find(
    i => i.product.toString() === productId
  );

  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({
      product: product._id, // ✅ THIS IS CRITICAL
      qty,
    });
  }

  await cart.save();
  res.json(cart);
};


// UPDATE ITEM ---------------------------------
exports.updateItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { qty } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const prod = await Plant.findById(productId);
    item.qty = Math.min(prod.stock, qty);

    cart.updatedAt = new Date();
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error('updateItem', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// REMOVE ITEM ---------------------------------
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error('removeItem', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CLEAR CART ---------------------------------
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('clearCart', err);
    res.status(500).json({ message: 'Server error' });
  }
};
