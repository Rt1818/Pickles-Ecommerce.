import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import styles from './Layout.module.css';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/cart', label: 'Cart' },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.nav}`}>
        {/* Logo */}
        <Link to="/" className={styles.brand}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Shanti Pickles Logo" />
          </div>
          <span className={styles.brandName}>Shanti Pickles</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.navLink} ${location.pathname === link.to ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Cart */}
          <Link to="/cart" className={styles.cartBtn} id="cart-button">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  className={styles.cartBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  key={count}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button className={styles.avatarBtn} onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <div className={styles.avatar}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className={styles.dropdown}
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className={styles.dropdownHeader}>
                      <strong>{user?.name}</strong>
                      <span>{user?.email}</span>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <Link to="/account" className={styles.dropdownItem}>👤 My Account</Link>
                    <Link to="/account?tab=orders" className={styles.dropdownItem}>📦 Orders</Link>
                    <Link to="/account?tab=addresses" className={styles.dropdownItem}>📍 Addresses</Link>
                    <div className={styles.dropdownDivider} />
                    <button className={styles.dropdownItem} onClick={handleLogout}>🚪 Logout</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className={styles.mobileNav}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className={styles.mobileNavHeader}>
                <span className={styles.brandName}>Shanti Pickles</span>
                <button onClick={() => setMobileOpen(false)} className={styles.closeBtn}>✕</button>
              </div>
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} className={styles.mobileNavLink}>
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/account" className={styles.mobileNavLink}>My Account</Link>
                  <button onClick={handleLogout} className={styles.mobileNavLink}>Logout</button>
                </>
              ) : (
                <Link to="/login" className={styles.mobileNavLink}>Sign In</Link>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
