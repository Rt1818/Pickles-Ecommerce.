const db = require('../db/connection');
const bcrypt = require('bcryptjs');
const { sanitizeUser } = require('../utils/helpers');

/**
 * GET /api/profile
 */
async function getProfile(req, res) {
  res.json({ user: req.user });
}

/**
 * PUT /api/profile
 * Body: { name, phone, avatar_url }
 */
async function updateProfile(req, res, next) {
  try {
    const { name, phone, avatar_url } = req.body;

    await db.query(
      'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), avatar_url = COALESCE(?, avatar_url) WHERE id = ?',
      [name || null, phone || null, avatar_url || null, req.user.id]
    );

    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: 'Profile updated.', user: sanitizeUser(rows[0]) });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/profile/password
 * Body: { current_password, new_password }
 */
async function changePassword(req, res, next) {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current and new passwords are required.' });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    // Verify current password
    const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(new_password, salt);

    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, changePassword };
