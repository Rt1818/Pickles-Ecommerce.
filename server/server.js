const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const addressRoutes = require('./routes/address.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware
// ============================================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (dev)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// Routes
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Shanti Pickles API is running 🫙', timestamp: new Date().toISOString() });
});

app.get('/api/seed', async (req, res) => {
  try {
    const mysql = require('mysql2/promise');
    const fs = require('fs');
    const path = require('path');
    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT) || parseInt(process.env.DB_PORT) || 3306,
      user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
      password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'shanti_pickles',
      multipleStatements: true,
      ssl: { rejectUnauthorized: false }
    });
    const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
    const seed = fs.readFileSync(path.join(__dirname, 'db', 'seed.sql'), 'utf8');
    await conn.query(schema);
    await conn.query(seed);
    await conn.end();
    res.json({ message: 'Database seeded successfully on server!' });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/user', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use(errorHandler);

// ============================================
// Start server
// ============================================
app.listen(PORT, () => {
  console.log(`
  🫙 Shanti Pickles API Server
  ────────────────────────────
  Port:     ${PORT}
  Mode:     ${process.env.NODE_ENV || 'development'}
  Client:   ${process.env.CLIENT_URL || 'http://localhost:5173'}
  Health:   http://localhost:${PORT}/api/health
  ────────────────────────────
  `);
});

module.exports = app;
