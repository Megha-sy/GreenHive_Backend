// controllers/usercontroller/productController.js

const Plant = require("../../models/sellermodels/Plant");

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Plant.find({ isActive: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to load products" });
  }
};

// GET product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Plant.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to load product" });
  }
};
