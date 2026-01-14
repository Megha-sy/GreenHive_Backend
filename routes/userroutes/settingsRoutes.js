const router = require("express").Router();
const { protect } = require("../../middleware/auth");
const {
  getSettings,
  updateSettings,
} = require("../../controllers/usercontroller/settingsController");

router.get("/", protect, getSettings);
router.put("/", protect, updateSettings);

module.exports = router;
