import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Offers = () => {
  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState('');

  const coupons = [
    {
      code: 'FRESH50',
      discount: '₹50 OFF',
      minOrder: 'Min order ₹499',
      desc: 'Applicable on fruits & vegetables',
      bg: 'linear-gradient(135deg, #16a34a, #15803d)',
    },
    {
      code: 'WEEKEND20',
      discount: '20% OFF',
      minOrder: 'Min order ₹999',
      desc: 'Valid on entire grocery cart',
      bg: 'linear-gradient(135deg, #f97316, #ea580c)',
    },
    {
      code: 'DAIRY15',
      discount: '15% OFF',
      minOrder: 'Min order ₹299',
      desc: 'On milk, cheese & bakery treats',
      bg: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    },
  ];

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.get('/products?isOffer=true&limit=24');
        setOfferProducts(res.data.products || []);
      } catch (err) {
        console.error('Failed to fetch offer products:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(''), 2500);
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            color: 'white',
            marginBottom: '2.5rem',
            boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px' }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              🔥 Limited Time Grocery Deals
            </span>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', color: 'white' }}>
              Mega Savings & Fresh Discounts
            </h1>
            <p style={{ fontSize: '1.05rem', opacity: 0.9, marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Stock up on your daily essentials with massive discounts on farm-fresh produce, dairy, snacks, and pantry staples.
            </p>
            <Link
              to="/products"
              className="btn"
              style={{
                background: 'white',
                color: '#15803d',
                fontWeight: 700,
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              Browse All Products →
            </Link>
          </div>
        </div>

        {/* Coupons Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-dark, #1e293b)' }}>
            🏷️ Available Discount Vouchers
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                style={{
                  background: coupon.bg,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 16px -4px rgba(0,0,0,0.12)',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                    {coupon.discount}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, opacity: 0.9 }}>
                    {coupon.minOrder}
                  </div>
                  <p style={{ fontSize: '0.85rem', opacity: 0.85, marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                    {coupon.desc}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.18)',
                    backdropFilter: 'blur(6px)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px dashed rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px', fontSize: '1rem' }}>
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    style={{
                      background: copiedCoupon === coupon.code ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
                      color: '#15803d',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {copiedCoupon === coupon.code ? '✓ Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offer Products Grid */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark, #1e293b)' }}>
                ⚡ Hot Deals & Discounted Products
              </h2>
              <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.95rem' }}>
                Handpicked special deals on high demand groceries
              </p>
            </div>
            <Link to="/products?isOffer=true" style={{ color: 'var(--primary, #16a34a)', fontWeight: 600, fontSize: '0.9rem' }}>
              View All ({offerProducts.length}) →
            </Link>
          </div>

          {loading ? (
            <div className="spinner-wrapper" style={{ minHeight: '30vh' }}>
              <div className="spinner" />
            </div>
          ) : offerProducts.length > 0 ? (
            <div className="products-grid">
              {offerProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                background: 'white',
                borderRadius: '16px',
                border: '1px solid var(--border, #e2e8f0)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Active Offers Right Now</h3>
              <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1.5rem' }}>
                Check back soon or explore our everyday low priced grocery collection!
              </p>
              <Link to="/products" className="btn btn-primary">
                Shop Groceries
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Offers;
