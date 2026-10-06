const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Stock = require('../models/Stock');
const TradingAccount = require('../models/TradingAccount');

const router = express.Router();

router.get('/dashboard', protect, adminOnly, async (req, res) => {
  const [users, accounts, stocks] = await Promise.all([
    User.find().select('name email role createdAt').lean(),
    TradingAccount.find().lean(),
    Stock.find().sort({ price: -1 }).limit(6).lean(),
  ]);
  const orders = accounts.flatMap((account) => account.orders.map((order) => ({ ...order, userId: account.userId })));
  const mostTraded = orders.reduce((counts, order) => {
    counts[order.stock] = (counts[order.stock] || 0) + 1;
    return counts;
  }, {});

  res.json({
    metrics: {
      totalUsers: users.length,
      activeUsers: users.length,
      totalTrades: orders.length,
      totalPortfolioValue: accounts.reduce((sum, account) => sum + account.virtualCash, 0),
      mostTradedStocks: Object.entries(mostTraded).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([ticker]) => ticker),
    },
    stocks,
    users,
    orders: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
  });
});

module.exports = router;
