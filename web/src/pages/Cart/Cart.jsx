import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, subtotal, count, loading, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const shipping = subtotal >= 500 ? 0 : 49;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) { addToast('Please sign in to checkout', 'warning'); navigate('/login'); return; }
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="section container">
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Sign in to start adding delicious pickles!</p>
          <Link to="/login" className={styles.ctaBtn}>Sign In</Link>
          <Link to="/shop" className={styles.linkBtn}>Browse Products →</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="section container" style={{ textAlign: 'center', padding: '80px 0' }}><div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border-default)', borderTopColor: 'var(--brand-amber)', borderRadius: '50%', margin: '0 auto' }} /></div>;

  if (count === 0) {
    return (
      <div className="section container">
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/shop" className={styles.ctaBtn}>Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className={styles.title}>Shopping Cart <span className={styles.countBadge}>{count} items</span></h1>

        <div className={styles.layout}>
          {/* Cart Items */}
          <div className={styles.itemsList}>
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  className={styles.cartItem}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, padding: 0, margin: 0 }}
                >
                  <img src={item.image_url} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemInfo}>
                    <Link to={`/product/${item.slug}`} className={styles.itemName}>{item.name}</Link>
                    {item.telugu_name && <span className={styles.itemTelugu}>{item.telugu_name}</span>}
                    <span className={styles.itemSize}>{item.size}</span>
                    <span className={styles.itemPrice}>₹{item.unit_price} each</span>
                  </div>
                  <div className={styles.qtyControl}>
                    <button onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className={styles.itemTotal}>₹{item.total_price.toFixed(0)}</div>
                  <button className={styles.removeBtn} onClick={() => { removeItem(item.id); addToast('Item removed from cart', 'info'); }}>✕</button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <h3>Order Summary</h3>
              <div className={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
              <div className={styles.summaryRow}><span>Shipping</span><span>{shipping === 0 ? <span className={styles.freeShipping}>FREE</span> : `₹${shipping}`}</span></div>
              {shipping > 0 && <p className={styles.shippingNote}>Free shipping on orders above ₹500</p>}
              <div className={styles.summaryRow}><span>Tax (5% GST)</span><span>₹{tax.toFixed(0)}</span></div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Total</span><span>₹{total.toFixed(0)}</span></div>
              <button className={styles.checkoutBtn} onClick={handleCheckout} id="checkout-btn">
                Proceed to Checkout
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <Link to="/shop" className={styles.continueLink}>← Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
