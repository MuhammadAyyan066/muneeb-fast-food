const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();

// 1. Explicit Global CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Bypass-Tunnel-Reminder");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// 2. Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 3. CORS Package
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
}));

// 4. Rate Limiting
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

// 5. Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Safe local uploads directory handling for non-serverless environments
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem par silent ignore
}
app.use('/uploads', express.static(uploadsDir));

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/muneeb_fast_food';
mongoose.set('bufferCommands', false);

let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;
  if (!cachedDb) {
    cachedDb = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false
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

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Database connection failed. Check MONGO_URI.' });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ status: 'online', message: 'Muneeb Fast Food API is running securely' });
});

app.get('/api/menu', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${req.query.category}$`, 'i');
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found on this server.` });
});

app.use((err, req, res, next) => {
  console.error('Server Internal Error:', err.stack || err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;