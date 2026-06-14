import { Link } from 'react-router-dom';
import styles from './Layout.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            <img src="/logo.png" alt="Shanti Pickles Logo" style={{ width: 32, height: 32, borderRadius: 8 }} />
            <strong>Shanti Pickles & Foods</strong>
          </div>
          <p>Authentic Telugu pickles and snacks crafted with hand‑picked ingredients. Pure. Homely. Peaceful.</p>
          <div className={styles.footerBadges}>
            <span className={styles.chip}>🌿 Preservative‑Free</span>
            <span className={styles.chip}>🇮🇳 Made in India</span>
          </div>
        </div>

        <div className={styles.footerLinks}>
          <h4>Quick Links</h4>
          <Link to="/shop">Shop All</Link>
          <Link to="/shop?category=pickles">Pickles</Link>
          <Link to="/shop?category=snacks">Snacks</Link>
          <Link to="/shop?category=powders">Powders</Link>
        </div>

        <div className={styles.footerLinks}>
          <h4>Account</h4>
          <Link to="/login">Sign In</Link>
          <Link to="/cart">My Cart</Link>
          <Link to="/account?tab=orders">My Orders</Link>
          <Link to="/account">Profile</Link>
        </div>

        <div className={styles.footerLinks}>
          <h4>Support</h4>
          <a href="#">FAQ</a>
          <a href="#">Shipping Info</a>
          <a href="#">Return Policy</a>
          <a href="#">Contact Us</a>
        </div>
      </div>

      <div className={`container ${styles.footerBottom}`}>
        <p>© {new Date().getFullYear()} Shanti Pickles & Foods. All rights reserved.</p>
        <p className={styles.footerTag}>Made with ❤️ in Telangana • <code>#PureHomelyPeaceful</code></p>
      </div>
    </footer>
  );
}
