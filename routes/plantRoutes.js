const express = require("express");
const router = express.Router();

const {
  getFeaturedPlants,
  getOfferPlants,
} = require("../controllers/plantController");

router.get("/featured", getFeaturedPlants);
router.get("/offers", getOfferPlants);

module.exports = router;
