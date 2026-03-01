const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },

    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },

    category: {
      type: String,
      enum: ['garbage', 'pothole', 'water_leakage', 'streetlight', 'other'],
      default: 'other'
    },

    photo: {
      type: String,
      default: ''
    },

    // 🌍 GEOJSON FORMAT
    location_coords: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },

    address: {
      type: String,
      default: ''
    },

    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    status: {
      type: String,
      enum: ['received', 'in_review', 'in_progress', 'resolved', 'rejected'],
      default: 'received'
    }
  },
  {
    timestamps: true
  }
);

// 🔥 REQUIRED for geospatial queries
ComplaintSchema.index({ location_coords: '2dsphere' });

module.exports = mongoose.model('Complaint', ComplaintSchema);