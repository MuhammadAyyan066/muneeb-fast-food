const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. Create New Order (Customer Side)
router.post('/', async (req, res) => {
    try {
        const {
            customerName,
            customerPhone,
            phone,           // fallback key
            deliveryAddress,
            address,         // fallback key
            locationCoords,
            items,
            totalAmount
        } = req.body;

        // Resolve field naming differences
        const finalPhone = (customerPhone || phone || '').trim();
        const finalAddress = (deliveryAddress || address || '').trim();
        const finalName = (customerName || '').trim();

        // Server-side validation
        if (!finalName) {
            return res.status(400).json({ error: 'Customer name is required.' });
        }
        if (!finalPhone) {
            return res.status(400).json({ error: 'Customer phone number is required.' });
        }
        if (!finalAddress) {
            return res.status(400).json({ error: 'Delivery address is required.' });
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Cart cannot be empty.' });
        }

        const newOrder = new Order({
            customerName: finalName,
            customerPhone: finalPhone,
            deliveryAddress: finalAddress,
            locationCoords: {
                lat: locationCoords?.lat || null,
                lng: locationCoords?.lng || null
            },
            items: items.map(item => ({
                name: item.name,
                price: Number(item.price) || 0,
                quantity: Number(item.quantity) || 1
            })),
            totalAmount: Number(totalAmount) || 0,
            status: 'Pending'
        });

        const savedOrder = await newOrder.save();
        return res.status(201).json(savedOrder);
    } catch (err) {
        return res.status(400).json({ error: err.message || 'Failed to place order.' });
    }
});

// 2. Get All Orders (Shop Admin Dashboard)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json({ error: 'Server error retrieving orders.' });
    }
});

// 3. Update Order Status (Pending, In Delivery, Done, Cancelled)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'In Delivery', 'Done', 'Cancelled'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: `Invalid status. Allowed values: ${validStatuses.join(', ')}` 
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true } // Ensures schema enum validation runs
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found with provided ID.' });
        }

        return res.status(200).json(updatedOrder);
    } catch (err) {
        return res.status(400).json({ error: err.message || 'Could not update order status.' });
    }
});

module.exports = router;