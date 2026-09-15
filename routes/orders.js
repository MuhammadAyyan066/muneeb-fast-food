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

// Handle /:id/status (PUT & PATCH)
const updateStatusHandler = async (req, res) => {
  try {
    const { status } = req.body;
    const updatePayload = { status };
    if (status === 'Done') {
      updatePayload.completedAt = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error updating status:', err);
    return res.status(500).json({ error: 'Failed to update status' });
  }
};

router.patch('/:id/status', updateStatusHandler);
router.put('/:id/status', updateStatusHandler);

// Handle direct /:id (PUT & PATCH)
const updateOrderHandler = async (req, res) => {
  try {
    const updatePayload = { ...req.body };
    if (req.body.status === 'Done') {
      updatePayload.completedAt = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    return res.status(500).json({ error: 'Failed to update order' });
  }
};

router.patch('/:id', updateOrderHandler);
router.put('/:id', updateOrderHandler);

// DELETE order by ID (For Remove button)
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.status(200).json({ message: 'Order removed successfully', id: req.params.id });
  } catch (err) {
    console.error('Error deleting order:', err);
    return res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;
