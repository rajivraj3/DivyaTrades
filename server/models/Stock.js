const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    ticker: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    previousClose: { type: Number, required: true, min: 0 },
    sector: { type: String, required: true },
    marketCap: String,
    pe: Number,
    eps: Number,
    week52High: Number,
    week52Low: Number,
    change: Number,
    changePercent: Number,
    volatility: String,
    risk: String,
    marketStatus: String,
    sparkline: [Number],
    description: String,
    priceType: { type: String, default: 'SIMULATED', enum: ['SIMULATED'] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Stock || mongoose.model('Stock', stockSchema);