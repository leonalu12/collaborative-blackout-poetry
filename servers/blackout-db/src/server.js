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
   // save the poem rooms in memory
  // All rooms are stored in the poemRooms object
  const poemRooms = {};
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
    socket.to(`poem:${roomId}`).emit('player-joined', {
      playerId: socket.id,
      players: poemRooms[roomId].players
    });
    console.log(`用户 ${socket.id} 加入房间 ${roomId}，当前玩家:`, poemRooms[roomId].players);
      })

      socket.on('update-text', ({ roomId, text }) => {
        // update the text in the poemRooms object
        poemRooms[roomId].rawText = text;
        poemRooms[roomId].words = initializeText(text);
        // Broadcast the updated text to all clients in the room
        io.to(`poem:${roomId}`).emit('text-updated', {
          rawText: text,
          words: poemRooms[roomId].words
        });

        socket.on('update-words', ({ roomId, words,isBlackout,isInGame }) => {
          poemRooms[roomId].words = words;
          poemRooms[roomId].isBlackout = isBlackout;
          poemRooms[roomId].isInGame = isInGame;
          console.log(`收到房间 ${roomId} 的单词更新:`, words);
          socket.to(`poem:${roomId}`).emit('words-updated', {
            words: poemRooms[roomId].words,
            isBlackout: poemRooms[roomId].isBlackout,
            isInGame: poemRooms[roomId].isInGame
          });
        });
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