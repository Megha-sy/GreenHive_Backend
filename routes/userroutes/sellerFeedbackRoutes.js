const router = require('express').Router();
const { protect } = require('../../middleware/auth');
const {
  createSellerFeedback,
  getSellerFeedback
} = require('../../controllers/usercontroller/sellerFeedbackController');

router.post('/', protect, createSellerFeedback);
router.get('/:sellerId', getSellerFeedback);

module.exports = router;
