const User = require("../../models/usermodels/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      { role: "user" },
      "name role"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to load users" });
  }
};
