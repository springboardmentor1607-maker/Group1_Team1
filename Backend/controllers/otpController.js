const Otp = require("../models/Otp");
const sendOtp = require("../utils/sendOtp");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Generate OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP for Registration
exports.sendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const otp = generateOtp();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
    });

    await sendOtp(email, otp);

    res.json({
      message: "OTP sent to email",
    });
  } catch (error) {
    console.error("OTP error:", error);
    res.status(500).json({
      message: "Failed to send OTP",
    });
  }
};

// Verify Registration OTP
exports.verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp, name, password, role } = req.body;

    const record = await Otp.findOne({ email });

    if (!record)
      return res.status(400).json({ message: "OTP not found or expired" });

    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user"
    });

    await Otp.deleteMany({ email });

    res.json({
      message: "Registration successful",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Verification failed"
    });
  }
};

// Send OTP for Password Reset
exports.sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
    });

    await sendOtp(email, otp);

    res.json({
      message: "Reset OTP sent",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send reset OTP",
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const record = await Otp.findOne({ email });

    if (!record)
      return res.status(400).json({ message: "OTP expired" });

    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const user = await User.findOne({ email });

    user.password = newPassword;

    await user.save();

    await Otp.deleteMany({ email });

    res.json({
      message: "Password reset successful"
    });

  } catch (error) {
    res.status(500).json({
      message: "Password reset failed"
    });
  }
};
