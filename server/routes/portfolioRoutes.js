const express = require('express');
const Stock = require('../models/Stock');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const roundMoney = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100;

const getValuedHoldings = async (account) => {
  const tickers = account.holdings.map((holding) => holding.stock);
  const stocks = await Stock.find({ ticker: { $in: tickers } }).lean();
  const stockByTicker = new Map(stocks.map((stock) => [stock.ticker, stock]));

  return account.holdings.map((holding) => {
    const stock = stockByTicker.get(holding.stock);
    const currentPrice = stock?.price ?? holding.averagePrice;
    const investedAmount = roundMoney(holding.averagePrice * holding.quantity);
    const currentValue = roundMoney(currentPrice * holding.quantity);
    const pnl = roundMoney(currentValue - investedAmount);
    return {
      stock: holding.stock,
      quantity: holding.quantity,
      sector: stock?.sector || 'Other',
      averagePrice: holding.averagePrice,
      currentPrice,
      investedAmount,
      currentValue,
      pnl,
      pnlPercent: investedAmount ? roundMoney((pnl / investedAmount) * 100) : 0,
      priceType: 'SIMULATED',
    };
  });
};

router.get('/summary', protect, async (req, res) => {
  const holdings = await getValuedHoldings(req.account);
  const tickers = holdings.map((holding) => holding.stock);
  const stocks = await Stock.find({ ticker: { $in: tickers } }).lean();
  const stockByTicker = new Map(stocks.map((stock) => [stock.ticker, stock]));
  const investedAmount = roundMoney(holdings.reduce((sum, holding) => sum + holding.investedAmount, 0));
  const holdingsValue = roundMoney(holdings.reduce((sum, holding) => sum + holding.currentValue, 0));
  const unrealizedPnl = roundMoney(holdings.reduce((sum, holding) => sum + holding.pnl, 0));
  const todayProfit = roundMoney(holdings.reduce((sum, holding) => {
    const stock = stockByTicker.get(holding.stock);
    return sum + ((stock ? stock.price - stock.previousClose : 0) * holding.quantity);
  }, 0));
  const totalProfit = roundMoney(req.account.realizedPnl + unrealizedPnl);

  res.json({
    totalPortfolioValue: roundMoney(req.account.virtualCash + holdingsValue),
    currentPortfolioValue: holdingsValue,
    todayProfit,
    totalProfit,
    realizedPnl: req.account.realizedPnl,
    unrealizedPnl,
    investedAmount,
    availableCash: req.account.virtualCash,
    returnPercent: investedAmount ? roundMoney((totalProfit / investedAmount) * 100) : 0,
    priceType: 'SIMULATED',
  });
});

router.get('/holdings', protect, async (req, res) => {
  res.json({ holdings: await getValuedHoldings(req.account), priceType: 'SIMULATED' });
});

module.exports = router;
