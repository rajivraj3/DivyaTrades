const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, (req, res) => {
  res.json({ entries: [...req.account.journaling].sort((a, b) => b.createdAt - a.createdAt) });
});

router.post('/', protect, async (req, res) => {
  const { stock, action, price, reason, outcome } = req.body;
  const normalizedAction = String(action || '').toUpperCase();
  if (!stock || !['BUY', 'SELL'].includes(normalizedAction) || !reason) {
    return res.status(400).json({ message: 'Stock, BUY or SELL action, and reason are required.' });
  }

  req.account.journaling.unshift({
    stock: String(stock).toUpperCase(),
    action: normalizedAction,
    price: Number(price || 0),
    reason,
    outcome: outcome || 'Notes captured for future review.',
  });
  await req.account.save();
  return res.status(201).json({ entry: req.account.journaling[0] });
});

module.exports = router;
