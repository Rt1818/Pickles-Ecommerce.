const db = require('../db/connection');

/**
 * GET /api/addresses
 */
async function getAddresses(req, res, next) {
  try {
    const [addresses] = await db.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );
    res.json({ addresses });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/addresses
 */
async function addAddress(req, res, next) {
  try {
    const { label, name, phone, address_line1, address_line2, city, state, pincode, is_default } = req.body;

    if (!name || !phone || !address_line1 || !city || !state || !pincode) {
      return res.status(400).json({ error: 'Name, phone, address, city, state, and pincode are required.' });
    }

    // If setting as default, unset other defaults first
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [req.user.id]);
    }

    const [result] = await db.query(
      `INSERT INTO addresses (user_id, label, name, phone, address_line1, address_line2, city, state, pincode, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, label || 'Home', name, phone, address_line1, address_line2 || null, city, state, pincode, is_default || false]
    );

    const [newAddr] = await db.query('SELECT * FROM addresses WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Address added.', address: newAddr[0] });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/addresses/:id
 */
async function updateAddress(req, res, next) {
  try {
    const { label, name, phone, address_line1, address_line2, city, state, pincode, is_default } = req.body;

    // Verify ownership
    const [existing] = await db.query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Address not found.' });
    }

    if (is_default) {
      await db.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [req.user.id]);
    }

    await db.query(
      `UPDATE addresses SET label = ?, name = ?, phone = ?, address_line1 = ?, address_line2 = ?,
       city = ?, state = ?, pincode = ?, is_default = ? WHERE id = ? AND user_id = ?`,
      [label || existing[0].label, name || existing[0].name, phone || existing[0].phone,
       address_line1 || existing[0].address_line1, address_line2 !== undefined ? address_line2 : existing[0].address_line2,
       city || existing[0].city, state || existing[0].state, pincode || existing[0].pincode,
       is_default !== undefined ? is_default : existing[0].is_default,
       req.params.id, req.user.id]
    );

    res.json({ message: 'Address updated.' });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/addresses/:id
 */
async function deleteAddress(req, res, next) {
  try {
    const [result] = await db.query(
      'DELETE FROM addresses WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Address not found.' });
    }
    res.json({ message: 'Address deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
