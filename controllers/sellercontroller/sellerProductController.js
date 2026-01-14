const cloudinary = require("../../utils/cloudinary");
const streamifier = require("streamifier");
const Plant = require("../../models/sellermodels/Plant");

/* =========================
   ADD PLANT
========================= */
exports.addPlant = async (req, res) => {
  try {
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedUrl = await new Promise(
          (resolve, reject) => {
            const uploadStream =
              cloudinary.uploader.upload_stream(
                { folder: "greenhive_plants" },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result.secure_url);
                }
              );

            streamifier
              .createReadStream(file.buffer)
              .pipe(uploadStream);
          }
        );

        imageUrls.push(uploadedUrl);
      }
    }

    const plant = await Plant.create({
      seller: req.user._id,
      ...req.body,
      images: imageUrls,
    });

    res.status(201).json(plant);
  } catch (err) {
    console.error("Add Plant Error:", err);
    res.status(500).json({ message: "Plant Create Failed" });
  }
};

/* =========================
   GET SELLER PLANTS
========================= */
exports.getSellerPlants = async (req, res) => {
  try {
    const plants = await Plant.find({
      seller: req.user.id,
      isDeleted: false,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(plants);
  } catch (err) {
    console.error("Fetch Plants Failed:", err);
    res.status(500).json({ message: "Fetch Plants Failed" });
  }
};

/* =========================
   GET PLANT BY ID
========================= */
exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id)
      .populate("category", "name")
      .populate("seller", "name shopName email"); // ✅ ADD THIS

    if (!plant) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(plant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch failed" });
  }
};



exports.updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findOne({
      _id: req.params.id,
      seller: req.user.id,
      isDeleted: false,
    });

    if (!plant) {
      return res.status(404).json({
        message: "Plant Not Found",
      });
    }

    // IMAGE UPLOAD
    let imageUrls = plant.images;

    if (req.files && req.files.length > 0) {
      imageUrls = [];

      for (const file of req.files) {
        const uploadedUrl = await new Promise(
          (resolve, reject) => {
            const uploadStream =
              cloudinary.uploader.upload_stream(
                { folder: "greenhive_plants" },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result.secure_url);
                }
              );

            streamifier
              .createReadStream(file.buffer)
              .pipe(uploadStream);
          }
        );

        imageUrls.push(uploadedUrl);
      }
    }

    Object.keys(req.body).forEach((key) => {
      plant[key] = req.body[key];
    });

    plant.images = imageUrls;

    await plant.save();
    res.json(plant);
  } catch (err) {
    console.error("Plant Update Failed:", err);
    res.status(500).json({ message: "Plant Update Failed" });
  }
};

/* =========================
   DELETE PLANT (SELLER)
========================= */
exports.deletePlant = async (req, res) => {
  try {
    await Plant.findOneAndDelete({
      _id: req.params.id,
      seller: req.user.id,
    });

    res.json({ message: "Plant Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Plant Delete Failed" });
  }
};
