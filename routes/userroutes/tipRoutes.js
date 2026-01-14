const router = require('express').Router();
const { createTip, getTips, upvoteTip,getMyTips } = require('../../controllers/usercontroller/tipController');
const { protect } = require('../../middleware/auth');

router.post('/', protect, createTip);
router.get('/', getTips);
router.post('/:id/upvote', protect, upvoteTip);
router.get("/my", protect, getMyTips);

module.exports = router;
