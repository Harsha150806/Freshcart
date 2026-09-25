import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  'All',
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Meat & Seafood',
  'Bakery',
  'Beverages',
  'Snacks',
  'Pantry',
  'Frozen Foods',
  'Personal Care',
  'Household',
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating-desc' },
  { label: 'Most Reviews', value: 'numReviews-desc' },
  { label: 'Best Discount', value: 'discount-desc' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('createdAt-desc');
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyOffers, setOnlyOffers] = useState(searchParams.get('isOffer') === 'true');
  const [onlyFeatured, setOnlyFeatured] = useState(searchParams.get('isFeatured') === 'true');

  const search = searchParams.get('search') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [sortBy, order] = sort.split('-');
      const params = new URLSearchParams({
        page,
        limit: 12,
        sortBy,
        order,
        ...(category !== 'All' && { category }),
        ...(search && { search }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(onlyOffers && { isOffer: 'true' }),
        ...(onlyFeatured && { isFeatured: 'true' }),
      });
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error('Failed to fetch products:', err.message);
    } finally {
      setLoading(false);
    }
  }, [category, sort, page, minPrice, maxPrice, onlyOffers, onlyFeatured, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync URL params to state
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const resetFilters = () => {
    setCategory('All');
    setSort('createdAt-desc');
    setMinPrice('');
    setMaxPrice('');
    setOnlyOffers(false);
    setOnlyFeatured(false);
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              {search ? `Results for "${search}"` : 'All Products'}
            </h1>
            <div className="breadcrumb">
              <Link to="/">Home</Link> / <span>Shop</span>
              {category !== 'All' && <> / <span>{category}</span></>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {total} products found
            </span>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category chips */}
        <div className="category-chips" style={{ marginBottom: '1.5rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="products-layout">
          {/* Filter Sidebar */}
          <aside className="filter-sidebar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Filters</h3>
              <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Reset</button>
            </div>

            {/* Category filter */}
            <div className="filter-section">
              <p className="filter-section-title">Category</p>
              {CATEGORIES.map((cat) => (
                <label key={cat} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>

            {/* Price filter */}
            <div className="filter-section">
              <p className="filter-section-title">Price Range (₹)</p>
              <form onSubmit={handlePriceFilter}>
                <div className="price-range">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.5rem' }}
                  />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.5rem' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm btn-block" style={{ marginTop: '0.75rem' }}>
                  Apply
                </button>
              </form>
            </div>

            {/* Special filters */}
            <div className="filter-section">
              <p className="filter-section-title">Special</p>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={onlyOffers}
                  onChange={(e) => { setOnlyOffers(e.target.checked); setPage(1); }}
                />
                🔥 On Sale / Offers
              </label>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={onlyFeatured}
                  onChange={(e) => { setOnlyFeatured(e.target.checked); setPage(1); }}
                />
                ⭐ Featured Only
              </label>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {loading ? (
              <div className="spinner-wrapper"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🥦</div>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
                <button className="btn btn-primary" onClick={resetFilters}>Reset Filters</button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      ←
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`page-btn ${p === page ? 'active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      className="page-btn"
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      disabled={page === pages}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
