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

    photo: {
      type: String,
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

    assigned_to: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["received", "in_review", "resolved"],
      default: "received",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

complaintSchema.index({ location_coords: "2dsphere" });

module.exports = mongoose.model("Complaint", complaintSchema);