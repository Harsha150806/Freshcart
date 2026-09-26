import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockProducts';

const CATEGORIES = [
  'All',
  'Fruits & Vegetables',
  'Rice, Atta & Grains',
  'Dal & Pulses',
  'Oil & Ghee',
  'Masala & Spices',
  'Dairy, Bread & Eggs',
  'Snacks & Biscuits',
  'Beverages',
  'Instant & Packaged Food',
  'Chocolates & Sweets',
  'Cleaning & Household',
  'Personal Care',
  'Baby Care',
  'Pet Care',
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating-desc' },
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
      if (data && data.products && data.products.length > 0) {
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log('Backend API request fallback to local mock catalog:', err.message);
    }

    // Client-side filtering over extensive MOCK_PRODUCTS catalog
    let filtered = [...MOCK_PRODUCTS];

    if (category !== 'All') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase().trim() === category.toLowerCase().trim()
      );
    }

    if (search) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
          (p.weight && p.weight.toLowerCase().includes(q))
      );
    }

    if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    if (onlyOffers) filtered = filtered.filter((p) => p.isOffer);
    if (onlyFeatured) filtered = filtered.filter((p) => p.isFeatured);

    // Sorting
    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating-desc') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === 'discount-desc') filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));

    const itemsPerPage = 12;
    setTotal(filtered.length);
    setPages(Math.ceil(filtered.length / itemsPerPage) || 1);
    const startIndex = (page - 1) * itemsPerPage;
    setProducts(filtered.slice(startIndex, startIndex + itemsPerPage));
    setLoading(false);
  }, [category, sort, page, minPrice, maxPrice, onlyOffers, onlyFeatured, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync URL params to state
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
    const isOff = searchParams.get('isOffer') === 'true';
    if (isOff) setOnlyOffers(true);
    const isFeat = searchParams.get('isFeatured') === 'true';
    if (isFeat) setOnlyFeatured(true);
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
    const newParams = {};
    if (cat !== 'All') newParams.category = cat;
    if (search) newParams.search = search;
    setSearchParams(newParams);
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
              {search ? `Results for "${search}"` : 'All Grocery Products'}
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
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
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
            <div
              style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Filters</h3>
              <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
                Reset
              </button>
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
                <button
                  type="submit"
                  className="btn btn-primary btn-sm btn-block"
                  style={{ marginTop: '0.75rem' }}
                >
                  Apply Filter
                </button>
              </form>
            </div>

            {/* Special filters */}
            <div className="filter-section">
              <p className="filter-section-title">Special Deals</p>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={onlyOffers}
                  onChange={(e) => {
                    setOnlyOffers(e.target.checked);
                    setPage(1);
                  }}
                />
                🔥 On Sale / Offers
              </label>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={onlyFeatured}
                  onChange={(e) => {
                    setOnlyFeatured(e.target.checked);
                    setPage(1);
                  }}
                />
                ⭐ Featured Items
              </label>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {loading ? (
              <div className="spinner-wrapper">
                <div className="spinner" />
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🛒</div>
                <h3>No grocery products found</h3>
                <p>Try searching for another keyword or reset filters to view all products.</p>
                <button className="btn btn-primary" onClick={resetFilters}>
                  View All Products
                </button>
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
