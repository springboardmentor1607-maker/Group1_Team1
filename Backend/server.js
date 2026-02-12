const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Route files
const auth = require('./routes/auth');
const users = require('./routes/user');
const complaints = require('./routes/complaint');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/complaints', complaints);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Clean Street API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});