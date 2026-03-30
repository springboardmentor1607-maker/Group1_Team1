const Otp  = require("../models/Otp");
const sendOtp = require("../utils/sendOtp");
const User = require("../models/User");

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ============================================================
// ✅ Send OTP for Registration
// ============================================================
exports.sendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const otp = generateOtp();

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });
    await sendOtp(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ============================================================
// ✅ Verify Registration OTP — saves location on User
// ============================================================
exports.verifyRegisterOtp = async (req, res) => {
  try {
    // ✅ Extract location from request body
    const { email, otp, name, password, role, location } = req.body;

    const record = await Otp.findOne({ email });

    if (!record)
      return res.status(400).json({ message: "OTP not found or expired" });

    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // ✅ Create user WITH location and zone (both set to same value for zone matching)
    const user = await User.create({
      name,
      email,
      password,
      role:     role     || "user",
      location: location || "",    // ✅ saves location field
      zone:     location || "",    // ✅ saves zone field (used for volunteer assignment matching)
    });

    await Otp.deleteMany({ email });

    res.json({
      message: "Registration successful",
      user: {
        _id:      user._id,
        name:     user.name,
        email:    user.email,
        role:     user.role,
        location: user.location,
      },
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

// ============================================================
// ✅ Send OTP for Password Reset
// ============================================================
exports.sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });
    await sendOtp(email, otp);

    res.json({ message: "Reset OTP sent" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send reset OTP" });
  }
};

// ============================================================
// ✅ Reset Password
// ============================================================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const record = await Otp.findOne({ email });
    if (!record) return res.status(400).json({ message: "OTP expired" });
    if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    await Otp.deleteMany({ email });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Password reset failed" });
  }
};
