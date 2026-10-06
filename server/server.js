require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const orderRoutes = require('./routes/orderRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const newsRoutes = require('./routes/newsRoutes');
const learningRoutes = require('./routes/learningRoutes');
const journalRoutes = require('./routes/journalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = new Set(
  (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(
  cors({
    origin(origin, callback) {
      const isLocalViteOrigin = process.env.NODE_ENV !== 'production' && /^https?:\/\/(localhost|127\.0\.0\.1):517\d+$/.test(origin || '');
      if (!origin || allowedOrigins.has(origin) || isLocalViteOrigin) {
        return callback(null, true);
      }
      return callback(new Error('Origin is not allowed by CORS.'));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('dev'));
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DivyaTrades backend is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/watchlists', watchlistRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DivyaTrades server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB is required but could not be reached. Check MONGO_URI and database availability.');
    console.error(error.message);
    process.exit(1);
  });
