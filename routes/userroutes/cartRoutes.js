// backend/routes/cartRoutes.js
const router = require('express').Router();
const { protect } = require('../../middleware/auth');
const { getCart, addItem, updateItem, removeItem, clearCart } = require('../../controllers/usercontroller/cartController');

router.get('/', protect, getCart);
router.post('/add', protect, addItem);
router.put('/item/:productId', protect, updateItem);
router.delete('/item/:productId', protect, removeItem);
router.delete('/clear', protect, clearCart);

module.exports = router;
