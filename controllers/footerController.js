const Footer = require("../models/Footer");

// GET footer content
exports.getFooterContent = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    console.log("Footer data:", data);

    res.json(footer);
  } catch (err) {
    res.status(500).json({ message: "Failed to load footer" });
  }
};
