const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  size: { 
    type: String, 
    enum: ['Small', 'Medium', 'Large', 'Family', null], 
    default: null 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1, 
    default: 1 
  }
}, { _id: true });

const orderSchema = new mongoose.Schema(
  {
    customerName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    phone: { 
      type: String, 
      required: true, 
      trim: true 
    },
    customerPhone: { 
      type: String, 
      trim: true 
    },
    address: { 
      type: String, 
      required: true, 
      trim: true 
    },
    deliveryAddress: { 
      type: String, 
      trim: true 
    },
    locationCoords: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Order must contain at least one item.'
      }
    },
    totalAmount: { 
      type: Number, 
      required: true, 
      min: 0, 
      default: 0 
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'In Delivery', 'Delivery', 'Done'],
      default: 'Pending',
      index: true
    },
    // MongoDB TTL Index: 7 din (604800 seconds) baad completed order auto-delete
    completedAt: {
      type: Date,
      default: null,
      index: { expires: 604800 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);