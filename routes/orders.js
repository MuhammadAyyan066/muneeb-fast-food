const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. GET ALL ORDERS
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error('>>> [ORDERS API] Error fetching orders:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch orders.' });
  }
});

// 2. CREATE ORDER
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      phone,
      deliveryAddress,
      address,
      locationCoords,
      items,
      totalAmount
    } = req.body;

    const finalName = (customerName || '').trim();
    const finalPhone = (customerPhone || phone || '').trim();
    const finalAddress = (deliveryAddress || address || '').trim();

    if (!finalName || !finalPhone || !finalAddress) {
      return res.status(400).json({ error: 'Customer name, phone, and address are required.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const orderData = {
      customerName: finalName,
      phone: finalPhone,
      customerPhone: finalPhone,
      address: finalAddress,
      deliveryAddress: finalAddress,
      locationCoords: locationCoords || { lat: null, lng: null },
      items: items.map(i => ({
        name: i.name,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1
      })),
      totalAmount: Number(totalAmount) || 0,
      status: 'Pending'
    };

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();
    return res.status(201).json(savedOrder);
  } catch (error) {
    console.error('>>> [ORDERS API] Error saving order:', error);
    return res.status(500).json({ error: error.message || 'Failed to place order.' });
  }
});

// 3. UPDATE ORDER STATUS (PATCH /:id or /:id/status)
const updateStatusHandler = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Processing', 'Out for Delivery', 'Done'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
    }

    const updateData = { status };
    if (status === 'Done') {
      updateData.completedAt = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('>>> [ORDERS API] Error updating status:', error);
    return res.status(500).json({ error: error.message || 'Failed to update order status.' });
  }
};

router.patch('/:id/status', updateStatusHandler);
router.patch('/:id', updateStatusHandler);

// 4. DELETE ORDER (DELETE /:id)
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Optional validation: Ensure only completed orders can be removed
    if (order.status !== 'Done') {
      return res.status(400).json({ error: 'Only completed ("Done") orders can be removed from dashboard.' });
    }

    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Order removed successfully.', id: req.params.id });
  } catch (error) {
    console.error('>>> [ORDERS API] Error deleting order:', error);
    return res.status(500).json({ error: error.message || 'Failed to remove order.' });
  }
});
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, address, items, totalAmount } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const formattedItems = items.map(item => ({
      productId: item.productId || null,
      name: item.name,
      size: item.size || null,
      price: Number(item.price),
      quantity: Number(item.quantity) || 1
    }));

    const newOrder = new Order({
      customerName,
      phone,
      address,
      items: formattedItems,
      totalAmount: Number(totalAmount),
      status: 'Pending'
    });

    const savedOrder = await newOrder.save();
    return res.status(201).json(savedOrder);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;