import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI } from '../../api';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Home.module.css';

export default function Home() {
  const [bestsellers, setBestsellers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productsAPI.getAll({ sort: 'rating', limit: 6 })
      .then(res => setBestsellers(res.data.products))
      .catch(() => {});
    productsAPI.getCategories()
      .then(res => setCategories(res.data.categories))
      .catch(() => {});
  }, []);

  const features = [
    { icon: '🥄', title: 'No Added Colors', desc: 'Only turmeric, chilli & natural spices for rich color.' },
    { icon: '🪔', title: 'Traditional Methods', desc: 'Sun‑curing, stone‑ground masalas, clay vessels.' },
    { icon: '🫙', title: 'Food‑Grade Packing', desc: 'Tamper‑evident jars & leak‑proof pouches.' },
    { icon: '🚚', title: 'Pan‑India Shipping', desc: 'Careful packaging, dispatched in 24–48 hours.' },
  ];

  const reviews = [
    { name: 'Ananya', city: 'Bengaluru', text: 'The Gongura hit the perfect sour‑spicy balance. Tastes just like my nani\'s!' },
    { name: 'Karthik', city: 'Hyderabad', text: 'Super fresh, well packed. The Avakaya has that authentic kick without being oily.' },
    { name: 'Shreya', city: 'Pune', text: 'Crispy snacks and quick dispatch. Will reorder for the festive season.' },
  ];

  return (
    <div className={styles.home}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroContent}`}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.heroBadge}>✨ 100% Homemade • Preservative‑Free</div>
            <h1>
              Pure. Homely.{' '}
              <span className="text-gradient">Peaceful.</span>
            </h1>
            <p className={styles.heroLead}>
              Authentic Telugu <strong>పచ్చళ్లు</strong> (pickles) and snacks crafted with hand‑picked
              ingredients. <em>Mana inti ruchulu, mee intiki</em> — మన ఇంటి రుచులు, మీ ఇంటికి.
            </p>
            <div className={styles.heroChips}>
              <span className={styles.chip}>Sun‑cured</span>
              <span className={styles.chip}>Cold‑pressed oils</span>
              <span className={styles.chip}>Farm‑fresh spices</span>
              <span className={styles.chip}>Pan‑India shipping</span>
            </div>
            <div className={styles.heroCta}>
              <Link to="/shop" className={styles.btnPrimary}>
                Shop Bestsellers
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/shop?category=pickles" className={styles.btnSecondary}>
                Browse Pickles
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>4.9/5</div>
                <div className={styles.statLabel}>⭐ Rating</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>Small‑batch</div>
                <div className={styles.statLabel}>👨‍🍳 Crafted</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>24–48 hrs</div>
                <div className={styles.statLabel}>🚚 Dispatch</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1200&auto=format&fit=crop"
              alt="Assorted Telugu pickles and Indian Spices"
            />
            <div className={styles.heroImageGlow} />
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={`section ${styles.featuresSection}`}>
        <div className="container">
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Shop by Category</h2>
              <Link to="/shop" className={styles.viewAll}>View All →</Link>
            </div>
            <div className={styles.categoriesGrid}>
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link to={`/shop?category=${cat.slug}`} className={styles.categoryCard}>
                    <img src={cat.image_url} alt={cat.name} />
                    <div className={styles.categoryOverlay}>
                      <h3>{cat.name}</h3>
                      <span>{cat.product_count} items</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bestsellers ── */}
      {bestsellers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Our Bestsellers <span className={styles.telugu}>— పాపులర్ ఐటంస్</span></h2>
              <Link to="/shop" className={styles.viewAll}>Shop All →</Link>
            </div>
            <div className={styles.productsGrid}>
              {bestsellers.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Reviews ── */}
      <section className={`section ${styles.reviewsSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>What Customers Say</h2>
          </div>
          <div className={styles.reviewsGrid}>
            {reviews.map((r, i) => (
              <motion.div
                key={r.name}
                className={styles.reviewCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={styles.reviewStars}>⭐⭐⭐⭐⭐</div>
                <p className={styles.reviewText}>"{r.text}"</p>
                <div className={styles.reviewAuthor}>
                  <div className={styles.reviewAvatar}>{r.name.charAt(0)}</div>
                  <div>
                    <strong>{r.name}</strong>
                    <span>{r.city}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <motion.div
            className={styles.ctaCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Ready to taste tradition?</h2>
            <p>Browse our full collection of pickles, snacks, and powders. Free shipping on orders above ₹500.</p>
            <Link to="/shop" className={styles.btnPrimary}>
              Explore the Shop
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
