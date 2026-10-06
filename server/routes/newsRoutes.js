const express = require('express');
const { appState } = require('../data/store');

const router = express.Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  let news = [...appState.news];

  if (category && category !== 'all') {
    news = news.filter((item) => item.category.toLowerCase() === String(category).toLowerCase());
  }

  res.json({ news });
});

module.exports = router;
