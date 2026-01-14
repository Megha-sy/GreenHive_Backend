const Category = require("../../models/Category");

/* =========================
   ADMIN – GET
========================= */
exports.getCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
};

/* =========================
   ADMIN – ADD
========================= */
exports.addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res.status(400).json({ message: "Name required" });

  const exists = await Category.findOne({ name });
  if (exists)
    return res.status(400).json({ message: "Category exists" });

  const category = await Category.create({ name });
  res.status(201).json(category);
};

/* =========================
   ADMIN – DELETE
========================= */
exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};
