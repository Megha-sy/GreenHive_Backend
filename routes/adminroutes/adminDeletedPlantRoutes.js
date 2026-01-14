const express = require("express");
const router = express.Router();

const {
  getDeletedPlants,
} = require("../../controllers/adminController/adminDeletedPlantController");

const {
  protect,
  authorizeRoles,
} = require("../../middleware/auth");

router.get(
  "/deleted-plants",
  protect,
  authorizeRoles("admin"),
  getDeletedPlants
);

module.exports = router;
