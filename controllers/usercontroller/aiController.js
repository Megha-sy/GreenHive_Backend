const axios = require("axios");
const DiseaseReport = require("../../models/usermodels/DiseaseReport");

exports.detectDisease = async (req, res) => {
  try {
    // 1️⃣ Validate image
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // 2️⃣ Convert image to base64
    const base64Image = req.file.buffer.toString("base64");
    console.log("BUFFER SIZE:", req.file.buffer.length);
    console.log("➡️ Calling Plant.id API...");

    // 3️⃣ Call Plant.id v3 Health Assessment API
    const response = await axios.post(
      "https://plant.id/api/v3/health_assessment",
      {
        images: [base64Image],
      },
      {
        headers: {
          "Api-Key": process.env.PLANT_ID_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    console.log("⬅️ Plant.id API responded");
    console.log(
      "PLANT.ID RAW RESPONSE:",
      JSON.stringify(response.data, null, 2)
    );

    // 4️⃣ Default fallback result
    let result = {
      plantName: "Plant Detected",
      disease: "Unidentified",
      severity: "unknown",
      treatment: "Manual review required",
      confidence: null,
    };

    // 5️⃣ Parse Plant.id v3 response
    const suggestions =
      response.data?.result?.disease?.suggestions || [];

    const isHealthy =
      response.data?.result?.is_healthy?.binary === true;

    // ✅ If plant is healthy
    if (isHealthy) {
      result = {
        plantName: "Healthy Plant",
        disease: "No disease detected",
        severity: "None",
        treatment: "No treatment required",
        confidence: 1,
      };
    }

    // ✅ If disease detected
    else if (suggestions.length > 0) {
     const top = suggestions[0];

const treatmentObj = {
  chemical: top.treatment?.chemical || [],
  biological: top.treatment?.biological || [],
  prevention: top.treatment?.prevention || [],
};

result = {
  plantName: "Plant Detected",
  disease: top.name,
  severity:
    top.probability > 0.8
      ? "Severe"
      : top.probability > 0.5
      ? "Moderate"
      : "Mild",
  treatment: treatmentObj,
  confidence: top.probability,
};

    }

    // 6️⃣ Save report in MongoDB
    const report = await DiseaseReport.create({
      user: req.user?._id || null,
      plantName: result.plantName,
      imageUrl: "https://via.placeholder.com/300",
      disease: result.disease,
      severity: result.severity,
      treatment: result.treatment,
      confidence: result.confidence,
    });

    // 7️⃣ Send response to frontend
    return res.json({
      success: true,
      message: "Disease scan completed",
      report,
    });
  } catch (error) {
    console.error("🔥 FULL ERROR:", error);
    console.error("🔥 ERROR RESPONSE:", error.response?.data);
    console.error("🔥 ERROR STATUS:", error.response?.status);
    console.error("🔥 ERROR MESSAGE:", error.message);

    return res.status(500).json({
      success: false,
      message: "Plant disease detection failed",
      error: error.response?.data || error.message,
    });
  }
};
// 📜 Get AI Scan History
exports.getScanHistory = async (req, res) => {
  try {
    const history = await DiseaseReport.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 }) // latest first
      .select("plantName disease severity createdAt confidence");

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Scan history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load scan history",
    });
  }
};
// 🗑️ Delete scan
exports.deleteScan = async (req, res) => {
  await DiseaseReport.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  res.json({ success: true });
};
// 🧹 Clear all AI scan history for logged-in user
exports.clearScanHistory = async (req, res) => {
  try {
    await DiseaseReport.deleteMany({
      user: req.user._id,
    });

    res.json({
      success: true,
      message: "Scan history cleared",
    });
  } catch (error) {
    console.error("Clear history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear scan history",
    });
  }
};
