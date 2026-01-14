// backend/controllers/notificationController.js
const Notification = require('../../models/usermodels/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
    res.json(notes);
  } catch (err) {
    console.error('getNotifications', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Notification.findOne({ _id: id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Not found' });
    note.read = true;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// helper to create notification (used by other controllers)
exports.createNotification = async ({ userId, title, message, link }) => {
  try {
    return await Notification.create({ user: userId, title, message, link });
  } catch (err) {
    console.error('createNotification', err.message);
    return null;
  }
};
