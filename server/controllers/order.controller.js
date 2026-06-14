const db = require('../db/connection');
const { generateOrderNumber, getEstimatedDelivery } = require('../utils/helpers');

/**
 * POST /api/orders
 * Body: { address_id, payment_method, delivery_type, coupon_code, notes }
 */
async function placeOrder(req, res, next) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { address_id, payment_method, delivery_type = 'standard', coupon_code, notes } = req.body;

    if (!address_id || !payment_method) {
      return res.status(400).json({ error: 'Address and payment method are required.' });
    }

    // Verify address belongs to user
    const [addr] = await conn.query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [address_id, req.user.id]);
    if (addr.length === 0) {
      return res.status(400).json({ error: 'Invalid address.' });
    }

    // Get cart items
    const [cartItems] = await conn.query(
      `SELECT ci.*, p.name, p.price_250g, p.price_500g, p.price_1kg, p.in_stock
       FROM cart_items ci JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    // Calculate prices
    let subtotal = 0;
    const orderItems = cartItems.map(item => {
      let unitPrice;
      switch (item.size) {
        case '500g': unitPrice = item.price_500g || item.price_250g * 2; break;
        case '1kg': unitPrice = item.price_1kg || item.price_250g * 4; break;
        default: unitPrice = item.price_250g;
      }
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      return {
        product_id: item.product_id,
        product_name: item.name,
        quantity: item.quantity,
        size: item.size,
        unit_price: unitPrice,
        total_price: totalPrice
      };
    });

    // Shipping
    const shipping_cost = delivery_type === 'express' ? 99.00 : (subtotal >= 500 ? 0 : 49.00);

    // Discount (demo coupons)
    let discount = 0;
    if (coupon_code) {
      const code = coupon_code.toUpperCase();
      if (code === 'SPICY10') discount = subtotal * 0.10;
      else if (code === 'FIRST20') discount = subtotal * 0.20;
      else if (code === 'FLAT50') discount = Math.min(50, subtotal);
    }

    // Tax (5% GST)
    const tax = (subtotal - discount) * 0.05;
    const total = subtotal + shipping_cost - discount + tax;

    const order_number = generateOrderNumber();
    const estimated_delivery = getEstimatedDelivery(delivery_type);

    // Insert order
    const [orderResult] = await conn.query(
      `INSERT INTO orders (order_number, user_id, address_id, subtotal, shipping_cost, discount, tax, total,
        coupon_code, payment_method, payment_status, order_status, delivery_type, estimated_delivery, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid', 'placed', ?, ?, ?)`,
      [order_number, req.user.id, address_id,
       subtotal.toFixed(2), shipping_cost.toFixed(2), discount.toFixed(2), tax.toFixed(2), total.toFixed(2),
       coupon_code || null, payment_method, delivery_type, estimated_delivery, notes || null]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of orderItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, size, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.product_name, item.quantity, item.size, item.unit_price, item.total_price]
      );
    }

    // Clear cart
    await conn.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    await conn.commit();

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        id: orderId,
        order_number,
        total: parseFloat(total.toFixed(2)),
        estimated_delivery,
        item_count: orderItems.length
      }
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
}

/**
 * GET /api/orders
 */
async function getOrders(req, res, next) {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [req.user.id];

    if (status) {
      query += ' AND order_status = ?';
      params.push(status);
    }

    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.max(1, parseInt(limit) || 10);
    const offset = (parsedPage - 1) * parsedLimit;

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parsedLimit, offset);

    const [orders] = await db.query(query, params);

    // Get item count for each order
    for (const order of orders) {
      const [items] = await db.query(
        'SELECT COUNT(*) as count FROM order_items WHERE order_id = ?', [order.id]
      );
      order.item_count = items[0].count;
    }

    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders/:id
 */
async function getOrderById(req, res, next) {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = orders[0];

    // Get order items
    const [items] = await db.query(
      `SELECT oi.*, p.image_url, p.slug FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order.id]
    );

    // Get address
    const [addr] = await db.query('SELECT * FROM addresses WHERE id = ?', [order.address_id]);

    res.json({ order, items, address: addr[0] || null });
  } catch (err) {
    next(err);
  }
}

module.exports = { placeOrder, getOrders, getOrderById };
