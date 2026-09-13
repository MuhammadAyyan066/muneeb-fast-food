const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. GET ALL ORDERS (For Admin Dashboard)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error('>>> [ORDERS API] Error fetching orders:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch orders.' });
  }
});

// 2. CREATE NEW ORDER (From Frontend Cart)
router.post('/', async (req, res) => {
  console.log('>>> [ORDERS API] Request received:', req.body);

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

    if (!finalName) {
      return res.status(400).json({ error: 'Customer name is required.' });
    }
    if (!finalPhone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }
    if (!finalAddress) {
      return res.status(400).json({ error: 'Address is required.' });
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

    console.log('>>> [ORDERS API] Saving to Database...');
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    console.log('>>> [ORDERS API] Order saved successfully ID:', savedOrder._id);
    return res.status(201).json(savedOrder);

  } catch (error) {
    console.error('>>> [ORDERS API] Error saving order:', error);
    return res.status(500).json({ error: error.message || 'Failed to place order.' });
  }
});

// 3. UPDATE ORDER STATUS HANDLER (Supports both /:id and /:id/status)
const updateStatusHandler = async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = { status };

    if (status === 'Completed' || status === 'Done') {
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

    console.log(`>>> [ORDERS API] Order ${req.params.id} updated to: ${status}`);
    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('>>> [ORDERS API] Error updating status:', error);
    return res.status(500).json({ error: error.message || 'Failed to update order status.' });
  }
};

router.patch('/:id/status', updateStatusHandler);
router.patch('/:id', updateStatusHandler);

module.exports = router;