import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ordersAPI } from '../../api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import styles from './Payment.module.css';

const methods = [
  { id: 'upi', label: 'UPI', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Rupay' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when delivered' },
];

export default function Payment() {
  const [method, setMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCart } = useCart();
  const { addToast } = useToast();

  const { addressId, deliveryType, total } = location.state || {};

  if (!addressId) { return <Navigate to="/checkout" replace />; }

  const formatCardNumber = (v) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (v) => {
    const clean = v.replace(/\D/g, '');
    if (clean.length >= 3) return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    return clean;
  };

  const handlePay = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const res = await ordersAPI.place({
        address_id: addressId,
        payment_method: method,
        delivery_type: deliveryType,
        coupon_code: null,
        notes: null,
      });
      await fetchCart();
      navigate('/confirmation', { state: { order: res.data.order } });
    } catch (err) {
      addToast(err.response?.data?.error || 'Payment failed', 'error');
      setProcessing(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className={styles.steps}>
          <div className={`${styles.step} ${styles.done}`}><span>✓</span> Address</div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${styles.active}`}><span>2</span> Payment</div>
          <div className={styles.stepLine} />
          <div className={styles.step}><span>3</span> Confirmation</div>
        </div>

        {processing ? (
          <motion.div className={styles.processingState} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.processingSpinner} />
            <h2>Processing Payment...</h2>
            <p>Please wait while we confirm your payment of ₹{total?.toFixed(0)}</p>
          </motion.div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.main}>
              <h2>Select Payment Method</h2>
              <div className={styles.methodGrid}>
                {methods.map(m => (
                  <motion.div key={m.id} className={`${styles.methodCard} ${method === m.id ? styles.selectedMethod : ''}`} onClick={() => setMethod(m.id)} whileTap={{ scale: 0.98 }}>
                    <span className={styles.methodIcon}>{m.icon}</span>
                    <div><strong>{m.label}</strong><span className={styles.methodDesc}>{m.desc}</span></div>
                    {method === m.id && <div className={styles.radioActive} />}
                  </motion.div>
                ))}
              </div>

              {method === 'card' && (
                <motion.div className={styles.cardForm} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <div className={styles.inputGroup}><label>Card Number</label><input className={styles.input} placeholder="1234 5678 9012 3456" value={cardForm.number} onChange={(e) => setCardForm(p => ({ ...p, number: formatCardNumber(e.target.value) }))} /></div>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}><label>Expiry</label><input className={styles.input} placeholder="MM/YY" value={cardForm.expiry} onChange={(e) => setCardForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} maxLength={5} /></div>
                    <div className={styles.inputGroup}><label>CVV</label><input className={styles.input} placeholder="•••" type="password" value={cardForm.cvv} onChange={(e) => setCardForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))} maxLength={3} /></div>
                  </div>
                  <div className={styles.inputGroup}><label>Name on Card</label><input className={styles.input} placeholder="ROBIN KUMAR" value={cardForm.name} onChange={(e) => setCardForm(p => ({ ...p, name: e.target.value.toUpperCase() }))} /></div>
                </motion.div>
              )}

              {method === 'upi' && (
                <motion.div className={styles.upiForm} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <div className={styles.inputGroup}><label>UPI ID</label><input className={styles.input} placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} /></div>
                </motion.div>
              )}
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryCard}>
                <h3>Pay ₹{total?.toFixed(0)}</h3>
                <div className={styles.secureNote}>🔒 Secure Payment</div>
                <button className={styles.payBtn} onClick={handlePay} id="pay-btn">
                  Pay ₹{total?.toFixed(0)}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <p className={styles.payNote}>By placing this order, you agree to our Terms of Service.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
