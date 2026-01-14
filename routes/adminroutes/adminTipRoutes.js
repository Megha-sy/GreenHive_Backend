const router = require("express").Router();

const {
  getAllTips,
  getDeletedTips,
  deleteTip,
} = require("../../controllers/adminController/adminTipController");

const { protect, authorizeRoles } = require("../../middleware/auth");

/* 🔐 ADMIN ONLY */
router.use(protect, authorizeRoles("admin"));

router.get("/", getAllTips);
router.get("/deleted", getDeletedTips);
router.delete("/:id", deleteTip);

module.exports = router;
