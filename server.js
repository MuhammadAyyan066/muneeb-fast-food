const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
require('dotenv').config();

// Models
const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();

// 1. Security Headers (Helmet)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. CORS Configuration
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder'],
  credentials: true
}));

// 3. Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Bohat zyada requests! 15 minutes baad dobara koshish karein.' }
});
app.use('/api', generalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Bohat zyada login attempts. Thori dair baad dobara koshish karein.' }
});
app.use('/api/auth', authLimiter);

// 4. Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static uploads folder
app.use('/uploads', express.static(uploadsDir));

// ==========================================
// DATABASE CONNECTION (SERVERLESS CACHING)
// ==========================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/muneeb_fast_food';

// Buffering ON rakhein taake query connection ka wait kare
mongoose.set('bufferCommands', true);

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  if (!cachedDb) {
    cachedDb = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: true
    }).then((m) => {
      console.log('MongoDB Connected Successfully');
      return m;
    }).catch((err) => {
      cachedDb = null;
      console.error('Database connection error:', err.message);
      throw err;
    });
  }

  return await cachedDb;
}

// Ensure DB connected on every incoming request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Database connection failed. Please retry.' });
  }
});

// Health / Test Route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'online', 
    message: 'Muneeb Fast Food API is running securely' 
  });
});

// Menu Route (Category filter support ke sath)
app.get('/api/menu', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${req.query.category}$`, 'i');
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
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

// Daily Cleanup Cron Job (Local/Dedicated servers ke liye)
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

// Server Initialization (Local development ke liye)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;