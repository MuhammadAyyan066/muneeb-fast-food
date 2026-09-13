const mongoose = require('mongoose');

const sizeVariantSchema = new mongoose.Schema({
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

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Pizzas', 'Muneeb Special Pizzas', 'Burgers', 'Deals', 'Sides', 'Beverages']
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  hasSizes: {
    type: Boolean,
    default: false
  },
  // Used if hasSizes is false
  price: {
    type: Number,
    default: 0
  },
  // Used if hasSizes is true
  sizes: [sizeVariantSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);