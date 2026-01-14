const router = require("express").Router();
const { protect, authorizeRoles } = require("../../middleware/auth");

const {
  getSellerProfile,
  updateSellerProfile,
} = require("../../controllers/sellercontroller/sellerProfileController");

router.get("/profile", protect, authorizeRoles("seller"), getSellerProfile);
router.put("/profile", protect, authorizeRoles("seller"), updateSellerProfile);



module.exports = router;
