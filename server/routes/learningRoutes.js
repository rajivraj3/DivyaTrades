const express = require('express');
const { appState } = require('../data/store');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ learning: appState.learning });
});

router.get('/:id', (req, res) => {
  const item = appState.learning.find((entry) => entry.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Learning topic not found.' });
  }
  res.json({ topic: item });
});

module.exports = router;
