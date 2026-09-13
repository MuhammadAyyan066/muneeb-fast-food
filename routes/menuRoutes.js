const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const MenuItem = require('../models/MenuItem'); // Make sure sizes array is added in this schema

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 1. GET /api/menu (Fetch all items for admin & storefront)
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve menu items.' });
  }
});

// 2. POST /api/admin/items (Create new item with Multi-Size Support)
router.post('/admin/items', upload.single('imageFile'), async (req, res) => {
  try {
    const { name, category, price, desc, description, tag, imageUrl, prices } = req.body;
    let finalImage = imageUrl;
    if (req.file) {
      finalImage = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    if (!name || !category || !finalImage) {
      return res.status(400).json({ error: 'Name, category, and image are mandatory.' });
    }

    const isPizza = category.toLowerCase().includes('pizza');
    let sizesArray = [];

    // Parse prices object if sent via FormData string
    let parsedPrices = {};
    if (prices) {
      try {
        parsedPrices = typeof prices === 'string' ? JSON.parse(prices) : prices;
      } catch (e) {
        console.error("Error parsing prices:", e);
      }
    }

    if (isPizza) {
      if (Number(parsedPrices.small) > 0) sizesArray.push({ size: 'Small', price: Number(parsedPrices.small) });
      if (Number(parsedPrices.medium) > 0) sizesArray.push({ size: 'Medium', price: Number(parsedPrices.medium) });
      if (Number(parsedPrices.large) > 0) sizesArray.push({ size: 'Large', price: Number(parsedPrices.large) });
      if (Number(parsedPrices.family) > 0) sizesArray.push({ size: 'Family', price: Number(parsedPrices.family) });
    }

    // Determine final single price format
    let finalPrice = '0/-';
    if (!isPizza && price) {
      finalPrice = price.toString().includes('/-') ? price.toString().trim() : `${price.toString().trim()}/-`;
    }

    const newItem = new MenuItem({
      name: name.trim(),
      category: category.trim(),
      price: finalPrice,
      desc: (desc || description || '').trim(),
      image: finalImage,
      tag: tag || 'Special',
      hasSizes: isPizza && sizesArray.length > 0,
      sizes: sizesArray
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create item.' });
  }
});

// 3. PUT /api/admin/items/:id (Edit item & prices)
router.put('/admin/items/:id', upload.single('imageFile'), async (req, res) => {
  try {
    const { name, category, price, desc, description, tag, imageUrl, prices } = req.body;
    const updatePayload = {};

    if (name) updatePayload.name = name.trim();
    if (desc !== undefined || description !== undefined) updatePayload.desc = (desc || description || '').trim();
    if (tag) updatePayload.tag = tag.trim();

    if (req.file) {
      updatePayload.image = `http://localhost:5000/uploads/${req.file.filename}`;
    } else if (imageUrl && imageUrl.trim()) {
      updatePayload.image = imageUrl.trim();
    }

    // Handle Category & Multi-size logic
    if (category) {
      updatePayload.category = category.trim();
      const isPizza = updatePayload.category.toLowerCase().includes('pizza');

      if (isPizza) {
        let sizesArray = [];
        let parsedPrices = {};
        if (prices) {
          try {
            parsedPrices = typeof prices === 'string' ? JSON.parse(prices) : prices;
          } catch (e) {}
        }

        if (Number(parsedPrices.small) > 0) sizesArray.push({ size: 'Small', price: Number(parsedPrices.small) });
        if (Number(parsedPrices.medium) > 0) sizesArray.push({ size: 'Medium', price: Number(parsedPrices.medium) });
        if (Number(parsedPrices.large) > 0) sizesArray.push({ size: 'Large', price: Number(parsedPrices.large) });
        if (Number(parsedPrices.family) > 0) sizesArray.push({ size: 'Family', price: Number(parsedPrices.family) });

        updatePayload.hasSizes = sizesArray.length > 0;
        updatePayload.sizes = sizesArray;
        updatePayload.price = '0/-'; // Reset single price for pizzas
      } else {
        updatePayload.hasSizes = false;
        updatePayload.sizes = [];
        if (price) {
          updatePayload.price = price.toString().includes('/-') ? price.toString().trim() : `${price.toString().trim()}/-`;
        }
      }
    }

    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update item.' });
  }
});

// 4. PUT /api/admin/categories (Batch rename category across all items)
router.put('/admin/categories', async (req, res) => {
  try {
    const { oldCategory, newCategory } = req.body;
    if (!oldCategory || !newCategory || !newCategory.trim()) {
      return res.status(400).json({ error: 'Both old and new category names are required.' });
    }

    const result = await MenuItem.updateMany(
      { category: oldCategory.trim() },
      { $set: { category: newCategory.trim() } }
    );

    res.status(200).json({ 
      message: `Category '${oldCategory}' renamed to '${newCategory}' successfully.`,
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to rename category.' });
  }
});

// 5. DELETE /api/admin/items/:id (Delete item)
router.delete('/admin/items/:id', async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }
    res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item.' });
  }
});

module.exports = router;