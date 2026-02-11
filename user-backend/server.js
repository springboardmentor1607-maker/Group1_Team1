// @ts-nocheck
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();   

app.use(express.json());

app.get("/create-user", async (req, res) => {
  const user = await User.create({
    name: "Test User",
    email: "test@gmail.com",
    password: "123456",
  });

  res.json(user);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
