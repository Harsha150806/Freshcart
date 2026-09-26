import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockProducts';

const StarRatingInput = ({ value, onChange }) => (
  <div className="star-rating-input">
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} type="button" className={s <= value ? 'active' : ''} onClick={() => onChange(s)}>★</button>
    ))}
  </div>
);

const StarDisplay = ({ rating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= Math.round(rating) ? 'star-filled' : 'star-empty'} style={{ fontSize: '1rem' }}>★</span>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let foundProduct = null;
      let fetchedReviews = [];

      // Try fetching from Backend API
      try {
        const prodRes = await api.get(`/products/${id}`);
        if (prodRes.data && prodRes.data._id) {
          foundProduct = prodRes.data;
        }
      } catch (err) {
        console.log('Backend product detail fetch fallback:', err.message);
      }

      // Fallback to MOCK_PRODUCTS if API did not return product
      if (!foundProduct) {
        const decodedId = decodeURIComponent(id || '').toLowerCase().trim();
        foundProduct = MOCK_PRODUCTS.find(
          (p) =>
            p._id === id ||
            p.name.toLowerCase().trim() === decodedId ||
            p.name.toLowerCase().includes(decodedId)
        );

        // Ultimate safety net: if still not found, return first catalog product
        if (!foundProduct && MOCK_PRODUCTS.length > 0) {
          foundProduct = MOCK_PRODUCTS[0];
        }
      }

      // Fetch reviews safely if product exists
      if (foundProduct) {
        try {
          const revRes = await api.get(`/reviews/${foundProduct._id}`);
          if (Array.isArray(revRes.data)) {
            fetchedReviews = revRes.data;
          }
        } catch (revErr) {
          console.log('Reviews fetch fallback:', revErr.message);
        }

        // Fetch related products safely
        try {
          const relRes = await api.get(`/products?category=${encodeURIComponent(foundProduct.category)}&limit=5`);
          if (relRes.data && Array.isArray(relRes.data.products)) {
            setRelated(relRes.data.products.filter((p) => String(p._id) !== String(foundProduct._id)));
          } else {
            setRelated(
              MOCK_PRODUCTS.filter(
                (p) => p.category === foundProduct.category && String(p._id) !== String(foundProduct._id)
              ).slice(0, 4)
            );
          }
        } catch (relErr) {
          setRelated(
            MOCK_PRODUCTS.filter(
              (p) => p.category === foundProduct.category && String(p._id) !== String(foundProduct._id)
            ).slice(0, 4)
          );
        }
      }

      setProduct(foundProduct);
      setReviews(fetchedReviews);
      setLoading(false);
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product._id, qty);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }
    if (!reviewForm.title || !reviewForm.comment) {
      toast.error('Please fill all review fields');
      return;
    }
    setSubmittingReview(true);
    try {
      const { data } = await api.post('/reviews', { productId: id, ...reviewForm });
      setReviews([data, ...reviews]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      toast.success('Review submitted successfully!');
      // Update product rating locally
      setProduct((p) => ({
        ...p,
        numReviews: p.numReviews + 1,
        rating: ((p.rating * p.numReviews) + reviewForm.rating) / (p.numReviews + 1),
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="page-wrapper">
      <div className="container spinner-wrapper"><div className="spinner" /></div>
    </div>
  );

  if (!product) return (
    <div className="page-wrapper">
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <h3>Product not found</h3>
          <Link to="/products" className="btn btn-primary">Back to Shop</Link>
        </div>
      </div>
    </div>
  );

  const getInitials = (name) => name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <Link to="/">Home</Link> /
          <Link to="/products">Shop</Link> /
          <Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link> /
          <span style={{ color: 'var(--text-secondary)' }}>{product.name}</span>
        </div>

        {/* Product Detail */}
        <div className="product-detail-layout">
          {/* Image */}
          <div className="product-detail-img-wrap">
            <img
              src={product.image}
              alt={product.name}
              className="product-detail-img"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600?text=Product+Image'; }}
            />
          </div>

          {/* Info */}
          <div>
            <p className="product-detail-category">{product.category}</p>
            <h1 className="product-detail-name">{product.name}</h1>
            {product.brand && (
              <p className="product-detail-brand">by {product.brand} · {product.weight}</p>
            )}

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <StarDisplay rating={product.rating} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {product.rating.toFixed(1)} ({product.numReviews} reviews)
              </span>
              {product.stock > 0 ? (
                <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  ✓ In Stock
                </span>
              ) : (
                <span className="badge badge-out">Out of Stock</span>
              )}
            </div>

            {/* Price */}
            <div className="product-detail-price">
              <span className="product-detail-current">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="product-detail-original">₹{product.originalPrice}</span>
                  <span className="product-detail-discount">{product.discount}% OFF</span>
                </>
              )}
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>/ {product.unit}</span>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {product.tags.map((tag) => (
                  <span key={tag} style={{ padding: '0.2rem 0.6rem', background: 'var(--bg)', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {product.stock} left in stock
              </span>
            </div>

            <div className="product-detail-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                🛒 Add to Cart
              </button>
              <Link to="/cart" className="btn btn-outline btn-lg">
                View Cart
              </Link>
            </div>

            {/* Meta */}
            <div className="product-detail-meta" style={{ marginTop: '1.5rem' }}>
              <div className="product-meta-item">
                <div className="product-meta-label">Brand</div>
                <div className="product-meta-value">{product.brand || 'Generic'}</div>
              </div>
              <div className="product-meta-item">
                <div className="product-meta-label">Weight/Size</div>
                <div className="product-meta-value">{product.weight || product.unit}</div>
              </div>
              <div className="product-meta-item">
                <div className="product-meta-label">Category</div>
                <div className="product-meta-value">{product.category}</div>
              </div>
              <div className="product-meta-item">
                <div className="product-meta-label">Stock</div>
                <div className="product-meta-value" style={{ color: product.stock < 10 ? 'var(--danger)' : 'var(--primary)' }}>
                  {product.stock} units
                </div>
              </div>
            </div>

            {/* Delivery info */}
            <div style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius)', padding: '0.85rem 1rem', border: '1px solid var(--primary-100)', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🚚</span>
                Free delivery on orders above ₹500. Estimated delivery in 2–3 days.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem' }}>
            {['description', 'nutrition', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: '-2px',
                  color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'var(--transition)',
                }}
              >
                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              {product.description}
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              {product.nutritionInfo ? (
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{product.nutritionInfo}</p>
              ) : (
                <div className="alert alert-info">
                  <span>ℹ️</span> Nutrition information not available for this product.
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {/* Review summary */}
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', padding: '1.25rem', background: 'var(--bg)', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                    {product.rating.toFixed(1)}
                  </div>
                  <StarDisplay rating={product.rating} />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    {product.numReviews} reviews
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
                    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '8px' }}>{star}</span>
                        <span style={{ fontSize: '0.9rem', color: '#f59e0b' }}>★</span>
                        <div style={{ flex: 1, height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: '#f59e0b', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: '24px' }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Write review */}
              {user && !showReviewForm && (
                <button
                  className="btn btn-outline"
                  style={{ marginBottom: '1.25rem' }}
                  onClick={() => setShowReviewForm(true)}
                >
                  ✏️ Write a Review
                </button>
              )}
              {!user && (
                <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
                  <Link to="/login" style={{ color: 'var(--info)', textDecoration: 'underline' }}>Login</Link> to write a review
                </div>
              )}

              {/* Review form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 700 }}>Your Review</h3>
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <StarRatingInput value={reviewForm.rating} onChange={(v) => setReviewForm((f) => ({ ...f, rating: v }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Review Title</label>
                    <input
                      className="form-input"
                      placeholder="Summarize your experience"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Comment</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Share your detailed thoughts..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : '✅ Submit Review'}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => setShowReviewForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews list */}
              {reviews.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div className="empty-state-icon">💬</div>
                  <h3>No reviews yet</h3>
                  <p>Be the first to review this product!</p>
                </div>
              ) : (
                <div className="card">
                  {reviews.map((review) => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="review-avatar">
                          {review.user?.avatar ? (
                            <img src={review.user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                          ) : (
                            getInitials(review.user?.name || 'U')
                          )}
                        </div>
                        <div className="review-meta">
                          <div className="review-name">{review.user?.name || 'Anonymous'}</div>
                          <div className="review-date">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <StarDisplay rating={review.rating} />
                          {review.verified && (
                            <div className="review-verified" style={{ marginTop: '0.25rem' }}>
                              ✅ Verified Purchase
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="review-title">{review.title}</div>
                      <div className="review-comment">{review.comment}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">Related Products</h2>
            </div>
            <div className="products-grid">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const getInitials = (name) => name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

export default ProductDetail;
