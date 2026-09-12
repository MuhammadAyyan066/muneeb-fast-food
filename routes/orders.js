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
            phone: finalPhone,              // Schema key satisfy karega
            customerPhone: finalPhone,      // Backward compatibility
            address: finalAddress,          // Schema key satisfy karega
            deliveryAddress: finalAddress,  // Backward compatibility
            locationCoords: {
                lat: locationCoords?.lat ? Number(locationCoords.lat) : null,
                lng: locationCoords?.lng ? Number(locationCoords.lng) : null
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
        console.error("Error creating order:", err);
        return res.status(400).json({ error: err.message || 'Failed to place order.' });
    }
});

// 2. Get All Orders (Shop Admin Dashboard)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (err) {
        console.error("Error fetching orders:", err);
        return res.status(500).json({ error: 'Server error retrieving orders.' });
    }
});

// 3. Update Order Status (Pending, In Delivery, Delivering, Done, Cancelled)
router.patch('/:id/status', async (req, res) => {
    try {
        let { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required.' });
        }

        // Clean & normalize status string
        status = status.trim();

        // Allowed statuses list
        const validStatuses = ['Pending', 'In Delivery', 'Delivering', 'Out for Delivery', 'Done', 'Cancelled'];

        if (!validStatuses.map(s => s.toLowerCase()).includes(status.toLowerCase())) {
            return res.status(400).json({ 
                error: `Invalid status. Allowed values: Pending, In Delivery, Done, Cancelled` 
            });
        }

        // Schema match fallback: Agar schema me 'Delivering' ho aur request me 'In Delivery', ya vice versa
        const schemaStatusEnum = Order.schema.path('status')?.enumValues || validStatuses;
        
        let targetStatus = status;
        const matchedEnum = schemaStatusEnum.find(e => e.toLowerCase() === status.toLowerCase());
        
        if (matchedEnum) {
            targetStatus = matchedEnum;
        } else if (status.toLowerCase() === 'in delivery' && schemaStatusEnum.includes('Delivering')) {
            targetStatus = 'Delivering';
        } else if (status.toLowerCase() === 'delivering' && schemaStatusEnum.includes('In Delivery')) {
            targetStatus = 'In Delivery';
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: targetStatus },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found with provided ID.' });
        }

        return res.status(200).json(updatedOrder);
    } catch (err) {
        console.error("Error updating order status:", err);
        return res.status(400).json({ error: err.message || 'Could not update order status.' });
    }
});

module.exports = router;