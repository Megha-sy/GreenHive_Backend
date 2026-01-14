const mongoose = require("mongoose");

const DiseaseReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    plantName: String,
    imageUrl: String,
    disease: String,
    severity: String,

    // ✅ STRUCTURED TREATMENT
    treatment: {
      chemical: [String],
      biological: [String],
      prevention: [String],
    },

    confidence: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiseaseReport", DiseaseReportSchema);
