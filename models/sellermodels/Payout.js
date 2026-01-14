const mongoose = require("mongoose");

const PayoutSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "rejected"],
      default: "pending",
    },
    paidAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payout", PayoutSchema);
