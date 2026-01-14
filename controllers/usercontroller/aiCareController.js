const PlantCare = require("../../models/usermodels/PlantCare");
const mockCare = require("../../data/mockPlantCare");

exports.generateCareWithAI = async (req, res) => {
  try {
    // 🔹 GET plant name from URL param
    const { plantName } = req.params;

    if (!plantName) {
      return res.status(400).json({
        message: "Plant name required",
      });
    }

    const key = plantName.toLowerCase().trim();

    // =========================
    // 1️⃣ CHECK DB CACHE
    // =========================
    const existing = await PlantCare.findOne({ name: key });

    if (existing) {
      return res.json({
        plantName,
        careGuide: {
          sunlight: existing.sunlight,
          watering: existing.watering,
          soil: existing.soil,
          temperature: existing.temperature,
          maintenance: existing.maintenance,
        },
        source: "cache",
      });
    }

    // =========================
    // 2️⃣ FALLBACK (MOCK / RULE BASED)
    // =========================
    const care = mockCare[key] || {
      sunlight: `Bright indirect sunlight is suitable for ${plantName}.`,
      watering: `Water ${plantName} when the top soil feels dry.`,
      soil: `Use well-drained, nutrient-rich soil.`,
      temperature: `Ideal temperature range for ${plantName} is 20–30°C.`,
      maintenance: `Trim dry leaves and fertilize once a month.`,
    };

    // =========================
    // 3️⃣ SAVE TO DB (CACHE)
    // =========================
    const savedCare = await PlantCare.create({
      name: key,
      category: "ai-generated",
      sunlight: care.sunlight,
      watering: care.watering,
      soil: care.soil,
      temperature: care.temperature,
      maintenance: care.maintenance,
      createdBy: null,
    });

    // =========================
    // 4️⃣ CONSISTENT RESPONSE
    // =========================
    res.json({
      plantName,
      careGuide: {
        sunlight: savedCare.sunlight,
        watering: savedCare.watering,
        soil: savedCare.soil,
        temperature: savedCare.temperature,
        maintenance: savedCare.maintenance,
      },
      source: "fallback",
    });
  } catch (err) {
    console.error("🌱 Care Error:", err.message);
    res.status(500).json({
      message: "Plant care generation failed",
    });
  }
};
