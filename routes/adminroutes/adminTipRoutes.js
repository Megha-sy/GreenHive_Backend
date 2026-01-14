const router = require("express").Router();

const {
  getAllTips,
  getDeletedTips,
  deleteTip,
} = require("../../controllers/admincontroller/adminTipController");

const { protect, authorizeRoles } = require("../../middleware/auth");

/* 🔐 ADMIN ONLY */
router.use(protect, authorizeRoles("admin"));

router.get("/", getAllTips);
router.get("/deleted", getDeletedTips); // ✅ REQUIRED
router.delete("/:id", deleteTip);

module.exports = router;
