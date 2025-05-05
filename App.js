import Express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import UserRouter from "./route/User.js";
import ChatRouter from "./route/Chat.js";
import mongoose from 'mongoose';
import USER from './Model/User.js'

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Chat')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(() => console.log('❌ Not connected to MongoDB'));

const app = Express();
const port = 3000;

// Middleware
app.use(Express.json());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Routes
app.use('/user', UserRouter);
app.use('/chat', ChatRouter);

// Create HTTP and Socket.IO servers
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const onlineUsers = new Map(); // Keeps track of userId <-> socketId

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.emit('Welcome', socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  socket.on("Message", (data) => {
    const { sender, receiver, messages, time } = data;

    // Send to the specific receiver's 
    io.to(receiver).emit("receive-message", {
      sender,
      messages,
      time
    });
  });

  socket.on('disconnect', async () => {

    console.log(`❌ User disconnected`);

  });
});


server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
