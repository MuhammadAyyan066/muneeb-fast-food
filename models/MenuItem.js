const mongoose = require('mongoose');

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
  price: {
    type: String, // Kept as string to support notations like "550/- (S)" or "350"
    required: [true, 'Price is required'],
    trim: true
  },
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