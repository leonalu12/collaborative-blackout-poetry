require('dotenv').config();
const express = require('express');
const connectDB = require('../config/blackout-db');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.json({ message: "Hello from Express and MongoDB!" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));