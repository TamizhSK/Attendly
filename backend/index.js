const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const noteRoutes = require('./routes/noteRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const configureMiddleware = (app) => {
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

// Route configuration
const configureRoutes = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/notes', noteRoutes);
};

// Error handling middleware
const configureErrorHandling = (app) => {
  // 404 handler
  app.use((req, res, next) => {
    res.status(404).json({ 
      message: 'Route not found',
      path: req.path
    });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
  });
};

// Database and server initialization
const startServer = async () => {
  try {
    // Authenticate and sync database
    await sequelize.authenticate();
    await sequelize.sync({ 
      // Use alter: true in development to automatically update table schemas
      alter: process.env.NODE_ENV === 'development' 
    });
    console.log('Database connected and models synced');

    // Configure middleware
    configureMiddleware(app);

    // Configure routes
    configureRoutes(app);

    // Configure error handling
    configureErrorHandling(app);

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        sequelize.close().then(() => {
          console.log('Database connection closed');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize the server
startServer();

module.exports = app;