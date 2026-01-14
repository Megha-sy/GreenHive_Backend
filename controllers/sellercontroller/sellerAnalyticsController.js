// controllers/sellercontroller/sellerAnalyticsController.js
const Order = require("../../models/Order");
const Plant = require("../../models/sellermodels/Plant");
const Payout = require("../../models/sellermodels/Payout");


exports.getProductAnalytics = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get seller plants
    const plants = await Plant.find({ seller: sellerId });

    // Get orders containing seller products
    const order = await Order.find({
      "products.seller": sellerId,
    });

    const analytics = plants.map((plant) => {
      let totalSold = 0;
      let totalRevenue = 0;
      let orderCount = 0;

order.forEach((ord) => {
  ord.products.forEach((item) => {
    if (
      item.product.toString() === plant._id.toString() &&
      item.seller.toString() === sellerId.toString()
    ) {
      totalSold += item.qty;
      totalRevenue += item.qty * plant.price;
      orderCount += 1;
    }
  });
});


      return {
        productId: plant._id,
        name: plant.name,
        image: plant.images?.[0],
        price: plant.price,
        stock: plant.stock,
        totalSold,
        totalRevenue,
        orderCount,
      };
    });

    res.json(analytics);
  } catch (err) {
    console.error("Product Analytics Error:", err);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};
// ===============================
// SALES & PAYOUT DASHBOARD
// ===============================

exports.getSalesDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // 1️⃣ Fetch orders
    const orders = await Order.find({
      "products.seller": sellerId,
      status: { $ne: "cancelled" },
    }).populate("products.product", "name price");

    let totalRevenue = 0;
    let monthlyRevenue = 0;
    const productMap = {};

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 2️⃣ Calculate revenue
    orders.forEach(order => {
      const orderMonth = new Date(order.orderDate).getMonth();
      const orderYear = new Date(order.orderDate).getFullYear();

      order.products.forEach(item => {
        if (!item.product) return;
        if (item.seller.toString() !== sellerId.toString()) return;

        const amount = item.qty * item.product.price;

        totalRevenue += amount;

        if (orderMonth === currentMonth && orderYear === currentYear) {
          monthlyRevenue += amount;
        }

        if (!productMap[item.product._id]) {
          productMap[item.product._id] = {
            name: item.product.name,
            sold: 0,
            revenue: 0,
          };
        }

        productMap[item.product._id].sold += item.qty;
        productMap[item.product._id].revenue += amount;
      });
    });

    const products = Object.values(productMap);

    // 3️⃣ Fetch payout history
    const payouts = await Payout.find({ seller: sellerId })
      .sort({ createdAt: -1 });

    // 4️⃣ Calculate withdrawn & available
    const withdrawn = payouts
      .filter(p => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);

    const available = totalRevenue - withdrawn;

    // 5️⃣ Send response
    res.json({
      summary: {
        totalRevenue,
        monthlyRevenue,
        withdrawn,
        available,
      },
      products,
      payouts,
    });

  } catch (err) {
    console.error("Sales Dashboard Error:", err);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

exports.requestPayout = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // 🔹 Calculate total revenue
    const orders = await Order.find({
      "products.seller": sellerId,
      status: "delivered",
    }).populate("products.product", "price");

    let totalRevenue = 0;
    orders.forEach(order => {
      order.products.forEach(item => {
        if (item.seller.toString() === sellerId.toString()) {
          totalRevenue += item.qty * item.product.price;
        }
      });
    });

    // 🔹 Calculate withdrawn amount
    const payouts = await Payout.find({ seller: sellerId, status: "paid" });
    const withdrawn = payouts.reduce((sum, p) => sum + p.amount, 0);

    const available = totalRevenue - withdrawn;

    if (amount > available) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 🔹 Create payout request
    const payout = await Payout.create({
      seller: sellerId,
      amount,
      status: "pending",
    });

    res.json({
      message: "Payout request submitted",
      payout,
    });

  } catch (err) {
    console.error("Payout request error:", err);
    res.status(500).json({ message: "Failed to request payout" });
  }
};