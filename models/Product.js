const mongoose = require('mongoose');

// Sub-schema for variant pricing (Enum hata diya taake Pieces, Sizes aur Servings sab chal sakein)
const sizeVariantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0
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
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  hasSizes: {
    type: Boolean,
    default: false
  },

  // 1. Single Price (Non-variant items)
  price: {
    type: Number,
    default: 0,
    min: 0
  },

  // 2. Direct Object Format
  prices: {
    small: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    large: { type: Number, default: 0 },
    family: { type: Number, default: 0 }
  },

  // 3. Array Format
  sizes: [sizeVariantSchema]

}, { 
  timestamps: true 
});

// Pre-save hook: Sync sizes array with prices object without breaking non-standard sizes
productSchema.pre('save', function (next) {
  const isVariantItem = (this.category && this.category.toLowerCase().includes('pizza')) || 
                        this.hasSizes || 
                        (Array.isArray(this.sizes) && this.sizes.length > 0);

  if (isVariantItem) {
    this.hasSizes = true;

    // Agar prices object aaya hai aur sizes khali hain (Admin Pizza Save)
    if (this.prices && (!this.sizes || this.sizes.length === 0)) {
      const generatedSizes = [];
      if (this.prices.small > 0) generatedSizes.push({ size: 'Small', price: this.prices.small });
      if (this.prices.medium > 0) generatedSizes.push({ size: 'Medium', price: this.prices.medium });
      if (this.prices.large > 0) generatedSizes.push({ size: 'Large', price: this.prices.large });
      if (this.prices.family > 0) generatedSizes.push({ size: 'Family', price: this.prices.family });
      this.sizes = generatedSizes;
    }

    // Agar sizes array aya ho toh standardized keys sync karein
    if (Array.isArray(this.sizes) && this.sizes.length > 0 && this.prices) {
      this.sizes.forEach(s => {
        if (s.size) {
          const key = s.size.toLowerCase();
          if (this.prices[key] !== undefined) {
            this.prices[key] = s.price;
          }
        }
      });
    }
  }

  next();
});

module.exports = mongoose.model('Product', productSchema);