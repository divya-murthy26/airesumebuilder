import express from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/userRoutes.js';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies // middlware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));         // Enable Cross-Origin Resource Sharing

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running successfully!' );
});

// Error Handling Middleware (Must be defined LAST)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  // If status code is 200 (success), change it to 500 (server error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  res.json({
    message: err.message,
    // Only show stack trace in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});