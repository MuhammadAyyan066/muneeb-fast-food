const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    customerPhone: { type: String, trim: true },
    address: { type: String, trim: true },
    deliveryAddress: { type: String, trim: true },
    locationCoords: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
    },
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, default: 1 }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        default: 'Pending',
        trim: true
    },
    completedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// 7-day TTL Index (604,800 seconds)
orderSchema.index({ completedAt: 1 }, { expireAfterSeconds: 604800, sparse: true });

module.exports = mongoose.model('Order', orderSchema);