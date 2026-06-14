import { Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Confirmation.module.css';

export default function Confirmation() {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) return <Navigate to="/shop" replace />;

  return (
    <div className="section">
      <div className="container">
        <motion.div className={styles.card} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 15 }}>
          <motion.div className={styles.checkCircle} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', damping: 10 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>Order Placed! 🎉</motion.h1>
          <motion.p className={styles.subtitle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Thank you for ordering from Shanti Pickles & Foods!
          </motion.p>

          <motion.div className={styles.orderDetails} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className={styles.detailRow}><span>Order Number</span><strong>{order.order_number}</strong></div>
            <div className={styles.detailRow}><span>Total Paid</span><strong>₹{order.total?.toFixed(0)}</strong></div>
            <div className={styles.detailRow}><span>Items</span><strong>{order.item_count} items</strong></div>
            <div className={styles.detailRow}><span>Estimated Delivery</span><strong>{order.estimated_delivery}</strong></div>
          </motion.div>

          <motion.div className={styles.actions} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <Link to={`/track/${order.id}`} className={styles.trackBtn}>📦 Track Order</Link>
            <Link to="/account?tab=orders" className={styles.ordersBtn}>View All Orders</Link>
            <Link to="/shop" className={styles.shopBtn}>Continue Shopping →</Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
