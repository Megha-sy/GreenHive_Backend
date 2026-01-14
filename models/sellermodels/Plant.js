const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
  required: true,
},
    description: String,
    images: [String],

    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    offerEndsAt: { type: Date },
    discountPercent: { type: Number, default: 0 },
    tags: [String],

    /* =========================
       ⭐ MODERATION / SOFT DELETE
    ========================= */
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
    },

    deleteReason: {
      type: String,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
    },

    /* =========================
       ⭐ RATING SYSTEM
    ========================= */
    rating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plant", PlantSchema);
