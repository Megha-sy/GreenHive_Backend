// models/PlantCare.js
const mongoose = require("mongoose");

const plantCareSchema = new mongoose.Schema({
  name: { type: String, required: true },          // Money Plant
  category: { type: String },                       // indoor / outdoor / flower
  sunlight: { type: String },
  watering: { type: String },
  soil: { type: String },
  temperature: { type: String },
  maintenance: { type: String },                    // tips
  traits: [String],                                 // low-water, air-purifier
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("PlantCare", plantCareSchema);
