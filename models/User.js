const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['main_admin', 'shop_admin'], default: 'shop_admin' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);