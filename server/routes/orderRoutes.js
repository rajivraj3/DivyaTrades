const express = require('express');
const Stock = require('../models/Stock');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const roundMoney = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100;

router.get('/history', protect, (req, res) => {
  const orders = [...req.account.orders].sort((a, b) => b.createdAt - a.createdAt);
  res.json({ orders, executionType: 'SIMULATED' });
});

router.post('/place', protect, async (req, res) => {
  const ticker = String(req.body.stock || '').trim().toUpperCase();
  const side = String(req.body.side || '').toUpperCase();
  const quantity = Number(req.body.quantity);

  if (!ticker || !['BUY', 'SELL'].includes(side)) {
    return res.status(400).json({ message: 'A valid stock and BUY or SELL side are required.' });
  }
  if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive whole number of shares.' });
  }

  const stock = await Stock.findOne({ ticker }).lean();
  if (!stock) return res.status(404).json({ message: 'Stock not found.' });

  const price = roundMoney(stock.price);
  const total = roundMoney(price * quantity);
  let realizedPnl = 0;
  const holdingIndex = req.account.holdings.findIndex((holding) => holding.stock === ticker);

  if (side === 'BUY') {
    if (req.account.virtualCash < total) {
      return res.status(400).json({ message: 'Insufficient virtual cash for this simulated order.' });
    }

    req.account.virtualCash = roundMoney(req.account.virtualCash - total);
    if (holdingIndex >= 0) {
      const holding = req.account.holdings[holdingIndex];
      const combinedQuantity = holding.quantity + quantity;
      holding.averagePrice = roundMoney(((holding.averagePrice * holding.quantity) + total) / combinedQuantity);
      holding.quantity = combinedQuantity;
    } else {
      req.account.holdings.push({ stock: ticker, quantity, averagePrice: price });
    }
  } else {
    if (holdingIndex < 0 || req.account.holdings[holdingIndex].quantity < quantity) {
      return res.status(400).json({ message: 'You do not have enough shares to sell.' });
    }

    const holding = req.account.holdings[holdingIndex];
    realizedPnl = roundMoney((price - holding.averagePrice) * quantity);
    req.account.virtualCash = roundMoney(req.account.virtualCash + total);
    req.account.realizedPnl = roundMoney(req.account.realizedPnl + realizedPnl);
    holding.quantity -= quantity;
    if (holding.quantity === 0) req.account.holdings.splice(holdingIndex, 1);
  }

  const trade = {
    stock: ticker,
    side,
    quantity,
    orderType: 'Market',
    price,
    total,
    realizedPnl,
    status: 'Completed',
    executionType: 'SIMULATED',
    createdAt: new Date(),
  };
  req.account.orders.unshift(trade);
  req.account.transactions.unshift({
    stock: ticker,
    side,
    quantity,
    price,
    total,
    realizedPnl,
    status: 'Completed',
    createdAt: trade.createdAt,
  });

  try {
    await req.account.save();
  } catch (error) {
    if (error.name === 'VersionError') {
      return res.status(409).json({ message: 'Your account changed during this trade. Refresh and try again.' });
    }
    throw error;
  }

  return res.status(201).json({
    message: `${side} paper order placed successfully. No real money or broker was used.`,
    order: req.account.orders[0],
    remainingCash: req.account.virtualCash,
    realizedPnl,
    executionType: 'SIMULATED',
  });
});

module.exports = router;
