const mongoose = require("mongoose");

const TipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
    },

    plantName: {
      type: String,
    },

    content: {
      type: String,
      required: true,
    },

    upvotes: {
      type: Number,
      default: 0,
    },

    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /* =========================
       ⭐ MODERATION FIELDS
    ========================= */
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deleteReason: {
      type: String,
    },

    deletedAt: {
      type: Date,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tip", TipSchema);
