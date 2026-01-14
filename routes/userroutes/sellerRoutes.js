const router = require('express').Router();
const { applySeller, getSellers } = require('../../controllers/usercontroller/sellerController');
const { protect, authorizeRoles } = require('../../middleware/auth');

router.post('/apply', protect, applySeller);
router.get('/', protect, authorizeRoles('admin'), getSellers);

module.exports = router;
