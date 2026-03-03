const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../config/multer");

// ============================================================
// ✅ CREATE COMPLAINT
// ============================================================
router.post("/", protect, upload.single("photo"), async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      priority,
      latitude,
      longitude,
      address,
      landmark,
    } = req.body;

    // ✅ validations
    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Location coordinates are required" });
    }

    if (!title || !description || !address) {
      return res
        .status(400)
        .json({ message: "Title, description and address are required" });
    }

    const complaint = await Complaint.create({
      user_id: req.user._id,
      title,
      description,
      type: type || "other",
      priority: priority || "medium",
      photo: req.file ? `/uploads/${req.file.filename}` : null,
      location_coords: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      address,
      landmark: landmark || "",
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ GET ALL COMPLAINTS (ROLE BASED)
// ============================================================
router.get("/", protect, async (req, res) => {
  try {
    const query =
      req.user.role === "admin"
        ? {}
        : { user_id: req.user._id };

    const complaints = await Complaint.find(query)
      .populate("user_id", "name email")
      .populate("assigned_to", "name email")
      .sort({ created_at: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ GET MY COMPLAINTS
// ============================================================
router.get("/my", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user_id: req.user._id,
    })
      .populate("assigned_to", "name email")
      .sort({ created_at: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ GET VOLUNTEER ASSIGNED COMPLAINTS
// ============================================================
router.get("/my-assignments", protect, authorize("volunteer"), async (req, res) => {
  try {
    const complaints = await Complaint.find({ assigned_to: req.user._id })
      .populate("user_id", "name email")
      .sort({ created_at: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ ADMIN: ASSIGN VOLUNTEER
// ============================================================
router.put("/assign/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { volunteerId } = req.body;

    if (!volunteerId) {
      return res
        .status(400)
        .json({ message: "Volunteer ID is required" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.assigned_to = volunteerId;
    complaint.status = "in_review";

    await complaint.save();

    res.json({
      message: "Complaint assigned successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ ADMIN: UPDATE STATUS
// ============================================================
router.put("/status/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["received", "in_review", "resolved"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;
    await complaint.save();

    res.json({
      message: "Status updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
