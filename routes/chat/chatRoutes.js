const router = require("express").Router();
const { protect } = require("../../middleware/auth");

const {
  getOrCreateConversation,
  getMyConversations,
  sendMessage,
  getMessages,
  markAsRead,
} = require("../../controllers/chat/chatController");

const {
  getAllSellers,
} = require("../../controllers/chat/chatUserController");

const {
  getAllUsers,
} = require("../../controllers/chat/chatSellerController");

router.get("/sellers", protect, getAllSellers);
router.get("/users", protect, getAllUsers);

router.post("/conversation", protect, getOrCreateConversation);
router.get("/conversation", protect, getMyConversations);

router.post("/message", protect, sendMessage);
router.get("/message/:conversationId", protect, getMessages);

// ✅ NOW SAFE
router.post("/read/:conversationId", protect, markAsRead);

module.exports = router;
