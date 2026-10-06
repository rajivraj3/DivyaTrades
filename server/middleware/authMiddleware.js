const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const TradingAccount = require('../models/TradingAccount');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'Please log in to continue.' });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'divya_trades_demo_secret_2026');
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }

  if (!mongoose.isValidObjectId(decoded.id)) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found.' });

    const account = await TradingAccount.findOne({ userId: user._id });
    if (!account) return res.status(401).json({ message: 'Trading account not found.' });

    req.user = user;
    req.account = account;
    next();
  } catch (error) {
    next(error);
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};

module.exports = { protect, adminOnly };
