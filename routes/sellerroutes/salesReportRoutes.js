const router = require("express").Router();
const { protect } = require("../../middleware/auth");
const { getSalesReport } = require("../../controllers/sellercontroller/salesReportController");

router.get("/sales-report", protect, getSalesReport);

module.exports = router;
