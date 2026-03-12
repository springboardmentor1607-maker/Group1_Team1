const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "other",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent", "critical"],
      default: "medium",
    },

    photo: {
      type: String,
      default: null,
    },

    location_coords: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    address: {
      type: String,
      required: true,
    },

    landmark: {
      type: String,
      default: "",
    },

    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "received",
        "pending",
        "assigned",
        "accepted",
        "in_review",
        "in_progress",
        "denied",
        "resolved",
        "completed",
      ],
      default: "received",
    },

    // ─── Voting ──────────────────────────────────────────────
    upvotes: {
      type: Number,
      default: 0,
    },

    downvotes: {
      type: Number,
      default: 0,
    },

    voters: [
      {
        user:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        voteType: { type: String, enum: ["upvote", "downvote"] },
      },
    ],

    // ─── Comments ─────────────────────────────────────────────
    comments: {
      type: Number,
      default: 0,
    },

    commentsList: [
      {
        user_id:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content:   { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// ✅ Required for geo queries
complaintSchema.index({ location_coords: "2dsphere" });

module.exports = mongoose.model("Complaint", complaintSchema);
