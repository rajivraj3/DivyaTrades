const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Stock = require('../models/Stock');
const TradingAccount = require('../models/TradingAccount');
const { stockSeed } = require('../data/store');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('Set MONGO_URI in server/.env before starting the backend.');
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  await Stock.bulkWrite(
    stockSeed.map((stock) => ({
      updateOne: {
        filter: { ticker: stock.ticker },
        update: { $setOnInsert: { ...stock, priceType: 'SIMULATED' } },
        upsert: true,
      },
    }))
  );

  const email = (process.env.DEMO_EMAIL || 'demo@divyatrades.com').toLowerCase();
  let demoUser = await User.findOne({ email });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Aarav Sharma',
      email,
      phone: '+91 98765 43210',
      password: await bcrypt.hash(process.env.DEMO_PASSWORD || 'Demo@123', 10),
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    });
  }

  await TradingAccount.updateOne(
    { userId: demoUser._id },
    { $setOnInsert: { userId: demoUser._id, virtualCash: 1000000, watchlists: [
      { name: 'My Stocks', items: ['RELIANCE', 'TCS', 'INFY'] },
      { name: 'Long Term', items: ['HDFCBANK', 'ITC', 'BHARTIARTL'] },
      { name: 'Tech Stocks', items: ['TCS', 'INFY', 'WIPRO'] },
    ] } },
    { upsert: true }
  );

  console.log('MongoDB connected; simulated market data and demo account are ready.');
};

module.exports = { connectDB };