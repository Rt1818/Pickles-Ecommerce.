import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ordersAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import styles from './Track.module.css';

const statusSteps = [
  { key: 'placed', label: 'Order Placed', icon: '📝' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅' },
  { key: 'processing', label: 'Processing', icon: '👨‍🍳' },
  { key: 'shipped', label: 'Shipped', icon: '📦' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
];

export default function Track() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    ordersAPI.getById(id)
      .then(res => {
        setOrder(res.data.order);
        setItems(res.data.items || []);
        setAddress(res.data.address);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (loading) return <div className="section container" style={{ textAlign: 'center', padding: '80px' }}><div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border-default)', borderTopColor: 'var(--brand-amber)', borderRadius: '50%', margin: '0 auto' }} /></div>;
  if (!order) return <div className="section container"><h2>Order not found</h2><Link to="/account?tab=orders">← Back to Orders</Link></div>;

  const currentIndex = statusSteps.findIndex(s => s.key === order.order_status);

  return (
    <div className="section">
      <div className="container">
        <Link to="/account?tab=orders" className={styles.backLink}>← Back to Orders</Link>
        <h1>Track Order <span className={styles.orderNum}>{order.order_number}</span></h1>

        <div className={styles.layout}>
          <div className={styles.main}>
            {/* Timeline */}
            <div className={styles.timeline}>
              {statusSteps.map((step, i) => {
                const isCompleted = i <= currentIndex;
                const isCurrent = i === currentIndex;
                return (
                  <motion.div key={step.key} className={`${styles.timelineStep} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className={styles.timelineDot}>
                      <span>{isCompleted ? '✓' : step.icon}</span>
                    </div>
                    <div className={styles.timelineContent}>
                      <strong>{step.label}</strong>
                      {isCurrent && <span className={styles.currentLabel}>Current Status</span>}
                    </div>
                    {i < statusSteps.length - 1 && <div className={`${styles.timelineLine} ${isCompleted ? styles.completedLine : ''}`} />}
                  </motion.div>
                );
              })}
            </div>

            {/* Map placeholder */}
            <div className={styles.mapPlaceholder}>
              <div className={styles.mapIcon}>🗺️</div>
              <h3>Delivery Map</h3>
              <p>Live tracking will be available once your order is shipped.</p>
              {address && <p className={styles.deliverTo}>📍 Delivering to: {address.city}, {address.state} — {address.pincode}</p>}
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.detailCard}>
              <h3>Order Details</h3>
              <div className={styles.detailRow}><span>Order Number</span><strong>{order.order_number}</strong></div>
              <div className={styles.detailRow}><span>Placed On</span><strong>{new Date(order.created_at).toLocaleDateString('en-IN')}</strong></div>
              <div className={styles.detailRow}><span>Payment</span><strong>{order.payment_method.toUpperCase()}</strong></div>
              <div className={styles.detailRow}><span>Delivery</span><strong>{order.delivery_type}</strong></div>
              {order.estimated_delivery && <div className={styles.detailRow}><span>Est. Delivery</span><strong>{order.estimated_delivery}</strong></div>}
              <div className={`${styles.detailRow} ${styles.totalRow}`}><span>Total</span><strong>₹{parseFloat(order.total).toFixed(0)}</strong></div>
            </div>

            <div className={styles.itemsCard}>
              <h3>Items ({items.length})</h3>
              {items.map(item => (
                <div key={item.id} className={styles.itemRow}>
                  <img src={item.image_url} alt={item.product_name} className={styles.itemImg} />
                  <div>
                    <strong>{item.product_name}</strong>
                    <span>{item.size} × {item.quantity}</span>
                  </div>
                  <span>₹{parseFloat(item.total_price).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
