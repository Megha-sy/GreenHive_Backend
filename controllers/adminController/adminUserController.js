const User = require("../../models/usermodels/User");
const bcrypt = require("bcryptjs");

// ADD USER (ADMIN)
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,          // 🔐 hashed by pre-save hook
      role: role || "user",
      isActive: true,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add user" });
  }
};
// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// UPDATE USER (ROLE / STATUS)
exports.updateUser = async (req, res) => {
  const { role, isActive } = req.body;

  // allow only safe fields
  const updates = {};
  if (role) updates.role = role;
  if (typeof isActive === "boolean") updates.isActive = isActive;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};
