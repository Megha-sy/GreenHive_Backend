const router = require("express").Router();

const {
  getAllDiseaseReports,
  deleteDiseaseReport,
} = require("../../controllers/adminController/adminDiseaseController");

const { protect, authorizeRoles } = require("../../middleware/auth");

/* 🔐 ADMIN ONLY */
router.use(protect, authorizeRoles("admin"));

router.get("/", getAllDiseaseReports);
router.delete("/:id", deleteDiseaseReport);

module.exports = router;
