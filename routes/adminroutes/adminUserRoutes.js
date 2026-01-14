const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  updateUser,
  addUser,
  
} = require("../../controllers/adminController/adminUserController");

const { protect, authorizeRoles } = require("../../middleware/auth");

router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

router.put( "/users/:id", protect, authorizeRoles("admin"), updateUser);
router.post("/users", protect, authorizeRoles("admin"), addUser);

module.exports = router;
