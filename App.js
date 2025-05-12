import Express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import UserRouter from "./route/User.js";
import ChatRouter from "./route/Chat.js";
import mongoose from 'mongoose';
import USER from './Model/User.js'

// Connect to MongoDB
mongoose.connect('mongodb+srv://yugpatel5880:yugpatel4545@cluster0.j3rq9pd.mongodb.net/DeepChat?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(() => console.log('❌ Not connected to MongoDB'));

const app = Express();
const port = 3000;

// Middleware
app.use(Express.json());
app.use(cors({
  origin: 'https://deep-chat-beta.vercel.app',
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
    origin: 'https://deep-chat-beta.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const onlineUsers = new Map(); // Keeps track of userId <-> socketId

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.emit('Welcome', socket.id);

  socket.on("join", async (userId) => {
    try {
      socket.join(userId);
      onlineUsers.set(userId, socket.id);
      console.log(`✅ User ${userId} joined their personal room`);

      // Notify others (optional)
      socket.broadcast.emit('user-online', { userId, isOnline: true });

      // Mark user as online in DB
      await USER.findByIdAndUpdate(
        userId,
        { isOnline: true },
        { new: true }
      );


    } catch (error) {
      console.error(`⚠️ Error on join:`, error.message);
    }
  });

  socket.on("Message", (data) => {
    const { sender, receiver, messages, time } = data;

    // Send to the specific receiver's 
    io.to(receiver).emit("receive-message", {
      sender,
      receiver,
      messages,
      time
    });
  });

  socket.on('disconnect', async () => {
    try {
      for (const [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          console.log(`❌ User ${userId} disconnected`);

          // Notify others
          socket.broadcast.emit('user-online', { userId, isOnline: false });

          await USER.findByIdAndUpdate(
            userId,
            { isOnline: false },
            { new: true }
          );


          break;
        }
      }
    } catch (error) {
      console.error(`⚠️ Error on disconnect:`, error.message);
    }
  });
});


server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
