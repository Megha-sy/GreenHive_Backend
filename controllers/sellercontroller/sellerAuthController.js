const SellerProfile = require("../../models/sellermodels/SellerProfile");

// ✅ Apply for Seller
const applySeller = async (req, res) => {
  try {
    const exist = await SellerProfile.findOne({ user: req.user.id });
    if (exist) {
      return res.status(400).json({ message: "Already Applied" });
    }

    const seller = await SellerProfile.create({
      user: req.user.id,
      shopName: req.body.shopName,
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      address: req.body.address,
      bio: req.body.bio,
      documents: req.body.documents || [],
    });

    res.status(201).json(seller);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seller Apply Failed" });
  }
};

// ✅ ✅ IMPORTANT EXPORT (THIS FIXES YOUR ERROR)
module.exports = { applySeller };
