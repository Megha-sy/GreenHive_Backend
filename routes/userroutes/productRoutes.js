const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
} = require("../../controllers/usercontroller/productController");
const {
  generateCareWithAI,
} = require("../../controllers/usercontroller/aiCareController");

router.get("/generate-care/:plantName", generateCareWithAI);

router.get("/", getAllProducts); // public route
router.get("/:id", getProductById); // view single plant

module.exports = router;
