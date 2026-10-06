const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const TradingAccount = require('../models/TradingAccount');
const { generateToken } = require('../utils/auth');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const sanitiseUser = (user, account) => ({
  _id: String(user._id),
  id: String(user._id),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  virtualCash: account.virtualCash,
  profilePicture: user.profilePicture,
  createdAt: user.createdAt,
});

router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    phone: phone || '',
    password: await bcrypt.hash(password, 10),
  });

  try {
    const account = await TradingAccount.create({ userId: user._id, virtualCash: 1000000 });
    return res.status(201).json({ token: generateToken(user._id), user: sanitiseUser(user, account) });
  } catch (error) {
    await User.deleteOne({ _id: user._id });
    throw error;
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const account = await TradingAccount.findOneAndUpdate(
    { userId: user._id },
    { $setOnInsert: { userId: user._id, virtualCash: 1000000 } },
    { upsert: true, new: true }
  );
  return res.json({ token: generateToken(user._id), user: sanitiseUser(user, account) });
});

router.get('/me', protect, (req, res) => {
  return res.json({ user: sanitiseUser(req.user, req.account) });
});

router.post('/forgot-password', (req, res) => {
  if (!req.body.email) return res.status(400).json({ message: 'Email is required.' });
  return res.json({ message: 'Password reset is not configured for this paper-trading demo.' });
});

router.post('/reset-password', (req, res) => {
  if (!req.body.token || !req.body.password) {
    return res.status(400).json({ message: 'Reset token and new password are required.' });
  }
  return res.status(501).json({ message: 'Password reset is not configured for this paper-trading demo.' });
});

module.exports = router;
