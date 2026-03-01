const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const { protect, authorize } = require("../middleware/auth");

// ================= CREATE COMPLAINT =================
// User can create complaint
router.post("/", protect, authorize("user", "admin"), async (req, res) => {
  try {
    const {
      title,
      description,
      latitude,
      longitude,
      address,
      photo,
    } = req.body;

    const complaint = await Complaint.create({
      user_id: req.user._id,
      title,
      description,
      photo,
      location_coords: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      address,
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= GET ALL COMPLAINTS =================
// Admin + User can see all complaints
router.get(
  "/",
  protect,
  authorize("admin", "user"),
  async (req, res) => {
    try {
      const complaints = await Complaint.find()
        .populate("user_id", "name email")
        .populate("assigned_to", "name email");

      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ================= GET VOLUNTEER ASSIGNED COMPLAINTS =================
// Volunteer sees only assigned complaints
router.get(
  "/my-assignments",
  protect,
  authorize("volunteer"),
  async (req, res) => {
    try {
      const complaints = await Complaint.find({
        assigned_to: req.user._id,
      }).populate("user_id", "name email");

      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ================= ADMIN ASSIGN COMPLAINT =================
router.put(
  "/assign/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { volunteerId } = req.body;

      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      complaint.assigned_to = volunteerId;
      await complaint.save();

      res.json({
        message: "Complaint assigned successfully",
        complaint,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ================= ADMIN UPDATE STATUS =================
router.put(
  "/status/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

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
  }
);

module.exports = router;