// backend/routes/userRoutes.js
const router = require('express').Router();
const { protect } = require('../../middleware/auth');
const {
  updateProfile,
  getDashboard,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  searchPlantCare,
  getMyPlants,
  updateSettings,getUserAddress,
  ratePlant
} = require('../../controllers/usercontroller/userController');

router.put('/profile', protect, updateProfile);
router.get('/dashboard', protect, getDashboard);

router.post('/wishlist', protect, addToWishlist);
router.get('/wishlist', protect, getWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

router.get('/plantcare', protect, searchPlantCare);

router.get("/my-plants", protect, getMyPlants);
router.post("/rate-plant", protect, ratePlant);


router.put('/settings', protect, updateSettings);
router.get("/address", protect, getUserAddress);

module.exports = router;
