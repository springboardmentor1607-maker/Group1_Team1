const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController");

router.post("/send-register-otp", otpController.sendRegisterOtp);
router.post("/verify-register-otp", otpController.verifyRegisterOtp);

router.post("/send-reset-otp", otpController.sendResetOtp);
router.post("/reset-password", otpController.resetPassword);

module.exports = router;