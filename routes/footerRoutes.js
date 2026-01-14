const router = require("express").Router();
const { getFooterContent } = require("../controllers/footerController");

router.get("/", getFooterContent);

module.exports = router;
