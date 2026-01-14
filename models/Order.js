const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Plant",
          required: true,
        },
        qty: { type: Number, required: true },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
         price: Number,

    // ✅ ADD THIS
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
      },
    ],

    totalPrice: { type: Number, required: true },

 payment: {
  method: String,
  status: {
    type: String,
    enum: ["paid", "unpaid"],
    default: "unpaid",
  },
  transactionId: String,
},


    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
     orderDate: {
      type: Date,
      default: Date.now,   // ✅ Order date
    },
    reason: {
  type: String,
},
cancelledAt: {
  type: Date,
},


    // ✅ FIXED ADDRESS
    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      district: String,
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
