const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Load env vars
dotenv.config({ path: "./backend.env" });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/complaints", require("./routes/complaintRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "Clean Street API running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});