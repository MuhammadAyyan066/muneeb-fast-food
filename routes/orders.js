const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST new order
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    
    // Normalize fields so schema mismatches never fail
    const orderData = {
      ...body,
      customerName: body.customerName || body.name || 'Guest Customer',
      customerPhone: body.customerPhone || body.phone || '0000000000',
      deliveryAddress: body.deliveryAddress || body.address || 'Fatehpur',
      totalAmount: Number(body.totalAmount || body.total || 0),
      items: Array.isArray(body.items) ? body.items : []
    };

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();
    return res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error placing order:', err.message || err);
    return res.status(500).json({ error: err.message || 'Failed to place order' });
  }
});

// PATCH / PUT order status
router.patch('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    return res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
