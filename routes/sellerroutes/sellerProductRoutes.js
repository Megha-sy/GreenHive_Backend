  const express = require("express");
  const router = express.Router();
  const { protect } = require("../../middleware/auth");
  const upload = require("../../middleware/upload");

  const {
    addPlant,
    getSellerPlants,
    updatePlant,
    deletePlant,
    getPlantById,
    getProductById,
  } = require("../../controllers/sellercontroller/sellerProductController");

  router.post("/plants", protect, upload.array("images", 5), addPlant);
  router.get("/plants", protect, getSellerPlants);
  router.put(
    "/plants/:id",
    protect,
    upload.array("images", 5), // ✅ REQUIRED
    updatePlant
  );
  router.delete("/plants/:id", protect, deletePlant);
  router.get("/plants/:id", getPlantById);
router.get("/products/:id", getProductById); // 👈 PUBLIC


  module.exports = router;
