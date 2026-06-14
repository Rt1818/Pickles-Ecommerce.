import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Product.module.css';

const spiceLabels = { mild: 'Mild 🌶️', medium: 'Medium 🌶️🌶️', hot: 'Hot 🌶️🌶️🌶️', extra_hot: 'Extra Hot 🔥🔥' };

export default function Product() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState('250g');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    setLoading(true);
    productsAPI.getBySlug(slug)
      .then(res => {
        setProduct(res.data.product);
        setRelated(res.data.related || []);
        setReviews(res.data.reviews || []);
        setSelectedSize('250g');
        setQuantity(1);
      })
      .catch(() => addToast('Product not found', 'error'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="section container" style={{ textAlign: 'center', padding: '100px 0' }}><div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border-default)', borderTopColor: 'var(--brand-amber)', borderRadius: '50%', margin: '0 auto' }} /></div>;
  if (!product) return <div className="section container"><h2>Product not found</h2><Link to="/shop">← Back to Shop</Link></div>;

  const getPrice = () => {
    if (selectedSize === '1kg') return product.price_1kg || product.price_250g * 4;
    if (selectedSize === '500g') return product.price_500g || product.price_250g * 2;
    return product.price_250g;
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) { addToast('Please sign in to add items', 'warning'); return; }
    try {
      await addToCart(product.id, quantity, selectedSize);
      addToast(`${product.name} added to cart!`, 'success');
    } catch { addToast('Failed to add to cart', 'error'); }
  };

  const sizes = [
    { value: '250g', price: product.price_250g },
    ...(product.price_500g ? [{ value: '500g', price: product.price_500g }] : []),
    ...(product.price_1kg ? [{ value: '1kg', price: product.price_1kg }] : []),
  ];

  const tags = product.tags || [];

  return (
    <div className="section">
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <Link to={`/shop?category=${product.category_slug}`}>{product.category_name}</Link> / <span>{product.name}</span>
        </nav>

        <div className={styles.layout}>
          <motion.div className={styles.imageSection} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className={styles.mainImage}>
              <img src={product.image_url} alt={product.name} />
            </div>
          </motion.div>

          <motion.div className={styles.details} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <span className={styles.category}>{product.category_name}</span>
            <h1>{product.name}</h1>
            {product.telugu_name && <p className={styles.teluguName}>{product.telugu_name}</p>}
            
            <div className={styles.ratingRow}>
              <span className={styles.stars}>{'⭐'.repeat(Math.round(product.rating))}</span>
              <span>{product.rating} ({product.review_count} reviews)</span>
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.metaRow}>
              <span className={styles.spiceBadge}>{spiceLabels[product.spice_level]}</span>
              {tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
            </div>

            <div className={styles.sizeSelector}>
              <h4>Size</h4>
              <div className={styles.sizeOptions}>
                {sizes.map(s => (
                  <button key={s.value} className={`${styles.sizeBtn} ${selectedSize === s.value ? styles.sizeActive : ''}`} onClick={() => setSelectedSize(s.value)}>
                    <span className={styles.sizeLabel}>{s.value}</span>
                    <span className={styles.sizePrice}>₹{s.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.actionRow}>
              <div className={styles.qtyControl}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button className={styles.addToCartBtn} onClick={handleAddToCart} disabled={!product.in_stock} id="add-to-cart-btn">
                {product.in_stock ? `Add to Cart — ₹${(getPrice() * quantity).toFixed(0)}` : 'Out of Stock'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className={styles.reviewsSection}>
            <h2>Customer Reviews</h2>
            <div className={styles.reviewsGrid}>
              {reviews.map(r => (
                <div key={r.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewAvatar}>{r.user_name?.charAt(0)}</div>
                    <div><strong>{r.user_name}</strong><span>{'⭐'.repeat(r.rating)}</span></div>
                  </div>
                  {r.comment && <p>{r.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className={styles.relatedSection}>
            <h2>You May Also Like</h2>
            <div className={styles.relatedGrid}>
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
