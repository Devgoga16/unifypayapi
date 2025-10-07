const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./src/config/database');
const { specs, swaggerUi } = require('./src/config/swagger');

// Route imports
const transactionRoutes = require('./src/routes/transactions');
const depositRoutes = require('./src/routes/deposits');
const dashboardRoutes = require('./src/routes/dashboard');
const balanceRoutes = require('./src/routes/balance');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies with increased limit
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'UnifyPay API Documentation'
}));

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/balance', balanceRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'UnifyPay API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to UnifyPay API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      transactions: '/api/transactions',
      deposits: '/api/deposits',
      dashboard: '/api/dashboard',
      balance: '/api/balance',
      health: '/health'
    }
  });
});

// 404 Handler - Must be after all other routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message
  });
});

const PORT = process.env.PORT || 3000;

// Solo ejecutar el servidor si no estamos en Vercel
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => {
      process.exit(1);
    });
  });
}

module.exports = app;