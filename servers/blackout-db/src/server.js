require('dotenv').config();

const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('../config/blackout-db');
const { title } = require('process');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5050;

// at the top, after you load dotenv…
const raw = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = raw.split(',').map(u => u.trim()).filter(Boolean);

// then reuse for both Express and Socket.IO
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
const io = new Server(server, { cors: corsOptions });

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
        title: '',
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

      // 监听用户发送的聊天消息
    socket.on('send-message', (messageData) => {
      const { roomId, username, message, timestamp } = messageData;

      // 广播消息到指定房间
      io.to(`document:${roomId}`).emit('receive-message', {
        username,
        message,
        timestamp
      });

      console.log(`Message sent to room ${roomId}:`, messageData);
    });


      socket.on('update-room-state', ({ roomId, title, rawText, words, isBlackout, isInGame }) => {
        if (!poemRooms[roomId]) return;
      
        // 更新对应房间状态
        poemRooms[roomId] = {
          ...poemRooms[roomId],
          title,
          rawText,
          words,
          isBlackout,
          isInGame,
        };
      
        // 通知房间内所有人（包含发送者或不包含，按需）
        io.to(`document:${roomId}`).emit('room-state', poemRooms[roomId]);
      });


  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });

  socket.on('leave-document', (roomId) => {
    socket.leave(`document:${roomId}`);
    if (poemRooms[roomId]) {
      poemRooms[roomId].players = poemRooms[roomId].players.filter(id => id !== socket.id);
    }
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