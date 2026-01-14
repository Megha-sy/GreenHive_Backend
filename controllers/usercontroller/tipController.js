const Tip = require('../../models/usermodels/Tip');

exports.createTip = async (req, res) => {
  const { title, content, plantName } = req.body;

  const tip = await Tip.create({
    user: req.user._id,
    title,
    content,
    plantName
  });

  res.status(201).json(tip);
};


exports.getTips = async (req, res) => {
  const tips = await Tip.find({ isDeleted: false })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.json(tips);
};


exports.upvoteTip = async (req, res) => {
  const tip = await Tip.findById(req.params.id);

  if (!tip) {
    return res.status(404).json({ message: "Tip not found" });
  }

  // ❌ Already voted
  if (tip.upvotedBy.includes(req.user._id)) {
    return res.status(400).json({ message: "You already voted" });
  }

  tip.upvotes += 1;
  tip.upvotedBy.push(req.user._id);

  await tip.save();
  res.json(tip);
};

exports.getMyTips = async (req, res) => {
  const tips = await Tip.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(tips);
};
