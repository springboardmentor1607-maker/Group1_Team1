const dotenv = require("dotenv");
// Load env vars
dotenv . config({ path: "./backend.env" });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dns = require("dns");
const otpRoutes = require("./routes/otpRoutes");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Connect to database
connectDB();

const app = express();
console.log("Email:", process.env.EMAIL_USER);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/otp", otpRoutes);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/complaints", require("./routes/complaint"));

app.get("/", (req, res) => {
  res.json({ message: "Clean Street API running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});