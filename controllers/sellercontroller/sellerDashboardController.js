const Plant = require("../../models/sellermodels/Plant");
const Order = require("../../models/Order");

exports.getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // =========================
    // 1️⃣ PRODUCTS COUNT
    // =========================
    const totalProducts = await Plant.countDocuments({ seller: sellerId });
    const totalActiveProducts = await Plant.countDocuments({
      seller: sellerId,
      isActive: true,
    });

    // =========================
    // 2️⃣ SELLER ORDERS
    // =========================
    const orders = await Order.find({
      "products.seller": sellerId,
      status: { $ne: "cancelled" },
    }).populate("products.product", "price");

    const totalOrders = orders.length;

    // =========================
    // 3️⃣ TOTAL REVENUE ✅ (MATCHES ANALYTICS)
    // =========================
    let totalRevenue = 0;

    orders.forEach(order => {
      order.products.forEach(item => {
        if (
          item.seller.toString() === sellerId.toString() &&
          item.product
        ) {
          totalRevenue += item.qty * item.product.price;
        }
      });
    });

    // =========================
    // 4️⃣ TOP SELLING PLANTS
    // =========================
    const plantSalesMap = {};

    orders.forEach(order => {
      order.products.forEach(item => {
        if (
          item.seller.toString() === sellerId.toString() &&
          item.product
        ) {
          const plantId = item.product._id.toString();
          plantSalesMap[plantId] =
            (plantSalesMap[plantId] || 0) + item.qty;
        }
      });
    });

    const topPlantIds = Object.entries(plantSalesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([plantId]) => plantId);

    const topSellingPlants = await Plant.find({
      _id: { $in: topPlantIds },
    });

    // =========================
    // 5️⃣ ACTIVE DISCOUNT PLANTS
    // =========================
    const discountedPlants = await Plant.find({
      seller: sellerId,
      isActive: true,
      discountPercent: { $gt: 0 },
      $or: [
        { offerEndsAt: null },
        { offerEndsAt: { $exists: false } },
        { offerEndsAt: { $gte: new Date() } },
      ],
    });

    // =========================
    // RESPONSE
    // =========================
    res.json({
      totalProducts,
      totalActiveProducts,
      totalOrders,
      totalRevenue,
      topSellingPlants,
      discountedPlants,
    });

  } catch (err) {
    console.error("Seller Dashboard Error:", err);
    res.status(500).json({ message: "Dashboard load failed" });
  }
};
