const router = require('express').Router();
const { detectDisease ,getScanHistory,deleteScan,clearScanHistory} = require('../../controllers/usercontroller/aiController');
const upload = require('../../middleware/upload');
const { protect } = require('../../middleware/auth');

router.post("/detect", protect, upload.single("image"), detectDisease);
router.get("/history", protect, getScanHistory);
router.delete("/history/:id", protect, deleteScan);
router.delete("/history", protect, clearScanHistory); // 👈 clear all


module.exports = router;
