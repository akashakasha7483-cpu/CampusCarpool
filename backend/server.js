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
// Production & Development CORS Configuration
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null;

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, health check, Postman, and curl probes
    if (!origin) return callback(null, true);
    if (!clientUrl || clientUrl === '*' || origin === clientUrl || origin.includes('onrender.com') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(morgan('dev'));

// Technical Health Check
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'healthy' : 'degraded',
    project: 'CampusCarpool',
    database: {
      connected: isDbConnected,
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

