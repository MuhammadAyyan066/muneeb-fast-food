const mongoose = require('mongoose');

const SizeVariantSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large', 'Family'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  // Single price field (Burgers, Deals, Sides wagera ke liye)
  price: {
    type: String,
    default: '0/-',
    trim: true
  },
  // Multi-size support (Pizzas ke liye)
  hasSizes: {
    type: Boolean,
    default: false
  },
  sizes: [SizeVariantSchema],
  desc: {
    type: String,
    default: '',
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image URL or file is required']
  },
  tag: {
    type: String,
    default: 'Popular'
  },
  time: {
    type: String,
    default: '15 min'
  },
  rating: {
    type: String,
    default: '4.8 (50)'
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);