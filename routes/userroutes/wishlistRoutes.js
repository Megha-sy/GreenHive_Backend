const router = require("express").Router();
const { protect } = require("../../middleware/auth");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../../controllers/usercontroller/wishlistController");

router.get("/", protect, getWishlist);
router.post("/add", protect, addToWishlist);
router.delete("/:productId", protect, removeFromWishlist);

module.exports = router;
