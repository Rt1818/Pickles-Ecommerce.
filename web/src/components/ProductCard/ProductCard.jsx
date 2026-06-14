import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import styles from './ProductCard.module.css';

const spiceColors = {
  mild: '#4ade80',
  medium: '#f59e0b',
  hot: '#ef4444',
  extra_hot: '#dc2626',
};

const spiceLabels = {
  mild: '🌶️',
  medium: '🌶️🌶️',
  hot: '🌶️🌶️🌶️',
  extra_hot: '🔥🔥🔥🔥',
};

export default function ProductCard({ product, index = 0 }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      addToast('Please sign in to add items to cart', 'warning');
      return;
    }
    try {
      await addToCart(product.id, 1, '250g');
      addToast(`${product.name} added to cart!`, 'success');
    } catch {
      addToast('Failed to add to cart', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link to={`/product/${product.slug}`} className={styles.card} id={`product-${product.slug}`}>
        <div className={styles.imageWrap}>
          <img
            src={product.image_url}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.imageOverlay}>
            <span className={styles.viewBtn}>View Details</span>
          </div>
          {product.tags?.includes('bestseller') && (
            <span className={styles.bestsellerBadge}>⭐ Bestseller</span>
          )}
          {!product.in_stock && (
            <div className={styles.outOfStock}>Out of Stock</div>
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.category}>{product.category_name}</div>
          <h3 className={styles.name}>{product.name}</h3>
          {product.telugu_name && (
            <span className={styles.teluguName}>{product.telugu_name}</span>
          )}
          
          <div className={styles.meta}>
            <span className={styles.spice} style={{ color: spiceColors[product.spice_level] }}>
              {spiceLabels[product.spice_level]}
            </span>
            <span className={styles.rating}>
              ⭐ {product.rating} <span className={styles.reviewCount}>({product.review_count})</span>
            </span>
          </div>

          <div className={styles.footer}>
            <div className={styles.price}>
              <span className={styles.currency}>₹</span>
              <span className={styles.amount}>{product.price_250g}</span>
              <span className={styles.size}>/ 250g</span>
            </div>
            <button
              className={styles.addBtn}
              onClick={handleAddToCart}
              disabled={!product.in_stock}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
