const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

// Get all products
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const [products] = await db.query('SELECT * FROM products');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new product
router.post('/', async (req, res) => {
  const { name, price, description, category, image } = req.body;
  try {
    const db = getDB();
    const [result] = await db.query(
      'INSERT INTO products (name, price, description, category, image) VALUES (?, ?, ?, ?, ?)',
      [name, price, description, category, image]
    );
    res.status(201).json({ id: result.insertId, name, price, description, category, image });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;