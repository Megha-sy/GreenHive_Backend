const router = require("express").Router();
const {
  getMyProfile,
  updateMyProfile,
} = require("../../controllers/usercontroller/profileController");
const { protect } = require("../../middleware/auth");

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

module.exports = router;
