require('dotenv').config();

const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('../config/blackout-db');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});


const PORT = process.env.PORT || 5000;

// 👇 CORS for Express
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.json({ message: 'Hello from Express and MongoDB!' }));

app.use('/api/users', require('../routes/userRoutes'));
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/documents', require('../routes/documentRoutes'));
app.use('/api/comments', require('../routes/commentRoutes'));
app.use('/api/community', require('../routes/communityRoutes'));
app.use('/api/generate', require('../routes/generateRoutes'));

// 🧠 Socket.IO logic
io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  socket.on('join-document', (documentId) => {
    socket.join(`document:${documentId}`);
    console.log(`User ${socket.id} joined document:${documentId}`);
  });

  socket.on('blackout-change', ({ documentId, blackoutData }) => {
    socket.to(`document:${documentId}`).emit('receive-blackout', blackoutData);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });

  socket.on('leave-document', (documentId) => {
    socket.leave(`document:${documentId}`);
    console.log(`User ${socket.id} left document:${documentId}`);
  });
});

// Only start server outside tests
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
  });
}

module.exports = { app, server };