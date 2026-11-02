const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(morgan('dev'));

// Project Metadata & Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    project: 'CampusCarpool',
    student: {
      name: 'AKASH M R',
      studentId: '2102508522',
    },
    database: {
      connected: mongoose.connection.readyState === 1,
      name: mongoose.connection.name || 'campuscarpool',
    },
    serverTime: new Date().toISOString(),
  });
});

// Mount Routes
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const requestRoutes = require('./routes/requestRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/requests', requestRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` CampusCarpool Server Running on Port ${PORT}`);
      console.log(` Student: AKASH M R (ID: 2102508522)`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;

