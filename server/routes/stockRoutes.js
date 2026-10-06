const express = require('express');
const Stock = require('../models/Stock');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  const { search, sortBy, category } = req.query;
  let stocks = await Stock.find().lean();

  if (search) {
    const needle = search.toLowerCase();
    stocks = stocks.filter((stock) =>
      stock.name.toLowerCase().includes(needle) ||
      stock.ticker.toLowerCase().includes(needle) ||
      stock.sector.toLowerCase().includes(needle)
    );
  }

  if (category && category !== 'all') {
    stocks = stocks.filter((stock) => stock.sector.toLowerCase() === category.toLowerCase());
  }

  if (sortBy === 'price') {
    stocks.sort((a, b) => b.price - a.price);
  }

  if (sortBy === 'change') {
    stocks.sort((a, b) => b.changePercent - a.changePercent);
  }

  res.json({ stocks });
});

router.get('/top-gainers', async (req, res) => {
  const stocks = await Stock.find().sort({ changePercent: -1 }).limit(5).lean();
  res.json({ stocks });
});

router.get('/top-losers', async (req, res) => {
  const stocks = await Stock.find().sort({ changePercent: 1 }).limit(5).lean();
  res.json({ stocks });
});

router.get('/trending', async (req, res) => {
  const stocks = await Stock.find().sort({ price: -1 }).limit(6).lean();
  res.json({ stocks });
});

router.get('/:ticker', async (req, res) => {
  const stock = await Stock.findOne({ ticker: String(req.params.ticker).toUpperCase() }).lean();

  if (!stock) {
    return res.status(404).json({ message: 'Stock not found.' });
  }

  const explain = {
    summary: `${stock.name} is currently trading at ₹${stock.price.toFixed(2)}. The stock is ${stock.changePercent >= 0 ? 'up' : 'down'} ${Math.abs(stock.changePercent).toFixed(2)}% today, with market momentum and sector sentiment playing a role in recent movement.`,
    simpleWords: [
      `What the company does: ${stock.description}`,
      `Why investors watch it: It is a major player in the ${stock.sector} sector with strong market visibility.`,
      `What can influence the stock: valuations, sector momentum, earnings updates, and broader market sentiment.`,
      `Major risks: sector pressure, earnings volatility, and macroeconomic shifts.`,
      `Important metrics: Market cap ${stock.marketCap}, P/E ${stock.pe}, EPS ${stock.eps}.`,
    ],
    riskIndicator: 'Moderate',
    educationalNote: 'Educational content is informational and not financial advice.'
  };

  return res.json({ stock, explain });
});

router.get('/:ticker/explain', protect, async (req, res) => {
  const stock = await Stock.findOne({ ticker: String(req.params.ticker).toUpperCase() }).lean();
  if (!stock) {
    return res.status(404).json({ message: 'Stock not found.' });
  }

  res.json({
    title: `Explain ${stock.ticker}`,
    summary: `${stock.name} is currently trading at ₹${stock.price.toFixed(2)}. The stock is ${stock.changePercent >= 0 ? 'up' : 'down'} ${Math.abs(stock.changePercent).toFixed(2)}% today. Its recent movement may be related to positive sector momentum and increased buying activity.`,
    simpleWords: [
      `What the company does: ${stock.description}`,
      `Why investors watch it: It has a significant role in ${stock.sector} and a visible market presence.`,
      `What could influence the stock: earnings reports, valuation trends, and sector-wide sentiment.`,
      `Major risks: competition, policy changes, and wider market volatility.`,
      `Important metrics: Market cap ${stock.marketCap}, P/E ${stock.pe}, 52-week range ₹${stock.week52Low} - ₹${stock.week52High}.`,
    ],
    educationalNote: 'This explanation is for educational purposes only and is not financial advice.'
  });
});

module.exports = router;
