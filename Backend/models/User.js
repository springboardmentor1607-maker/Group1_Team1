const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },

  // ── Profile fields ─────────────────────────────────────────
  username: {
    type: String,
    default: "",
    trim: true,
  },
  phone: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  profilePhoto: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },

  // ── Location — stored as both "location" and "address" for compatibility ──
  location: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },

  // ── Zone (used for volunteer assignment matching) ──────────
  zone: {
    type: String,
    default: "",
  },

  // ── Role ───────────────────────────────────────────────────
  role: {
    type: String,
    enum: ["user", "volunteer", "admin"],
    default: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt   = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
