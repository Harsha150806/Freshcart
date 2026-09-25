import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productAPI, reviewAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import ReviewCard from "../components/ReviewCard";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState(null);

  // Review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMsg, setReviewMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, r] = await Promise.all([productAPI.getById(id), reviewAPI.getByProduct(id)]);
        setProduct(p.data);
        setReviews(r.data);
      } catch { navigate("/404"); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate("/login"); return; }
    setAdding(true);
    const result = await addToCart(product._id, qty);
    setAdding(false);
    setMsg(result?.success ? { type: "success", text: "✓ Added to cart successfully!" } : { type: "error", text: result?.error || "Failed to add" });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleBuyNow = async () => {
    if (!user) { navigate("/login"); return; }
    await addToCart(product._id, qty);
    navigate("/cart");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    if (!comment.trim()) { setReviewMsg({ type: "error", text: "Please write a comment" }); return; }
    setReviewLoading(true);
    try {
      await reviewAPI.create({ productId: id, rating, comment });
      setReviewMsg({ type: "success", text: "Review submitted successfully!" });
      setComment(""); setRating(5);
      const r = await reviewAPI.getByProduct(id);
      setReviews(r.data);
      const p = await productAPI.getById(id);
      setProduct(p.data);
    } catch (err) {
      setReviewMsg({ type: "error", text: err.response?.data?.message || "Failed to submit review" });
    } finally { setReviewLoading(false); setTimeout(() => setReviewMsg(null), 4000); }
  };

  if (loading) return <LoadingSpinner message="Loading product..." />;
  if (!product) return null;

  const discountPct = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div>
      <div className="page-hero" style={{ padding: "2rem 0" }}>
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a><span>/</span><a href="/products">Products</a><span>/</span><span>{product.name}</span></div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: "2rem" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
            {/* Image */}
            <div>
              <img src={product.image || `https://via.placeholder.com/500x400/e8f5e9/2e7d32?text=${encodeURIComponent(product.name)}`}
                alt={product.name} style={{ width: "100%", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)" }}
                onError={e => { e.target.src = `https://via.placeholder.com/500x400/e8f5e9/2e7d32?text=${encodeURIComponent(product.name)}`; }} />
            </div>

            {/* Info */}
            <div>
              <span style={{ background: "var(--primary-bg)", color: "var(--primary)", fontSize: "0.8rem", fontWeight: 600, padding: "3px 12px", borderRadius: "var(--radius-full)" }}>{product.category}</span>
              <h1 style={{ marginTop: "0.75rem", marginBottom: "0.5rem" }}>{product.name}</h1>
              <p style={{ color: "var(--gray-500)", fontSize: "0.9rem", marginBottom: "1rem" }}>{product.description}</p>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <StarRating value={Math.round(product.rating)} readonly />
                <span style={{ color: "var(--gray-500)", fontSize: "0.88rem" }}>{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-dark)" }}>₹{product.price}</span>
                {product.originalPrice > product.price && (<span style={{ fontSize: "1.1rem", color: "var(--gray-400)", textDecoration: "line-through" }}>₹{product.originalPrice}</span>)}
                {discountPct > 0 && (<span style={{ background: "var(--red)", color: "#fff", fontSize: "0.8rem", fontWeight: 700, padding: "3px 10px", borderRadius: "var(--radius-full)" }}>{discountPct}% OFF</span>)}
              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--gray-600)", marginBottom: "1.25rem" }}>per {product.unit}</p>

              {/* Stock */}
              <div style={{ marginBottom: "1.5rem" }}>
                {product.stock > 0 ? (
                  <span className="badge badge-success">✓ In Stock ({product.stock} available)</span>
                ) : (
                  <span className="badge badge-danger">✗ Out of Stock</span>
                )}
              </div>

              {/* Qty selector */}
              {product.stock > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="form-label">Quantity</label>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                    <span className="qty-value">{qty}</span>
                    <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                  </div>
                </div>
              )}

              {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

              {product.stock > 0 && (
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button id="add-to-cart-btn" className="btn btn-secondary btn-lg" onClick={handleAddToCart} disabled={adding}>{adding ? "Adding..." : "🛒 Add to Cart"}</button>
                  <button id="buy-now-btn" className="btn btn-primary btn-lg" onClick={handleBuyNow}>⚡ Buy Now</button>
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div style={{ marginTop: "3rem" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>Customer Reviews</h2>

            {/* Write Review */}
            {user ? (
              <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
                <h3 style={{ marginBottom: "1rem", fontSize: "1rem" }}>Write a Review</h3>
                {reviewMsg && <div className={`alert alert-${reviewMsg.type}`}>{reviewMsg.text}</div>}
                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label className="form-label">Your Rating</label>
                    <StarRating value={rating} onChange={setRating} size="1.75rem" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Review</label>
                    <textarea className="form-control" rows={3} placeholder="Share your experience with this product..." value={comment} onChange={e => setComment(e.target.value)} />
                  </div>
                  <button type="submit" id="submit-review-btn" className="btn btn-primary" disabled={reviewLoading}>{reviewLoading ? "Submitting..." : "Submit Review"}</button>
                </form>
              </div>
            ) : (
              <div className="alert alert-info">Please <a href="/login" style={{ color: "var(--blue)", fontWeight: 600 }}>login</a> to write a review.</div>
            )}

            {reviews.length > 0 ? (
              <div className="reviews-grid">
                {reviews.map(r => <ReviewCard key={r._id} review={r} />)}
              </div>
            ) : (
              <p style={{ color: "var(--gray-500)" }}>No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
