// backend/routes/reviewRoutes.js
const router = require('express').Router();
const { protect } = require('../../middleware/auth');
const { createReview, getProductReviews } = require('../../controllers/usercontroller/reviewController');

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);

module.exports = router;
