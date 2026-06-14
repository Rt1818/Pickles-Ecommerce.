const db = require('../db/connection');

/**
 * GET /api/cart
 */
async function getCart(req, res, next) {
  try {
    const [items] = await db.query(
      `SELECT ci.*, p.name, p.telugu_name, p.slug, p.image_url, p.in_stock,
              p.price_250g, p.price_500g, p.price_1kg
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?
       ORDER BY ci.created_at DESC`,
      [req.user.id]
    );

    // Calculate price for each item based on size
    const cartItems = items.map(item => {
      let unitPrice;
      switch (item.size) {
        case '500g': unitPrice = item.price_500g || item.price_250g * 2; break;
        case '1kg': unitPrice = item.price_1kg || item.price_250g * 4; break;
        default: unitPrice = item.price_250g;
      }
      return {
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        telugu_name: item.telugu_name,
        slug: item.slug,
        image_url: item.image_url,
        size: item.size,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: unitPrice * item.quantity,
        in_stock: item.in_stock
      };
    });

    const subtotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);

    res.json({
      items: cartItems,
      count: cartItems.length,
      subtotal: parseFloat(subtotal.toFixed(2))
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/cart
 * Body: { product_id, quantity, size }
 */
async function addToCart(req, res, next) {
  try {
    const { product_id, quantity = 1, size = '250g' } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    // Verify product exists and is in stock
    const [product] = await db.query('SELECT id, name, in_stock FROM products WHERE id = ?', [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    if (!product[0].in_stock) {
      return res.status(400).json({ error: 'Product is out of stock.' });
    }

    // Upsert: if item already in cart with same size, update quantity
    await db.query(
      `INSERT INTO cart_items (user_id, product_id, quantity, size)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.id, product_id, quantity, size]
    );

    res.status(201).json({ message: `${product[0].name} added to cart.` });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/cart/:id
 * Body: { quantity }
 */
async function updateCartItem(req, res, next) {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1.' });
    }

    const [result] = await db.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    res.json({ message: 'Cart updated.' });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/cart/:id
 */
async function removeFromCart(req, res, next) {
  try {
    const [result] = await db.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/cart
 * Clear entire cart
 */
async function clearCart(req, res, next) {
  try {
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
