const express = require('express');
const Stock = require('../models/Stock');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, (req, res) => {
  const watchlists = req.account.watchlists.map((watchlist) => ({
    id: String(watchlist._id),
    name: watchlist.name,
    items: watchlist.items,
  }));
  res.json({ watchlists });
});

router.post('/', protect, async (req, res) => {
  const { name, stock } = req.body;
  const ticker = String(stock || '').trim().toUpperCase();
  if (!name || !ticker) {
    return res.status(400).json({ message: 'Watchlist name and stock are required.' });
  }
  if (!(await Stock.exists({ ticker }))) return res.status(404).json({ message: 'Stock not found.' });

  req.account.watchlists.push({ name: String(name).trim(), items: [ticker] });
  await req.account.save();
  const watchlist = req.account.watchlists[req.account.watchlists.length - 1];
  return res.status(201).json({ watchlist: { id: String(watchlist._id), name: watchlist.name, items: watchlist.items } });
});

router.post('/:id/add', protect, async (req, res) => {
  const ticker = String(req.body.stock || '').trim().toUpperCase();
  if (!ticker) return res.status(400).json({ message: 'Stock is required.' });
  if (!(await Stock.exists({ ticker }))) return res.status(404).json({ message: 'Stock not found.' });

  const watchlist = req.account.watchlists.id(req.params.id);
  if (!watchlist) return res.status(404).json({ message: 'Watchlist not found.' });
  if (!watchlist.items.includes(ticker)) {
    watchlist.items.push(ticker);
    await req.account.save();
  }
  return res.json({ watchlist: { id: String(watchlist._id), name: watchlist.name, items: watchlist.items } });
});

module.exports = router;
