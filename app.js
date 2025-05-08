import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { Server } from 'socket.io';  // Correctly use import
import { setupSwagger } from './swagger.js';
import { userRoutes, adminRoutes, verifyEmailRoute } from './routes/index.js';
import chatRoutes from './routes/chatRoutes.js';
import logger from './utils/logger.js';
import connectDB from './db/conn.js';
import rateLimit from 'express-rate-limit';

dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Create HTTP server using 'import' syntax
import http from 'http';
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',  // Change this to frontend URL in prod
    methods: ['GET', 'POST']
  }
});

// ✅ WebSocket Events
io.on('connection', (socket) => {
  logger.info(`🟢 WebSocket connected: ${socket.id}`);

  socket.on('chat message', (msg) => {
    logger.info(`💬 Message from ${socket.id}: ${msg}`);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    logger.info(`🔴 WebSocket disconnected: ${socket.id}`);
  });
});

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// ✅ Apply Global Rate Limiting (100 requests per 15 minutes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,  // Allow 100 requests per 15 minutes
  message: 'Too many requests, please try again later.'
});

app.use(globalLimiter);

// Optionally, apply stricter rate limit to /auth routes
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,  // 5 minutes
  max: 5,  // Allow 5 requests per 5 minutes
  message: 'Too many authentication attempts, please try again later.'
});

app.use('/api/auth', authLimiter);  // Apply rate limiting to authentication routes

// ✅ Swagger Docs Setup
setupSwagger(app);

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/', verifyEmailRoute);

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Error Handling (Optional)
app.use((err, req, res, next) => {
  logger.error(`❌ Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error' });
});

export { app, server, io };  // Export app for external usage
