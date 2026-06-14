const db = require('../db/connection');

/**
 * POST /api/reviews
 * Body: { product_id, rating, comment }
 */
async function addReview(req, res, next) {
  try {
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({ error: 'Product ID and rating are required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    // Check if product exists
    const [product] = await db.query('SELECT id FROM products WHERE id = ?', [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Check if user already reviewed this product
    const [existing] = await db.query(
      'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );
    if (existing.length > 0) {
      // Update existing review
      await db.query(
        'UPDATE reviews SET rating = ?, comment = ? WHERE user_id = ? AND product_id = ?',
        [rating, comment || null, req.user.id, product_id]
      );
    } else {
      // Insert new review
      await db.query(
        'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
        [req.user.id, product_id, rating, comment || null]
      );
    }

    // Update product rating stats
    const [stats] = await db.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ?',
      [product_id]
    );
    await db.query(
      'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
      [parseFloat(stats[0].avg_rating).toFixed(1), stats[0].count, product_id]
    );

    res.status(201).json({ message: 'Review submitted.' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:id/reviews
 */
async function getProductReviews(req, res, next) {
  try {
    const [reviews] = await db.query(
      `SELECT r.*, u.name as user_name, u.avatar_url
       FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ? ORDER BY r.created_at DESC`,
      [req.params.id]
    );
    res.json({ reviews });
  } catch (err) {
    next(err);
  }
}

module.exports = { addReview, getProductReviews };
