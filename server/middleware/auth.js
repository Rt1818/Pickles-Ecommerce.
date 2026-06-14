const { verifyToken } = require('../utils/jwt');
const db = require('../db/connection');

/**
 * Middleware to verify JWT token and attach user to request.
 * Sends 401 if token is missing or invalid.
 */
async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = header.split(' ')[1];
    const decoded = verifyToken(token);

    // Fetch user from DB to ensure they still exist
    const [rows] = await db.query('SELECT id, name, email, phone, avatar_url, role FROM users WHERE id = ?', [decoded.id]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

/**
 * Optional auth — attaches user if token is present, but doesn't block.
 */
async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const token = header.split(' ')[1];
      const decoded = verifyToken(token);
      const [rows] = await db.query('SELECT id, name, email, phone, avatar_url, role FROM users WHERE id = ?', [decoded.id]);
      if (rows.length > 0) {
        req.user = rows[0];
      }
    }
  } catch (err) {
    // Silently ignore — user just won't be attached
  }
  next();
}

module.exports = { auth, optionalAuth };
