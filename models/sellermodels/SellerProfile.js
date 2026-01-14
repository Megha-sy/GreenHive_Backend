// models/SellerProfile.js
const mongoose = require("mongoose");

const SellerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shopName: { type: String, required: true },
    logoUrl: String,
    contactEmail: String,
    contactPhone: String,
    address: String,
    bio: String,
    documents: [
      {
        label: String,
        url: String,
        verified: { type: Boolean, default: false },
      },
    ],
    isApproved: { type: Boolean, default: false },
    totalEarnings: { type: Number, default: 0 },
    pendingPayout: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellerProfile", SellerProfileSchema);
