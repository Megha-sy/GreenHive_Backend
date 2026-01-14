const Category = require("../models/Category");

/* =========================
   PUBLIC / SELLER – GET
========================= */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error("Get Categories Error:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
