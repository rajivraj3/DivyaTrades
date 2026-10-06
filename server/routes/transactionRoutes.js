const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, (req, res) => {
  const transactions = [...req.account.transactions]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((transaction) => ({
      _id: transaction._id,
      stock: transaction.stock,
      type: transaction.side,
      quantity: transaction.quantity,
      price: transaction.price,
      total: transaction.total,
      realizedPnl: transaction.realizedPnl,
      status: transaction.status,
      date: transaction.createdAt,
    }));
  res.json({ transactions, executionType: 'SIMULATED' });
});

router.get('/summary', protect, (req, res) => {
  const transactions = req.account.transactions;
  const buyCount = transactions.filter((item) => item.side === 'BUY').length;
  const sellCount = transactions.filter((item) => item.side === 'SELL').length;
  res.json({
    totalTransactions: transactions.length,
    buyCount,
    sellCount,
    netValue: transactions.reduce((sum, item) => sum + (item.side === 'BUY' ? -item.total : item.total), 0),
    realizedPnl: req.account.realizedPnl,
  });
});

module.exports = router;
