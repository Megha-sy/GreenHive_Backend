const User = require("../../models/usermodels/User");

// GET USER SETTINGS
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("settings");
    res.json(user.settings || {});
  } catch (err) {
    res.status(500).json({ message: "Failed to load settings" });
  }
};

// UPDATE USER SETTINGS
exports.updateSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.settings = req.body;
    await user.save();
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to save settings" });
  }
};
