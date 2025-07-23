import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // ADD THIS IMPORT
import { connectDB } from './lib/db.js';

// Routes
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import friendRoutes from './routes/friend.routes.js';
import chatRoutes from './routes/chat.route.js';

dotenv.config();

// ADD: Environment variables validation
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'STREAM_API_KEY', 'STREAM_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cookieParser());

// ADD: CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/chat', chatRoutes);

// Connect DB first, then start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
