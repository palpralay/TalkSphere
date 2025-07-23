import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
// Configure environment variables first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware (order matters! Must come BEFORE routes)
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Routes (after middleware)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use(cookieParser());

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});