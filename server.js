const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
require('dotenv').config();

// Models
const Product = require('./models/Product');
const Order = require('./models/Order');

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

mongoose.set('bufferCommands', false);

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000
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

// Direct Menu Route (Fetches all products sorted newest first)
app.get('/api/menu', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching menu:', err);
    return res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Route Handlers
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Daily Cleanup Cron Job (Har roz raat 12:00 baje 7 din purane 'Done' orders delete karega)
cron.schedule('0 0 * * *', async () => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const result = await Order.deleteMany({
      status: 'Done',
      completedAt: { $lte: sevenDaysAgo }
    });
    if (result.deletedCount > 0) {
      console.log(`[CRON] Auto-purged ${result.deletedCount} orders older than 7 days.`);
    }
  } catch (err) {
    console.error('[CRON] Auto-cleanup error:', err);
  }
});

// Global 404 Handler (Tamam routes ke baad aana lazmi hai)
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