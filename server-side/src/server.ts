import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import Message from './models/Message';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: "https://web-chat-app-lc.pages.dev",
      methods: ["GET", "POST"]
    }
  });


// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Connect to MongoDB
const mongooseUri:string = process.env.MONGOOSE_URI??'';

mongoose
  .connect(mongooseUri)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => console.error('MongoDB connection error:', err));

  app.get('/', async (req: Request, res: Response) => {
    res.send('hola mundo');
  });


// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    // Handle user joining
    socket.on('join', async (nickName: string) => {
      socket.data.nickName = nickName;
      
      // Send existing messages to the new user
      const messages = await Message.find().sort({ timestamp: 1 });
      socket.emit('previous-messages', messages);
      
      io.emit('user-joined', { id: socket.id, name: nickName });
    });
  
    // Handle new messages
    socket.on('send-message', async (content: string) => {
      console.log('recibed: ','send-message')
      const messageData = {
        content,
        sender: socket.data.nickName,
        timestamp: new Date()
      };
  
      // Save to database
      const message = new Message(messageData);
      await message.save();
  
      // Broadcast to all clients
      io.emit('new-message', messageData);
    });

    // Handle user leave
    socket.on('leave', async (nickName: string) => {
      socket.data.nickName = nickName;
            
      io.emit('user-leave', { id: socket.id, name: nickName });
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      io.emit('user-left', socket.id);
      console.log('User disconnected:', socket.id);
    });
  });

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down server...');
  await mongoose.disconnect(); // Disconnect from MongoDB
  httpServer.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the Server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
