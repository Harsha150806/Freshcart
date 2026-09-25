import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { label: 'All', icon: '🛒' },
  { label: 'Fruits & Vegetables', icon: '🥦' },
  { label: 'Dairy & Eggs', icon: '🥛' },
  { label: 'Meat & Seafood', icon: '🥩' },
  { label: 'Bakery', icon: '🍞' },
  { label: 'Beverages', icon: '🧃' },
  { label: 'Snacks', icon: '🍿' },
  { label: 'Pantry', icon: '🫙' },
  { label: 'Frozen Foods', icon: '🧊' },
  { label: 'Personal Care', icon: '🧴' },
  { label: 'Household', icon: '🏠' },
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
        setFeaturedProducts(featured.data.products);
        setOfferProducts(offers.data.products);
      } catch (err) {
        console.error('Failed to fetch products:', err.message);
      } finally {
        setLoading(false);
      }
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
                <span>✅</span> Free delivery on orders above ₹500
              </div>
              <h1 className="hero-title">
                Fresh Groceries<br />
                <span className="highlight">Delivered Daily</span>
              </h1>
              <p className="hero-description">
                Shop from 500+ fresh products sourced directly from local farms.
                From crispy vegetables to creamy dairy — everything at your doorstep in hours.
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-primary btn-lg">
                  🛒 Shop Now
                </Link>
                <Link to="/offers" className="btn" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)' }}>
                  🏷️ Today's Offers
                </Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="hero-stat-value">500+</div>
                  <div className="hero-stat-label">Fresh Products</div>
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
            { icon: '🌿', label: '100% Fresh', value: 'Farm to Door', color: 'green' },
            { icon: '💳', label: 'Secure Payment', value: 'Multiple Options', color: 'blue' },
            { icon: '🔄', label: 'Easy Returns', value: '24hr Policy', color: 'orange' },
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
              <p className="section-subtitle">Find exactly what you're looking for</p>
            </div>
          </div>
          <div className="category-chips">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                className="category-chip"
                onClick={() =>
                  navigate(cat.label === 'All' ? '/products' : `/products?category=${encodeURIComponent(cat.label)}`)
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
            <div className="offer-banner-title">🎉 Weekend Special Sale!</div>
            <div className="offer-banner-sub">
              Get up to 25% off on fresh fruits & vegetables. Limited time offer!
            </div>
          </div>
          <div className="offer-banner-tag">
            <span className="offer-banner-code">FRESH25</span>
            <div className="offer-banner-label">Use Code to Save</div>
          </div>
          <Link to="/offers" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', flexShrink: 0 }}>
            Shop Offers →
          </Link>
        </div>

        {/* Featured Products */}
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">⭐ Featured Products</h2>
              <p className="section-subtitle">Our top picks for you</p>
            </div>
            <Link to="/products?isFeatured=true" className="see-all-link">See All →</Link>
          </div>
          {loading ? (
            <div className="spinner-wrapper"><div className="spinner" /></div>
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
              <h2 className="section-title">🔥 Best Offers</h2>
              <p className="section-subtitle">Limited-time deals you can't miss</p>
            </div>
            <Link to="/offers" className="see-all-link">See All →</Link>
          </div>
          {loading ? (
            <div className="spinner-wrapper"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {offerProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Why Us */}
        <section className="section">
          <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', borderRadius: 'var(--radius-xl)', padding: '3rem 2.5rem', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
              Why Choose FreshCart?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', fontSize: '1rem' }}>
              We make grocery shopping effortless, fresh, and affordable
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {[
                { icon: '🌿', title: 'Farm Fresh', desc: 'Sourced directly from local farmers — no middlemen, maximum freshness.' },
                { icon: '⚡', title: 'Express Delivery', desc: 'Get your groceries in 2 hours or schedule for a convenient time.' },
                { icon: '💰', title: 'Best Prices', desc: 'Competitive prices and weekly deals to save more on every order.' },
                { icon: '🔒', title: '100% Secure', desc: 'Safe checkout with encrypted payments. Your data is fully protected.' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', transition: 'transform 0.2s', cursor: 'default' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
