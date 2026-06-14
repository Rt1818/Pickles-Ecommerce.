const db = require('../db/connection');

/**
 * GET /api/products
 * Query params: category, spice, search, sort, page, limit
 */
async function getProducts(req, res, next) {
  try {
    const { category, spice, search, sort, page = 1, limit = 20, in_stock } = req.query;
    let query = 'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id';
    const conditions = [];
    const params = [];

    if (category) {
      conditions.push('c.slug = ?');
      params.push(category);
    }
    if (spice) {
      conditions.push('p.spice_level = ?');
      params.push(spice);
    }
    if (in_stock !== undefined) {
      conditions.push('p.in_stock = ?');
      params.push(in_stock === 'true' ? 1 : 0);
    }
    if (search) {
      conditions.push('(p.name LIKE ? OR p.telugu_name LIKE ? OR p.description LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Sorting
    switch (sort) {
      case 'price-asc': query += ' ORDER BY p.price_250g ASC'; break;
      case 'price-desc': query += ' ORDER BY p.price_250g DESC'; break;
      case 'rating': query += ' ORDER BY p.rating DESC'; break;
      case 'newest': query += ' ORDER BY p.created_at DESC'; break;
      case 'name': query += ' ORDER BY p.name ASC'; break;
      default: query += ' ORDER BY p.review_count DESC'; // popularity
    }

    // Pagination
    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.max(1, parseInt(limit) || 20);
    const offset = (parsedPage - 1) * parsedLimit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parsedLimit, offset);

    const [products] = await db.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products p JOIN categories c ON p.category_id = c.id';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countParams = params.slice(0, params.length - 2); // Remove limit & offset
    const [countResult] = await db.query(countQuery, countParams);

    // Parse JSON tags
    const parsed = products.map(p => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags || []
    }));

    res.json({
      products: parsed,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / parsedLimit)
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:slug
 */
async function getProductBySlug(req, res, next) {
  try {
    const [rows] = await db.query(
      'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE p.slug = ?',
      [req.params.slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const product = rows[0];
    product.tags = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags || [];

    // Get reviews for this product
    const [reviews] = await db.query(
      'SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC LIMIT 10',
      [product.id]
    );

    // Get related products (same category, excluding self)
    const [related] = await db.query(
      'SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.category_id = ? AND p.id != ? LIMIT 4',
      [product.category_id, product.id]
    );

    res.json({ product, reviews, related });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/categories
 */
async function getCategories(req, res, next) {
  try {
    const [categories] = await db.query(
      'SELECT c.*, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON p.category_id = c.id GROUP BY c.id ORDER BY c.name'
    );
    res.json({ categories });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProducts, getProductBySlug, getCategories };
