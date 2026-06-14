import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { addressAPI } from '../../api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import styles from './Checkout.module.css';

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [delivery, setDelivery] = useState('standard');
  const [form, setForm] = useState({ label: 'Home', name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '', is_default: true });
  const { subtotal, count } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (count === 0) { navigate('/cart'); return; }
    addressAPI.getAll().then(res => {
      setAddresses(res.data.addresses);
      const def = res.data.addresses.find(a => a.is_default);
      if (def) setSelectedAddr(def.id);
      else if (res.data.addresses.length > 0) setSelectedAddr(res.data.addresses[0].id);
      else setShowForm(true);
    }).catch(() => {});
  }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressAPI.add(form);
      setAddresses(prev => [...prev, res.data.address]);
      setSelectedAddr(res.data.address.id);
      setShowForm(false);
      addToast('Address added!', 'success');
    } catch { addToast('Failed to add address', 'error'); }
  };

  const shipping = delivery === 'express' ? 99 : (subtotal >= 500 ? 0 : 49);
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handleContinue = () => {
    if (!selectedAddr) { addToast('Please select a delivery address', 'warning'); return; }
    navigate('/payment', { state: { addressId: selectedAddr, deliveryType: delivery, total, shipping, tax } });
  };

  return (
    <div className="section">
      <div className="container">
        <div className={styles.steps}>
          <div className={`${styles.step} ${styles.active}`}><span>1</span> Address</div>
          <div className={styles.stepLine} />
          <div className={styles.step}><span>2</span> Payment</div>
          <div className={styles.stepLine} />
          <div className={styles.step}><span>3</span> Confirmation</div>
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            <h2>Delivery Address</h2>
            {addresses.length > 0 && (
              <div className={styles.addressGrid}>
                {addresses.map(addr => (
                  <motion.div key={addr.id} className={`${styles.addressCard} ${selectedAddr === addr.id ? styles.selectedAddr : ''}`} onClick={() => setSelectedAddr(addr.id)} whileTap={{ scale: 0.98 }}>
                    <div className={styles.addrLabel}>{addr.label}</div>
                    <strong>{addr.name}</strong>
                    <p>{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}</p>
                    <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                    <p>📞 {addr.phone}</p>
                    {selectedAddr === addr.id && <div className={styles.checkmark}>✓</div>}
                  </motion.div>
                ))}
              </div>
            )}

            <button className={styles.addAddrBtn} onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '+ Add New Address'}
            </button>

            {showForm && (
              <motion.form className={styles.addressForm} onSubmit={handleAddAddress} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}><label>Full Name *</label><input name="name" required value={form.name} onChange={handleChange} className={styles.input} /></div>
                  <div className={styles.inputGroup}><label>Phone *</label><input name="phone" required value={form.phone} onChange={handleChange} className={styles.input} /></div>
                </div>
                <div className={styles.inputGroup}><label>Address Line 1 *</label><input name="address_line1" required value={form.address_line1} onChange={handleChange} className={styles.input} placeholder="House/Flat No, Street" /></div>
                <div className={styles.inputGroup}><label>Address Line 2</label><input name="address_line2" value={form.address_line2} onChange={handleChange} className={styles.input} placeholder="Landmark, Area" /></div>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}><label>City *</label><input name="city" required value={form.city} onChange={handleChange} className={styles.input} /></div>
                  <div className={styles.inputGroup}><label>State *</label><input name="state" required value={form.state} onChange={handleChange} className={styles.input} /></div>
                  <div className={styles.inputGroup}><label>Pincode *</label><input name="pincode" required value={form.pincode} onChange={handleChange} className={styles.input} /></div>
                </div>
                <button type="submit" className={styles.saveBtn}>Save Address</button>
              </motion.form>
            )}

            <h2 style={{ marginTop: 32 }}>Delivery Option</h2>
            <div className={styles.deliveryOptions}>
              <div className={`${styles.deliveryCard} ${delivery === 'standard' ? styles.selectedDelivery : ''}`} onClick={() => setDelivery('standard')}>
                <strong>🚚 Standard</strong><span>{subtotal >= 500 ? 'FREE' : '₹49'} • 5–7 days</span>
              </div>
              <div className={`${styles.deliveryCard} ${delivery === 'express' ? styles.selectedDelivery : ''}`} onClick={() => setDelivery('express')}>
                <strong>⚡ Express</strong><span>₹99 • 2–3 days</span>
              </div>
            </div>
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <h3>Order Summary</h3>
              <div className={styles.summaryRow}><span>Subtotal ({count} items)</span><span>₹{subtotal.toFixed(0)}</span></div>
              <div className={styles.summaryRow}><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className={styles.summaryRow}><span>Tax (5% GST)</span><span>₹{tax.toFixed(0)}</span></div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Total</span><span>₹{total.toFixed(0)}</span></div>
              <button className={styles.continueBtn} onClick={handleContinue}>Continue to Payment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
