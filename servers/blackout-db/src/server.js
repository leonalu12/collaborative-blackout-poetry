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
    origin: process.env.BLACKOUT_APP_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});


const PORT = process.env.PORT || 5000;

// 👇 CORS for Express
app.use(cors({
  origin: process.env.BLACKOUT_APP_URL,
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

  const poemRooms = {};
// 🧠 Socket.IO logic
io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);
   // save the poem rooms in memory
  // All rooms are stored in the poemRooms object

  // Initialize a new room when a user joins
  socket.on('join-document', (roomId) => {
    socket.join(`document:${roomId}`);
    console.log(`User ${socket.id} joined document:${roomId}`);
    // initialize the room if it doesn't exist
    if (!poemRooms[roomId]) {
      poemRooms[roomId] = {
        rawText: '',
        words: [],
        players: [],
        isBlackout: false,
        isInGame: false
      };
    }
    // Add the user to the room's players array
    poemRooms[roomId].players.push(socket.id);
        // 发送完整房间状态给新用户
        socket.emit('room-state', poemRooms[roomId]);
    // 通知其他用户（排除自己）
    socket.to(`document:${roomId}`).emit('player-joined', {
      playerId: socket.id,
      players: poemRooms[roomId].players
    });
    console.log(`用户 ${socket.id} 加入房间 ${roomId}，当前玩家:`, poemRooms[roomId].players);
      })


      socket.on('update-room-state', ({ roomId, rawText, words, isBlackout, isInGame }) => {
        if (!poemRooms[roomId]) return;
      
        // 更新对应房间状态
        poemRooms[roomId] = {
          ...poemRooms[roomId],
          rawText,
          words,
          isBlackout,
          isInGame,
        };
      
        // 通知房间内所有人（包含发送者或不包含，按需）
        io.to(`document:${roomId}`).emit('room-state', poemRooms[roomId]);
      });



//blackout change happens in the BlackoutPage.jsx component.So this may not be needed here.
  socket.on('blackout-change', ({ roomId, blackoutData }) => {
    socket.to(`document:${roomId}`).emit('receive-blackout', blackoutData);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });

  socket.on('leave-document', (roomId) => {
    socket.leave(`document:${roomId}`);
    console.log(`User ${socket.id} left document:${roomId}`);
  });
});

// Only start server outside tests
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
  });
}

module.exports = { app, server };