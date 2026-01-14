require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");

// ================= ROUTES =================
const authRoutes = require("./routes/userroutes/authRoutes");
const productRoutes = require("./routes/userroutes/productRoutes");
const orderRoutes = require("./routes/userroutes/orderRoutes");
const aiRoutes = require("./routes/userroutes/aiRoutes");
const tipRoutes = require("./routes/userroutes/tipRoutes");
const userRoutes = require("./routes/userroutes/userRoutes");
const cartRoutes = require("./routes/userroutes/cartRoutes");
const notificationRoutes = require("./routes/userroutes/notificationRoutes");
const reviewRoutes = require("./routes/userroutes/reviewRoutes");
const wishlistRoutes = require("./routes/userroutes/wishlistRoutes");
const paymentRoutes = require("./routes/userroutes/paymentRoutes");
const settingRoutes = require("./routes/userroutes/settingsRoutes");
const profileRoutes = require("./routes/userroutes/profileRoutes");
const aiCareRoutes = require("./routes/userroutes/aiCareRoutes");
const footerRoutes = require("./routes/footerRoutes");
const chatRoutes = require("./routes/chat/chatRoutes");

const adminRoutes = require("./routes/adminRoutes");
const adminDashboardRoutes = require("./routes/adminroutes/adminDashboardRoutes");
const adminUserRoutes = require("./routes/adminroutes/adminUserRoutes");
const adminSellerRoutes = require("./routes/adminroutes/adminSellerRoutes");
const adminOrderRoutes = require("./routes/adminroutes/adminOrderRoutes");
const adminProductRoutes = require("./routes/adminroutes/adminProductRoutes");
const adminDeletedPlantRoutes = require("./routes/adminroutes/adminDeletedPlantRoutes");
const adminCategoryRoutes = require("./routes/adminroutes/adminCategoryRoutes");
const adminTipRoutes = require("./routes/adminroutes/adminTipRoutes");
const adminDiseaseRoutes = require("./routes/adminroutes/adminDiseaseRoutes");

const sellerAuthRoutes = require("./routes/sellerroutes/sellerAuthRoutes");
const sellerDashboardRoutes = require("./routes/sellerroutes/sellerDashboardRoutes");
const sellerProductRoutes = require("./routes/sellerroutes/sellerProductRoutes");
const sellerOrderRoutes = require("./routes/sellerroutes/sellerOrderRoutes");
const sellerNotificationRoutes = require("./routes/sellerroutes/sellerNotificationRoutes");
const restockRoutes = require("./routes/sellerroutes/restockRoutes");
const salesReportRoutes = require("./routes/sellerroutes/salesReportRoutes");
const sellerAnalyticsRoutes = require("./routes/sellerroutes/sellerAnalyticsRoutes");
const promotionRoutes = require("./routes/sellerroutes/promotionRoutes");
const sellerprofileRoutes = require("./routes/sellerroutes/sellerprofileRoutes");
const plantRoutes = require("./routes/plantRoutes");

// ================= APP + SERVER =================
const app = express();
const server = http.createServer(app);

// ================= SOCKET.IO =================
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend
    methods: ["GET", "POST"],
  },
});

// 🔥 EXPORT IO FOR CONTROLLERS
module.exports.io = io;

// ================= SOCKET EVENTS =================
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(
      `📥 Socket ${socket.id} joined conversation ${conversationId}`
    );
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

connectDB();
app.use("/api/categories", require("./routes/categoryRoutes"));

// ================= USER API =================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/tips", tipRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", aiCareRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/footer", footerRoutes);

// ================= ADMIN API =================
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/admin", adminSellerRoutes);
app.use("/api/admin", adminOrderRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/api/admin", adminDeletedPlantRoutes);
app.use("/api/admin", adminCategoryRoutes);
app.use("/api/admin/tips", adminTipRoutes);
app.use("/api/admin/disease-reports", adminDiseaseRoutes);

// ================= SELLER API =================
app.use("/api/seller", sellerAuthRoutes);
app.use("/api/seller", sellerDashboardRoutes);
app.use("/api/seller", sellerProductRoutes);
app.use("/api/seller", sellerOrderRoutes);
app.use("/api/seller", sellerNotificationRoutes);
app.use("/api/seller", restockRoutes);
app.use("/api/seller", salesReportRoutes);
app.use("/api/seller", sellerAnalyticsRoutes);
app.use("/api/seller", promotionRoutes);
app.use("/api/seller", sellerprofileRoutes);
app.use("/api/plants", plantRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("✅ GreenHive API Running Successfully");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on http://localhost:${PORT}`);
});
require("dotenv").config();
