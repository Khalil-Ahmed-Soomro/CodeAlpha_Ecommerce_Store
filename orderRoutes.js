const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

// Place Order
router.post('/', async (req, res) => {
  const { userId, items, totalAmount, shippingAddress } = req.body;
  try {
    const db = getDB();
    const itemsJson = JSON.stringify(items); // Array ko JSON String banayein

    const [result] = await db.query(
      'INSERT INTO orders (user_id, items, total_amount, shipping_address) VALUES (?, ?, ?, ?)',
      [userId, itemsJson, totalAmount, shippingAddress]
    );

    res.status(201).json({ message: 'Order placed successfully!', orderId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;