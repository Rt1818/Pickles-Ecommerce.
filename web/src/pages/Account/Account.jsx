import { useState, useEffect } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ordersAPI, addressAPI, userAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import styles from './Account.module.css';

const tabs = [
  { id: 'profile', label: '👤 Profile' },
  { id: 'orders', label: '📦 Orders' },
  { id: 'addresses', label: '📍 Addresses' },
];

const statusColors = {
  placed: '#3b82f6', confirmed: '#8b5cf6', processing: '#f59e0b',
  shipped: '#06b6d4', out_for_delivery: '#f97316', delivered: '#22c55e', cancelled: '#ef4444',
};

export default function Account() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '' });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === 'orders') ordersAPI.getAll().then(r => setOrders(r.data.orders)).catch(() => {});
    if (activeTab === 'addresses') addressAPI.getAll().then(r => setAddresses(r.data.addresses)).catch(() => {});
    if (activeTab === 'profile' && user) setProfileForm({ name: user.name || '', phone: user.phone || '' });
  }, [activeTab, isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await userAPI.updateProfile(profileForm);
      updateUser(res.data.user);
      addToast('Profile updated!', 'success');
    } catch { addToast('Update failed', 'error'); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await userAPI.changePassword(passwordForm);
      setPasswordForm({ current_password: '', new_password: '' });
      addToast('Password changed!', 'success');
    } catch (err) { addToast(err.response?.data?.error || 'Failed', 'error'); }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await addressAPI.remove(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
      addToast('Address deleted', 'info');
    } catch { addToast('Failed to delete', 'error'); }
  };

  return (
    <div className="section">
      <div className="container">
        <h1>My Account</h1>
        <div className={styles.tabs}>
          {tabs.map(t => (
            <button key={t.id} className={`${styles.tab} ${activeTab === t.id ? styles.activeTab : ''}`}
              onClick={() => setSearchParams({ tab: t.id })}>
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.profileHeader}>
                <div className={styles.bigAvatar}>{user?.name?.charAt(0)?.toUpperCase()}</div>
                <div><h2>{user?.name}</h2><p>{user?.email}</p></div>
              </div>
              <form onSubmit={handleUpdateProfile} className={styles.form}>
                <h3>Edit Profile</h3>
                <div className={styles.inputGroup}><label>Name</label><input className={styles.input} value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div className={styles.inputGroup}><label>Phone</label><input className={styles.input} value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} /></div>
                <button type="submit" className={styles.saveBtn}>Save Changes</button>
              </form>
              <form onSubmit={handleChangePassword} className={styles.form}>
                <h3>Change Password</h3>
                <div className={styles.inputGroup}><label>Current Password</label><input type="password" className={styles.input} value={passwordForm.current_password} onChange={e => setPasswordForm(p => ({ ...p, current_password: e.target.value }))} required /></div>
                <div className={styles.inputGroup}><label>New Password</label><input type="password" className={styles.input} value={passwordForm.new_password} onChange={e => setPasswordForm(p => ({ ...p, new_password: e.target.value }))} required minLength={6} /></div>
                <button type="submit" className={styles.saveBtn}>Change Password</button>
              </form>
              <button className={styles.logoutBtn} onClick={logout}>🚪 Logout</button>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {orders.length === 0 ? (
                <div className={styles.emptyState}><span>📦</span><h3>No orders yet</h3><p>Your order history will appear here.</p><Link to="/shop" className={styles.shopLink}>Start Shopping →</Link></div>
              ) : (
                <div className={styles.ordersList}>
                  {orders.map(order => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderHeader}>
                        <div>
                          <strong>{order.order_number}</strong>
                          <span className={styles.orderDate}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <span className={styles.statusBadge} style={{ background: `${statusColors[order.order_status]}20`, color: statusColors[order.order_status], borderColor: `${statusColors[order.order_status]}40` }}>
                          {order.order_status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className={styles.orderBody}>
                        <span>{order.item_count} items</span>
                        <strong>₹{parseFloat(order.total).toFixed(0)}</strong>
                      </div>
                      <div className={styles.orderActions}>
                        <Link to={`/track/${order.id}`} className={styles.trackLink}>Track Order</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'addresses' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {addresses.length === 0 ? (
                <div className={styles.emptyState}><span>📍</span><h3>No saved addresses</h3><p>Add an address during checkout.</p></div>
              ) : (
                <div className={styles.addressGrid}>
                  {addresses.map(addr => (
                    <div key={addr.id} className={styles.addressCard}>
                      <div className={styles.addrHeader}>
                        <span className={styles.addrLabel}>{addr.label}</span>
                        {addr.is_default && <span className={styles.defaultBadge}>Default</span>}
                      </div>
                      <strong>{addr.name}</strong>
                      <p>{addr.address_line1}</p>
                      {addr.address_line2 && <p>{addr.address_line2}</p>}
                      <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                      <p>📞 {addr.phone}</p>
                      <button className={styles.deleteAddr} onClick={() => handleDeleteAddress(addr.id)}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
