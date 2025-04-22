require('dotenv').config();
const express = require('express');
const connectDB = require('../config/blackout-db');
const userRoutes = require('../routes/userRoutes');
const documentRoutes = require('../routes/documentRoutes');
const commentRoutes = require('../routes/commentRoutes');
const communityRoutes = require('../routes/communityRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Hello from Express and MongoDB!" });
});
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/community', communityRoutes);

// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  });
}

// Export app for testing
module.exports = app;