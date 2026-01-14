const Conversation = require("../../models/chat/Conversation");
const Message = require("../../models/chat/Message");
const { io } = require("../../server");

/**
 * =====================================
 * CREATE OR GET CONVERSATION
 * (User ↔ Seller)
 * =====================================
 */
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;

    if (!receiverId) {
      return res
        .status(400)
        .json({ message: "receiverId is required" });
    }

    let convo = await Conversation.findOne({
      members: { $all: [req.user._id, receiverId] },
    }).populate("members", "name role");

    if (!convo) {
      convo = await Conversation.create({
        members: [req.user._id, receiverId],
        unreadCounts: {},
      });

      convo = await convo.populate("members", "name role");
    }

    res.json(convo);
  } catch (err) {
    console.error("getOrCreateConversation:", err);
    res.status(500).json({ message: "Conversation error" });
  }
};

/**
 * =====================================
 * GET MY CONVERSATIONS
 * =====================================
 */
exports.getMyConversations = async (req, res) => {
  try {
    const convos = await Conversation.find({
      members: { $in: [req.user._id] },
    })
      .populate("members", "name role")
      .sort({ updatedAt: -1 });

    res.json(convos);
  } catch (err) {
    console.error("getMyConversations:", err);
    res.status(500).json({ message: "Failed to load conversations" });
  }
};

/**
 * =====================================
 * SEND MESSAGE
 * =====================================
 */
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    if (!conversationId || !text) {
      return res
        .status(400)
        .json({ message: "conversationId and text required" });
    }

    const msg = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text,
    });

    const populated = await msg.populate(
      "sender",
      "name role"
    );

    // 🔥 UPDATE CONVERSATION META
    const convo = await Conversation.findById(conversationId);

    if (!convo) {
      return res
        .status(404)
        .json({ message: "Conversation not found" });
    }

    convo.lastMessage = text;

    // increment unread count for OTHER users
    convo.members.forEach((m) => {
      const memberId = m.toString();
      if (memberId !== req.user._id.toString()) {
        const prev =
          convo.unreadCounts.get(memberId) || 0;
        convo.unreadCounts.set(memberId, prev + 1);
      }
    });

    await convo.save();

    // 🔥 REAL-TIME EMIT
    io.to(conversationId).emit(
      "receiveMessage",
      populated
    );

    res.status(201).json(populated);
  } catch (err) {
    console.error("sendMessage:", err);
    res.status(500).json({ message: "Send message failed" });
  }
};

/**
 * =====================================
 * GET MESSAGES IN A CONVERSATION
 * =====================================
 */
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId,
    })
      .populate("sender", "_id name role")
      .lean(); // 🔥 VERY IMPORTANT

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load messages" });
  }
};



/**
 * =====================================
 * MARK CONVERSATION AS READ
 * =====================================
 */
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const convo = await Conversation.findById(conversationId);

    if (!convo) {
      return res
        .status(404)
        .json({ message: "Conversation not found" });
    }

    convo.unreadCounts.set(
      req.user._id.toString(),
      0
    );

    await convo.save();

    res.json({ success: true });
  } catch (err) {
    console.error("markAsRead:", err);
    res.status(500).json({ message: "Mark as read failed" });
  }
};
