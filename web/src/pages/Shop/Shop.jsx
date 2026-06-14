import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI } from '../../api';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Shop.module.css';

const spiceLevels = [
  { value: '', label: 'All Levels' },
  { value: 'mild', label: '🌶️ Mild' },
  { value: 'medium', label: '🌶️🌶️ Medium' },
  { value: 'hot', label: '🌶️🌶️🌶️ Hot' },
  { value: 'extra_hot', label: '🔥 Extra Hot' },
];

const sortOptions = [
  { value: '', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'A → Z' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const category = searchParams.get('category') || '';
  const spice = searchParams.get('spice') || '';
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    productsAPI.getCategories()
      .then(res => setCategories(res.data.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (spice) params.spice = spice;
    if (sort) params.sort = sort;
    if (search) params.search = search;
    params.page = page;
    params.limit = 12;

    productsAPI.getAll(params)
      .then(res => {
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, spice, sort, search, page]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const [searchInput, setSearchInput] = useState(search);
  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Shop</h1>
            <p className={styles.resultCount}>
              {pagination.total ? `${pagination.total} products found` : 'Loading...'}
            </p>
          </div>
          <form onSubmit={handleSearch} className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search pickles, snacks, powders..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchInput}
              id="shop-search"
            />
            <button type="submit" className={styles.searchBtn}>
              🔍
            </button>
          </form>
        </motion.div>

        <div className={styles.layout}>
          {/* Sidebar Filters */}
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <h3>Category</h3>
              <button
                className={`${styles.filterBtn} ${!category ? styles.activeFilter : ''}`}
                onClick={() => updateFilter('category', '')}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`${styles.filterBtn} ${category === cat.slug ? styles.activeFilter : ''}`}
                  onClick={() => updateFilter('category', cat.slug)}
                >
                  {cat.name}
                  <span className={styles.filterCount}>{cat.product_count}</span>
                </button>
              ))}
            </div>

            <div className={styles.filterGroup}>
              <h3>Spice Level</h3>
              {spiceLevels.map(s => (
                <button
                  key={s.value}
                  className={`${styles.filterBtn} ${spice === s.value ? styles.activeFilter : ''}`}
                  onClick={() => updateFilter('spice', s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className={styles.filterGroup}>
              <h3>Sort By</h3>
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className={styles.sortSelect}
                id="shop-sort"
              >
                {sortOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </aside>

          {/* Product Grid */}
          <main className={styles.main}>
            {/* Active Filters */}
            {(category || spice || search) && (
              <div className={styles.activeFilters}>
                {category && (
                  <span className={styles.filterTag}>
                    {category} <button onClick={() => updateFilter('category', '')}>✕</button>
                  </span>
                )}
                {spice && (
                  <span className={styles.filterTag}>
                    {spice} <button onClick={() => updateFilter('spice', '')}>✕</button>
                  </span>
                )}
                {search && (
                  <span className={styles.filterTag}>
                    "{search}" <button onClick={() => { updateFilter('search', ''); setSearchInput(''); }}>✕</button>
                  </span>
                )}
                <button
                  className={styles.clearAll}
                  onClick={() => { setSearchParams({}); setSearchInput(''); }}
                >
                  Clear all
                </button>
              </div>
            )}

            {loading ? (
              <div className={styles.grid}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={styles.skeleton}>
                    <div className={styles.skeletonImage} />
                    <div className={styles.skeletonText} />
                    <div className={styles.skeletonText} style={{ width: '60%' }} />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>🫙</span>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div className={styles.grid}>
                  {products.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className={styles.pagination}>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={`${styles.pageBtn} ${page === i + 1 ? styles.activePage : ''}`}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams);
                          params.set('page', i + 1);
                          setSearchParams(params);
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
