const router = require("express").Router();
const { protect } = require("../../middleware/auth");
const { restockPlant } = require("../../controllers/sellercontroller/restockController");

router.post("/restock", protect, restockPlant);

module.exports = router;
