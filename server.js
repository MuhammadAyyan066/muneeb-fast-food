const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
app.use('/uploads', express.static(uploadsDir));

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/muneeb_fast_food';

// Disable buffering so pending queries fail immediately if connection drops
mongoose.set('bufferCommands', false);

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000 // 5 seconds mein fail kare agar cluster unreachable ho
})
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });

// Health / Test Route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'online', 
    message: 'Muneeb Fast Food API is running successfully' 
  });
});

// Route Handlers
const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found on this server.` });
});

// Global 500 Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Server Internal Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;