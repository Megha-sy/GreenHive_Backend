const Tip = require("../../models/usermodels/Tip");

/* =========================
   GET ACTIVE TIPS
========================= */
exports.getAllTips = async (req, res) => {
  try {
    const tips = await Tip.find({ isDeleted: { $ne: true } })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(tips);
  } catch (err) {
    res.status(500).json({ message: "Failed to load tips" });
  }
};

/* =========================
   GET DELETED TIPS ✅
========================= */
exports.getDeletedTips = async (req, res) => {
  try {
    const tips = await Tip.find({ isDeleted: true })
      .populate("user", "name email")
      .populate("deletedBy", "name email")
      .sort({ deletedAt: -1 });

    res.json(tips);
  } catch (err) {
    res.status(500).json({ message: "Failed to load deleted tips" });
  }
};

/* =========================
   DELETE TIP (SOFT)
========================= */
exports.deleteTip = async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ message: "Delete reason required" });
  }

  const tip = await Tip.findById(req.params.id);
  if (!tip) {
    return res.status(404).json({ message: "Tip not found" });
  }

  tip.isDeleted = true;
  tip.deletedAt = new Date();
  tip.deleteReason = reason;
  tip.deletedBy = req.user._id;

  await tip.save();

  res.json({ message: "Tip deleted successfully" });
};
