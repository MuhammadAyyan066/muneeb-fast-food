const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 1. GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${req.query.category}$`, 'i');
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch products.' });
  }
});

// 2. CREATE PRODUCT
router.post('/', async (req, res) => {
  try {
    const { name, category, description, image, price, prices, sizes } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required fields.' });
    }

    const isPizza = category.toLowerCase().includes('pizza');
    let sizesArray = [];

    // 1. Agar admin panel ne direct sizes array bheja ho
    if (Array.isArray(sizes) && sizes.length > 0) {
      sizesArray = sizes
        .filter(s => Number(s.price) > 0)
        .map(s => ({ size: s.size, price: Number(s.price) }));
    } 
    // 2. Agar admin panel ne prices object { small, medium, large, family } bheja ho
    else if (isPizza && prices) {
      if (Number(prices.small) > 0) sizesArray.push({ size: 'Small', price: Number(prices.small) });
      if (Number(prices.medium) > 0) sizesArray.push({ size: 'Medium', price: Number(prices.medium) });
      if (Number(prices.large) > 0) sizesArray.push({ size: 'Large', price: Number(prices.large) });
      if (Number(prices.family) > 0) sizesArray.push({ size: 'Family', price: Number(prices.family) });
    }

    const cleanPrices = {
      small: Number(prices?.small) || 0,
      medium: Number(prices?.medium) || 0,
      large: Number(prices?.large) || 0,
      family: Number(prices?.family) || 0
    };

    const product = new Product({
      name: name.trim(),
      category: category.trim(),
      description: description ? description.trim() : '',
      image: image ? image.trim() : '',
      hasSizes: isPizza && sizesArray.length > 0,
      price: isPizza ? 0 : (Number(price) || 0),
      prices: isPizza ? cleanPrices : {},
      sizes: sizesArray
    });

    const saved = await product.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving product:', err);
    return res.status(500).json({ error: err.message || 'Failed to save product.' });
  }
});

// 3. DELETE PRODUCT
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    return res.status(200).json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ error: err.message || 'Failed to delete product.' });
  }
});

module.exports = router;