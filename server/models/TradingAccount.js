const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema(
  {
    stock: { type: String, required: true, uppercase: true },
    quantity: { type: Number, required: true, min: 0 },
    averagePrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  stock: { type: String, required: true },
  side: { type: String, required: true, enum: ['BUY', 'SELL'] },
  quantity: { type: Number, required: true, min: 1 },
  orderType: { type: String, default: 'Market' },
  price: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  realizedPnl: { type: Number, default: 0 },
  status: { type: String, default: 'Completed' },
  executionType: { type: String, default: 'SIMULATED', enum: ['SIMULATED'] },
  createdAt: { type: Date, default: Date.now },
});

const transactionSchema = new mongoose.Schema({
  stock: { type: String, required: true },
  side: { type: String, required: true, enum: ['BUY', 'SELL'] },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  realizedPnl: { type: Number, default: 0 },
  status: { type: String, default: 'Completed' },
  createdAt: { type: Date, default: Date.now },
});

const watchlistSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  items: { type: [String], default: [] },
});

const journalSchema = new mongoose.Schema({
  stock: { type: String, required: true, uppercase: true },
  action: { type: String, required: true, enum: ['BUY', 'SELL'] },
  price: { type: Number, default: 0 },
  reason: { type: String, required: true },
  outcome: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const tradingAccountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    virtualCash: { type: Number, default: 1000000, min: 0 },
    realizedPnl: { type: Number, default: 0 },
    holdings: { type: [holdingSchema], default: [] },
    orders: { type: [orderSchema], default: [] },
    transactions: { type: [transactionSchema], default: [] },
    watchlists: { type: [watchlistSchema], default: [] },
    journaling: { type: [journalSchema], default: [] },
  },
  { timestamps: true, optimisticConcurrency: true }
);

module.exports = mongoose.models.TradingAccount || mongoose.model('TradingAccount', tradingAccountSchema);