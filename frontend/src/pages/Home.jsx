import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockProducts';

const CATEGORIES = [
  { label: 'All', icon: '🛒' },
  { label: 'Fruits & Vegetables', icon: '🥦' },
  { label: 'Rice, Atta & Grains', icon: '🌾' },
  { label: 'Dal & Pulses', icon: '🫘' },
  { label: 'Oil & Ghee', icon: '🪔' },
  { label: 'Masala & Spices', icon: '🌶️' },
  { label: 'Dairy, Bread & Eggs', icon: '🥛' },
  { label: 'Snacks & Biscuits', icon: '🍪' },
  { label: 'Beverages', icon: '🥤' },
  { label: 'Instant & Packaged Food', icon: '🍜' },
  { label: 'Chocolates & Sweets', icon: '🍫' },
  { label: 'Cleaning & Household', icon: '🧹' },
  { label: 'Personal Care', icon: '🧴' },
  { label: 'Baby Care', icon: '👶' },
  { label: 'Pet Care', icon: '🐾' },
];

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featured, offers] = await Promise.all([
          api.get('/products?isFeatured=true&limit=8'),
          api.get('/products?isOffer=true&limit=8'),
        ]);
        if (
          featured.data?.products?.length > 0 &&
          offers.data?.products?.length > 0
        ) {
          setFeaturedProducts(featured.data.products);
          setOfferProducts(offers.data.products);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('Using mock products fallback for home page:', err.message);
      }

      // Fallback
      setFeaturedProducts(MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 8));
      setOfferProducts(MOCK_PRODUCTS.filter((p) => p.isOffer).slice(0, 8));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Hero */}
        <section className="hero">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="container">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <span>⚡</span> Free express delivery on orders above ₹500
              </div>
              <h1 className="hero-title">
                Fresh Groceries<br />
                <span className="highlight">Delivered Daily</span>
              </h1>
              <p className="hero-description">
                Shop 500+ organic fruits, farm vegetables, dairy, bakery, meat, and everyday pantry essentials.
                Fast 2-hour doorstep delivery.
              </p>

              {/* Instant Search input in hero */}
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', maxWidth: '540px', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Search groceries (e.g. Apple, Milk, Rice, Chicken, Chocolate)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.95)',
                    fontSize: '0.95rem',
                    color: '#0f172a',
                    outline: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                />
                <button type="submit" className="btn btn-secondary btn-lg" style={{ borderRadius: 'var(--radius-full)' }}>
                  🔍 Search
                </button>
              </form>

              <div className="hero-actions">
                <Link to="/products" className="btn btn-primary btn-lg">
                  🛒 Shop All Products
                </Link>
                <Link
                  to="/offers"
                  className="btn"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  🏷️ Today's Offers
                </Link>
              </div>

              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="hero-stat-value">500+</div>
                  <div className="hero-stat-label">Fresh Items</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">2hr</div>
                  <div className="hero-stat-label">Express Delivery</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">10k+</div>
                  <div className="hero-stat-label">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="stats-row">
          {[
            { icon: '🚚', label: 'Free Delivery', value: 'Above ₹500', color: 'green' },
            { icon: '🌿', label: '100% Organic', value: 'Farm Fresh', color: 'green' },
            { icon: '💳', label: 'Secure Checkout', value: 'Instant & Safe', color: 'blue' },
            { icon: '🔄', label: 'Easy Returns', value: '24hr Guarantee', color: 'orange' },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-card-icon ${stat.color}`}>{stat.icon}</div>
              <div>
                <div className="stat-card-value">{stat.value}</div>
                <div className="stat-card-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Categories */}
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Explore fresh produce, dairy, bakery, beverages & staples</p>
            </div>
          </div>
          <div className="category-chips">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                className="category-chip"
                onClick={() =>
                  navigate(
                    cat.label === 'All'
                      ? '/products'
                      : `/products?category=${encodeURIComponent(cat.label)}`
                  )
                }
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Offer Banner */}
        <div className="offer-banner">
          <div>
            <div className="offer-banner-title">🎉 Weekend Special Grocery Deal!</div>
            <div className="offer-banner-sub">
              Get up to 25% OFF on fresh fruits, vegetables & organic staples.
            </div>
          </div>
          <div className="offer-banner-tag">
            <span className="offer-banner-code">FRESH25</span>
            <div className="offer-banner-label">Use Code to Save</div>
          </div>
          <Link
            to="/offers"
            className="btn"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              flexShrink: 0,
            }}
          >
            Shop Deals →
          </Link>
        </div>

        {/* Featured Products */}
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">⭐ Featured Fresh Items</h2>
              <p className="section-subtitle">Customer favorites and top picks</p>
            </div>
            <Link to="/products?isFeatured=true" className="see-all-link">
              See All →
            </Link>
          </div>
          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner" />
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Best Offers */}
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">🔥 Today's Best Offers</h2>
              <p className="section-subtitle">Discounted prices on top essential items</p>
            </div>
            <Link to="/offers" className="see-all-link">
              See All →
            </Link>
          </div>
          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner" />
            </div>
          ) : (
            <div className="products-grid">
              {offerProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
