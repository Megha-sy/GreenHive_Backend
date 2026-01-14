const express = require("express");
const router = express.Router();

const {
  getCategories,
  addCategory,
  deleteCategory,
} = require("../../controllers/adminController/adminCategoryController");

const {
  protect,
  authorizeRoles,
} = require("../../middleware/auth");

router.use(protect, authorizeRoles("admin"));

router.get("/", getCategories);
router.post("/", addCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
