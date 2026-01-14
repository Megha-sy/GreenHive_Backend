// backend/routes/notificationRoutes.js
const router = require('express').Router();
const { protect } = require('../../middleware/auth');
const { getNotifications, markRead } = require('../../controllers/usercontroller/notificationController');

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markRead);

module.exports = router;
