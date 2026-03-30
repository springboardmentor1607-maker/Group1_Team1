const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const User = require("../models/User"); // ✅ added
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

    if (!latitude || !longitude)
      return res
        .status(400)
        .json({ message: "Location coordinates are required" });

    if (!title || !description || !address)
      return res
        .status(400)
        .json({ message: "Title, description and address are required" });

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
      zone: address, // ✅ IMPORTANT (zone mapping)
      landmark: landmark || "",
      upvotes: 0,
      downvotes: 0,
      voters: [],
      comments: 0,
      commentsList: [],
    });

    res
      .status(201)
      .json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    console.error("Create complaint error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ GET MY COMPLAINTS
// ============================================================
router.get("/my", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user_id: req.user._id })
      .populate("user_id", "name email")
      .populate("assigned_to", "name email")
      .populate("commentsList.user_id", "name email")
      .sort({ created_at: -1 });

    const userId = String(req.user._id);
    const result = complaints.map((c) => {
      const obj = c.toObject();
      const voter = (obj.voters || []).find((v) => String(v.user) === userId);
      obj.userVote = voter ? voter.voteType : null;
      return obj;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ GET VOLUNTEER ASSIGNED COMPLAINTS
// ============================================================
router.get(
  "/my-assignments",
  protect,
  authorize("volunteer"),
  async (req, res) => {
    try {
      const complaints = await Complaint.find({ assigned_to: req.user._id })
        .populate("user_id", "name email")
        .populate("assigned_to", "name email")
        .sort({ created_at: -1 });

      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// ============================================================
// ✅ GET ALL COMPLAINTS
// ============================================================
router.get("/", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user_id", "name email")
      .populate("assigned_to", "name email")
      .populate("commentsList.user_id", "name email")
      .sort({ created_at: -1 });

    const userId = String(req.user._id);
    const result = complaints.map((c) => {
      const obj = c.toObject();
      const voter = (obj.voters || []).find((v) => String(v.user) === userId);
      obj.userVote = voter ? voter.voteType : null;
      return obj;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ AUTO ASSIGN VOLUNTEER BASED ON ZONE 🔥
// ============================================================
router.put("/assign/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    // ✅ If frontend already resolved the volunteer (auto or manual), use it directly
    if (req.body.volunteerId) {
      const volunteer = await User.findById(req.body.volunteerId);
      if (!volunteer || volunteer.role !== "volunteer") {
        return res.status(400).json({ message: "Invalid volunteer" });
      }
      complaint.assigned_to = volunteer._id;
      complaint.status = "assigned";
      complaint.updated_at = new Date();
      await complaint.save();

      const updated = await Complaint.findById(req.params.id)
        .populate("user_id", "name email")
        .populate("assigned_to", "name email");

      return res.json({ message: "Complaint assigned successfully", complaint: updated });
    }

    // 🔥 Fallback — no volunteerId provided, try zone-based matching
    const complaintZone = complaint.zone?.toLowerCase().trim();
    console.log("Complaint Zone:", complaintZone);

    let volunteers = [];
    if (complaintZone) {
      volunteers = await User.find({
        role: "volunteer",
        zone: { $regex: complaintZone, $options: "i" },
      });
    }

    console.log("Matching Volunteers:", volunteers);

    // 🔥 fallback if no match
    if (!volunteers || volunteers.length === 0) {
      const allVolunteers = await User.find({ role: "volunteer" });

      return res.status(200).json({
        manual: true,
        message: "No volunteer in this zone. Please assign manually.",
        volunteers: allVolunteers,
      });
    }

    // ✅ Pick first volunteer (can improve later)
    const volunteer = volunteers[0];

    complaint.assigned_to = volunteer._id;
    complaint.status = "assigned";
    complaint.updated_at = new Date();

    await complaint.save();

    const updated = await Complaint.findById(req.params.id)
      .populate("user_id", "name email")
      .populate("assigned_to", "name email");

    res.json({
      message: "Complaint auto-assigned successfully",
      complaint: updated,
    });
  } catch (error) {
    console.error("Assign Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ UPDATE STATUS
// ============================================================
router.put(
  "/status/:id",
  protect,
  authorize("admin", "volunteer"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const allowedStatus = [
        "received",
        "assigned",
        "in_review",
        "resolved",
        "completed",
        "pending",
      ];

      if (!allowedStatus.includes(status))
        return res.status(400).json({ message: "Invalid status value" });

      const complaint = await Complaint.findById(req.params.id);
      if (!complaint)
        return res.status(404).json({ message: "Complaint not found" });

      if (
        req.user.role === "volunteer" &&
        String(complaint.assigned_to) !== String(req.user._id)
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this complaint" });
      }

      complaint.status = status;
      complaint.updated_at = new Date();

      await complaint.save();

      res.json({ message: "Status updated successfully", complaint });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// ============================================================
// ✅ VOTE
// ============================================================
router.post("/:id/vote", protect, async (req, res) => {
  try {
    const { voteType } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    if (!Array.isArray(complaint.voters)) complaint.voters = [];

    const userId = String(req.user._id);
    const existingIdx = complaint.voters.findIndex(
      (v) => String(v.user) === userId,
    );

    if (existingIdx !== -1) {
      complaint.voters.splice(existingIdx, 1);
    } else {
      complaint.voters.push({ user: req.user._id, voteType });
    }

    await complaint.save();

    res.json({ message: "Vote updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ COMMENT
// ============================================================
router.post("/:id/comments", protect, async (req, res) => {
  try {
    const { content } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    complaint.commentsList.push({
      user_id: req.user._id,
      content,
    });

    complaint.comments = complaint.commentsList.length;

    await complaint.save();

    res.json({ message: "Comment added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;