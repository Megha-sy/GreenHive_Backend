const DiseaseReport = require("../../models/usermodels/DiseaseReport");

/* =========================
   GET ALL DISEASE REPORTS
========================= */
exports.getAllDiseaseReports = async (req, res) => {
  try {
    const reports = await DiseaseReport.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error("Admin disease fetch error:", err);
    res.status(500).json({ message: "Failed to load disease reports" });
  }
};

/* =========================
   DELETE REPORT (ADMIN)
========================= */
exports.deleteDiseaseReport = async (req, res) => {
  try {
    const report = await DiseaseReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ message: "Disease report deleted" });
  } catch (err) {
    console.error("Admin delete disease error:", err);
    res.status(500).json({ message: "Failed to delete report" });
  }
};
