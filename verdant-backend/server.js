require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/auth');
const plantRoutes = require('./routes/plants');
const noteRoutes = require('./routes/notes');
const favoriteRoutes = require('./routes/favorites');
const glossaryRoutes = require('./routes/glossary');

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet());

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ─── General Middleware ──────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🌿 Verdant API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/glossary', glossaryRoutes);

// ─── 404 & Error Handlers ────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Verdant API running on port ${PORT} [${process.env.NODE_ENV}]`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  console.log("Mongo URI:", process.env.MONGODB_URI);
});
