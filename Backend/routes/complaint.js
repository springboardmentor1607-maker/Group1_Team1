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
    const { title, description, type, priority, latitude, longitude, address, landmark } = req.body;

    if (!latitude || !longitude)
      return res.status(400).json({ message: "Location coordinates are required" });

    if (!title || !description || !address)
      return res.status(400).json({ message: "Title, description and address are required" });

    const complaint = await Complaint.create({
      user_id: req.user._id,
      title,
      description,
      type:     type     || "other",
      priority: priority || "medium",
      photo:    req.file ? `/uploads/${req.file.filename}` : null,
      location_coords: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      address,
      landmark:     landmark     || "",
      upvotes:      0,
      downvotes:    0,
      voters:       [],
      comments:     0,
      commentsList: [],
    });

    res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    console.error("Create complaint error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ GET MY COMPLAINTS (User Dashboard)
// ⚠️ Must be BEFORE "/:id"
// ============================================================
router.get("/my", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user_id: req.user._id })
      .populate("user_id",              "name email")
      .populate("assigned_to",          "name email")
      .populate("commentsList.user_id", "name email")
      .sort({ created_at: -1 });

    const userId = String(req.user._id);
    const result = complaints.map(c => {
      const obj    = c.toObject();
      const voter  = (obj.voters || []).find(v => String(v.user) === userId);
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
// ⚠️ Must be BEFORE "/:id"
// ============================================================
router.get("/my-assignments", protect, authorize("volunteer"), async (req, res) => {
  try {
    const complaints = await Complaint.find({ assigned_to: req.user._id })
      .populate("user_id",     "name email")
      .populate("assigned_to", "name email")
      .sort({ created_at: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ GET ALL COMPLAINTS (Community Board + Admin)
// ⚠️ Returns userVote for logged-in user
// ============================================================
router.get("/", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user_id",              "name email")
      .populate("assigned_to",          "name email")
      .populate("commentsList.user_id", "name email")
      .sort({ created_at: -1 });

    const userId = String(req.user._id);
    const result = complaints.map(c => {
      const obj    = c.toObject();
      const voter  = (obj.voters || []).find(v => String(v.user) === userId);
      obj.userVote = voter ? voter.voteType : null;
      return obj;
    });

    res.json(result);
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
    if (!volunteerId)
      return res.status(400).json({ message: "Volunteer ID is required" });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.assigned_to = volunteerId;
    complaint.updated_at  = new Date();
    await complaint.save();

    const updated = await Complaint.findById(req.params.id)
      .populate("user_id",     "name email")
      .populate("assigned_to", "name email");

    res.json({ message: "Complaint assigned successfully", complaint: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ ADMIN + VOLUNTEER: UPDATE STATUS
// ============================================================
router.put("/status/:id", protect, authorize("admin", "volunteer"), async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["received", "in_review", "resolved"];
    if (!allowedStatus.includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (
      req.user.role === "volunteer" &&
      String(complaint.assigned_to) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Not authorized to update this complaint" });
    }

    complaint.status     = status;
    complaint.updated_at = new Date();
    await complaint.save();

    res.json({ message: "Status updated successfully", complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ VOTE ON COMPLAINT
// POST /api/complaints/:id/vote  { voteType: "upvote"|"downvote" }
// ⚠️ Must be BEFORE "/:id"
// ============================================================
router.post("/:id/vote", protect, async (req, res) => {
  try {
    const { voteType } = req.body;
    if (!["upvote", "downvote"].includes(voteType))
      return res.status(400).json({ message: "Invalid voteType" });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    // Safely init missing fields (for old documents)
    if (!Array.isArray(complaint.voters))          complaint.voters    = [];
    if (typeof complaint.upvotes   !== "number")   complaint.upvotes   = 0;
    if (typeof complaint.downvotes !== "number")   complaint.downvotes = 0;

    const userId      = String(req.user._id);
    const existingIdx = complaint.voters.findIndex(v => String(v.user) === userId);

    if (existingIdx !== -1) {
      const existing = complaint.voters[existingIdx];
      if (existing.voteType === voteType) {
        // Same vote → remove (toggle off)
        complaint.voters.splice(existingIdx, 1);
        if (voteType === "upvote")   complaint.upvotes   = Math.max(0, complaint.upvotes - 1);
        if (voteType === "downvote") complaint.downvotes = Math.max(0, complaint.downvotes - 1);
      } else {
        // Different vote → switch
        if (existing.voteType === "upvote")   complaint.upvotes   = Math.max(0, complaint.upvotes - 1);
        if (existing.voteType === "downvote") complaint.downvotes = Math.max(0, complaint.downvotes - 1);
        complaint.voters[existingIdx].voteType = voteType;
        if (voteType === "upvote")   complaint.upvotes   += 1;
        if (voteType === "downvote") complaint.downvotes += 1;
      }
    } else {
      // New vote
      complaint.voters.push({ user: req.user._id, voteType });
      if (voteType === "upvote")   complaint.upvotes   += 1;
      if (voteType === "downvote") complaint.downvotes += 1;
    }

    complaint.markModified("voters");
    await complaint.save();

    const userVote = complaint.voters.find(v => String(v.user) === userId)?.voteType || null;
    res.json({ upvotes: complaint.upvotes, downvotes: complaint.downvotes, userVote });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ ADD COMMENT
// POST /api/complaints/:id/comments  { content }
// ⚠️ Must be BEFORE "/:id"
// ============================================================
router.post("/:id/comments", protect, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: "Comment cannot be empty" });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (!Array.isArray(complaint.commentsList)) complaint.commentsList = [];

    complaint.commentsList.push({
      user_id:   req.user._id,
      content:   content.trim(),
      timestamp: new Date(),
    });
    complaint.comments = complaint.commentsList.length;
    await complaint.save();

    await complaint.populate("commentsList.user_id", "name email");
    const saved = complaint.commentsList[complaint.commentsList.length - 1];

    res.status(201).json({ message: "Comment added", comment: saved });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ DELETE COMMENT
// DELETE /api/complaints/:id/comments/:commentId
// ============================================================
router.delete("/:id/comments/:commentId", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const comment = complaint.commentsList?.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (String(comment.user_id) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    complaint.commentsList.pull({ _id: req.params.commentId });
    complaint.comments = complaint.commentsList.length;
    await complaint.save();

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================================
// ✅ GET SINGLE COMPLAINT
// ⚠️ Must be LAST
// ============================================================
router.get("/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user_id",              "name email")
      .populate("assigned_to",          "name email")
      .populate("commentsList.user_id", "name email");

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const userId = String(req.user._id);
    const obj    = complaint.toObject();
    const voter  = (obj.voters || []).find(v => String(v.user) === userId);
    obj.userVote = voter ? voter.voteType : null;

    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
