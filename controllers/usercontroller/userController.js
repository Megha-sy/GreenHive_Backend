// backend/controllers/userController.js
const axios = require('axios');
const User = require('../../models/usermodels/User');
const Order = require('../../models/Order');
const Tip = require('../../models/usermodels/Tip');
const DiseaseReport = require('../../models/usermodels/DiseaseReport');
const Product = require('../../models/usermodels/Product');
const Plant = require("../../models/sellermodels/Plant");


// Update profile (name, email, password, address)
exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, email, password, address, settings } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // pre-save hash in User model
    if (address) user.address = address;
    if (settings) user.settings = Object.assign(user.settings || {}, settings);
    await user.save();
    res.json({ message: 'Profile updated', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('updateProfile', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Dashboard: recent orders, saved tips, disease reports summary
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const recentOrders = await Order.find({ buyer: userId }).sort({ createdAt: -1 }).limit(5).populate('products.product', 'name price images');
    const savedTips = await Tip.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
    const reports = await DiseaseReport.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
    // Basic spending summary
    const allOrders = await Order.find({ buyer: userId });
    const totalSpent = allOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);

    res.json({
      recentOrders,
      savedTips,
      reports,
      summary: { totalSpent, ordersCount: allOrders.length }
    });
  } catch (err) {
    console.error('getDashboard', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Favorites / wishlist - implemented as array in user document for simplicity
exports.addToWishlist = async (req, res) => {
  try {
    const user = req.user;
    const { productId } = req.body;
    user.wishlist = user.wishlist || [];
    if (!user.wishlist.find(id => id.toString() === productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const user = req.user;
    const { productId } = req.params;
    user.wishlist = (user.wishlist || []).filter(id => id.toString() !== productId);
    await user.save();
    res.json({ message: 'Removed', wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price images');
    res.json(user.wishlist || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Plant care search - uses configured free API (PERENUAL/TREFLE) via PLANT_CARE_API_URL
exports.searchPlantCare = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ message: 'Query required' });
    // Example: call Perenual API if configured
    if (process.env.PLANT_CARE_API_URL && process.env.PLANT_CARE_API_KEY) {
      const resp = await axios.get(process.env.PLANT_CARE_API_URL, {
        params: { key: process.env.PLANT_CARE_API_KEY, q },
        timeout: 15000
      });
      return res.json(resp.data);
    }
    // fallback: search local products by name
    const products = await Product.find({ name: new RegExp(q, 'i') }).limit(20).select('name category sunlight water description images');
    res.json({ source: 'local', results: products });
  } catch (err) {
    console.error('searchPlantCare', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save purchased plant to MyPlants for care reminders
exports.saveToMyPlants = async (req, res) => {
  try {
    const user = req.user;
    const { productId, nickname, purchaseDate } = req.body;
    user.myPlants = user.myPlants || [];
    user.myPlants.push({ product: productId, nickname, purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(), reminders: [] });
    await user.save();
    res.json({ message: 'Saved to My Plants', myPlants: user.myPlants });
  } catch (err) {
    console.error('saveToMyPlants', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const user = req.user;
    const { theme, notificationsEnabled, aiPreferences } = req.body;

    if (theme) user.settings.theme = theme;
    if (notificationsEnabled !== undefined) user.settings.notificationsEnabled = notificationsEnabled;
    if (aiPreferences) user.settings.aiPreferences = aiPreferences;

    await user.save();
    res.json({ message: 'Settings updated', settings: user.settings });
  } catch (err) {
    console.error('updateSettings', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyPlants = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find delivered orders
    const orders = await Order.find({
      buyer: userId,
      status: "delivered",
    }).populate("products.product");

    // Extract unique products
    const plantsMap = {};

    orders.forEach(order => {
      order.products.forEach(item => {
        if (item.product) {
          plantsMap[item.product._id] = {
            product: item.product,
            purchaseDate: order.createdAt,
            rating: item.rating || null,
          };
        }
      });
    });

    res.json(Object.values(plantsMap));
  } catch (err) {
    console.error("getMyPlants error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.ratePlant = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, rating } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({
        message: "productId and rating are required",
      });
    }

    // 1️⃣ Find delivered order
    const order = await Order.findOne({
      buyer: userId,
      status: "delivered",
    });

    if (!order) {
      return res.status(404).json({
        message: "No delivered order found",
      });
    }

    let rated = false;

    // 2️⃣ Save rating in ORDER (history)
    order.products.forEach((item) => {
      if (item.product.toString() === productId) {
        item.rating = Number(rating);
        rated = true;
      }
    });

    if (!rated) {
      return res.status(404).json({
        message: "Product not found in order",
      });
    }

    await order.save();

    // 3️⃣ Update PRODUCT (Plant)
    const plant = await Plant.findById(productId);

    if (!plant) {
      return res.status(404).json({
        message: "Plant not found",
      });
    }

    // prevent duplicate rating
    const alreadyRated = plant.reviews.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (!alreadyRated) {
      plant.reviews.push({
        user: userId,
        rating: Number(rating),
      });

      plant.reviewCount = plant.reviews.length;
      plant.rating =
        plant.reviews.reduce((sum, r) => sum + r.rating, 0) /
        plant.reviewCount;

      await plant.save();
    }

    res.json({
      message: "Rating saved successfully",
      rating: plant.rating,
      reviewCount: plant.reviewCount,
    });
  } catch (err) {
    console.error("RATE PLANT ERROR:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};




exports.getUserAddress = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const user = await User.findById(userId).select("address");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.address);
  } catch (err) {
    console.error("FETCH ADDRESS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch address" });
  }
};
