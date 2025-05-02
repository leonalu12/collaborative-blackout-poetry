require('dotenv').config();

const cors = require('cors');


const express = require('express');
const connectDB = require('../config/blackout-db');
const userRoutes = require('../routes/userRoutes');
const documentRoutes = require('../routes/documentRoutes');
const commentRoutes = require('../routes/commentRoutes');
const communityRoutes = require('../routes/communityRoutes');
const authRoutes = require('../routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(express.json());
app.use(cors());
// app.use(cors({
//   origin: "http://localhost:5173", // 允许前端域名
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// })); 

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Hello from Express and MongoDB!" });
});
app.use('/api/users', userRoutes);  // For user CRUD
app.use('/api/auth', authRoutes);   // For login/signup
app.use('/api/documents', documentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/community', communityRoutes);


// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
  });
}

// Export app for testing
module.exports = app;